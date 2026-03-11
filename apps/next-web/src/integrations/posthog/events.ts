export async function trackCtaClick(location: string, label?: string) {
  const { default: posthog } = await import("posthog-js")
  posthog.capture("cta_click", { location, label })
}

export async function trackNewsletterSignup(source: string) {
  const { default: posthog } = await import("posthog-js")
  posthog.capture("newsletter_signup", { source })
}

export async function trackNewsletterSignupFailed(source: string, error: string) {
  const { default: posthog } = await import("posthog-js")
  posthog.capture("newsletter_signup_failed", { source, error })
}
