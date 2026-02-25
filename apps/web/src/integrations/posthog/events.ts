import type { NewsletterSource } from "@/types/newsletter";

/**
 * PostHog custom event helpers.
 *
 * These rely on `posthog-js` being initialised by the `PostHogProvider`.
 * The dynamic import() ensures posthog-js is never loaded during SSR/prerender,
 * which would crash the server since it accesses browser-only APIs.
 */

function capture(event: string, properties: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  void import("posthog-js").then(({ default: posthog }) => {
    posthog.capture(event, properties);
  });
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
  capture("cta_clicked", props);
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export function trackNewsletterSignup(props: { source: NewsletterSource }) {
  capture("newsletter_signup", props);
}

export function trackNewsletterSignupFailed(props: {
  source: NewsletterSource;
  error: string;
}) {
  capture("newsletter_signup_failed", props);
}
