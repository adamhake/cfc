import { beforeEach, describe, expect, it, vi } from "vitest"

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}))

// Mock resend - use a class so `new Resend()` works
const mockContacts = {
  create: vi.fn(),
  segments: { add: vi.fn() },
}
const mockEmails = { send: vi.fn() }

vi.mock("resend", () => {
  return {
    Resend: class MockResend {
      contacts = mockContacts
      emails = mockEmails
    },
  }
})

// Mock env
vi.mock("@/env", () => ({
  env: {
    RESEND_API_KEY: "re_test_key",
    RESEND_SEGMENT_ID: "seg_123",
    TURNSTILE_SECRET_KEY: "turnstile_secret",
    TURNSTILE_EXPECTED_HOSTNAME: "example.com",
    ADMIN_EMAIL: "admin@chimborazoparkconservancy.org",
    NEWSLETTER_FROM_EMAIL: "newsletter@chimborazoparkconservancy.org",
    VERIFIED_EMAIL_DOMAIN: "chimborazoparkconservancy.org",
  },
}))

// Mock turnstile
vi.mock("@/lib/turnstile", () => ({
  verifyTurnstileToken: vi.fn(),
}))

import { headers } from "next/headers"
import { verifyTurnstileToken } from "@/lib/turnstile"
import { subscribeToNewsletter } from "./newsletter"

// Use a unique IP per test to avoid rate limit cross-contamination
// (the rate limiter uses a module-level Map that persists across tests)
let ipCounter = 0
function uniqueIp() {
  ipCounter++
  return `100.${Math.floor(ipCounter / 256) % 256}.${ipCounter % 256}.1`
}

function mockHeaders(ip?: string) {
  const testIp = ip ?? uniqueIp()
  vi.mocked(headers).mockResolvedValue(
    new Headers({ "x-forwarded-for": testIp }) as unknown as Awaited<ReturnType<typeof headers>>,
  )
}

