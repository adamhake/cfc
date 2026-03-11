import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@chimborazo/sanity-config/queries", () => ({
  paginatedMediaImagesQuery: "mock-query",
}))

vi.mock("@/lib/sanity", () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
}))

import { sanityClient } from "@/lib/sanity"
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
    vi.mocked(sanityClient.fetch).mockResolvedValue(mockImages)

    const response = await GET(makeRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual(mockImages)
    expect(sanityClient.fetch).toHaveBeenCalledWith("mock-query", { start: 0, end: 9 })
  })

  it("passes custom start and end params to Sanity", async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue([])

    await GET(makeRequest({ start: "10", end: "19" }))

    expect(sanityClient.fetch).toHaveBeenCalledWith("mock-query", { start: 10, end: 19 })
  })

  it("sets Cache-Control headers", async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue([])

    const response = await GET(makeRequest())

    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=1800, stale-while-revalidate=60",
    )
  })

  it("returns 400 for negative start", async () => {
    const response = await GET(makeRequest({ start: "-1", end: "9" }))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain("Invalid range")
    expect(sanityClient.fetch).not.toHaveBeenCalled()
  })

  it("returns 400 when end is less than start", async () => {
    const response = await GET(makeRequest({ start: "10", end: "5" }))

    expect(response.status).toBe(400)
    expect(sanityClient.fetch).not.toHaveBeenCalled()
  })

  it("returns 400 when range exceeds maximum page size", async () => {
    const response = await GET(
      makeRequest({ start: "0", end: "101" }),
    )

    expect(response.status).toBe(400)
    expect(sanityClient.fetch).not.toHaveBeenCalled()
  })

  it("returns 400 for NaN values", async () => {
    const response = await GET(
      makeRequest({ start: "abc", end: "10" }),
    )

    expect(response.status).toBe(400)
    expect(sanityClient.fetch).not.toHaveBeenCalled()
  })

  it("returns 500 when Sanity fetch fails", async () => {
    vi.mocked(sanityClient.fetch).mockRejectedValue(new Error("Sanity unavailable"))

    const response = await GET(makeRequest())

    expect(response.status).toBe(500)
    const json = await response.json()
    expect(json.error).toBe("Failed to fetch images")
  })

  it("allows range of exactly 100", async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue([])

    const response = await GET(
      makeRequest({ start: "0", end: "100" }),
    )

    expect(response.status).toBe(200)
    expect(sanityClient.fetch).toHaveBeenCalledWith("mock-query", { start: 0, end: 100 })
  })
})
