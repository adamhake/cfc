import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS, type CacheTag } from "@/lib/sanity-fetch"

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

  try {
    const body = await request.text()

    // Verify webhook signature
    const secret = process.env.SANITY_WEBHOOK_SECRET
    if (!secret) {
      console.error("[Sanity Webhook] SANITY_WEBHOOK_SECRET not configured")
      return Response.json(
        { error: "Server configuration error", message: "Webhook secret not configured" },
        { status: 500 },
      )
    }

    const signature = request.headers.get(SIGNATURE_HEADER_NAME)
    if (!signature) {
      console.warn("[Sanity Webhook] Missing signature header")
      return Response.json(
        { error: "Unauthorized", message: "Missing webhook signature" },
        { status: 401 },
      )
    }

    const isValid = isValidSignature(body, signature, secret)
    if (!isValid) {
      console.warn("[Sanity Webhook] Invalid signature - rejecting request")
      return Response.json(
        { error: "Unauthorized", message: "Invalid webhook signature" },
        { status: 401 },
      )
    }

    const payload = JSON.parse(body) as SanityWebhookPayload

    console.log("[Sanity Webhook] Validated payload:", {
      id: payload._id,
      type: payload._type,
      slug: payload.slug?.current,
    })

    const cacheTags = getCacheTagsForDocumentType(payload._type)

    console.log("[Sanity Webhook] Revalidating tags:", cacheTags.join(", "))

    // Revalidate all affected cache tags
    for (const tag of cacheTags) {
      revalidateTag(tag, { expire: 0 })
    }

    const totalDuration = Date.now() - startTime
    console.log("[Sanity Webhook] Revalidation complete:", {
      docType: payload._type,
      docId: payload._id,
      tags: cacheTags,
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
    console.error("[Sanity Webhook] Unhandled error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      totalDurationMs: totalDuration,
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
    case "siteSettings":
      tags.push(...(Object.values(CACHE_TAGS) as CacheTag[]))
      break
    case "partner":
    case "quote":
    case "gallery":
      tags.push(CACHE_TAGS.HOMEPAGE)
      break
    default:
      console.warn(`[Sanity Webhook] Unknown document type: ${docType}`)
      tags.push(CACHE_TAGS.HOMEPAGE)
  }

  return tags
}
