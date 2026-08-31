import { trace } from "@opentelemetry/api"
import { logs, SeverityNumber } from "@opentelemetry/api-logs"
import { SERVICE_NAME } from "./config"

/**
 * Structured server-side logging that lands in PostHog Logs.
 *
 * Every call is also mirrored to the console. That is deliberate: the console
 * is what shows up in `pnpm dev` and in Netlify's function logs, and losing it
 * would trade one blind spot for another. PostHog gets the queryable copy.
 *
 * Attributes are flattened into OTel log attributes, so anything passed here is
 * filterable in PostHog. Don't put PII in them — this is a public site with no
 * accounts, and log attributes are not covered by the person-profile settings.
 */
// `null` is accepted because third-party SDKs hand back nullable fields
// (Resend's `statusCode`, for one) and forcing every call site to coerce them
// is more noise than it's worth. Nullish values are dropped before export.
type LogAttributes = Record<string, string | number | boolean | null | undefined>

/**
 * Resolved from the OpenTelemetry global registry on every call, never cached
 * in module scope. `instrumentation.ts` is a separate bundle entry, so a
 * provider held in a module variable there is a different object from the one
 * a route handler would see — see the note at the top of `otel.ts`. The global
 * registry lives on `globalThis` and is shared.
 *
 * Before `register()` runs (and under Vitest, where it never does) this returns
 * a no-op logger, so the console mirror below is the only output. That is the
 * intended degradation, not a failure.
 */
const getLogger = () => logs.getLogger(SERVICE_NAME)

function emit(
  severityNumber: SeverityNumber,
  severityText: string,
  message: string,
  attributes?: LogAttributes,
) {
  // Strip nullish values so absent optional fields don't become the string
  // "undefined" in PostHog's log attribute filters.
  const cleaned: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(attributes ?? {})) {
    if (value !== undefined && value !== null) cleaned[key] = value
  }

  // Stamping trace/span ids joins a log line to the trace it happened in, which
  // is the whole point of running logs and traces through the same backend.
  const spanContext = trace.getActiveSpan()?.spanContext()
  if (spanContext) {
    cleaned.trace_id = spanContext.traceId
    cleaned.span_id = spanContext.spanId
  }

  getLogger().emit({ body: message, severityNumber, severityText, attributes: cleaned })
}

export function logInfo(message: string, attributes?: LogAttributes) {
  console.log(message, attributes ?? "")
  emit(SeverityNumber.INFO, "INFO", message, attributes)
}

export function logWarn(message: string, attributes?: LogAttributes) {
  console.warn(message, attributes ?? "")
  emit(SeverityNumber.WARN, "WARN", message, attributes)
}

export function logError(message: string, attributes?: LogAttributes) {
  console.error(message, attributes ?? "")
  emit(SeverityNumber.ERROR, "ERROR", message, attributes)
}

/**
 * Normalize an unknown caught value into log-safe attributes. `catch` gives us
 * `unknown`, and `String(error)` on a non-Error swallows the useful parts.
 */
export function errorAttributes(error: unknown): LogAttributes {
  if (error instanceof Error) {
    return { error_name: error.name, error_message: error.message, error_stack: error.stack }
  }
  return { error_message: typeof error === "string" ? error : JSON.stringify(error) }
}
