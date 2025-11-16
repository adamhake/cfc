import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";
import type { MediaImage } from "../../src/data/media";

export default async (_req: Request, context: Context) => {
  try {
    console.log("[get-media] Starting to fetch media...");
    console.log("[get-media] Site ID:", context.site?.id);

    // Open the media store
    const store = getStore({
      name: "media",
      siteID: context.site?.id,
    });

    // List all blobs in the media store
    console.log("[get-media] Listing blobs...");
    const { blobs } = await store.list();
    console.log(
      `[get-media] Found ${blobs.length} blobs:`,
      blobs.map((b) => b.key),
    );

    // Fetch metadata for each image
    const imagePromises = blobs.map(async (blob) => {
      console.log(`[get-media] Processing blob: ${blob.key}`);

      // Get the metadata stored with the blob
      const result = await store.getMetadata(blob.key, {
        consistency: "strong",
      });

      if (!result) {
        console.log(`[get-media] No metadata found for: ${blob.key}`);
        // Skip blobs without metadata
        return null;
      }

      console.log(`[get-media] Metadata for ${blob.key}:`, result.metadata);

      const typedMetadata = result.metadata as {
        width: number;
        height: number;
        alt: string;
        caption?: string;
        uploadedAt: string;
      };

      const image: MediaImage = {
        key: blob.key,
        src: `/media-img/${blob.key}`, // Served via Edge Function for optimal performance
        width: typedMetadata.width,
        height: typedMetadata.height,
        alt: typedMetadata.alt,
        caption: typedMetadata.caption,
        uploadedAt: typedMetadata.uploadedAt,
      };

      return image;
    });

    const results = await Promise.all(imagePromises);
    const images = results.filter((img): img is MediaImage => img !== null);

    console.log(`[get-media] Returning ${images.length} images`);

    // Sort by upload date (newest first)
    images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return new Response(JSON.stringify(images), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, s-maxage=600", // Cache for 5 min client, 10 min CDN
      },
    });
  } catch (error) {
    console.error("[get-media] Error fetching media:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch media",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
