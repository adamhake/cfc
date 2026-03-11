import { paginatedMediaImagesQuery } from "@chimborazo/sanity-config/queries"
import { NextResponse } from "next/server"
import { sanityClient } from "@/lib/sanity"

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
    const images = await sanityClient.fetch(paginatedMediaImagesQuery, { start, end })
    return NextResponse.json(images, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=60",
      },
    })
  } catch (error) {
    console.error("[API/media] Failed to fetch images:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}
