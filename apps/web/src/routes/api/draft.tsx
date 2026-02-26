import { env } from "@/env";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { sanityPreviewClient } from "@/lib/sanity";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/draft")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);

        console.log("[Draft Mode] Enable request received:", url.pathname + url.search);

        if (!env.SANITY_API_TOKEN) {
          console.error(
            "[Draft Mode] SANITY_API_TOKEN is not set – cannot validate preview secret",
          );
          return new Response("Server misconfiguration: missing API token", { status: 500 });
        }

        // Validate the preview URL secret from Sanity
        let isValid: boolean;
        let redirectTo: string;
        try {
          const result = await validatePreviewUrl(sanityPreviewClient(), url.toString());
          isValid = result.isValid;
          redirectTo = result.redirectTo ?? "/";
        } catch (error) {
          console.error("[Draft Mode] validatePreviewUrl threw:", error);
          return new Response("Failed to validate preview secret", { status: 500 });
        }

        if (!isValid) {
          console.warn("[Draft Mode] Invalid secret – returning 401");
          return new Response("Invalid secret", { status: 401 });
        }

        console.log("[Draft Mode] Secret valid, enabling preview. Redirecting to:", redirectTo);

        // Enable draft mode by setting a cookie.
        // Ensure redirectTo stays on this origin to prevent open redirects.
        const safeRedirect = getSafeRedirectPath(redirectTo);
        const redirectUrl = new URL(safeRedirect, url.origin).toString();

        // In production, use SameSite=None so the cookie works inside the
        // Presentation tool's cross-origin iframe (e.g. *.sanity.studio).
        // SameSite=None requires the Secure flag (HTTPS).
        // In development (localhost, same-site), Lax is sufficient.
        const isProduction = process.env.NODE_ENV === "production";
        const sameSite = isProduction ? "None" : "Lax";
        const cookieValue = `sanity-preview=true; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=3600${isProduction ? "; Secure" : ""}`;

        return new Response(null, {
          status: 307,
          headers: {
            Location: redirectUrl,
            "Set-Cookie": cookieValue,
          },
        });
      },
    },
  },
});
