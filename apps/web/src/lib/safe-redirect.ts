/**
 * Normalizes untrusted redirect input into a safe in-app path.
 *
 * Rules:
 * - Must be a relative path that starts with "/"
 * - Must not be protocol-relative ("//example.com")
 * - Backslashes are rejected to avoid slash-confusion edge cases
 */
export function getSafeRedirectPath(input: string | null | undefined): string {
  if (!input) return "/";
  if (!input.startsWith("/")) return "/";
  if (input.startsWith("//")) return "/";
  if (input.includes("\\")) return "/";

  try {
    const parsed = new URL(input, "http://localhost");
    if (parsed.origin !== "http://localhost") {
      return "/";
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/";
  }
}
