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
  registerOtel()
}

export async function onRequestError(
  error: { digest: string; message: string },
  request: { method: string; path: string; headers: Record<string, string> },
  context: { routerKind: string; routePath: string; routeType: string; renderSource: string },
) {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  const { captureRequestError } = await import("@/integrations/posthog/server")

  await captureRequestError(error, request, {
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
  })
}
