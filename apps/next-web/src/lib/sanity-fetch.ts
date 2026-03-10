import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { getSanityClient } from "./sanity";

/**
 * Cache tag constants for Next.js revalidation
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

interface SanityFetchOptions {
  query: string;
  params?: Record<string, unknown>;
  tags?: CacheTag[];
}

/**
 * Base fetch function used as the cache target.
 * Extracted so the function identity is stable across calls.
 */
function createCachedFetcher<T>(query: string, params: Record<string, unknown>, tags: CacheTag[]) {
  return unstable_cache(
    async () => {
      const client = getSanityClient(false);
      return client.fetch<T>(query, params);
    },
    [query, JSON.stringify(params)],
    {
      tags,
      revalidate: 1800, // 30 minutes
    },
  );
}

/**
 * Cached Sanity fetch wrapper using Next.js unstable_cache with tags for revalidation.
 * In preview/draft mode, bypasses cache for fresh content.
 */
export async function sanityFetch<T>({ query, params = {}, tags = [] }: SanityFetchOptions): Promise<T> {
  const { isEnabled: preview } = await draftMode();

  // In preview mode, bypass cache entirely
  if (preview) {
    const client = getSanityClient(true);
    return client.fetch<T>(query, params);
  }

  const fetcher = createCachedFetcher<T>(query, params, tags);
  return fetcher();
}
