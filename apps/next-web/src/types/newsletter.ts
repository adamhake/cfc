import { z } from "zod"

/**
 * Valid sources for newsletter signups
 * Used for analytics and tracking signup locations
 */
export const newsletterSourceSchema = z.enum(["get-involved-page", "homepage-widget", "footer"])

export type NewsletterSource = z.infer<typeof newsletterSourceSchema>

/**
 * Schema for validating newsletter subscription requests
 */
export const subscribeRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  source: newsletterSourceSchema,
  turnstileToken: z.string().min(1, "Security token is required"),
})

export type SubscribeRequest = z.infer<typeof subscribeRequestSchema>

/**
 * Why a subscription failed. `rate_limited` is our own per-IP throttle;
 * `resend_rate_limited` is Resend throttling us, which the subscriber can
 * retry but we may need to know about.
 */
export type SubscribeErrorCode =
  | "validation_error"
  | "rate_limited"
  | "resend_rate_limited"
  | "turnstile_failed"
  | "contact_error"
  | "server_error"

/**
 * Response from the newsletter subscription API
 * Uses discriminated union for type-safe success/error handling
 */
export type SubscribeResponse =
  | { success: true; message: string }
  | { success: false; error: SubscribeErrorCode; message: string }
