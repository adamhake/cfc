import { CACHE_TAGS, type CacheTag } from "@/lib/cache-headers";
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

          // Purge Netlify cache using the determined cache tags
          const purgeResult = await purgeNetlifyCache(cacheTags);

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

          console.log(
            `[Sanity Webhook] Successfully purged cache (method: ${purgeResult.method}) for tags:`,
            cacheTags,
          );

          return new Response(
            JSON.stringify({
              success: true,
              message: "Cache purged successfully",
              method: purgeResult.method,
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
 *
 * Uses the CACHE_TAGS constants from cache-headers.ts to ensure consistency
 * between header generation and cache invalidation.
 */
function getCacheTagsForDocumentType(docType: string): CacheTag[] {
  const tags: CacheTag[] = [];

  switch (docType) {
    case "event":
      // Events affect: event list page, individual event pages, homepage (recent events)
      tags.push(CACHE_TAGS.EVENTS, CACHE_TAGS.EVENTS_LIST, CACHE_TAGS.EVENT_DETAIL);
      tags.push(CACHE_TAGS.HOMEPAGE);
      break;

    case "project":
      // Projects affect: project list page, individual project pages, homepage (featured projects)
      tags.push(CACHE_TAGS.PROJECTS, CACHE_TAGS.PROJECTS_LIST, CACHE_TAGS.PROJECT_DETAIL);
      tags.push(CACHE_TAGS.HOMEPAGE);
      break;

    case "mediaImage":
      // Media affects: media gallery, homepage (galleries)
      tags.push(CACHE_TAGS.MEDIA);
      tags.push(CACHE_TAGS.HOMEPAGE);
      break;

    case "homePage":
      // Homepage content only affects homepage
      tags.push(CACHE_TAGS.HOMEPAGE);
      break;

    case "eventsPage":
      // Events page content affects events list
      tags.push(CACHE_TAGS.EVENTS_LIST);
      break;

    case "projectsPage":
      // Projects page content affects projects list
      tags.push(CACHE_TAGS.PROJECTS_LIST);
      break;

    case "mediaPage":
      // Media page content affects media gallery
      tags.push(CACHE_TAGS.MEDIA);
      break;

    case "partner":
    case "quote":
    case "gallery":
      // Partners, quotes, and galleries are shown on homepage
      tags.push(CACHE_TAGS.HOMEPAGE);
      break;

    default:
      // Unknown types: log warning but don't purge everything
      // This prevents accidental full cache purges for new document types
      console.warn(`[Sanity Webhook] Unknown document type: ${docType}`);
      // Still purge homepage as a safe default since most content appears there
      tags.push(CACHE_TAGS.HOMEPAGE);
  }

  return tags;
}

/**
 * Purges Netlify cache using their Purge API with cache tag support
 * Requires NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID environment variables
 *
 * Uses Netlify's cache tag purging for granular invalidation:
 * - POST /api/v1/purge with cache_tags for tag-based purging
 * - Falls back to full site purge if tag purge fails
 */
async function purgeNetlifyCache(
  tags: CacheTag[],
): Promise<{ success: boolean; error?: string; method?: "tags" | "full" }> {
  const authToken = process.env.NETLIFY_AUTH_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;

  if (!authToken || !siteId) {
    return {
      success: false,
      error: "Netlify credentials not configured (NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID missing)",
    };
  }

  try {
    // Try cache tag purging first (more granular)
    const tagPurgeResponse = await fetch("https://api.netlify.com/api/v1/purge", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        site_id: siteId,
        cache_tags: tags,
      }),
    });

    if (tagPurgeResponse.ok) {
      return { success: true, method: "tags" };
    }

    // Log the tag purge failure for debugging
    const tagErrorText = await tagPurgeResponse.text();
    console.warn(
      `[Sanity Webhook] Tag-based purge failed (${tagPurgeResponse.status}): ${tagErrorText}`,
    );

    // Fall back to full site cache purge
    console.log("[Sanity Webhook] Falling back to full site cache purge");
    const fullPurgeResponse = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/purge_cache`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!fullPurgeResponse.ok) {
      const errorText = await fullPurgeResponse.text();
      return {
        success: false,
        error: `Full site purge failed (${fullPurgeResponse.status}): ${errorText}`,
      };
    }

    return { success: true, method: "full" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
