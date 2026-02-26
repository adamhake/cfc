import { describe, expect, it } from "vitest";
import { shouldEnableTurnstile } from "./turnstile";

describe("shouldEnableTurnstile", () => {
  it("returns false when site key is missing", () => {
    expect(
      shouldEnableTurnstile({
        siteKey: undefined,
        isDevelopment: false,
      }),
    ).toBe(false);
  });

  it("returns true in production when site key is configured", () => {
    expect(
      shouldEnableTurnstile({
        siteKey: "site-key",
        isDevelopment: false,
      }),
    ).toBe(true);
  });

  it("returns false in development when hostname is unresolved", () => {
    expect(
      shouldEnableTurnstile({
        siteKey: "site-key",
        isDevelopment: true,
      }),
    ).toBe(false);
  });

  it("returns false in development on localhost hosts", () => {
    expect(
      shouldEnableTurnstile({
        siteKey: "site-key",
        isDevelopment: true,
        hostname: "localhost",
      }),
    ).toBe(false);
    expect(
      shouldEnableTurnstile({
        siteKey: "site-key",
        isDevelopment: true,
        hostname: "127.0.0.1",
      }),
    ).toBe(false);
  });

  it("returns true in development on non-localhost hosts", () => {
    expect(
      shouldEnableTurnstile({
        siteKey: "site-key",
        isDevelopment: true,
        hostname: "preview.chimborazopark.org",
      }),
    ).toBe(true);
  });
});
