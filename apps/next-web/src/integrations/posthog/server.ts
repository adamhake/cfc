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

function parseIdentityCookie(cookieHeader: string | undefined): PostHogIdentity {
  if (!cookieHeader || !IDENTITY_COOKIE_NAME) return {}

  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=")
    if (separator === -1) continue
    if (part.slice(0, separator).trim() !== IDENTITY_COOKIE_NAME) continue

    try {
      const parsed = JSON.parse(decodeURIComponent(part.slice(separator + 1))) as {
        distinct_id?: string
        // `$sesid` is [lastActivityTimestamp, sessionId, sessionStartTimestamp].
        $sesid?: [number, string, number]
      }
      return { distinctId: parsed.distinct_id, sessionId: parsed.$sesid?.[1] }
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

  const fromHeaders: PostHogIdentity = {
    distinctId: get("x-posthog-distinct-id"),
    sessionId: get("x-posthog-session-id"),
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
export async function captureRequestError(
  error: unknown,
  request: { method?: string; path?: string; headers: Record<string, string> | Headers },
  context?: Record<string, string | undefined>,
): Promise<void> {
  const posthog = createPostHogServerClient()
  if (!posthog) return

  const { distinctId, sessionId } = resolveIdentity(request.headers)

  try {
    posthog.captureException(error, distinctId, {
      $session_id: sessionId,
      method: request.method,
      path: request.path,
      ...context,
    })
    await posthog.shutdown()
  } catch {
    // Telemetry must never be the reason a request fails harder than it already has.
  }
}
