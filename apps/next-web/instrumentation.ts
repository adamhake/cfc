import { logs } from "@opentelemetry/api-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"
import { createPostHogServerClient } from "@/integrations/posthog/server"

let _loggerProvider: LoggerProvider | null = null

/**
 * Lazily construct the OTel LoggerProvider so module import doesn't
 * eagerly wire up the OTel SDK on every server file that imports the
 * logger helpers. Constructed on first call (from `register()` or
 * from `logger.ts` helpers in edge/node runtimes).
 */
export function getLoggerProvider(): LoggerProvider {
  if (_loggerProvider) return _loggerProvider
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  _loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ "service.name": "chimbo-park-next-web" }),
    processors: posthogKey
      ? [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: "https://d.chimborazoparkconservancy.org/i/v1/logs",
              headers: {
                Authorization: `Bearer ${posthogKey}`,
                "Content-Type": "application/json",
              },
            }),
          ),
        ]
      : [],
  })
  return _loggerProvider
}

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    logs.setGlobalLoggerProvider(getLoggerProvider())
  }
}

export async function onRequestError(
  error: { digest: string; message: string },
  request: { method: string; path: string; headers: Record<string, string> },
  context: { routerKind: string; routePath: string; routeType: string; renderSource: string },
) {
  const posthog = createPostHogServerClient()
  if (!posthog) return

  posthog.captureException(error, undefined, {
    method: request.method,
    path: request.path,
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
  })

  await posthog.shutdown()
}
