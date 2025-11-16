import { createSanityClient, urlForImage as urlForImageBase } from "@chimborazo/sanity-config";
import { env } from "@/env";

// Production client (uses CDN, published content only)
export const sanityClient = createSanityClient({
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET,
  apiVersion: env.VITE_SANITY_API_VERSION,
  useCdn: true,
  perspective: "published",
});

// Preview client (no CDN, includes drafts) - for draft/preview mode
// Lazy-loaded to avoid accessing server-side env vars on client
let _sanityPreviewClient: ReturnType<typeof createSanityClient> | null = null;
export const sanityPreviewClient = () => {
  if (!_sanityPreviewClient) {
    _sanityPreviewClient = createSanityClient({
      projectId: env.VITE_SANITY_PROJECT_ID,
      dataset: env.VITE_SANITY_DATASET,
      apiVersion: env.VITE_SANITY_API_VERSION,
      useCdn: false,
      perspective: "previewDrafts",
      token: env.SANITY_API_TOKEN, // Server-side only
    });
  }
  return _sanityPreviewClient;
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
  return preview ? sanityPreviewClient() : sanityClient;
}
