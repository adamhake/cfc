import { after } from "next/server"
import { PostHog } from "posthog-node"
import { POSTHOG_HOST, POSTHOG_KEY } from "./config"

export function createPostHogServerClient() {
  if (!POSTHOG_KEY) return null

  return new PostHog(POSTHOG_KEY, {
    host: POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })
}

/**
 * posthog-js writes its identity to `ph_<token>_posthog`, escaping the few
 * base64 characters that aren't cookie-safe. Our key has none of them, but the
 * transform is cheap and keeps this correct if the project key ever rotates.
 *
 * @see posthog-js `PostHogPersistence` — the same expression, inverted.
 */
const IDENTITY_COOKIE_NAME = POSTHOG_KEY
  ? `ph_${POSTHOG_KEY.replace(/\+/g, "PL").replace(/\//g, "SL").replace(/=/g, "EQ")}_posthog`
  : null

interface PostHogIdentity {
  distinctId?: string
  sessionId?: string
}

/**
 * PostHog caps distinct ids at 200 characters and drops events that exceed it.
 * Anything that isn't a plausible identifier is discarded rather than
 * forwarded — an unusable value is worse than no value, because it costs the
 * event rather than just the person link.
 */
const MAX_IDENTIFIER_LENGTH = 200

function asIdentifier(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 && value.length <= MAX_IDENTIFIER_LENGTH
    ? value
    : undefined
}

function parseIdentityCookie(cookieHeader: string | undefined): PostHogIdentity {
  if (!cookieHeader || !IDENTITY_COOKIE_NAME) return {}

  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=")
    if (separator === -1) continue
    if (part.slice(0, separator).trim() !== IDENTITY_COOKIE_NAME) continue

    try {
      const parsed = JSON.parse(decodeURIComponent(part.slice(separator + 1))) as {
        distinct_id?: unknown
        // `$sesid` is [lastActivityTimestamp, sessionId, sessionStartTimestamp].
        $sesid?: unknown
      }
      // The cookie is client-supplied and hand-editable, so the parsed shape is
      // checked rather than asserted — otherwise an object or a multi-kilobyte
      // string could be handed to posthog-node as a distinct id.
      return {
        distinctId: asIdentifier(parsed.distinct_id),
        sessionId: Array.isArray(parsed.$sesid) ? asIdentifier(parsed.$sesid[1]) : undefined,
      }
    } catch {
      // A truncated or hand-edited cookie shouldn't break error reporting.
      return {}
    }
  }

  return {}
}

/**
 * Work out who hit the request that just failed.
 *
 * Two sources, in order of reliability:
 *
 * 1. `X-POSTHOG-*` headers, which posthog-js attaches to same-origin fetches —
 *    but only once its tracing-headers extension has loaded, and that is gated
 *    on remote config. Present often enough to prefer, never enough to rely on.
 * 2. The identity cookie, which is written on init and sent with every request.
 *
 * Without either, exceptions arrive with no person and no session, which means
 * no "watch the replay of this 500" link — the single most useful thing about
 * server-side error tracking.
 */
function resolveIdentity(headers: Record<string, string> | Headers): PostHogIdentity {
  const get = (name: string) =>
    headers instanceof Headers ? (headers.get(name) ?? undefined) : headers[name]

  // Headers are as client-supplied as the cookie, so they get the same
  // validation. Neither source is trustworthy in a security sense — but the
  // PostHog project key is public by design, so anyone can already write
  // arbitrary events straight to PostHog. Nothing here is a trust boundary;
  // the checks exist to keep malformed values out of the event payload.
  const fromHeaders: PostHogIdentity = {
    distinctId: asIdentifier(get("x-posthog-distinct-id")),
    sessionId: asIdentifier(get("x-posthog-session-id")),
  }

  if (fromHeaders.distinctId && fromHeaders.sessionId) return fromHeaders

  const fromCookie = parseIdentityCookie(get("cookie"))
  return {
    distinctId: fromHeaders.distinctId ?? fromCookie.distinctId,
    sessionId: fromHeaders.sessionId ?? fromCookie.sessionId,
  }
}

/**
 * Report an error raised while handling a request. Backs `onRequestError` in
 * `instrumentation.ts`, and is safe to call directly for errors that are caught
 * and turned into an error response (which `onRequestError` never sees).
 */
export function captureRequestError(
  error: unknown,
  request: { method?: string; path?: string; headers: Record<string, string> | Headers },
  context?: Record<string, string | undefined>,
): void {
  const posthog = createPostHogServerClient()
  if (!posthog) return

  const { distinctId, sessionId } = resolveIdentity(request.headers)

  const work = (async () => {
    try {
      posthog.captureException(error, distinctId, {
        $session_id: sessionId,
        // This site has no accounts and the browser SDK runs
        // `person_profiles: "identified_only"`, so no visitor is ever
        // identified. posthog-node only suppresses person processing when the
        // distinct id is *absent*, so passing one would silently create a
        // durable person profile for every anonymous visitor who hits a 500.
        // Setting this keeps the session link (and therefore the replay) while
        // preserving the anonymous posture — the same thing posthog-js does.
        $process_person_profile: false,
        method: request.method,
        path: request.path,
        ...context,
      })
      // Bounded explicitly: shutdown() defaults to a 30s timeout, which is
      // longer than Netlify's function limit. An unreachable PostHog must not
      // be able to turn a fast 500 into a platform timeout.
      await posthog.shutdown(2000)
    } catch {
      // Telemetry must never be the reason a request fails harder than it already has.
    }
  })()

  // Hand the work to Next's `after()` so Netlify's waitUntil tracks it and
  // keeps the container alive until it finishes. React discards the promise
  // `onRequestError` returns, so on the render path a bare floating promise
  // would race the freeze and lose the exception. Callers must NOT await this:
  // it is deliberately off the pre-response path.
  try {
    after(work)
  } catch {
    // No request scope (Vitest, or a context Next doesn't provide one in).
    void work
  }
}
