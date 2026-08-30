/**
 * Single source of truth for where PostHog lives.
 *
 * `POSTHOG_HOST` is PostHog's managed reverse proxy for this domain (it CNAMEs
 * to proxyhog.com), not our own Netlify redirect. Pointing anything at
 * `us.i.posthog.com` directly re-exposes it to the ad blockers the proxy exists
 * to get around, so the value is hardcoded rather than read from an env var —
 * a misconfigured deploy should not be able to silently disable ingestion.
 */
export const POSTHOG_HOST = "https://d.chimborazoparkconservancy.org"

/** Where "view this in PostHog" links point. The proxy only carries ingestion. */
export const POSTHOG_UI_HOST = "https://us.posthog.com"

/**
 * The project API key. Public by design — it only grants write access to
 * ingestion, which is why the same value is used by the browser SDK, the
 * server SDK, and the OTLP exporters.
 */
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY

/** Identifies this app in Logs and Traces. */
export const SERVICE_NAME = "chimbo-park-next-web"

export const OTLP_LOGS_ENDPOINT = `${POSTHOG_HOST}/i/v1/logs`
export const OTLP_TRACES_ENDPOINT = `${POSTHOG_HOST}/i/v1/traces`
