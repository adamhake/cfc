import { logs } from "@opentelemetry/api-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions"
import { after } from "next/server"
import { OTLP_LOGS_ENDPOINT, OTLP_TRACES_ENDPOINT, POSTHOG_KEY, SERVICE_NAME } from "./config"

/**
 * PostHog's OTLP endpoints authenticate with the project API key as a bearer
 * token. Same key for logs and traces.
 */
const otlpHeaders = { Authorization: `Bearer ${POSTHOG_KEY}` }

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: SERVICE_NAME,
  "deployment.environment.name": process.env.NODE_ENV ?? "development",
})

let loggerProvider: LoggerProvider | null = null
// Typed loosely so this module never has to statically import
// @opentelemetry/sdk-trace-node — see startTracing below for why that matters.
let tracerProvider: { forceFlush(): Promise<void>; shutdown(): Promise<void> } | null = null

/**
 * Lazily construct the OTel LoggerProvider so importing the logger helpers
 * doesn't eagerly wire up the SDK on every server module that logs.
 *
 * With no project key the provider is built with zero processors: `logInfo`
 * and friends stay callable and become no-ops rather than throwing, which is
 * what local development without a `.env` should do.
 */
export function getLoggerProvider(): LoggerProvider {
  if (loggerProvider) return loggerProvider

  loggerProvider = new LoggerProvider({
    resource,
    processors: POSTHOG_KEY
      ? [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({ url: OTLP_LOGS_ENDPOINT, headers: otlpHeaders }),
          }),
        ]
      : [],
  })

  return loggerProvider
}

/**
 * Register the global tracer provider. Node-only: `sdk-trace-node` pulls in
 * `async_hooks` for its context manager, so it is imported dynamically to keep
 * it out of any edge bundle that happens to reach this module.
 */
export async function startTracing(): Promise<void> {
  if (tracerProvider || !POSTHOG_KEY) return

  // The OTLP/JSON exporter, not the protobuf one PostHog's Node docs suggest.
  // Both are accepted, but `/i/v1/traces` answers with a JSON `{}` body either
  // way, so the protobuf exporter logs "could not deserialize response —
  // Unknown wire type 3" after every successful batch. Verified against the
  // live endpoint: JSON in, JSON out, no spurious errors.
  const [{ NodeTracerProvider }, { BatchSpanProcessor }, { OTLPTraceExporter }] = await Promise.all(
    [
      import("@opentelemetry/sdk-trace-node"),
      import("@opentelemetry/sdk-trace-base"),
      import("@opentelemetry/exporter-trace-otlp-http"),
    ],
  )

  const provider = new NodeTracerProvider({
    resource,
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({ url: OTLP_TRACES_ENDPOINT, headers: otlpHeaders }),
      ),
    ],
  })

  // Sets the global tracer provider *and* the AsyncLocalStorage context
  // manager, which is what lets Next.js's own spans become parents of ours.
  provider.register()
  tracerProvider = provider
}

export function registerOtel(): void {
  logs.setGlobalLoggerProvider(getLoggerProvider())
  void startTracing()
}

/**
 * Push buffered logs and spans to PostHog now.
 *
 * Both batch processors hold records for several seconds before exporting.
 * Netlify freezes the function container the moment a response is returned, so
 * without an explicit flush a batch sits in a frozen process and is delivered
 * late on the next invocation — or lost entirely when the container is reaped.
 * Call this from `after()` so it runs once the response is already on its way.
 */
export async function flushTelemetry(): Promise<void> {
  await Promise.allSettled([loggerProvider?.forceFlush(), tracerProvider?.forceFlush()])
}

/**
 * Queue a flush for after the response is sent.
 *
 * `after()` throws outside a request scope, which is exactly what happens under
 * Vitest — so a route handler being unit-tested would fail on its telemetry
 * rather than on its behaviour. Falling back to a detached flush keeps the
 * call site a single line either way.
 */
export function scheduleFlush(): void {
  try {
    after(flushTelemetry)
  } catch {
    void flushTelemetry()
  }
}
