import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@chimborazo/sanity-config/queries", () => ({
  paginatedMediaImagesQuery: "mock-query",
}))

vi.mock("@/lib/sanity-fetch", () => ({
  CACHE_TAGS: {
    MEDIA: "media",
  },
  sanityFetch: vi.fn(),
}))

import { sanityFetch } from "@/lib/sanity-fetch"
import { GET } from "./route"

function makeRequest(params?: Record<string, string>): Request {
  const url = new URL("http://localhost/api/media")
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value)
    }
  }
  return new Request(url)
}

describe("Media API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns images with default pagination", async () => {
    const mockImages = [{ _id: "img-1" }, { _id: "img-2" }]
    vi.mocked(sanityFetch).mockResolvedValue({ data: mockImages })

    const response = await GET(makeRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual(mockImages)
    expect(sanityFetch).toHaveBeenCalledWith({
      query: "mock-query",
      params: { start: 0, end: 9 },
      tags: ["media"],
    })
  })

  it("passes custom start and end params to Sanity", async () => {
    vi.mocked(sanityFetch).mockResolvedValue({ data: [] })

    await GET(makeRequest({ start: "10", end: "19" }))

    expect(sanityFetch).toHaveBeenCalledWith({
      query: "mock-query",
      params: { start: 10, end: 19 },
      tags: ["media"],
    })
  })

  it("does not set independent cache headers", async () => {
    vi.mocked(sanityFetch).mockResolvedValue({ data: [] })

    const response = await GET(makeRequest())

    expect(response.headers.get("Cache-Control")).toBeNull()
  })

  it("returns 400 for negative start", async () => {
    const response = await GET(makeRequest({ start: "-1", end: "9" }))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain("Invalid range")
    expect(sanityFetch).not.toHaveBeenCalled()
  })

  it("returns 400 when end is less than start", async () => {
    const response = await GET(makeRequest({ start: "10", end: "5" }))

    expect(response.status).toBe(400)
    expect(sanityFetch).not.toHaveBeenCalled()
  })

  it("returns 400 when range exceeds maximum page size", async () => {
    const response = await GET(makeRequest({ start: "0", end: "101" }))

    expect(response.status).toBe(400)
    expect(sanityFetch).not.toHaveBeenCalled()
  })

  it("returns 400 for NaN values", async () => {
    const response = await GET(makeRequest({ start: "abc", end: "10" }))

    expect(response.status).toBe(400)
    expect(sanityFetch).not.toHaveBeenCalled()
  })

  it("returns 500 when Sanity fetch fails", async () => {
    vi.mocked(sanityFetch).mockRejectedValue(new Error("Sanity unavailable"))

    const response = await GET(makeRequest())

    expect(response.status).toBe(500)
    const json = await response.json()
    expect(json.error).toBe("Failed to fetch images")
  })

  it("allows range of exactly 100", async () => {
    vi.mocked(sanityFetch).mockResolvedValue({ data: [] })

    const response = await GET(makeRequest({ start: "0", end: "100" }))

    expect(response.status).toBe(200)
    expect(sanityFetch).toHaveBeenCalledWith({
      query: "mock-query",
      params: { start: 0, end: 100 },
      tags: ["media"],
    })
  })
})
