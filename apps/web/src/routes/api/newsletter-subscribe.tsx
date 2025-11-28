import { createFileRoute } from "@tanstack/react-router"
import { Resend } from "resend"
import { env } from "@/env"

/**
 * Newsletter subscription API endpoint
 *
 * Handles newsletter signups with:
 * - Cloudflare Turnstile verification for spam protection
 * - Resend Audiences/Contacts for subscriber management
 * - Optional admin email notification
 */

interface SubscribeRequest {
  email: string
  source: "get-involved-page" | "homepage-widget" | "footer"
  turnstileToken: string
}

interface TurnstileResponse {
  success: boolean
  "error-codes"?: string[]
}

export const Route = createFileRoute("/api/newsletter-subscribe")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(
          JSON.stringify({
            service: "Newsletter Subscription API",
            status: "active",
            configured: Boolean(
              env.RESEND_API_KEY &&
                env.RESEND_AUDIENCE_ID &&
                env.TURNSTILE_SECRET_KEY
            ),
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        )
      },

      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as SubscribeRequest

          // Validate required fields
          if (!body.email || !body.turnstileToken) {
            return new Response(
              JSON.stringify({
                error: "Validation failed",
                message: "Email and security token are required",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            )
          }

          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(body.email)) {
            return new Response(
              JSON.stringify({
                error: "Validation failed",
                message: "Please enter a valid email address",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            )
          }

          // Verify Turnstile token
          const turnstileSecret = env.TURNSTILE_SECRET_KEY
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
              }
            )

            const turnstileResult =
              (await turnstileResponse.json()) as TurnstileResponse

            if (!turnstileResult.success) {
              console.warn(
                "[Newsletter] Turnstile verification failed:",
                turnstileResult["error-codes"]
              )
              return new Response(
                JSON.stringify({
                  error: "Verification failed",
                  message:
                    "Security verification failed. Please try again.",
                }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                }
              )
            }
          } else {
            console.warn(
              "[Newsletter] TURNSTILE_SECRET_KEY not configured, skipping verification"
            )
          }

          // Validate Resend configuration
          const resendApiKey = env.RESEND_API_KEY
          const audienceId = env.RESEND_AUDIENCE_ID

          if (!resendApiKey || !audienceId) {
            console.error(
              "[Newsletter] RESEND_API_KEY or RESEND_AUDIENCE_ID not configured"
            )
            return new Response(
              JSON.stringify({
                error: "Server configuration error",
                message: "Unable to process subscription",
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            )
          }

          const resend = new Resend(resendApiKey)

          // Add contact to Resend audience
          // Resend handles duplicates gracefully - if the contact exists, it updates it
          const { data: contact, error: contactError } =
            await resend.contacts.create({
              audienceId,
              email: body.email.toLowerCase(),
              unsubscribed: false,
            })

          if (contactError) {
            console.error("[Newsletter] Failed to create contact:", contactError)
            return new Response(
              JSON.stringify({
                error: "Subscription failed",
                message: "Unable to add you to our mailing list. Please try again.",
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            )
          }

          console.log("[Newsletter] Contact added to audience:", {
            id: contact?.id,
            email: body.email,
            source: body.source,
          })

          // Send admin notification email (optional)
          const adminEmail = env.ADMIN_EMAIL
          if (adminEmail) {
            try {
              await resend.emails.send({
                from: "Chimborazo Park Conservancy <noreply@chimborazopark.org>",
                to: adminEmail,
                subject: "New Newsletter Signup - Chimborazo Park Conservancy",
                text: `
New subscriber: ${body.email}
Source: ${body.source || "get-involved-page"}
Date: ${new Date().toLocaleString()}

View all contacts in Resend dashboard:
https://resend.com/audiences/${audienceId}
                `.trim(),
              })
              console.log("[Newsletter] Admin notification email sent")
            } catch (emailError) {
              // Log but don't fail the request if email fails
              console.error(
                "[Newsletter] Failed to send admin notification:",
                emailError
              )
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              message:
                "Thank you for subscribing! We'll keep you updated on park news and events.",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          )
        } catch (error) {
          console.error("[Newsletter] Error processing subscription:", error)

          return new Response(
            JSON.stringify({
              error: "Internal server error",
              message:
                error instanceof Error ? error.message : "Unknown error",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          )
        }
      },
    },
  },
})
