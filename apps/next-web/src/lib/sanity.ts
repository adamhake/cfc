import { createSanityClient, urlForImage as urlForImageBase } from "@chimborazo/sanity-config/client";
import { env } from "@/env";

// Production client (uses CDN, published perspective)
export const sanityClient = createSanityClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
  perspective: "published",
});

// Preview client (no CDN, includes drafts, stega enabled) - server-side only
let _sanityPreviewClient: ReturnType<typeof createSanityClient> | null = null;
export const sanityPreviewClient = () => {
  if (!_sanityPreviewClient) {
    _sanityPreviewClient = createSanityClient({
      projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
      useCdn: false,
      perspective: "previewDrafts",
      token: env.SANITY_API_TOKEN,
      stega: {
        enabled: true,
        studioUrl: env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "http://localhost:3333",
      },
    });
  }
  return _sanityPreviewClient;
};

// Image URL builder helper
export function urlForImage(source: Parameters<typeof urlForImageBase>[0]) {
  return urlForImageBase(source, {
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  });
}

// Helper to determine which client to use (server-side only)
export function getSanityClient(preview = false) {
  if (!preview) return sanityClient;
  return sanityPreviewClient();
}
