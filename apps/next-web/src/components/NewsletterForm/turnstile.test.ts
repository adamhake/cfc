import { describe, expect, it } from "vitest"
import { shouldEnableTurnstile } from "./turnstile"

describe("shouldEnableTurnstile", () => {
  it("returns false when no site key", () => {
    expect(shouldEnableTurnstile({ isDevelopment: false })).toBe(false)
  })

  it("returns true in production with site key", () => {
    expect(shouldEnableTurnstile({ siteKey: "key_123", isDevelopment: false })).toBe(true)
  })

  it("returns false in development without hostname", () => {
    expect(shouldEnableTurnstile({ siteKey: "key_123", isDevelopment: true })).toBe(false)
  })

  it("returns false in development on localhost", () => {
    expect(
      shouldEnableTurnstile({ siteKey: "key_123", isDevelopment: true, hostname: "localhost" }),
    ).toBe(false)
  })

  it("returns false in development on 127.0.0.1", () => {
    expect(
      shouldEnableTurnstile({ siteKey: "key_123", isDevelopment: true, hostname: "127.0.0.1" }),
    ).toBe(false)
  })

  it("returns false in development on ::1", () => {
    expect(
      shouldEnableTurnstile({ siteKey: "key_123", isDevelopment: true, hostname: "::1" }),
    ).toBe(false)
  })

  it("returns false in development on [::1]", () => {
    expect(
      shouldEnableTurnstile({ siteKey: "key_123", isDevelopment: true, hostname: "[::1]" }),
    ).toBe(false)
  })

  it("returns true in development on non-localhost hostname", () => {
    expect(
      shouldEnableTurnstile({
        siteKey: "key_123",
        isDevelopment: true,
        hostname: "dev.example.com",
      }),
    ).toBe(true)
  })
})
