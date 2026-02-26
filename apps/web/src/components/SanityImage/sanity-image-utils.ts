export const DEFAULT_BREAKPOINTS = [320, 480, 640, 768, 896, 1024, 1280, 1536];

/**
 * Builds sorted, unique srcset widths and caps them when maxWidth is provided.
 */
export function getResponsiveWidths(breakpoints: number[], maxWidth?: number): number[] {
  const normalized = Array.from(
    new Set(
      breakpoints
        .filter((width) => Number.isFinite(width) && width > 0)
        .map((width) => Math.round(width)),
    ),
  ).sort((a, b) => a - b);

  const cap = typeof maxWidth === "number" && maxWidth > 0 ? Math.round(maxWidth) : undefined;
  const cappedDefaults = cap
    ? DEFAULT_BREAKPOINTS.filter((width) => width <= cap)
    : DEFAULT_BREAKPOINTS;

  if (normalized.length === 0) {
    if (cappedDefaults.length > 0) {
      return cappedDefaults;
    }
    return cap ? [cap] : DEFAULT_BREAKPOINTS;
  }

  if (cap) {
    const capped = normalized.filter((width) => width <= cap);
    return capped.length > 0 ? capped : [cap];
  }

  return normalized;
}
