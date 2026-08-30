"use server"

import { headers } from "next/headers"
import { Resend } from "resend"
import { env } from "@/env"
import { errorAttributes, logError, logInfo, logWarn } from "@/integrations/posthog/logger"
import { scheduleFlush } from "@/integrations/posthog/otel"
import { withSpan } from "@/integrations/posthog/tracing"
import { verifyTurnstileToken } from "@/lib/turnstile"
import { type SubscribeResponse, subscribeRequestSchema } from "@/types/newsletter"

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const RATE_LIMIT_MAP_MAX_SIZE = 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (record && now > record.resetTime) {
    rateLimitMap.delete(ip)
  }

  if (rateLimitMap.size > RATE_LIMIT_MAP_MAX_SIZE) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }

  const currentRecord = rateLimitMap.get(ip)
  if (!currentRecord || now > currentRecord.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  currentRecord.count++
  return currentRecord.count > RATE_LIMIT_MAX_REQUESTS
}

function getClientIp(headersList: Headers): string {
  const forwardedFor = headersList.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }

  const realIp = headersList.get("x-real-ip")
  if (realIp) {
    return realIp
  }

  return "unknown"
}

export async function subscribeToNewsletter(formData: {
  email: string
  source: string
  turnstileToken: string
}): Promise<SubscribeResponse> {
  const parsed = subscribeRequestSchema.safeParse(formData)
  if (!parsed.success) {
    return {
      success: false,
      error: "validation_error",
      message: parsed.error.issues[0]?.message || "Invalid input",
    }
  }
  const data = parsed.data

  // Signup is the site's one conversion. Every early return below is a lost
  // one, so each gets a log line and the whole action gets a flush.
  scheduleFlush()

  const headersList = await headers()
  const clientIp = getClientIp(headersList)

  if (isRateLimited(clientIp)) {
    // The IP goes to the console for local debugging but never to PostHog —
    // it's personal data, and "how often are we rate limiting" is the only
    // question the log needs to answer.
    console.warn(`[Newsletter] Rate limit exceeded for IP: ${clientIp}`)
    logWarn("[Newsletter] Rate limit exceeded", { source: data.source })
    return {
      success: false,
      error: "rate_limited",
      message: "Too many requests. Please try again in a minute.",
    }
  }

  // Verify Turnstile token
  const isDevBypassToken =
    process.env.NODE_ENV !== "production" && data.turnstileToken === "dev-bypass"
  const turnstileSecret = env.TURNSTILE_SECRET_KEY
  if (isDevBypassToken) {
    console.info("[Newsletter] Using dev bypass token, skipping Turnstile verification")
  } else if (turnstileSecret) {
    const turnstileResult = await withSpan("turnstile.verify", {}, () =>
      verifyTurnstileToken({
        token: data.turnstileToken,
        secret: turnstileSecret,
        clientIp,
        expectedHostname: env.TURNSTILE_EXPECTED_HOSTNAME,
      }),
    )

    if (!turnstileResult.success) {
      logWarn("[Newsletter] Turnstile verification failed", {
        source: data.source,
        errorCodes: turnstileResult.errorCodes?.join(",") ?? "none",
      })
      return {
        success: false,
        error: "turnstile_failed",
        message: "Security verification failed. Please try again.",
      }
    }
  } else {
    if (process.env.NODE_ENV === "production") {
      logError("[Newsletter] TURNSTILE_SECRET_KEY not configured in production!")
      return {
        success: false,
        error: "server_error",
        message: "Unable to process subscription",
      }
    }
    console.warn(
      "[Newsletter] TURNSTILE_SECRET_KEY not configured, skipping verification (dev mode)",
    )
  }

  const resendApiKey = env.RESEND_API_KEY
  const segmentId = env.RESEND_SEGMENT_ID

  if (!resendApiKey) {
    logError("[Newsletter] RESEND_API_KEY not configured")
    return {
      success: false,
      error: "server_error",
      message: "Unable to process subscription",
    }
  }

  const resend = new Resend(resendApiKey)
  const normalizedEmail = data.email.trim().toLowerCase()

  const { data: contact, error: contactError } = await withSpan(
    "resend.contacts.create",
    { "peer.service": "resend" },
    () => resend.contacts.create({ email: normalizedEmail, unsubscribed: false }),
  )

  if (contactError) {
    // The subscriber's address stays out of PostHog. `name` is what separates
    // "they typed a bad address" from "our API key lost its permissions",
    // which is the distinction worth alerting on.
    logError("[Newsletter] Failed to create contact", {
      source: data.source,
      resendErrorName: contactError.name,
      resendStatusCode: contactError.statusCode,
      resendMessage: contactError.message,
    })
    return {
      success: false,
      error: "contact_error",
      message:
        "We couldn't complete your subscription. Please check your email address and try again. If the problem persists, contact us at info@chimborazoparkconservancy.org",
    }
  }

  if (segmentId && contact?.id) {
    try {
      await withSpan("resend.contacts.segments.add", { "peer.service": "resend" }, () =>
        resend.contacts.segments.add({ contactId: contact.id, segmentId }),
      )
    } catch (segmentError) {
      logWarn("[Newsletter] Failed to add contact to segment", {
        segmentId,
        ...errorAttributes(segmentError),
      })
    }
  }

  logInfo("[Newsletter] Contact created", {
    contactId: contact?.id,
    source: data.source,
    addedToSegment: Boolean(segmentId && contact?.id),
  })

  // Send admin notification email
  const adminEmail = env.ADMIN_EMAIL
  const fromEmail = env.NEWSLETTER_FROM_EMAIL
  const verifiedDomain = env.VERIFIED_EMAIL_DOMAIN

  if (adminEmail) {
    if (!adminEmail.endsWith(verifiedDomain)) {
      logWarn("[Newsletter] ADMIN_EMAIL not on verified domain, skipping notification", {
        verifiedDomain,
      })
    } else {
      try {
        await withSpan("resend.emails.send", { "peer.service": "resend" }, () =>
          resend.emails.send({
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
          }),
        )
      } catch (emailError) {
        // The subscriber is already saved at this point, so this is an
        // operator-visibility failure, not a user-facing one.
        logError("[Newsletter] Failed to send admin notification", errorAttributes(emailError))
      }
    }
  }

  return {
    success: true,
    message: "Thank you for subscribing! We'll keep you updated on park news and events.",
  }
}
