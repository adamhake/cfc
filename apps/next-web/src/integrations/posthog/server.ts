import { PostHog } from "posthog-node"

export function createPostHogServerClient() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return null

  return new PostHog(key, {
    host: "https://d.chimborazoparkconservancy.org",
    flushAt: 1,
    flushInterval: 0,
  })
}
