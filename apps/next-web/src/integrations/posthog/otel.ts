import { DiagConsoleLogger, DiagLogLevel, diag, trace } from "@opentelemetry/api"
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

/**
 * Next.js loads `instrumentation.ts` as its own bundle entry, separate from the
 * route and SSR bundles. Anything imported by both is therefore emitted TWICE,
 * and module-level state is NOT shared between the copies — a provider stored
 * in a module variable here is invisible to the copy a route handler runs
 * against, and the bundler will happily tree-shake the assignment away and
 * fold the read to `undefined`.
 *
 * So nothing is cached in module scope. Providers are registered into the
 * OpenTelemetry global registry, which lives on `globalThis` and is genuinely
 * process-wide, and read back out of it at flush time.
 */

/**
 * Surface OTel's own failures. Export errors are routed to `globalErrorHandler`
 * -> `diag.error`, and `diag` is a no-op until a logger is installed — so
 * without this a rotated key or a dead endpoint silently stops all telemetry
 * with nothing in the function logs. WARN keeps it to real problems.
 */
function installDiagnostics(): void {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN)
}

function createLoggerProvider(): LoggerProvider {
  return new LoggerProvider({
    resource,
    // No key (local dev, tests) means no processors: the logging helpers stay
    // callable and become no-ops rather than throwing.
    processors: POSTHOG_KEY
      ? [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({ url: OTLP_LOGS_ENDPOINT, headers: otlpHeaders }),
          }),
        ]
      : [],
  })
}

/**
 * Register the global tracer provider. Node-only: `sdk-trace-node` pulls in
 * `async_hooks` for its context manager, so it is imported dynamically to keep
 * it out of any edge bundle that reaches this module.
 */
async function startTracing(): Promise<void> {
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
        // Registering a provider switches on Next's own 16 allowlisted span
        // types for every route at 100% sampling, but only handlers that call
        // scheduleFlush() force an export. A short delay means a warm container
        // ships page-render spans on its own soon after the request instead of
        // holding them until the next invocation. Spans carry their own
        // timestamps, so a late export is still accurate — only a container
        // reaped while idle loses them.
        { scheduledDelayMillis: 1000 },
      ),
    ],
  })

  // Sets the global tracer provider *and* the AsyncLocalStorage context
  // manager, which is what lets Next.js's own spans parent ours.
  provider.register()
}

/**
 * Awaited by `register()` in instrumentation.ts, so provider registration
 * completes before Next serves the first request. Returning early here would
 * hand out no-op tracers for the whole cold-start window.
 */
export async function registerOtel(): Promise<void> {
  installDiagnostics()
  logs.setGlobalLoggerProvider(createLoggerProvider())
  if (POSTHOG_KEY) await startTracing()
}

/** A provider is only useful to us if it can flush; proxies must be unwrapped first. */
function flushable(provider: unknown): { forceFlush: () => Promise<unknown> } | null {
  if (!provider || typeof provider !== "object") return null

  // trace.getTracerProvider() hands back a ProxyTracerProvider wrapping the real one.
  const withDelegate = provider as { getDelegate?: () => unknown }
  const target =
    typeof withDelegate.getDelegate === "function" ? withDelegate.getDelegate() : provider

  const candidate = target as { forceFlush?: () => Promise<unknown> } | null
  return typeof candidate?.forceFlush === "function"
    ? (candidate as { forceFlush: () => Promise<unknown> })
    : null
}

/**
 * Push buffered logs and spans to PostHog now.
 *
 * Both batch processors hold records before exporting, and Netlify freezes the
 * function container the moment a response is returned — so without an explicit
 * flush a batch sits in a frozen process and is delivered late on the next
 * invocation, or lost when the container is reaped.
 *
 * Providers are read from the global registry rather than module state, for the
 * bundle-duplication reason described at the top of this file.
 */
export async function flushTelemetry(): Promise<void> {
  await Promise.allSettled([
    flushable(logs.getLoggerProvider())?.forceFlush(),
    flushable(trace.getTracerProvider())?.forceFlush(),
  ])
}

/**
 * Queue a flush for after the response is sent.
 *
 * `after()` throws outside a request scope, which is what happens under Vitest —
 * so a route handler being unit-tested would fail on its telemetry rather than
 * on its behaviour. Falling back to a detached flush keeps the call site a
 * single line either way.
 */
export function scheduleFlush(): void {
  try {
    after(flushTelemetry)
  } catch {
    void flushTelemetry()
  }
}
