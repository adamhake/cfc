import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Simple authentication check using an admin key
    const authHeader = req.headers.get("Authorization");
    const adminKey = process.env.ADMIN_API_KEY;

    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const alt = formData.get("alt") as string;
    const caption = formData.get("caption") as string | null;
    const width = formData.get("width") as string;
    const height = formData.get("height") as string;
    const key = formData.get("key") as string; // Custom key or filename

    // Validate required fields
    if (!file || !alt || !width || !height || !key) {
      return new Response(
        "Missing required fields: image, alt, width, height, key",
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return new Response("File must be an image", { status: 400 });
    }

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();

    // Open the media store
    const store = getStore({
      name: "media",
      siteID: context.site?.id,
    });

    // Store the image with metadata
    const metadata = {
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      alt,
      caption: caption || undefined,
      uploadedAt: new Date().toISOString(),
    };

    await store.set(key, arrayBuffer, {
      metadata,
    });

    return new Response(
      JSON.stringify({
        success: true,
        key,
        message: "Image uploaded successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error uploading media:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upload media" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
