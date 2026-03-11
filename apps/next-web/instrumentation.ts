import { logs } from "@opentelemetry/api-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"
import { createPostHogServerClient } from "@/integrations/posthog/server"

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY

export const loggerProvider = new LoggerProvider({
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

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    logs.setGlobalLoggerProvider(loggerProvider)
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
