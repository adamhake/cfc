"use client"

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { CheckCircle } from "lucide-react"
import { useEffect, useRef, useState, useTransition } from "react"
import { subscribeToNewsletter } from "@/actions/newsletter"
import { Button } from "@/components/Button/button"
import { trackNewsletterSignup, trackNewsletterSignupFailed } from "@/integrations/posthog/events"
import type { NewsletterSource, SubscribeResponse } from "@/types/newsletter"
import { cn } from "@/utils/cn"
import { shouldEnableTurnstile } from "./turnstile"

export interface NewsletterFormProps {
  /**
   * Tracks which form the signup came from
   */
  source: NewsletterSource

  /**
   * Callback when subscription succeeds
   */
  onSuccess?: () => void

  /**
   * Additional CSS classes for the form container
   */
  className?: string

  /**
   * Label text for the email input
   * @default "Stay updated"
   */
  label?: string

  /**
   * Show the privacy notice below the form
   * @default true
   */
  showPrivacyNotice?: boolean
}

export function NewsletterForm({
  source,
  onSuccess,
  className,
  label = "Stay updated",
  showPrivacyNotice = true,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileError, setTurnstileError] = useState<string | null>(null)
  const [hostname, setHostname] = useState<string>()
  const [isPending, startTransition] = useTransition()
  const turnstileRef = useRef<TurnstileInstance>(null)
  const successRef = useRef<HTMLOutputElement>(null)

  // Focus management for accessibility - announce success to screen readers
  useEffect(() => {
    if (successMessage && successRef.current) {
      successRef.current.focus()
    }
  }, [successMessage])

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const isDevelopment = process.env.NODE_ENV === "development"
  const isTurnstileEnabled = shouldEnableTurnstile({
    siteKey: turnstileSiteKey,
    isDevelopment,
    hostname,
  })

  useEffect(() => {
    setHostname(window.location.hostname)
  }, [])

  function validateEmail(value: string): string | null {
    if (!value) return "Please enter your email address"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address"
    }
    return null
  }

  function handleEmailChange(value: string) {
    setEmail(value)
    // Clear validation error when user types
    if (emailError) {
      const error = validateEmail(value)
      setEmailError(error)
    }
  }

  function handleEmailBlur() {
    const error = validateEmail(email)
    setEmailError(error)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validate email
    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      return
    }

    // Clear any previous errors
    setTurnstileError(null)
    setFormError(null)

    // In production, Turnstile token is required
    // In development, allow bypass if Turnstile is not configured
    if (isTurnstileEnabled && !turnstileToken) {
      setTurnstileError("Please complete the security verification")
      return
    }

    if (!isTurnstileEnabled && !isDevelopment) {
      setTurnstileError("Security verification is not available. Please try again later.")
      return
    }

    // Only use dev bypass token in development mode without Turnstile
    const tokenToSend = turnstileToken || (isDevelopment ? "dev-bypass" : "")

    if (!tokenToSend) {
      setTurnstileError("Security verification is required")
      return
    }

    startTransition(async () => {
      try {
        const result: SubscribeResponse = await subscribeToNewsletter({
          email,
          source,
          turnstileToken: tokenToSend,
        })

        if (result.success) {
          setSuccessMessage(result.message)
          trackNewsletterSignup(source)
          setEmail("")
          onSuccess?.()
        } else {
          setFormError(result.message)
          trackNewsletterSignupFailed(source, result.message)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        setFormError("Something went wrong. Please try again.")
        trackNewsletterSignupFailed(source, errorMessage)
      } finally {
        // Reset Turnstile for next submission
        turnstileRef.current?.reset()
        setTurnstileToken(null)
      }
    })
  }

  const inputId = `newsletter-email-${source}`
  const errorId = `newsletter-error-${source}`

  // Show success state with prominent confirmation
  if (successMessage) {
    return (
      <output
        ref={successRef}
        tabIndex={-1}
        className={cn(
          "block rounded-xl border border-green-200 bg-green-50 p-4",
          "dark:border-green-800 dark:bg-green-900/20",
          "focus:outline-none",
          className,
        )}
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 shrink-0 text-green-600 dark:text-green-400" />
          <div className="space-y-1">
            <p className="font-display text-base font-semibold text-green-800 dark:text-green-300">
              You're subscribed!
            </p>
            <p className="font-body text-sm text-green-700 dark:text-green-400">{successMessage}</p>
          </div>
        </div>
      </output>
    )
  }

  const displayError = turnstileError || formError

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      <label htmlFor={inputId} className="font-display text-lg text-grey-900 dark:text-grey-100">
        {label}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          type="email"
          name="email"
          value={email}
          onBlur={handleEmailBlur}
          onChange={(e) => handleEmailChange(e.target.value)}
          placeholder="your.email@example.com"
          required
          aria-required="true"
          aria-invalid={!!emailError || !!displayError}
          aria-describedby={emailError || displayError ? errorId : undefined}
          disabled={isPending}
          className={cn(
            "flex-1 rounded-xl border border-accent-300 bg-white px-4 py-3",
            "font-body text-grey-900 placeholder-grey-500",
            "focus:border-accent-600 focus:ring-2 focus:ring-accent-600/20 focus:outline-none",
            "dark:border-accent-600/30 dark:bg-primary-950 dark:text-grey-100 dark:placeholder-grey-400",
            "dark:focus:border-accent-400 dark:focus:ring-accent-400/20",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />
        <Button type="submit" variant="accent" size="small" disabled={isPending}>
          {isPending ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>

      {/* Turnstile widget - invisible mode */}
      {isTurnstileEnabled && (
        <Turnstile
          ref={turnstileRef}
          siteKey={turnstileSiteKey ?? ""}
          onSuccess={setTurnstileToken}
          onError={() => {
            setTurnstileToken(null)
            setTurnstileError("Security verification failed. Please refresh and try again.")
          }}
          onExpire={() => {
            setTurnstileToken(null)
          }}
          options={{
            size: "invisible",
            theme: "auto",
          }}
        />
      )}

      {/* Field-level validation errors */}
      {emailError && (
        <p id={errorId} className="font-body text-sm text-red-600 dark:text-red-400" role="alert">
          {emailError}
        </p>
      )}

      {/* Form-level errors (Turnstile or server errors) */}
      {displayError && !emailError && (
        <p id={errorId} className="font-body text-sm text-red-600 dark:text-red-400" role="alert">
          {displayError}
        </p>
      )}

      {/* Privacy notice - visible when not submitting and no success */}
      {showPrivacyNotice && !isPending && (
        <p className="font-body text-xs text-grey-600 dark:text-grey-400">
          We respect your privacy. Unsubscribe anytime.
        </p>
      )}
    </form>
  )
}
