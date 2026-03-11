import { beforeEach, describe, expect, it, vi } from "vitest"

// Mock @sanity/webhook
vi.mock("@sanity/webhook", () => ({
  isValidSignature: vi.fn(),
  SIGNATURE_HEADER_NAME: "x-sanity-signature",
}))

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}))

// Mock sanity-fetch to avoid env validation chain (sanity-fetch -> sanity-live -> @/env)
vi.mock("@/lib/sanity-fetch", () => ({
  sanityFetch: vi.fn(),
  CACHE_TAGS: {
    HOMEPAGE: "homepage",
    EVENTS: "events",
    EVENTS_LIST: "events-list",
    EVENT_DETAIL: "event-detail",
    PROJECTS: "projects",
    PROJECTS_LIST: "projects-list",
    PROJECT_DETAIL: "project-detail",
    MEDIA: "media",
    ABOUT: "about",
    HISTORY: "history",
    DONATE: "donate",
    GET_INVOLVED: "get-involved",
    AMENITIES: "amenities",
    SITE_SETTINGS: "site-settings",
  },
}))

import { isValidSignature } from "@sanity/webhook"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/lib/sanity-fetch"
import { GET, POST } from "./route"

function makeRequest(body: object, signature?: string, secret?: string): Request {
  if (secret !== undefined) {
    vi.stubEnv("SANITY_WEBHOOK_SECRET", secret)
  } else {
    vi.stubEnv("SANITY_WEBHOOK_SECRET", "test-secret")
  }

  const headers = new Headers({ "Content-Type": "application/json" })
  if (signature) {
    headers.set("x-sanity-signature", signature)
  }

  return new Request("http://localhost/api/webhooks/sanity", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
}

describe("Sanity Webhook Route", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  describe("GET", () => {
    it("returns status ok", async () => {
      const response = await GET()
      const json = await response.json()
      expect(json).toEqual({ status: "ok" })
    })
  })

  describe("POST", () => {
    it("returns 500 when webhook secret is not configured", async () => {
      const request = makeRequest({ _id: "test", _type: "event" }, "sig", "")
      // Need to clear it since makeRequest sets it
      vi.stubEnv("SANITY_WEBHOOK_SECRET", "")

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json.error).toBe("Server configuration error")
    })

    it("returns 401 when signature header is missing", async () => {
      const request = makeRequest({ _id: "test", _type: "event" })
      // No signature header

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(401)
      expect(json.error).toBe("Unauthorized")
      expect(json.message).toContain("Missing")
    })

    it("returns 401 when signature is invalid", async () => {
      vi.mocked(isValidSignature).mockReturnValue(false)
      const request = makeRequest({ _id: "test", _type: "event" }, "invalid-sig")

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(401)
      expect(json.message).toContain("Invalid")
    })

    it("revalidates correct tags for event document", async () => {
      vi.mocked(isValidSignature).mockReturnValue(true)
      const request = makeRequest({ _id: "event-1", _type: "event" }, "valid-sig")

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.tags).toContain(CACHE_TAGS.EVENTS)
      expect(json.tags).toContain(CACHE_TAGS.EVENTS_LIST)
      expect(json.tags).toContain(CACHE_TAGS.EVENT_DETAIL)
      expect(json.tags).toContain(CACHE_TAGS.HOMEPAGE)
      expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAGS.EVENTS, { expire: 0 })
    })

    it("revalidates correct tags for project document", async () => {
      vi.mocked(isValidSignature).mockReturnValue(true)
      const request = makeRequest({ _id: "proj-1", _type: "project" }, "valid-sig")

      const response = await POST(request)
      const json = await response.json()

      expect(json.tags).toContain(CACHE_TAGS.PROJECTS)
      expect(json.tags).toContain(CACHE_TAGS.PROJECTS_LIST)
      expect(json.tags).toContain(CACHE_TAGS.PROJECT_DETAIL)
      expect(json.tags).toContain(CACHE_TAGS.HOMEPAGE)
    })

    it("revalidates correct tags for mediaImage document", async () => {
      vi.mocked(isValidSignature).mockReturnValue(true)
      const request = makeRequest({ _id: "img-1", _type: "mediaImage" }, "valid-sig")

      const response = await POST(request)
      const json = await response.json()

      expect(json.tags).toContain(CACHE_TAGS.MEDIA)
      expect(json.tags).toContain(CACHE_TAGS.HOMEPAGE)
    })

    it("revalidates all tags for siteSettings document", async () => {
      vi.mocked(isValidSignature).mockReturnValue(true)
      const request = makeRequest({ _id: "settings", _type: "siteSettings" }, "valid-sig")

      const response = await POST(request)
      const json = await response.json()

      const allTags = Object.values(CACHE_TAGS)
      for (const tag of allTags) {
        expect(json.tags).toContain(tag)
      }
    })

    it.each([
      ["homePage", [CACHE_TAGS.HOMEPAGE]],
      ["eventsPage", [CACHE_TAGS.EVENTS_LIST]],
      ["projectsPage", [CACHE_TAGS.PROJECTS_LIST]],
      ["mediaPage", [CACHE_TAGS.MEDIA]],
      ["aboutPage", [CACHE_TAGS.ABOUT]],
      ["historyPage", [CACHE_TAGS.HISTORY]],
      ["donatePage", [CACHE_TAGS.DONATE]],
      ["getInvolvedPage", [CACHE_TAGS.GET_INVOLVED]],
      ["amenitiesPage", [CACHE_TAGS.AMENITIES]],
    ])("revalidates correct tags for %s", async (docType, expectedTags) => {
      vi.mocked(isValidSignature).mockReturnValue(true)
      const request = makeRequest({ _id: "doc-1", _type: docType }, "valid-sig")

      const response = await POST(request)
      const json = await response.json()

      for (const tag of expectedTags) {
        expect(json.tags).toContain(tag)
      }
    })

    it.each([
      "partner",
      "quote",
      "gallery",
    ])("revalidates homepage for %s document", async (docType) => {
      vi.mocked(isValidSignature).mockReturnValue(true)
      const request = makeRequest({ _id: "doc-1", _type: docType }, "valid-sig")

      const response = await POST(request)
      const json = await response.json()

      expect(json.tags).toContain(CACHE_TAGS.HOMEPAGE)
    })

    it("revalidates homepage for unknown document type", async () => {
      vi.mocked(isValidSignature).mockReturnValue(true)
      const request = makeRequest({ _id: "doc-1", _type: "unknownType" }, "valid-sig")

      const response = await POST(request)
      const json = await response.json()

      expect(json.tags).toContain(CACHE_TAGS.HOMEPAGE)
    })

    it("returns 500 for malformed JSON body", async () => {
      vi.stubEnv("SANITY_WEBHOOK_SECRET", "test-secret")
      vi.mocked(isValidSignature).mockReturnValue(true)

      const headers = new Headers({ "Content-Type": "application/json" })
      headers.set("x-sanity-signature", "valid-sig")

      const request = new Request("http://localhost/api/webhooks/sanity", {
        method: "POST",
        headers,
        body: "not-json{{{",
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
    })

    it("includes duration in successful response", async () => {
      vi.mocked(isValidSignature).mockReturnValue(true)
      const request = makeRequest({ _id: "doc-1", _type: "event" }, "valid-sig")

      const response = await POST(request)
      const json = await response.json()

      expect(json.durationMs).toBeTypeOf("number")
      expect(json.durationMs).toBeGreaterThanOrEqual(0)
    })
  })
})
