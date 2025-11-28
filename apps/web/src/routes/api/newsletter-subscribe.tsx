import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";
import { env } from "@/env";
import { subscribeRequestSchema, type SubscribeResponse } from "@/types/newsletter";

/**
 * Newsletter subscription API endpoint
 *
 * Handles newsletter signups with:
 * - Cloudflare Turnstile verification for spam protection
 * - Resend Audiences/Contacts for subscriber management
 * - Optional admin email notification
 * - Simple rate limiting
 */

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

/**
 * Simple in-memory rate limiter
 * Note: This resets on server restart. For production at scale,
 * consider using Redis or a distributed rate limiting service.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count++;
  return record.count > RATE_LIMIT_MAX_REQUESTS;
}

// Clean up old rate limit entries periodically
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  },
  5 * 60 * 1000,
); // Clean every 5 minutes

function jsonResponse(body: SubscribeResponse, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getClientIp(request: Request): string {
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

export const Route = createFileRoute("/api/newsletter-subscribe")({
  server: {
    handlers: {
      GET: async () => {
        // Return minimal information - don't expose configuration state
        return new Response(
          JSON.stringify({
            status: "ok",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },

      POST: async ({ request }) => {
        try {
          // Rate limiting
          const clientIp = getClientIp(request);
          if (isRateLimited(clientIp)) {
            console.warn(`[Newsletter] Rate limit exceeded for IP: ${clientIp}`);
            return jsonResponse(
              {
                error: "Rate limit exceeded",
                message: "Too many requests. Please try again in a minute.",
              },
              429,
            );
          }

          // Parse and validate request body with Zod
          const rawBody = await request.json();
          const parseResult = subscribeRequestSchema.safeParse(rawBody);

          if (!parseResult.success) {
            const firstError = parseResult.error.issues[0];
            return jsonResponse(
              {
                error: "Validation failed",
                message: firstError?.message || "Invalid request data",
              },
              400,
            );
          }

          const body = parseResult.data;

          // Verify Turnstile token
          const turnstileSecret = env.TURNSTILE_SECRET_KEY;
          if (turnstileSecret) {
            const turnstileResponse = await fetch(
              "https://challenges.cloudflare.com/turnstile/v0/siteverify",
              {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                  secret: turnstileSecret,
                  response: body.turnstileToken,
                }),
              },
            );

            const turnstileResult = (await turnstileResponse.json()) as TurnstileResponse;

            if (!turnstileResult.success) {
              console.warn(
                "[Newsletter] Turnstile verification failed:",
                turnstileResult["error-codes"],
              );
              return jsonResponse(
                {
                  error: "Verification failed",
                  message: "Security verification failed. Please try again.",
                },
                400,
              );
            }
          } else {
            // In production, this should be configured
            if (process.env.NODE_ENV === "production") {
              console.error("[Newsletter] TURNSTILE_SECRET_KEY not configured in production!");
              return jsonResponse(
                {
                  error: "Server configuration error",
                  message: "Unable to process subscription",
                },
                500,
              );
            }
            console.warn(
              "[Newsletter] TURNSTILE_SECRET_KEY not configured, skipping verification (dev mode)",
            );
          }

          // Validate Resend configuration
          const resendApiKey = env.RESEND_API_KEY;
          const audienceId = env.RESEND_AUDIENCE_ID;

          if (!resendApiKey || !audienceId) {
            console.error("[Newsletter] RESEND_API_KEY or RESEND_AUDIENCE_ID not configured");
            return jsonResponse(
              {
                error: "Server configuration error",
                message: "Unable to process subscription",
              },
              500,
            );
          }

          const resend = new Resend(resendApiKey);

          // Add contact to Resend audience
          // Resend handles duplicates gracefully - if the contact exists, it updates it
          const { data: contact, error: contactError } = await resend.contacts.create({
            audienceId,
            email: body.email.toLowerCase(),
            unsubscribed: false,
          });

          if (contactError) {
            console.error("[Newsletter] Failed to create contact:", contactError);
            return jsonResponse(
              {
                error: "Subscription failed",
                message: "Unable to add you to our mailing list. Please try again.",
              },
              500,
            );
          }

          console.log("[Newsletter] Contact added to audience:", {
            id: contact?.id,
            email: body.email,
            source: body.source,
          });

          // Send admin notification email (optional, rate limited separately)
          const adminEmail = env.ADMIN_EMAIL;
          if (adminEmail) {
            try {
              await resend.emails.send({
                from: "Chimborazo Park Conservancy <noreply@chimborazopark.org>",
                to: adminEmail,
                subject: "New Newsletter Signup - Chimborazo Park Conservancy",
                text: `
New subscriber: ${body.email}
Source: ${body.source}
Date: ${new Date().toLocaleString()}

View all contacts in Resend dashboard:
https://resend.com/audiences/${audienceId}
                `.trim(),
              });
              console.log("[Newsletter] Admin notification email sent");
            } catch (emailError) {
              // Log but don't fail the request if email fails
              console.error("[Newsletter] Failed to send admin notification:", emailError);
            }
          }

          return jsonResponse(
            {
              success: true,
              message: "Thank you for subscribing! We'll keep you updated on park news and events.",
            },
            200,
          );
        } catch (error) {
          console.error("[Newsletter] Error processing subscription:", error);

          // Don't expose internal error details to the client
          return jsonResponse(
            {
              error: "Internal server error",
              message: "An unexpected error occurred. Please try again.",
            },
            500,
          );
        }
      },
    },
  },
});
