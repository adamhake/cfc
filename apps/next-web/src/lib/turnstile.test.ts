import { describe, expect, it, vi } from "vitest";
import { verifyTurnstileToken } from "./turnstile";

function mockFetch(response: object, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(response),
  });
}

describe("verifyTurnstileToken", () => {
  it("returns success for valid token", async () => {
    const fetchImpl = mockFetch({ success: true, hostname: "example.com" });
    const result = await verifyTurnstileToken({
      token: "valid-token",
      secret: "secret-key",
      fetchImpl,
    });

    expect(result.success).toBe(true);
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("sends correct form data", async () => {
    const fetchImpl = mockFetch({ success: true });
    await verifyTurnstileToken({
      token: "test-token",
      secret: "test-secret",
      clientIp: "1.2.3.4",
      fetchImpl,
    });

    const body = fetchImpl.mock.calls[0][1].body as URLSearchParams;
    expect(body.get("secret")).toBe("test-secret");
    expect(body.get("response")).toBe("test-token");
    expect(body.get("remoteip")).toBe("1.2.3.4");
  });

  it("skips remoteip when clientIp is unknown", async () => {
    const fetchImpl = mockFetch({ success: true });
    await verifyTurnstileToken({
      token: "test-token",
      secret: "test-secret",
      clientIp: "unknown",
      fetchImpl,
    });

    const body = fetchImpl.mock.calls[0][1].body as URLSearchParams;
    expect(body.has("remoteip")).toBe(false);
  });

  it("returns error for failed verification", async () => {
    const fetchImpl = mockFetch({ success: false, "error-codes": ["invalid-input-response"] });
    const result = await verifyTurnstileToken({
      token: "bad-token",
      secret: "secret",
      fetchImpl,
    });

    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("invalid-input-response");
  });

  it("returns error for HTTP failure", async () => {
    const fetchImpl = mockFetch({}, false, 500);
    const result = await verifyTurnstileToken({
      token: "token",
      secret: "secret",
      fetchImpl,
    });

    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("http-500");
  });

  it("returns error for network failure", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("Network error"));
    const result = await verifyTurnstileToken({
      token: "token",
      secret: "secret",
      fetchImpl,
    });

    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("network-error");
  });

  it("returns error for invalid JSON response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON")),
    });
    const result = await verifyTurnstileToken({
      token: "token",
      secret: "secret",
      fetchImpl,
    });

    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("invalid-json");
  });

  it("returns error for invalid response shape", async () => {
    const fetchImpl = mockFetch("not an object");
    const result = await verifyTurnstileToken({
      token: "token",
      secret: "secret",
      fetchImpl,
    });

    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("invalid-response");
  });

  it("detects hostname mismatch", async () => {
    const fetchImpl = mockFetch({ success: true, hostname: "evil.com" });
    const result = await verifyTurnstileToken({
      token: "token",
      secret: "secret",
      expectedHostname: "example.com",
      fetchImpl,
    });

    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("hostname-mismatch");
  });

  it("passes when hostname matches", async () => {
    const fetchImpl = mockFetch({ success: true, hostname: "example.com" });
    const result = await verifyTurnstileToken({
      token: "token",
      secret: "secret",
      expectedHostname: "example.com",
      fetchImpl,
    });

    expect(result.success).toBe(true);
  });
});
