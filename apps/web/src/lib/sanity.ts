import { createSanityClient, urlForImage as urlForImageBase } from "@chimborazo/sanity-config";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { env } from "@/env";

type SanityClient = ReturnType<typeof createSanityClient>;
type SanityFetchClient = Pick<SanityClient, "fetch">;

type PreviewQueryInput = {
  query: string;
  params?: Record<string, unknown>;
};

// Browser-safe preview fetch: runs on the server so SANITY_API_TOKEN stays server-only.
const fetchPreviewQuery = createServerFn({ method: "POST" })
  .inputValidator((input: unknown): PreviewQueryInput => {
    if (!input || typeof input !== "object") {
      throw new Error("Invalid preview query input");
    }

    const data = input as { query?: unknown; params?: unknown };
    if (typeof data.query !== "string") {
      throw new Error("Preview query must be a string");
    }

    if (data.params != null && typeof data.params !== "object") {
      throw new Error("Preview query params must be an object");
    }

    return {
      query: data.query,
      params: data.params as Record<string, unknown> | undefined,
    };
  })
  .handler(async ({ data }: { data: PreviewQueryInput }) => {
    if (getCookie("sanity-preview") !== "true") {
      throw new Error("Preview mode is not enabled");
    }

    return await sanityPreviewClient().fetch(data.query, data.params);
  });

// Production client (uses CDN, excludes drafts via query filters)
// Using "raw" perspective with draft filters in queries to show all non-draft content
export const sanityClient = createSanityClient({
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET,
  apiVersion: env.VITE_SANITY_API_VERSION,
  useCdn: true,
  perspective: "raw",
});

// Preview client (no CDN, includes drafts, stega enabled) - for draft/preview mode
// Lazy-loaded to avoid accessing server-side env vars on client
let _sanityPreviewClient: SanityClient | null = null;
export const sanityPreviewClient = () => {
  if (!_sanityPreviewClient) {
    _sanityPreviewClient = createSanityClient({
      projectId: env.VITE_SANITY_PROJECT_ID,
      dataset: env.VITE_SANITY_DATASET,
      apiVersion: env.VITE_SANITY_API_VERSION,
      useCdn: false,
      perspective: "previewDrafts",
      token: env.SANITY_API_TOKEN, // Server-side only
      // Enable stega encoding for Visual Editing click-to-edit overlays
      stega: {
        enabled: true,
        studioUrl: env.VITE_SANITY_STUDIO_URL ?? "http://localhost:3333",
      },
    });
  }
  return _sanityPreviewClient;
};

const sanityPreviewBrowserClient: SanityFetchClient = {
  fetch: async (query: string, params?: Record<string, unknown>) => {
    return fetchPreviewQuery({
      data: {
        query,
        params,
      },
    });
  },
};

// Image URL builder helper
export function urlForImage(source: Parameters<typeof urlForImageBase>[0]) {
  return urlForImageBase(source, {
    projectId: env.VITE_SANITY_PROJECT_ID,
    dataset: env.VITE_SANITY_DATASET,
  });
}

// Helper to determine which client to use
export function getSanityClient(preview = false) {
  if (!preview) return sanityClient;

  // On the browser, route/query functions can run during navigation.
  // Use a server function to keep draft fetches and the API token server-only.
  if (typeof window !== "undefined") {
    return sanityPreviewBrowserClient;
  }

  return sanityPreviewClient();
}
