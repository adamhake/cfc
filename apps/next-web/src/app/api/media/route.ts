import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSanityClient } from "@/lib/sanity";
import { paginatedMediaImagesQuery } from "@chimborazo/sanity-config/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const start = parseInt(searchParams.get("start") || "0", 10);
  const end = parseInt(searchParams.get("end") || "9", 10);

  const client = getSanityClient();
  const images = await client.fetch(paginatedMediaImagesQuery, { start, end });

  return NextResponse.json(images);
}
