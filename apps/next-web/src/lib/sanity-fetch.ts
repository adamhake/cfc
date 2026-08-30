/**
 * The app-facing entry point for Sanity data access. Route handlers, pages, and
 * layouts should import from here rather than reaching into `sanity-live.ts`,
 * so a single `vi.mock("@/lib/sanity-fetch")` covers the whole surface in tests.
 */
export { CACHE_TAGS, type CacheTag } from "./cache-tags"
export { type DynamicFetchOptions, getDynamicFetchOptions, sanityFetch } from "./sanity-live"
