import { queryKeys } from "@/lib/query-keys";
import { sanityClient } from "@/lib/sanity";
import { getSiteSettingsQuery } from "@chimborazo/sanity-config";
import type { GetSiteSettingsQueryResult } from "@chimborazo/sanity-config";
import { queryOptions, useQuery } from "@tanstack/react-query";

// Query options for TanStack Query
export const siteSettingsQueryOptions = queryOptions({
  queryKey: queryKeys.siteSettings(),
  queryFn: async (): Promise<GetSiteSettingsQueryResult | null> => {
    try {
      return await sanityClient.fetch(getSiteSettingsQuery);
    } catch (error) {
      console.warn("Failed to fetch site settings from Sanity:", error);
      return null;
    }
  },
  // Site settings change very infrequently - cache for 1 hour
  staleTime: 60 * 60 * 1000, // 1 hour
  gcTime: 2 * 60 * 60 * 1000, // 2 hours (must be >= staleTime)
});

/**
 * Hook to fetch site settings from Sanity CMS
 * Returns social media URLs, donation URL, and other global settings
 */
export function useSiteSettings() {
  return useQuery(siteSettingsQueryOptions);
}
