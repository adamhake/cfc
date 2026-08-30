import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook"
import { revalidateTag } from "next/cache"
import { errorAttributes, logError, logInfo, logWarn } from "@/integrations/posthog/logger"
import { scheduleFlush } from "@/integrations/posthog/otel"
import { captureRequestError } from "@/integrations/posthog/server"
import { CACHE_TAGS, type CacheTag } from "@/lib/cache-tags"

interface SanityWebhookPayload {
  _id: string
  _type: string
  _rev?: string
  slug?: {
    current: string
  }
}

export async function GET() {
  return Response.json({ status: "ok" })
}

export async function POST(request: Request) {
  const startTime = Date.now()

  // The webhook is the only thing standing between a Studio publish and a stale
  // page, and it fails silently by design — Sanity retries, nobody watches.
  // Flushing telemetry after the response is what makes those failures visible.
  scheduleFlush()

  try {
    const body = await request.text()

    // Verify webhook signature
    const secret = process.env.SANITY_WEBHOOK_SECRET
    if (!secret) {
      logError("[Sanity Webhook] SANITY_WEBHOOK_SECRET not configured")
      return Response.json(
        { error: "Server configuration error", message: "Webhook secret not configured" },
        { status: 500 },
      )
    }

    const signature = request.headers.get(SIGNATURE_HEADER_NAME)
    if (!signature) {
      logWarn("[Sanity Webhook] Missing signature header")
      return Response.json(
        { error: "Unauthorized", message: "Missing webhook signature" },
        { status: 401 },
      )
    }

    // `isValidSignature` is async. Without the await this is a Promise, which
    // is always truthy, so `!isValid` was always false and the check below
    // could never reject anything.
    const isValid = await isValidSignature(body, signature, secret)
    if (!isValid) {
      logWarn("[Sanity Webhook] Invalid signature - rejecting request")
      return Response.json(
        { error: "Unauthorized", message: "Invalid webhook signature" },
        { status: 401 },
      )
    }

    const payload = JSON.parse(body) as SanityWebhookPayload
    const cacheTags = getCacheTagsForDocumentType(payload._type)

    // Revalidate all affected cache tags
    for (const tag of cacheTags) {
      revalidateTag(tag, { expire: 0 })
    }

    const totalDuration = Date.now() - startTime
    logInfo("[Sanity Webhook] Revalidation complete", {
      docType: payload._type,
      docId: payload._id,
      slug: payload.slug?.current,
      tags: cacheTags.join(","),
      tagCount: cacheTags.length,
      durationMs: totalDuration,
    })

    return Response.json({
      success: true,
      message: "Cache revalidated successfully",
      type: payload._type,
      tags: cacheTags,
      durationMs: totalDuration,
    })
  } catch (error) {
    const totalDuration = Date.now() - startTime
    logError("[Sanity Webhook] Unhandled error", {
      ...errorAttributes(error),
      totalDurationMs: totalDuration,
    })
    await captureRequestError(error, {
      method: "POST",
      path: "/api/webhooks/sanity",
      headers: request.headers,
    })

    return Response.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred while processing the webhook",
      },
      { status: 500 },
    )
  }
}

function getCacheTagsForDocumentType(docType: string): CacheTag[] {
  const tags: CacheTag[] = []

  switch (docType) {
    case "event":
      tags.push(CACHE_TAGS.EVENTS, CACHE_TAGS.EVENTS_LIST, CACHE_TAGS.EVENT_DETAIL)
      tags.push(CACHE_TAGS.HOMEPAGE)
      break
    case "project":
      tags.push(CACHE_TAGS.PROJECTS, CACHE_TAGS.PROJECTS_LIST, CACHE_TAGS.PROJECT_DETAIL)
      tags.push(CACHE_TAGS.HOMEPAGE)
      break
    case "update":
      tags.push(CACHE_TAGS.UPDATES, CACHE_TAGS.UPDATES_LIST, CACHE_TAGS.UPDATE_DETAIL)
      break
    // Update listings and detail pages both render `update.category.title`,
    // so renaming a category has to invalidate them.
    case "updateCategory":
      tags.push(CACHE_TAGS.UPDATES, CACHE_TAGS.UPDATES_LIST, CACHE_TAGS.UPDATE_DETAIL)
      break
    case "mediaImage":
      tags.push(CACHE_TAGS.MEDIA)
      tags.push(CACHE_TAGS.HOMEPAGE)
      break
    case "homePage":
      tags.push(CACHE_TAGS.HOMEPAGE)
      break
    case "eventsPage":
      tags.push(CACHE_TAGS.EVENTS_LIST)
      break
    case "projectsPage":
      tags.push(CACHE_TAGS.PROJECTS_LIST)
      break
    case "updatesPage":
      tags.push(CACHE_TAGS.UPDATES_LIST)
      break
    case "mediaPage":
      tags.push(CACHE_TAGS.MEDIA)
      break
    case "aboutPage":
      tags.push(CACHE_TAGS.ABOUT)
      break
    case "historyPage":
      tags.push(CACHE_TAGS.HISTORY)
      break
    case "donatePage":
      tags.push(CACHE_TAGS.DONATE)
      break
    case "getInvolvedPage":
      tags.push(CACHE_TAGS.GET_INVOLVED)
      break
    case "amenitiesPage":
      tags.push(CACHE_TAGS.AMENITIES)
      break
    case "surveyResultsPage":
      tags.push(CACHE_TAGS.SURVEY_RESULTS)
      break
    case "siteSettings":
      tags.push(...(Object.values(CACHE_TAGS) as CacheTag[]))
      break
    case "partner":
    case "quote":
    case "gallery":
      tags.push(CACHE_TAGS.HOMEPAGE)
      break
    default:
      logWarn(`[Sanity Webhook] Unknown document type: ${docType}`, { docType })
      tags.push(CACHE_TAGS.HOMEPAGE)
  }

  return tags
}
