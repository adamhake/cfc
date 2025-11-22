import { createFileRoute } from "@tanstack/react-router";
import Anthropic from "@anthropic-ai/sdk";

/**
 * TanStack Start server function for AI-powered image metadata generation
 *
 * This endpoint receives image URLs from Sanity Studio and uses Claude Vision API
 * to generate accessibility-focused metadata including title, alt text, caption,
 * and category classification.
 *
 * Security: The Anthropic API key is kept secure on the server side and never
 * exposed to the browser.
 *
 * Usage:
 * POST /api/generate-metadata
 * Body: { "imageUrl": "https://cdn.sanity.io/images/..." }
 * Returns: { "title": "...", "alt": "...", "caption": "...", "category": "..." }
 */

interface ImageMetadata {
  title: string;
  alt: string;
  caption: string;
  category: "park-views" | "events" | "nature" | "community" | "history";
}

interface RequestBody {
  imageUrl: string;
}

export const Route = createFileRoute("/api/generate-metadata")({
  server: {
    handlers: {
      GET: async () => {
        // Return service status info for GET requests
        return new Response(
          JSON.stringify({
            service: "AI Metadata Generator",
            status: "active",
            configured: Boolean(process.env.ANTHROPIC_API_KEY),
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },

      POST: async ({ request }) => {
        console.log("API route invoked");

        try {
          // Parse request body
          const body = (await request.json()) as RequestBody;
          const { imageUrl } = body;

          console.log("Received imageUrl:", imageUrl);

          if (!imageUrl) {
            console.error("imageUrl is missing from request body");
            return new Response(JSON.stringify({ error: "imageUrl is required" }), {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            });
          }

          // Get API key from environment variables
          const apiKey = process.env.ANTHROPIC_API_KEY;

          if (!apiKey) {
            console.error("ANTHROPIC_API_KEY environment variable is not set");
            return new Response(
              JSON.stringify({
                error: "API key not configured. Please set ANTHROPIC_API_KEY environment variable.",
              }),
              {
                status: 500,
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              },
            );
          }

          console.log("API key is configured, proceeding with image fetch");

          // Initialize Anthropic client
          const anthropic = new Anthropic({
            apiKey,
          });

          // Fetch the image and convert to base64
          console.log("Fetching image from:", imageUrl);
          const imageResponse = await fetch(imageUrl);
          if (!imageResponse.ok) {
            console.error("Failed to fetch image:", imageResponse.status, imageResponse.statusText);
            throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
          }

          console.log("Image fetched successfully, converting to base64");
          const imageBuffer = await imageResponse.arrayBuffer();
          const base64Image = Buffer.from(imageBuffer).toString("base64");
          console.log("Base64 conversion complete, image size:", base64Image.length);

          // Determine the media type from the URL or response
          const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
          const mediaType = contentType.includes("png")
            ? "image/png"
            : contentType.includes("webp")
              ? "image/webp"
              : contentType.includes("gif")
                ? "image/gif"
                : ("image/jpeg" as const);

          // Call Claude Vision API
          console.log("Calling Claude Vision API with media type:", mediaType);
          const message = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: mediaType,
                      data: base64Image,
                    },
                  },
                  {
                    type: "text",
                    text: `Analyze this image from Chimborazo Park in Richmond, Virginia's Church Hill neighborhood. This park is a historic site with beautiful views, community events, nature trails, and rich local history.

Generate metadata for this image in JSON format with the following fields:

1. **title**: A concise, descriptive title for internal organization (3-8 words)
2. **alt**: Detailed alternative text for accessibility that describes what's in the image for screen readers (1-2 sentences)
3. **caption**: An engaging caption that could be displayed publicly, providing context or highlighting interesting details (1-2 sentences)
4. **category**: Choose the single most appropriate category from these options:
   - "park-views": Scenic views, landscapes, vistas of the park
   - "events": Community events, gatherings, festivals, activities
   - "nature": Flora, fauna, wildlife, natural features
   - "community": People enjoying the park, community engagement
   - "history": Historical markers, monuments, historical significance

Return ONLY valid JSON with no additional text, in this exact format:
{
  "title": "...",
  "alt": "...",
  "caption": "...",
  "category": "..."
}`,
                  },
                ],
              },
            ],
          });

          // Extract the text content from the response
          console.log("Claude API call successful, parsing response");
          const textContent = message.content.find((block) => block.type === "text");
          if (!textContent || textContent.type !== "text") {
            console.error("No text response from Claude");
            throw new Error("No text response from Claude");
          }

          // Parse the JSON response
          const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            console.error("Could not find JSON in Claude's response");
            throw new Error("Could not find JSON in Claude's response");
          }

          const metadata = JSON.parse(jsonMatch[0]) as ImageMetadata;
          console.log("Parsed metadata:", metadata);

          // Validate the category
          const validCategories = ["park-views", "events", "nature", "community", "history"];
          if (!validCategories.includes(metadata.category)) {
            console.log("Invalid category, defaulting to park-views:", metadata.category);
            // Default to park-views if invalid category
            metadata.category = "park-views";
          }

          console.log("Returning metadata successfully");
          // Return success response
          return new Response(JSON.stringify(metadata), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
            },
          });
        } catch (error) {
          console.error("Error generating metadata:", error);

          const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

          return new Response(
            JSON.stringify({
              error: `Failed to generate metadata: ${errorMessage}`,
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            },
          );
        }
      },

      // Handle CORS preflight
      OPTIONS: async () => {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
          },
        });
      },
    },
  },
});
