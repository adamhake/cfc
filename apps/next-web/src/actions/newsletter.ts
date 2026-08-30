"use server"

import { headers } from "next/headers"
import { Resend } from "resend"
import { env } from "@/env"
import { verifyTurnstileToken } from "@/lib/turnstile"
import { type SubscribeResponse, subscribeRequestSchema } from "@/types/newsletter"

const CONTACT_EMAIL = "info@chimborazoparkconservancy.org"

/**
 * Resend error codes that mean *we* are misconfigured, not that the subscriber
 * typed a bad address. Telling someone to "check your email address" when the
 * API key lacks contact permissions sends them chasing a problem they can't fix.
 *
 * @see https://resend.com/docs/api-reference/errors
 */
const RESEND_CONFIG_ERROR_NAMES: ReadonlySet<string> = new Set([
  "missing_api_key",
  "restricted_api_key",
  "invalid_api_key",
  "invalid_access",
  "not_found",
  "method_not_allowed",
  "monthly_quota_exceeded",
  "daily_quota_exceeded",
  "security_error",
  "application_error",
  "internal_server_error",
])

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

  const headersList = await headers()
  const clientIp = getClientIp(headersList)

  if (isRateLimited(clientIp)) {
    console.warn(`[Newsletter] Rate limit exceeded for IP: ${clientIp}`)
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
    const turnstileResult = await verifyTurnstileToken({
      token: data.turnstileToken,
      secret: turnstileSecret,
      clientIp,
      expectedHostname: env.TURNSTILE_EXPECTED_HOSTNAME,
    })

    if (!turnstileResult.success) {
      console.warn("[Newsletter] Turnstile verification failed:", turnstileResult.errorCodes)
      return {
        success: false,
        error: "turnstile_failed",
        message: "Security verification failed. Please try again.",
      }
    }
  } else {
    if (process.env.NODE_ENV === "production") {
      console.error("[Newsletter] TURNSTILE_SECRET_KEY not configured in production!")
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
    console.error("[Newsletter] RESEND_API_KEY not configured")
    return {
      success: false,
      error: "server_error",
      message: "Unable to process subscription",
    }
  }

  const resend = new Resend(resendApiKey)
  const normalizedEmail = data.email.trim().toLowerCase()

  const { data: contact, error: contactError } = await resend.contacts.create({
    email: normalizedEmail,
    unsubscribed: false,
  })

  if (contactError) {
    const failure = {
      name: contactError.name,
      statusCode: contactError.statusCode,
      message: contactError.message,
    }

    if (contactError.name === "rate_limit_exceeded") {
      console.warn("[Newsletter] Resend rate limit hit:", failure)
      return {
        success: false,
        error: "resend_rate_limited",
        message: "We're a little busy right now. Please try again in a moment.",
      }
    }

    if (RESEND_CONFIG_ERROR_NAMES.has(contactError.name)) {
      console.error(
        "[Newsletter] Resend rejected contact creation for a configuration reason — " +
          "check RESEND_API_KEY permissions (it needs full access, not sending-only) " +
          "and the account's quota status:",
        failure,
      )
      return {
        success: false,
        error: "server_error",
        message: `Something went wrong on our end and we couldn't save your subscription. Please try again later, or email us at ${CONTACT_EMAIL} and we'll add you manually.`,
      }
    }

    console.warn("[Newsletter] Resend rejected contact creation:", failure)
    return {
      success: false,
      error: "contact_error",
      message: `We couldn't complete your subscription. Please check your email address and try again. If the problem persists, contact us at ${CONTACT_EMAIL}`,
    }
  }

  if (!segmentId) {
    console.warn(
      "[Newsletter] RESEND_SEGMENT_ID not configured — contact created but not added to any segment",
    )
  } else if (contact?.id) {
    try {
      // The SDK reports API failures on the returned `error`, not by throwing,
      // so both paths have to be checked or a failed add looks like a success.
      const { error: segmentError } = await resend.contacts.segments.add({
        contactId: contact.id,
        segmentId,
      })

      if (segmentError) {
        console.warn("[Newsletter] Failed to add contact to segment:", segmentError)
      } else {
        console.log("[Newsletter] Contact added to segment:", segmentId)
      }
    } catch (segmentError) {
      console.warn("[Newsletter] Failed to add contact to segment:", segmentError)
    }
  }

  console.log("[Newsletter] Contact created:", {
    id: contact?.id,
    email: normalizedEmail,
    source: data.source,
  })

  // Send admin notification email
  const adminEmail = env.ADMIN_EMAIL
  const fromEmail = env.NEWSLETTER_FROM_EMAIL
  const verifiedDomain = env.VERIFIED_EMAIL_DOMAIN

  if (adminEmail) {
    // Resend constrains the *From* address to a verified domain; the recipient can
    // be any address. Checking `adminEmail` here instead of `fromEmail` skipped
    // every notification whenever the admin inbox lived off the sending domain.
    if (!fromEmail.endsWith(verifiedDomain)) {
      console.warn(
        `[Newsletter] NEWSLETTER_FROM_EMAIL (${fromEmail}) is not on the verified sending domain (${verifiedDomain}), skipping notification`,
      )
    } else {
      try {
        const { error: emailError } = await resend.emails.send({
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
        })

        if (emailError) {
          console.error("[Newsletter] Failed to send admin notification:", emailError)
        } else {
          console.log("[Newsletter] Admin notification email sent")
        }
      } catch (emailError) {
        console.error("[Newsletter] Failed to send admin notification:", emailError)
      }
    }
  }

  return {
    success: true,
    message: "Thank you for subscribing! We'll keep you updated on park news and events.",
  }
}
