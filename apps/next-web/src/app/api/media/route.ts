import { paginatedMediaImagesQuery } from "@chimborazo/sanity-config/queries"
import { NextResponse } from "next/server"
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

  try {
    const { data: images } = (await cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: paginatedMediaImagesQuery,
      params: { start, end },
      tags: [CACHE_TAGS.MEDIA],
      // JSON API response — stega encoding would put invisible characters in
      // titles and alt text with no visual-editing overlay to make use of them.
      stega: false,
    })) as { data: SanityMediaImage[] }

    return NextResponse.json(images)
  } catch (error) {
    console.error("[API/media] Failed to fetch images:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}
