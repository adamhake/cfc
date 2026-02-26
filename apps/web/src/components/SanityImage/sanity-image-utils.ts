const DEFAULT_BREAKPOINTS = [640, 1024, 1536];

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

  if (normalized.length === 0) {
    if (typeof maxWidth === "number" && maxWidth > 0) {
      return [Math.round(maxWidth)];
    }
    return DEFAULT_BREAKPOINTS;
  }

  if (typeof maxWidth === "number" && maxWidth > 0) {
    const cap = Math.round(maxWidth);
    const capped = normalized.filter((width) => width <= cap);
    return capped.length > 0 ? capped : [cap];
  }

  return normalized;
}
