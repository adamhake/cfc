import { useState, useRef } from "react"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/Button/button"
import {
  useNewsletterSignup,
  type NewsletterSource,
} from "@/hooks/useNewsletterSignup"
import { env } from "@/env"
import { cn } from "@/utils/cn"

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

type FormStatus = "idle" | "submitting" | "success" | "error"

export function NewsletterForm({
  source,
  onSuccess,
  className,
  label = "Stay updated",
  showPrivacyNotice = true,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<FormStatus>("idle")
  const [message, setMessage] = useState("")
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)

  const mutation = useNewsletterSignup()
  const turnstileSiteKey = env.VITE_TURNSTILE_SITE_KEY

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus("error")
      setMessage("Please enter your email address")
      return
    }

    // If Turnstile is configured but token not ready, show error
    if (turnstileSiteKey && !turnstileToken) {
      setStatus("error")
      setMessage("Please complete the security verification")
      return
    }

    setStatus("submitting")
    setMessage("")

    try {
      const result = await mutation.mutateAsync({
        email,
        source,
        turnstileToken: turnstileToken || "dev-mode-no-turnstile",
      })

      setStatus("success")
      setMessage(result.message)
      setEmail("")
      onSuccess?.()

      // Reset Turnstile for next submission
      turnstileRef.current?.reset()
      setTurnstileToken(null)
    } catch (error) {
      setStatus("error")
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      )

      // Reset Turnstile on error
      turnstileRef.current?.reset()
      setTurnstileToken(null)
    }
  }

  const isSubmitting = status === "submitting"

  // Show success state with prominent confirmation
  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-xl border border-green-200 bg-green-50 p-4",
          "dark:border-green-800 dark:bg-green-900/20",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 shrink-0 text-green-600 dark:text-green-400" />
          <div className="space-y-1">
            <p className="font-display text-base font-semibold text-green-800 dark:text-green-300">
              You're subscribed!
            </p>
            <p className="font-body text-sm text-green-700 dark:text-green-400">
              {message}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      <label
        htmlFor={`newsletter-email-${source}`}
        className="font-display text-lg text-grey-900 dark:text-grey-100"
      >
        {label}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={`newsletter-email-${source}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
          aria-required="true"
          disabled={isSubmitting}
          className={cn(
            "flex-1 rounded-xl border border-accent-300 bg-white px-4 py-3",
            "font-body text-grey-900 placeholder-grey-500",
            "focus:border-accent-600 focus:ring-2 focus:ring-accent-600/20 focus:outline-none",
            "dark:border-accent-600/30 dark:bg-transparent dark:text-grey-100 dark:placeholder-grey-400",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
        />
        <Button
          type="submit"
          variant="accent"
          size="small"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>

      {/* Turnstile widget - invisible mode */}
      {turnstileSiteKey && (
        <Turnstile
          ref={turnstileRef}
          siteKey={turnstileSiteKey}
          onSuccess={setTurnstileToken}
          onError={() => {
            setTurnstileToken(null)
            setStatus("error")
            setMessage("Security verification failed. Please refresh and try again.")
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

      {/* Error message */}
      {status === "error" && (
        <p className="font-body text-sm text-red-600 dark:text-red-400">
          {message}
        </p>
      )}

      {/* Privacy notice */}
      {showPrivacyNotice && status === "idle" && (
        <p className="font-body text-xs text-grey-600 dark:text-grey-400">
          We respect your privacy. Unsubscribe anytime.
        </p>
      )}
    </form>
  )
}
