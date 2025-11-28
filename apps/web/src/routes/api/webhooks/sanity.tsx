import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { createFileRoute } from "@tanstack/react-router";

/**
 * Sanity webhook endpoint for on-demand Netlify cache invalidation
 *
 * This endpoint receives webhook events from Sanity when content is published
 * and purges the Netlify cache to ensure users see fresh content immediately.
 *
 * Setup Instructions:
 * 1. In Sanity Studio: Settings → API → Webhooks → Create webhook
 * 2. URL: https://your-domain.com/api/webhooks/sanity
 * 3. Trigger on: Create, Update, Delete events
 * 4. Secret: Generate a random string and add to SANITY_WEBHOOK_SECRET env var
 * 5. Add NETLIFY_AUTH_TOKEN to your environment (Personal access token from Netlify)
 * 6. Add NETLIFY_SITE_ID to your environment (found in Netlify site settings)
 *
 * How it works:
 * - Webhook arrives when content is published in Sanity
 * - We validate the webhook signature for security
 * - We purge Netlify's cache for affected pages
 * - Next SSR request fetches fresh data from Sanity
 * - Users see updated content immediately
 */

interface SanityWebhookPayload {
  _id: string;
  _type: string;
  _rev?: string;
  slug?: {
    current: string;
  };
}

export const Route = createFileRoute("/api/webhooks/sanity")({
  server: {
    handlers: {
      GET: async () => {
        // Return webhook status info for GET requests
        return new Response(
          JSON.stringify({
            service: "Sanity Webhook Handler",
            status: "active",
            configured: Boolean(
              process.env.SANITY_WEBHOOK_SECRET &&
              process.env.NETLIFY_AUTH_TOKEN &&
              process.env.NETLIFY_SITE_ID,
            ),
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },

      POST: async ({ request }) => {
        try {
          // Read the raw body for signature verification
          const body = await request.text();

          // Verify webhook signature
          const secret = process.env.SANITY_WEBHOOK_SECRET;
          if (!secret) {
            console.error("[Sanity Webhook] SANITY_WEBHOOK_SECRET not configured");
            return new Response(
              JSON.stringify({
                error: "Server configuration error",
                message: "Webhook secret not configured",
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          const signature = request.headers.get(SIGNATURE_HEADER_NAME);
          if (!signature) {
            console.warn("[Sanity Webhook] Missing signature header");
            return new Response(
              JSON.stringify({
                error: "Unauthorized",
                message: "Missing webhook signature",
              }),
              {
                status: 401,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // Verify the signature matches
          const isValid = isValidSignature(body, signature, secret);
          if (!isValid) {
            console.warn("[Sanity Webhook] Invalid signature");
            return new Response(
              JSON.stringify({
                error: "Unauthorized",
                message: "Invalid webhook signature",
              }),
              {
                status: 401,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // Parse the webhook payload
          const payload = JSON.parse(body) as SanityWebhookPayload;

          console.log(`[Sanity Webhook] Received event for ${payload._type}:`, {
            id: payload._id,
            type: payload._type,
            slug: payload.slug?.current,
          });

          // Determine cache tags to purge based on document type
          const cacheTags = getCacheTagsForDocumentType(payload._type);

          // Purge Netlify cache
          const purgeResult = await purgeNetlifyCache();

          if (!purgeResult.success) {
            console.error("[Sanity Webhook] Failed to purge cache:", purgeResult.error);
            return new Response(
              JSON.stringify({
                error: "Cache purge failed",
                message: purgeResult.error,
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          console.log(`[Sanity Webhook] Successfully purged cache for tags:`, cacheTags);

          return new Response(
            JSON.stringify({
              success: true,
              message: "Cache purged successfully",
              type: payload._type,
              tags: cacheTags,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          console.error("[Sanity Webhook] Error processing webhook:", error);

          return new Response(
            JSON.stringify({
              error: "Internal server error",
              message: error instanceof Error ? error.message : "Unknown error",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});

/**
 * Maps Sanity document types to Netlify cache tags
 * Cache tags determine which pages to invalidate when content changes
 */
function getCacheTagsForDocumentType(docType: string): string[] {
  const tags: string[] = [];

  switch (docType) {
    case "event":
      // Events affect: event list page, individual event pages, homepage
      tags.push("events", "homepage");
      break;

    case "mediaImage":
      // Media affects: media gallery, homepage
      tags.push("media", "homepage");
      break;

    case "homePage":
      // Homepage content only affects homepage
      tags.push("homepage");
      break;

    case "partner":
    case "quote":
      // Partners and quotes are shown on homepage
      tags.push("homepage");
      break;

    default:
      // Unknown types: purge everything to be safe
      console.warn(`[Sanity Webhook] Unknown document type: ${docType}, purging all`);
      tags.push("all");
  }

  return tags;
}

/**
 * Purges Netlify cache using their Purge API
 * Requires NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID environment variables
 *
 * Note: Cache tags could be used in the future for granular invalidation
 * if Netlify adds support for cache tags in their API
 */
async function purgeNetlifyCache(): Promise<{ success: boolean; error?: string }> {
  const authToken = process.env.NETLIFY_AUTH_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;

  if (!authToken || !siteId) {
    return {
      success: false,
      error: "Netlify credentials not configured (NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID missing)",
    };
  }

  try {
    // Netlify's cache purge API endpoint
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/purge_cache`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Purge specific cache tags or entire site
        // Note: Netlify's API may vary - adjust based on their current API
        site_id: siteId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Netlify API error (${response.status}): ${errorText}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
