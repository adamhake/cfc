import { SpanStatusCode, trace } from "@opentelemetry/api"
import { SERVICE_NAME } from "./config"

/**
 * Wrap an outbound call in a span.
 *
 * Next.js emits spans for rendering, route handling, and the fetches it manages
 * itself, but a bare `fetch()` to Resend or Anthropic inside a route handler is
 * invisible to it. Wrapping those calls is what turns a flat "this request took
 * 3s" into "this request took 3s, 2.8s of which was Anthropic".
 *
 * Errors are recorded on the span and rethrown — this never changes control flow.
 */
export async function withSpan<T>(
  name: string,
  attributes: Record<string, string | number | boolean>,
  fn: () => Promise<T>,
): Promise<T> {
  const tracer = trace.getTracer(SERVICE_NAME)

  return tracer.startActiveSpan(name, { attributes }, async (span) => {
    try {
      const result = await fn()
      span.setStatus({ code: SpanStatusCode.OK })
      return result
    } catch (error) {
      span.recordException(error as Error)
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    } finally {
      span.end()
    }
  })
}

/**
 * Attach attributes to whichever span is currently active, if any. Useful for
 * recording an outcome that is only known partway through a handler.
 */
export function annotateActiveSpan(attributes: Record<string, string | number | boolean>): void {
  trace.getActiveSpan()?.setAttributes(attributes)
}
