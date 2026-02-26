import { CACHE_TAGS, type CacheTag } from "@/lib/cache-headers";
import { purgeCache } from "@netlify/functions";
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
        return new Response(
          JSON.stringify({ status: "ok" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },

      POST: async ({ request }) => {
        const startTime = Date.now();

        try {
          // Read the raw body for signature verification
          const body = await request.text();

          console.log("[Sanity Webhook] Received POST request", {
            contentLength: body.length,
            userAgent: request.headers.get("user-agent"),
          });

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
            console.warn("[Sanity Webhook] Invalid signature - rejecting request");
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

          console.log(`[Sanity Webhook] Validated payload`, {
            id: payload._id,
            type: payload._type,
            rev: payload._rev,
            slug: payload.slug?.current,
          });

          // Determine cache tags to purge based on document type
          const cacheTags = getCacheTagsForDocumentType(payload._type);

          console.log(`[Sanity Webhook] Purging cache tags: [${cacheTags.join(", ")}]`);

          // Purge Netlify cache using the determined cache tags
          const purgeStartTime = Date.now();
          const purgeResult = await purgeNetlifyCache(cacheTags);
          const purgeDuration = Date.now() - purgeStartTime;

          if (!purgeResult.success) {
            const totalDuration = Date.now() - startTime;
            console.error("[Sanity Webhook] Cache purge FAILED", {
              error: purgeResult.error,
              tags: cacheTags,
              docType: payload._type,
              docId: payload._id,
              purgeDurationMs: purgeDuration,
              totalDurationMs: totalDuration,
            });
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

          const totalDuration = Date.now() - startTime;
          console.log(`[Sanity Webhook] Cache purge SUCCESS`, {
            docType: payload._type,
            docId: payload._id,
            slug: payload.slug?.current,
            tags: cacheTags,
            purgeDurationMs: purgeDuration,
            totalDurationMs: totalDuration,
          });

          return new Response(
            JSON.stringify({
              success: true,
              message: "Cache purged successfully",
              type: payload._type,
              tags: cacheTags,
              durationMs: totalDuration,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          const totalDuration = Date.now() - startTime;
          console.error("[Sanity Webhook] Unhandled error", {
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
            totalDurationMs: totalDuration,
          });

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

    case "aboutPage":
      tags.push(CACHE_TAGS.ABOUT);
      break;

    case "historyPage":
      tags.push(CACHE_TAGS.HISTORY);
      break;

    case "donatePage":
      tags.push(CACHE_TAGS.DONATE);
      break;

    case "getInvolvedPage":
      tags.push(CACHE_TAGS.GET_INVOLVED);
      break;

    case "amenitiesPage":
      tags.push(CACHE_TAGS.AMENITIES);
      break;

    case "siteSettings":
      // Site settings (org name, social links, etc.) appear in header/footer on every page
      tags.push(...Object.values(CACHE_TAGS));
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
 * Purges Netlify cache using the @netlify/functions purgeCache helper
 *
 * Uses Netlify's cache tag purging for granular invalidation.
 * The purgeCache function handles authentication automatically when
 * running in a Netlify function context.
 */
async function purgeNetlifyCache(
  tags: CacheTag[],
): Promise<{ success: boolean; error?: string }> {
  try {
    // Use Netlify's purgeCache function for cache tag invalidation
    // This automatically handles authentication in the Netlify function context
    await purgeCache({ tags });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
