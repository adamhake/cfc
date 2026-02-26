/**
 * Determines whether a route should be statically prerendered at build time.
 *
 * We intentionally disable page prerendering to keep one unified strategy:
 * all page responses are served at runtime with route-level cache headers.
 */
export function shouldPrerenderPath(path: string): boolean {
  void path;
  return false;
}
