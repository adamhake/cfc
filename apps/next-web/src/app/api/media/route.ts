import { paginatedMediaImagesQuery } from "@chimborazo/sanity-config/queries"
import { NextResponse } from "next/server"
import { errorAttributes, logError } from "@/integrations/posthog/logger"
import { scheduleFlush } from "@/integrations/posthog/otel"
import { captureRequestError } from "@/integrations/posthog/server"
import { withSpan } from "@/integrations/posthog/tracing"
import { CACHE_TAGS, cachedSanityFetch, getDynamicFetchOptions } from "@/lib/sanity-fetch"
import type { SanityMediaImage } from "@/lib/sanity-types"

const MAX_PAGE_SIZE = 100

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const start = parseInt(searchParams.get("start") || "0", 10)
  const end = parseInt(searchParams.get("end") || "9", 10)

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    start < 0 ||
    end < start ||
    end - start > MAX_PAGE_SIZE
  ) {
    return NextResponse.json(
      {
        error: "Invalid range. start must be >= 0, end must be >= start, and range must be <= 100.",
      },
      { status: 400 },
    )
  }

  scheduleFlush()

  try {
    const images = await withSpan("sanity.media.paginate", { start, end }, async () => {
      const { data } = (await cachedSanityFetch({
        ...(await getDynamicFetchOptions()),
        query: paginatedMediaImagesQuery,
        params: { start, end },
        tags: [CACHE_TAGS.MEDIA],
        // JSON API response — stega encoding would put invisible characters in
        // titles and alt text with no visual-editing overlay to make use of them.
        stega: false,
      })) as { data: SanityMediaImage[] }

      return data
    })

    return NextResponse.json(images)
  } catch (error) {
    logError("[API/media] Failed to fetch images", { ...errorAttributes(error), start, end })
    await captureRequestError(error, {
      method: "GET",
      path: "/api/media",
      headers: request.headers,
    })
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}
