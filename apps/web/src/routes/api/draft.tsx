import { sanityPreviewClient } from "@/lib/sanity";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/draft")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);

        // Validate the preview URL secret from Sanity
        const { isValid, redirectTo = "/" } = await validatePreviewUrl(
          sanityPreviewClient(),
          url.toString(),
        );

        if (!isValid) {
          return new Response("Invalid secret", { status: 401 });
        }

        // Enable draft mode by setting a cookie
        // Ensure redirectTo is an absolute URL
        const redirectUrl = new URL(redirectTo, url.origin).toString();

        return new Response(null, {
          status: 307,
          headers: {
            Location: redirectUrl,
            "Set-Cookie":
              "sanity-preview=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600",
          },
        });
      },
    },
  },
});
