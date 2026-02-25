import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

/**
 * Get or create a singleton PostHog Node.js client for server-side event capture.
 *
 * Usage in server functions:
 * ```ts
 * import { getPostHogServer } from "@/integrations/posthog/server";
 *
 * const posthog = getPostHogServer();
 * if (posthog) {
 *   posthog.capture({ distinctId: "user-id", event: "my_event" });
 * }
 * ```
 */
export function getPostHogServer(): PostHog | null {
  const apiKey = process.env.POSTHOG_API_KEY;
  if (!apiKey) return null;

  if (!posthogClient) {
    posthogClient = new PostHog(apiKey, {
      host: process.env.POSTHOG_HOST || "https://us.i.posthog.com",
      // Flush immediately - suitable for serverless environments (Netlify)
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return posthogClient;
}

/**
 * Gracefully shut down the PostHog client, flushing any pending events.
 * Call this during server shutdown if running in a persistent server.
 */
export async function shutdownPostHog(): Promise<void> {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
}
