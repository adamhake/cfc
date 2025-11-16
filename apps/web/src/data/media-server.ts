import { getStore } from "@netlify/blobs";
import { createServerFn } from "@tanstack/react-start";
import type { MediaImage } from "./media";

export const getMediaImages = createServerFn().handler(async () => {
  try {
    console.log("[getMediaImages] Starting to fetch media...");

    const siteId = process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_TOKEN;

    console.log("[getMediaImages] Site ID:", siteId);
    console.log("[getMediaImages] Token exists:", !!token);
    console.log("[getMediaImages] Environment:", process.env.CONTEXT || "local");

    if (!siteId) {
      throw new Error("NETLIFY_SITE_ID environment variable is not set");
    }

    // Open the media store
    const store = getStore({
      name: "media",
      siteID: siteId,
      token: token, // Add token for local dev
    });

    // List all blobs in the media store
    console.log("[getMediaImages] Listing blobs...");
    let blobs;
    try {
      const result = await store.list();
      blobs = result.blobs;
      console.log(
        `[getMediaImages] Found ${blobs.length} blobs:`,
        blobs.map((b) => b.key),
      );
    } catch (listError) {
      console.error("[getMediaImages] Error listing blobs:", listError);
      throw new Error(
        `Failed to list blobs: ${listError instanceof Error ? listError.message : String(listError)}`,
      );
    }

    // Fetch metadata for each image
    const imagePromises = blobs.map(async (blob) => {
      console.log(`[getMediaImages] Processing blob: ${blob.key}`);

      // Get the metadata stored with the blob
      const result = await store.getMetadata(blob.key, {
        consistency: "strong",
      });

      if (!result) {
        console.log(`[getMediaImages] No metadata found for: ${blob.key}`);
        return null;
      }

      console.log(`[getMediaImages] Metadata for ${blob.key}:`, result.metadata);

      const typedMetadata = result.metadata as {
        width: number;
        height: number;
        alt: string;
        caption?: string;
        uploadedAt: string;
      };

      // Validate required metadata fields
      if (!typedMetadata.width || !typedMetadata.height) {
        console.warn(
          `[getMediaImages] Skipping ${blob.key} - missing width or height in metadata`,
          typedMetadata,
        );
        return null;
      }

      // In development, fetch the actual blob data and convert to data URL
      // In production, use the edge function URL
      const isDev = process.env.NODE_ENV === "development";
      let src = `/media-img/${blob.key}`;

      if (isDev) {
        try {
          // Fetch the actual blob data
          const blobData = await store.get(blob.key, { type: "arrayBuffer" });
          if (blobData) {
            // Convert to base64
            const base64 = Buffer.from(blobData).toString("base64");
            // Determine mime type from extension
            let mimeType = "image/webp";
            if (blob.key.endsWith(".jpg") || blob.key.endsWith(".jpeg")) {
              mimeType = "image/jpeg";
            } else if (blob.key.endsWith(".png")) {
              mimeType = "image/png";
            }
            src = `data:${mimeType};base64,${base64}`;
          }
        } catch (err) {
          console.warn(`[getMediaImages] Failed to fetch blob data for ${blob.key}:`, err);
          // Fall back to edge function URL
        }
      }

      const image: MediaImage = {
        key: blob.key,
        src,
        width: typedMetadata.width,
        height: typedMetadata.height,
        alt: typedMetadata.alt || blob.key,
        caption: typedMetadata.caption,
        uploadedAt: typedMetadata.uploadedAt || new Date().toISOString(),
      };

      return image;
    });

    const results = await Promise.all(imagePromises);
    const images = results.filter((img): img is MediaImage => img !== null);

    console.log(`[getMediaImages] Returning ${images.length} images`);

    // Sort by upload date (newest first)
    images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return images;
  } catch (error) {
    console.error("[getMediaImages] Error fetching media:", error);
    throw new Error(
      `Failed to fetch media: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
});
