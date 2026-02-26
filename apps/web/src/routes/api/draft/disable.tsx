import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/draft/disable")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const redirectTo = url.searchParams.get("redirect") || "/";

        // Ensure redirect stays on this origin to prevent open redirects.
        const safeRedirect = getSafeRedirectPath(redirectTo);

        // Clear the preview cookie (must match SameSite attribute from /api/draft)
        const isProduction = process.env.NODE_ENV === "production";
        const sameSite = isProduction ? "None" : "Lax";
        const cookieValue = `sanity-preview=; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=0${isProduction ? "; Secure" : ""}`;

        return new Response(null, {
          status: 307,
          headers: {
            Location: safeRedirect,
            "Set-Cookie": cookieValue,
          },
        });
      },
    },
  },
});
