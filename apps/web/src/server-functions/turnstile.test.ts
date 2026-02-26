import { describe, expect, it, vi } from "vitest";
import { verifyTurnstileToken } from "./turnstile";

describe("verifyTurnstileToken", () => {
  it("returns success for valid verification payload", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, hostname: "chimborazopark.org" }), {
        status: 200,
      }),
    );

    const result = await verifyTurnstileToken({
      token: "valid-token",
      secret: "secret",
      expectedHostname: "chimborazopark.org",
      fetchImpl,
    });

    expect(result).toEqual({ success: true });
  });

  it("fails when Turnstile returns unsuccessful verification", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: false, "error-codes": ["invalid-input-response"] }), {
        status: 200,
      }),
    );

    const result = await verifyTurnstileToken({
      token: "bad-token",
      secret: "secret",
      fetchImpl,
    });

    expect(result.success).toBe(false);
    expect(result.errorCodes).toEqual(["invalid-input-response"]);
  });

  it("fails when hostname does not match expected value", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, hostname: "preview.chimborazo.org" }), {
        status: 200,
      }),
    );

    const result = await verifyTurnstileToken({
      token: "valid-token",
      secret: "secret",
      expectedHostname: "chimborazopark.org",
      fetchImpl,
    });

    expect(result).toEqual({ success: false, errorCodes: ["hostname-mismatch"] });
  });
});
