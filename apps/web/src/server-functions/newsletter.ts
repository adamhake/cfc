import { env } from "@/env";
import { verifyTurnstileToken } from "@/server-functions/turnstile";
import { subscribeRequestSchema, type SubscribeResponse } from "@/types/newsletter";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { Resend } from "resend";

/**
 * Newsletter subscription server function
 *
 * Handles newsletter signups with:
 * - Input validation via Zod
 * - Cloudflare Turnstile verification for spam protection
 * - Resend Contacts API for subscriber management (with optional Segment assignment)
 * - Optional admin email notification
 * - Simple rate limiting
 */

/**
 * Simple in-memory rate limiter
 *
 * NOTE: In-memory rate limiting is not reliable on serverless platforms (Netlify)
 * as each cold start gets a fresh Map. Cloudflare Turnstile verification (below)
 * serves as the primary abuse prevention mechanism.
 *
 * For production at scale, consider using Redis or a distributed rate limiting service.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP
const RATE_LIMIT_MAP_MAX_SIZE = 1000; // Maximum entries before forced cleanup

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Inline cleanup - remove expired entry for this IP
  if (record && now > record.resetTime) {
    rateLimitMap.delete(ip);
  }

  // Periodic cleanup when map grows too large (prevents memory leak in serverless)
  if (rateLimitMap.size > RATE_LIMIT_MAP_MAX_SIZE) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  const currentRecord = rateLimitMap.get(ip);
  if (!currentRecord || now > currentRecord.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  currentRecord.count++;
  return currentRecord.count > RATE_LIMIT_MAX_REQUESTS;
}

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator(subscribeRequestSchema)
  .handler(async ({ data }): Promise<SubscribeResponse> => {
    // Get client IP for rate limiting
    const request = getRequest();
    const clientIp = getClientIp(request);

    // Rate limiting
    if (isRateLimited(clientIp)) {
      console.warn(`[Newsletter] Rate limit exceeded for IP: ${clientIp}`);
      throw new Error("Too many requests. Please try again in a minute.");
    }

    // Verify Turnstile token
    const isDevBypassToken =
      process.env.NODE_ENV !== "production" && data.turnstileToken === "dev-bypass";
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    if (isDevBypassToken) {
      console.info("[Newsletter] Using dev bypass token, skipping Turnstile verification");
    } else if (turnstileSecret) {
      const turnstileResult = await verifyTurnstileToken({
        token: data.turnstileToken,
        secret: turnstileSecret,
        clientIp,
        expectedHostname: env.TURNSTILE_EXPECTED_HOSTNAME,
      });

      if (!turnstileResult.success) {
        console.warn("[Newsletter] Turnstile verification failed:", turnstileResult.errorCodes);
        throw new Error("Security verification failed. Please try again.");
      }
    } else {
      // In production, this should be configured
      if (process.env.NODE_ENV === "production") {
        console.error("[Newsletter] TURNSTILE_SECRET_KEY not configured in production!");
        throw new Error("Unable to process subscription");
      }
      console.warn(
        "[Newsletter] TURNSTILE_SECRET_KEY not configured, skipping verification (dev mode)",
      );
    }

    // Validate Resend configuration
    const resendApiKey = env.RESEND_API_KEY;
    const segmentId = env.RESEND_SEGMENT_ID;

    if (!resendApiKey) {
      console.error("[Newsletter] RESEND_API_KEY not configured");
      throw new Error("Unable to process subscription");
    }

    const resend = new Resend(resendApiKey);

    // Create contact using the new Resend Contacts API
    // Contacts are now global entities (not tied to Audiences)
    // Resend handles duplicates gracefully - if the contact exists, it updates it
    const normalizedEmail = data.email.trim().toLowerCase();
    const { data: contact, error: contactError } = await resend.contacts.create({
      email: normalizedEmail,
      unsubscribed: false,
    });

    if (contactError) {
      console.error("[Newsletter] Failed to create contact:", contactError);
      throw new Error(
        "We couldn't complete your subscription. Please check your email address and try again. If the problem persists, contact us at info@chimborazoparkconservancy.org",
      );
    }

    // Optionally add contact to a Segment for organization
    if (segmentId && contact?.id) {
      try {
        await resend.contacts.segments.add({
          contactId: contact.id,
          segmentId,
        });
        console.log("[Newsletter] Contact added to segment:", segmentId);
      } catch (segmentError) {
        // Log but don't fail - contact was still created successfully
        console.warn("[Newsletter] Failed to add contact to segment:", segmentError);
      }
    }

    console.log("[Newsletter] Contact created:", {
      id: contact?.id,
      email: normalizedEmail,
      source: data.source,
    });

    // Send admin notification email (optional)
    // Only send if admin email is from verified domain for security
    const adminEmail = env.ADMIN_EMAIL;
    const fromEmail = env.NEWSLETTER_FROM_EMAIL;
    const verifiedDomain = env.VERIFIED_EMAIL_DOMAIN;

    if (adminEmail) {
      if (!adminEmail.endsWith(verifiedDomain)) {
        console.warn(
          `[Newsletter] ADMIN_EMAIL not from verified domain (${verifiedDomain}), skipping notification`,
        );
      } else {
        try {
          await resend.emails.send({
            from: `Chimborazo Park Conservancy <${fromEmail}>`,
            to: adminEmail,
            subject: "New Newsletter Signup - Chimborazo Park Conservancy",
            text: `
New subscriber: ${normalizedEmail}
Source: ${data.source}
Date: ${new Date().toLocaleString()}

View all contacts in Resend dashboard:
https://resend.com/contacts
            `.trim(),
          });
          console.log("[Newsletter] Admin notification email sent");
        } catch (emailError) {
          // Log but don't fail the request if email fails
          console.error("[Newsletter] Failed to send admin notification:", emailError);
        }
      }
    }

    return {
      success: true,
      message: "Thank you for subscribing! We'll keep you updated on park news and events.",
    };
  });

function getClientIp(request?: Request): string {
  if (!request) return "unknown";

  // Check common headers for proxied requests
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback - in serverless environments this may not be available
  return "unknown";
}