describe("subscribeToNewsletter", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHeaders()
    vi.mocked(verifyTurnstileToken).mockResolvedValue({ success: true })
    mockContacts.create.mockResolvedValue({ data: { id: "contact_123" }, error: null })
    mockContacts.segments.add.mockResolvedValue({})
    mockEmails.send.mockResolvedValue({})
  })

  describe("validation", () => {
    it("rejects invalid email", async () => {
      const result = await subscribeToNewsletter({
        email: "not-an-email",
        source: "footer",
        turnstileToken: "token",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe("validation_error")
      }
    })

    it("rejects empty email", async () => {
      const result = await subscribeToNewsletter({
        email: "",
        source: "footer",
        turnstileToken: "token",
      })

      expect(result.success).toBe(false)
    })

    it("rejects invalid source", async () => {
      const result = await subscribeToNewsletter({
        email: "test@example.com",
        source: "invalid-source" as "footer",
        turnstileToken: "token",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe("validation_error")
      }
    })

    it("rejects empty turnstile token", async () => {
      const result = await subscribeToNewsletter({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe("validation_error")
      }
    })
  })

  describe("turnstile verification", () => {
    it("returns turnstile_failed when verification fails", async () => {
      vi.mocked(verifyTurnstileToken).mockResolvedValue({
        success: false,
        errorCodes: ["invalid-input-response"],
      })

      const result = await subscribeToNewsletter({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "bad-token",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe("turnstile_failed")
      }
    })

    it("calls verifyTurnstileToken with correct params", async () => {
      const ip = uniqueIp()
      mockHeaders(ip)
      await subscribeToNewsletter({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "valid-token",
      })

      expect(verifyTurnstileToken).toHaveBeenCalledWith({
        token: "valid-token",
        secret: "turnstile_secret",
        clientIp: ip,
        expectedHostname: "example.com",
      })
    })
  })

  describe("successful subscription", () => {
    it("creates contact and returns success", async () => {
      const result = await subscribeToNewsletter({
        email: "Test@Example.com",
        source: "footer",
        turnstileToken: "valid-token",
      })

      expect(result.success).toBe(true)
      expect(result.message).toContain("Thank you")
      expect(mockContacts.create).toHaveBeenCalledWith({
        email: "test@example.com",
        unsubscribed: false,
      })
    })

    it("normalizes email to lowercase", async () => {
      await subscribeToNewsletter({
        email: "USER@EXAMPLE.COM",
        source: "homepage-widget",
        turnstileToken: "token",
      })

      expect(mockContacts.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: "user@example.com" }),
      )
    })

    it("adds contact to segment when segment ID is configured", async () => {
      await subscribeToNewsletter({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "token",
      })

      expect(mockContacts.segments.add).toHaveBeenCalledWith({
        contactId: "contact_123",
        segmentId: "seg_123",
      })
    })

    it("sends admin notification email", async () => {
      await subscribeToNewsletter({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "token",
      })

      expect(mockEmails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "admin@chimborazoparkconservancy.org",
          subject: expect.stringContaining("New Newsletter Signup"),
        }),
      )
    })
  })

  describe("error handling", () => {
    it("returns contact_error when Resend fails", async () => {
      mockContacts.create.mockResolvedValue({
        data: null,
        error: { message: "Invalid email" },
      })

      const result = await subscribeToNewsletter({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "token",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe("contact_error")
      }
    })

    it("still succeeds when segment add fails", async () => {
      mockContacts.segments.add.mockRejectedValue(new Error("Segment error"))

      const result = await subscribeToNewsletter({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "token",
      })

      expect(result.success).toBe(true)
    })

    it("still succeeds when admin email fails", async () => {
      mockEmails.send.mockRejectedValue(new Error("Email error"))

      const result = await subscribeToNewsletter({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "token",
      })

      expect(result.success).toBe(true)
    })
  })

  describe("rate limiting", () => {
    it("allows requests within rate limit", async () => {
      // Each call uses a unique IP to avoid cross-test pollution
      for (let i = 0; i < 5; i++) {
        mockHeaders(`10.0.0.${i}`)
        const result = await subscribeToNewsletter({
          email: `test${i}@example.com`,
          source: "footer",
          turnstileToken: "token",
        })
        expect(result.success).toBe(true)
      }
    })

    it("blocks requests exceeding rate limit from same IP", async () => {
      const testIp = "10.99.99.99"
      mockHeaders(testIp)

      // Make 6 requests from the same IP
      const results = []
      for (let i = 0; i < 7; i++) {
        const result = await subscribeToNewsletter({
          email: `test${i}@example.com`,
          source: "footer",
          turnstileToken: "token",
        })
        results.push(result)
      }

      // First 5 should succeed, 6th+ should be rate limited
      const rateLimited = results.filter(
        (r) => !r.success && "error" in r && r.error === "rate_limited",
      )
      expect(rateLimited.length).toBeGreaterThan(0)
    })
  })

  describe("client IP detection", () => {
    it("extracts IP from x-forwarded-for header", async () => {
      const ip = uniqueIp()
      mockHeaders(ip)
      await subscribeToNewsletter({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "token",
      })

      expect(verifyTurnstileToken).toHaveBeenCalledWith(expect.objectContaining({ clientIp: ip }))
    })

    it("handles multiple IPs in x-forwarded-for (takes first)", async () => {
      const firstIp = uniqueIp()
      vi.mocked(headers).mockResolvedValue(
        new Headers({
          "x-forwarded-for": `${firstIp}, 2.2.2.2, 3.3.3.3`,
        }) as unknown as Awaited<ReturnType<typeof headers>>,
      )

      await subscribeToNewsletter({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "token",
      })

      expect(verifyTurnstileToken).toHaveBeenCalledWith(
        expect.objectContaining({ clientIp: firstIp }),
      )
    })

    it("falls back to x-real-ip header", async () => {
      const ip = uniqueIp()
      vi.mocked(headers).mockResolvedValue(
        new Headers({ "x-real-ip": ip }) as unknown as Awaited<ReturnType<typeof headers>>,
      )

      await subscribeToNewsletter({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "token",
      })

      expect(verifyTurnstileToken).toHaveBeenCalledWith(expect.objectContaining({ clientIp: ip }))
    })

    it("returns unknown when no IP headers present", async () => {
      vi.mocked(headers).mockResolvedValue(
        new Headers() as unknown as Awaited<ReturnType<typeof headers>>,
      )

      await subscribeToNewsletter({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "token",
      })

      expect(verifyTurnstileToken).toHaveBeenCalledWith(
        expect.objectContaining({ clientIp: "unknown" }),
      )
    })
  })
})
