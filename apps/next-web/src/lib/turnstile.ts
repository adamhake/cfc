const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const DEFAULT_TIMEOUT_MS = 5000;

interface TurnstileVerifyResponse {
  success: boolean;
  hostname?: string;
  "error-codes"?: string[];
}

export interface VerifyTurnstileTokenInput {
  token: string;
  secret: string;
  clientIp?: string;
  expectedHostname?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export interface VerifyTurnstileTokenResult {
  success: boolean;
  errorCodes?: string[];
}

function getTimeoutSignal(timeoutMs: number): AbortSignal | undefined {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(timeoutMs);
  }

  return undefined;
}

export async function verifyTurnstileToken({
  token,
  secret,
  clientIp,
  expectedHostname,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  fetchImpl = fetch,
}: VerifyTurnstileTokenInput): Promise<VerifyTurnstileTokenResult> {
  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (clientIp && clientIp !== "unknown") {
    body.set("remoteip", clientIp);
  }

  let response: Response;
  try {
    response = await fetchImpl(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: getTimeoutSignal(timeoutMs),
    });
  } catch {
    return {
      success: false,
      errorCodes: ["network-error"],
    };
  }

  if (!response.ok) {
    return {
      success: false,
      errorCodes: [`http-${response.status}`],
    };
  }

  let parsed: unknown;
  try {
    parsed = await response.json();
  } catch {
    return {
      success: false,
      errorCodes: ["invalid-json"],
    };
  }

  if (!parsed || typeof parsed !== "object" || typeof (parsed as { success?: unknown }).success !== "boolean") {
    return {
      success: false,
      errorCodes: ["invalid-response"],
    };
  }

  const result = parsed as TurnstileVerifyResponse;

  if (!result.success) {
    return {
      success: false,
      errorCodes: result["error-codes"] ?? ["verification-failed"],
    };
  }

  if (expectedHostname && result.hostname && result.hostname !== expectedHostname) {
    return {
      success: false,
      errorCodes: ["hostname-mismatch"],
    };
  }

  return {
    success: true,
  };
}
