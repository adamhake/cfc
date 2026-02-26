const LOCALHOST_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

interface ShouldEnableTurnstileOptions {
  siteKey?: string;
  isDevelopment: boolean;
  hostname?: string;
}

export function shouldEnableTurnstile({
  siteKey,
  isDevelopment,
  hostname,
}: ShouldEnableTurnstileOptions): boolean {
  if (!siteKey) {
    return false;
  }

  // Turnstile pre-clearance attempts can emit warnings on localhost in dev.
  // Skip the widget there and use the existing dev bypass token path instead.
  if (isDevelopment) {
    if (!hostname) {
      return false;
    }

    return !LOCALHOST_HOSTNAMES.has(hostname);
  }

  return true;
}
