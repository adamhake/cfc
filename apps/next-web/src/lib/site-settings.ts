import { sanityFetch, CACHE_TAGS } from "./sanity-fetch";
import type { SanitySiteSettings } from "./sanity-types";
import { getSiteSettingsQuery } from "@chimborazo/sanity-config/queries";

/**
 * Server-side function to fetch site settings from Sanity.
 * Used in layout.tsx to avoid client-side waterfall fetches.
 */
export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  const { data } = (await sanityFetch({
    query: getSiteSettingsQuery,
    tags: [CACHE_TAGS.SITE_SETTINGS],
  })) as { data: SanitySiteSettings | null };
  return data;
}
