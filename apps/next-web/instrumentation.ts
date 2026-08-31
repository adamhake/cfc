/**
 * Server telemetry entry point.
 *
 * Everything here is loaded through dynamic imports on purpose. Next.js
 * evaluates this file in both the node and edge runtimes, and both the OTel
 * node SDK (`async_hooks`) and posthog-node are node-only. Importing them at
 * module scope pulls them into the edge bundle whether or not they are used.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  const { registerOtel } = await import("@/integrations/posthog/otel")

  // Awaited, not fire-and-forget. Next serves requests as soon as register()
  // resolves; returning before the tracer provider is registered would hand
  // out no-op tracers for the whole cold-start window, and on a low-traffic
  // site a large share of requests are the first on their container.
  await registerOtel()
}

export async function onRequestError(
  error: { digest: string; message: string },
  request: { method: string; path: string; headers: Record<string, string> },
  context: { routerKind: string; routePath: string; routeType: string; renderSource: string },
) {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  const { captureRequestError } = await import("@/integrations/posthog/server")

  // Not awaited: captureRequestError registers its own completion with
  // `after()`. React discards this function's return value on the render path
  // anyway, so awaiting here would buy nothing and only delay the response.
  captureRequestError(error, request, {
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
  })
}
