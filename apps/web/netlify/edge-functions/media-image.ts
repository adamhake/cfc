import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  try {
    // Extract the image key from the URL path
    // URL format: /media-img/{key}
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/media-img/");
    const key = pathParts[1];

    if (!key) {
      return new Response("Image key is required", { status: 400 });
    }

    // Open the media store
    const store = getStore({
      name: "media",
      siteID: context.site?.id,
    });

    // Get the image blob with strong consistency for immediate availability
    const blob = await store.get(key, {
      type: "arrayBuffer",
      consistency: "strong",
    });

    if (!blob) {
      return new Response("Image not found", { status: 404 });
    }

    // Determine content type based on file extension
    let contentType = "image/jpeg";
    if (key.endsWith(".png")) {
      contentType = "image/png";
    } else if (key.endsWith(".webp")) {
      contentType = "image/webp";
    } else if (key.endsWith(".gif")) {
      contentType = "image/gif";
    } else if (key.endsWith(".svg")) {
      contentType = "image/svg+xml";
    }

    // Return with aggressive caching headers
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
        "CDN-Cache-Control": "public, max-age=31536000, immutable", // Netlify CDN
        "Netlify-CDN-Cache-Control": "public, max-age=31536000, immutable", // Netlify-specific
        Vary: "Accept", // Allow different formats if needed
      },
    });
  } catch (error) {
    console.error("Error fetching image from edge:", error);
    return new Response("Failed to fetch image", {
      status: 500,
      headers: {
        "Cache-Control": "no-cache", // Don't cache errors
      },
    });
  }
};

export const config = {
  path: "/media-img/*",
};
