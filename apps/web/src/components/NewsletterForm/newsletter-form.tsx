import { useEffect, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/Button/button";
import { useNewsletterSignup } from "@/hooks/useNewsletterSignup";
import type { NewsletterSource } from "@/types/newsletter";
import { env } from "@/env";
import { cn } from "@/utils/cn";

export interface NewsletterFormProps {
  /**
   * Tracks which form the signup came from
   */
  source: NewsletterSource;

  /**
   * Callback when subscription succeeds
   */
  onSuccess?: () => void;

  /**
   * Additional CSS classes for the form container
   */
  className?: string;

  /**
   * Label text for the email input
   * @default "Stay updated"
   */
  label?: string;

  /**
   * Show the privacy notice below the form
   * @default true
   */
  showPrivacyNotice?: boolean;
}

export function NewsletterForm({
  source,
  onSuccess,
  className,
  label = "Stay updated",
  showPrivacyNotice = true,
}: NewsletterFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Focus management for accessibility - announce success to screen readers
  useEffect(() => {
    if (successMessage && successRef.current) {
      successRef.current.focus();
    }
  }, [successMessage]);

  const mutation = useNewsletterSignup();
  const turnstileSiteKey = env.VITE_TURNSTILE_SITE_KEY;
  const isDevelopment = import.meta.env.DEV;

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      // Clear any previous turnstile errors
      setTurnstileError(null);

      // In production, Turnstile token is required
      // In development, allow bypass if Turnstile is not configured
      if (turnstileSiteKey && !turnstileToken) {
        setTurnstileError("Please complete the security verification");
        return;
      }

      if (!turnstileSiteKey && !isDevelopment) {
        setTurnstileError("Security verification is not available. Please try again later.");
        return;
      }

      // Only use dev bypass token in development mode without Turnstile
      const tokenToSend = turnstileToken || (isDevelopment ? "dev-bypass" : "");

      if (!tokenToSend) {
        setTurnstileError("Security verification is required");
        return;
      }

      const result = await mutation.mutateAsync({
        email: value.email,
        source,
        turnstileToken: tokenToSend,
      });

      setSuccessMessage(result.message);
      form.reset();
      onSuccess?.();

      // Reset Turnstile for next submission
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    },
  });

  const inputId = `newsletter-email-${source}`;
  const errorId = `newsletter-error-${source}`;

  // Show success state with prominent confirmation
  if (successMessage) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className={cn(
          "rounded-xl border border-green-200 bg-green-50 p-4",
          "dark:border-green-800 dark:bg-green-900/20",
          "focus:outline-none",
          className,
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
            <p className="font-body text-sm text-green-700 dark:text-green-400">{successMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  const formError = turnstileError || (mutation.error ? mutation.error.message : null);
  const isSubmitting = form.state.isSubmitting;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={cn("space-y-3", className)}
    >
      <label htmlFor={inputId} className="font-display text-lg text-grey-900 dark:text-grey-100">
        {label}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Please enter your email address";
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return "Please enter a valid email address";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <input
              id={inputId}
              type="email"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="your.email@example.com"
              required
              aria-required="true"
              aria-invalid={field.state.meta.errors.length > 0 || !!formError}
              aria-describedby={
                field.state.meta.errors.length > 0 || formError ? errorId : undefined
              }
              disabled={isSubmitting}
              className={cn(
                "flex-1 rounded-xl border border-accent-300 bg-white px-4 py-3",
                "font-body text-grey-900 placeholder-grey-500",
                "focus:border-accent-600 focus:ring-2 focus:ring-accent-600/20 focus:outline-none",
                "dark:border-accent-600/30 dark:bg-transparent dark:text-grey-100 dark:placeholder-grey-400",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            />
          )}
        </form.Field>
        <Button type="submit" variant="accent" size="small" disabled={isSubmitting}>
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
            setTurnstileToken(null);
            setTurnstileError("Security verification failed. Please refresh and try again.");
          }}
          onExpire={() => {
            setTurnstileToken(null);
          }}
          options={{
            size: "invisible",
            theme: "auto",
          }}
        />
      )}

      {/* Field-level validation errors */}
      <form.Subscribe selector={(state) => state.fieldMeta.email?.errors}>
        {(errors) =>
          errors && errors.length > 0 ? (
            <p
              id={errorId}
              className="text-red-600 dark:text-red-400 font-body text-sm"
              role="alert"
            >
              {errors[0]}
            </p>
          ) : null
        }
      </form.Subscribe>

      {/* Form-level errors (Turnstile or mutation errors) */}
      {formError && (
        <p id={errorId} className="text-red-600 dark:text-red-400 font-body text-sm" role="alert">
          {formError}
        </p>
      )}

      {/* Privacy notice - visible when not submitting and no success */}
      {showPrivacyNotice && !isSubmitting && (
        <p className="font-body text-xs text-grey-600 dark:text-grey-400">
          We respect your privacy. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
