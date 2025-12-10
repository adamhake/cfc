import { queryKeys } from "@/lib/query-keys";
import { sanityClient } from "@/lib/sanity";
import type { SanityProject } from "@/lib/sanity-types";
import { projectBySlugQuery } from "@chimborazo/sanity-config";
import { queryOptions, useQuery } from "@tanstack/react-query";

// Query options for fetching a project by slug
export const projectBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: queryKeys.projects.detail(slug),
    queryFn: async (): Promise<SanityProject | null> => {
      try {
        return await sanityClient.fetch(projectBySlugQuery, { slug });
      } catch (error) {
        console.warn(`Failed to fetch project "${slug}" from Sanity:`, error);
        return null;
      }
    },
    // Projects don't change frequently - cache for 10 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

/**
 * Hook to fetch a project by slug from Sanity CMS
 */
export function useProject(slug: string) {
  return useQuery(projectBySlugQueryOptions(slug));
}
