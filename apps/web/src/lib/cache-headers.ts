/**
 * Cache header utilities for ISR (Incremental Static Regeneration)
 *
 * These utilities generate Cache-Control headers for Netlify's CDN,
 * enabling ISR with stale-while-revalidate for background regeneration.
 *
 * The cache times align with TanStack Query's CACHE_PRESETS to maintain
 * consistency between client-side and CDN caching strategies.
 */

import { CACHE_PRESETS, type CachePreset } from "./query-config";

/**
 * Convert milliseconds to seconds for Cache-Control headers
 */
const msToSeconds = (ms: number): number => Math.floor(ms / 1000);

/**
 * Cache tag constants for Netlify CDN purging
 *
 * These tags are used in Netlify-Cache-Tag headers and can be
 * selectively purged via the Sanity webhook when content changes.
 */
export const CACHE_TAGS = {
  HOMEPAGE: "homepage",
  EVENTS: "events",
  EVENTS_LIST: "events-list",
  EVENT_DETAIL: "event-detail",
  PROJECTS: "projects",
  PROJECTS_LIST: "projects-list",
  PROJECT_DETAIL: "project-detail",
  MEDIA: "media",
  ABOUT: "about",
  HISTORY: "history",
  DONATE: "donate",
  GET_INVOLVED: "get-involved",
  AMENITIES: "amenities",
  SITE_SETTINGS: "site-settings",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

interface CacheHeaderOptions {
  /** Cache preset to use for timing (aligns with TanStack Query presets) */
  preset: CachePreset;
  /** Cache tags for granular invalidation via Netlify */
  tags?: CacheTag[];
  /** Multiplier for stale-while-revalidate duration (default: 2x the staleTime) */
  swrMultiplier?: number;
  /** Whether this is a preview/draft request (bypasses CDN cache) */
  isPreview?: boolean;
}

/**
 * Generates Cache-Control headers for ISR (Incremental Static Regeneration)
 *
 * Uses a layered caching strategy:
 * 1. Standard Cache-Control with s-maxage for broad CDN compatibility
 *    (works with any CDN/proxy, as recommended by TanStack Start docs)
 * 2. Netlify-CDN-Cache-Control for Netlify-specific features (durable cache)
 * 3. Netlify-Cache-Tag for granular tag-based invalidation via webhooks
 *
 * When both Cache-Control and Netlify-CDN-Cache-Control are present,
 * Netlify's CDN uses the Netlify-specific header and forwards the
 * standard Cache-Control to the browser.
 *
 * @example
 * ```typescript
 * headers: ({ loaderData }) => {
 *   return generateCacheHeaders({
 *     preset: "CURATED_CONTENT",
 *     tags: [CACHE_TAGS.HOMEPAGE],
 *     isPreview: loaderData?.preview ?? false,
 *   });
 * }
 * ```
 */
export function generateCacheHeaders(options: CacheHeaderOptions): Record<string, string> {
  const { preset, tags = [], swrMultiplier = 2, isPreview = false } = options;

  // Preview mode: bypass all CDN caching to serve fresh draft content
  if (isPreview) {
    return {
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      "Netlify-CDN-Cache-Control": "no-store",
    };
  }

  const presetConfig = CACHE_PRESETS[preset];
  const maxAgeSeconds = msToSeconds(presetConfig.staleTime);
  const swrSeconds = maxAgeSeconds * swrMultiplier;

  const headers: Record<string, string> = {
    // Standard Cache-Control: browser gets max-age=0 (always revalidate),
    // shared caches (CDNs/proxies) get s-maxage for ISR compatibility
    "Cache-Control": `public, max-age=0, s-maxage=${maxAgeSeconds}, must-revalidate, stale-while-revalidate=${swrSeconds}`,
    // Netlify-specific CDN cache: overrides standard Cache-Control for Netlify's CDN
    // "durable" flag ensures cache survives deploys
    "Netlify-CDN-Cache-Control": `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${swrSeconds}, durable`,
  };

  // Add cache tags for granular invalidation via Sanity webhook
  if (tags.length > 0) {
    headers["Netlify-Cache-Tag"] = tags.join(",");
  }

  return headers;
}
