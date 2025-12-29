import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/draft/disable")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const redirectTo = url.searchParams.get("redirect") || "/";

        // Ensure redirect is a relative path to prevent open redirect
        const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/";

        // Clear the preview cookie
        const isProduction = process.env.NODE_ENV === "production";
        const cookieValue = `sanity-preview=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProduction ? "; Secure" : ""}`;

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
