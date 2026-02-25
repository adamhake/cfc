import posthog from "posthog-js";
import type { NewsletterSource } from "@/types/newsletter";

/**
 * PostHog custom event helpers.
 *
 * These rely on `posthog-js` being initialised by the `PostHogProvider`.
 * Calling them before initialisation (or on the server) is a no-op because
 * posthog-js guards against captures when uninitialised.
 */

function canCapture(): boolean {
  return typeof window !== "undefined";
}

// ---------------------------------------------------------------------------
// CTA clicks
// ---------------------------------------------------------------------------

export function trackCtaClick(props: {
  cta_text: string;
  cta_url?: string;
  cta_location: string;
  cta_variant?: string;
}) {
  if (canCapture()) posthog.capture("cta_clicked", props);
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export function trackNewsletterSignup(props: { source: NewsletterSource }) {
  if (canCapture()) posthog.capture("newsletter_signup", props);
}

export function trackNewsletterSignupFailed(props: {
  source: NewsletterSource;
  error: string;
}) {
  if (canCapture()) posthog.capture("newsletter_signup_failed", props);
}
