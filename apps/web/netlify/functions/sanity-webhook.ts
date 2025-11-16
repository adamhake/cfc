import type { Handler, HandlerEvent } from "@netlify/functions";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

/**
 * Netlify function to handle Sanity webhooks for cache invalidation
 *
 * This function:
 * 1. Validates the webhook signature from Sanity
 * 2. Determines which pages need to be purged based on content type
 * 3. Triggers Netlify cache invalidation for those pages
 */
const handler: Handler = async (event: HandlerEvent) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    // Validate webhook signature
    const signature = event.headers[SIGNATURE_HEADER_NAME.toLowerCase()];
    const body = event.body || "";

    if (!signature) {
      console.error("Missing signature header");
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Missing signature" }),
      };
    }

    const isValid = await isValidSignature(body, signature, process.env.SANITY_WEBHOOK_SECRET!);

    if (!isValid) {
      console.error("Invalid webhook signature");
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid signature" }),
      };
    }

    // Parse webhook payload
    const payload = JSON.parse(body);
    console.log("Received webhook:", payload);

    // Determine which pages to purge based on content type
    const pagesToPurge: string[] = [];

    if (payload._type === "event") {
      // Event was created/updated/deleted
      pagesToPurge.push("/events");

      if (payload.slug?.current) {
        pagesToPurge.push(`/events/${payload.slug.current}`);
      }

      // Homepage might show featured events
      pagesToPurge.push("/");
    }

    if (payload._type === "mediaImage") {
      // Media was created/updated/deleted
      pagesToPurge.push("/media");
    }

    console.log("Pages to purge:", pagesToPurge);

    // Purge Netlify CDN cache
    if (pagesToPurge.length > 0) {
      await purgeCDNCache(pagesToPurge);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Webhook processed successfully",
        purged: pagesToPurge,
      }),
    };
  } catch (error) {
    console.error("Webhook error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

/**
 * Purge specific pages from Netlify's CDN cache
 */
async function purgeCDNCache(paths: string[]) {
  const siteId = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_PURGE_TOKEN || process.env.NETLIFY_TOKEN;

  if (!siteId || !token) {
    console.warn("Missing NETLIFY_SITE_ID or NETLIFY_PURGE_TOKEN - skipping cache purge");
    return;
  }

  try {
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/purge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paths }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to purge cache: ${response.status} ${error}`);
    }

    console.log("Successfully purged cache for:", paths);
  } catch (error) {
    console.error("Cache purge error:", error);
    throw error;
  }
}

export { handler };
