import { getSiteSettingsQuery } from "@chimborazo/sanity-config/queries"
import { cache } from "react"
import { CACHE_TAGS, cachedSanityFetch, getDynamicFetchOptions } from "./sanity-fetch"
import type { SanitySiteSettings } from "./sanity-types"

/**
 * Server-side function to fetch site settings from Sanity.
 * Wrapped in React.cache() for request-level memoization regardless of
 * transport — layout.tsx + individual pages all call this and we want
 * a single Sanity round trip per request.
 */
export const getSiteSettings = cache(async (): Promise<SanitySiteSettings | null> => {
  const { data } = (await cachedSanityFetch({
    query: getSiteSettingsQuery,
    tags: [CACHE_TAGS.SITE_SETTINGS],
    ...(await getDynamicFetchOptions()),
  })) as { data: SanitySiteSettings | null }
  return data
})
