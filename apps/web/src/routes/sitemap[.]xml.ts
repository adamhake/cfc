import { sanityClient } from "@/lib/sanity";
import { eventSlugsQuery, projectSlugsQuery } from "@chimborazo/sanity-config";
import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://chimborazoparkconservancy.org";

// Static routes with their change frequency and priority
const staticRoutes: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/events", changefreq: "weekly", priority: "0.9" },
  { path: "/projects", changefreq: "weekly", priority: "0.9" },
  { path: "/amenities", changefreq: "monthly", priority: "0.7" },
  { path: "/history", changefreq: "monthly", priority: "0.6" },
  { path: "/get-involved", changefreq: "monthly", priority: "0.8" },
  { path: "/donate", changefreq: "monthly", priority: "0.8" },
  { path: "/media", changefreq: "weekly", priority: "0.6" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.2" },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];

        // Fetch dynamic slugs from Sanity
        const [eventSlugs, projectSlugs] = await Promise.all([
          sanityClient.fetch<Array<{ slug: string }>>(eventSlugsQuery),
          sanityClient.fetch<Array<{ slug: string }>>(projectSlugsQuery),
        ]);

        const urls = [
          // Static routes
          ...staticRoutes.map(
            (route) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${route.path}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
          ),
          // Dynamic event pages
          ...eventSlugs.map(
            ({ slug }) => `  <url>
    <loc>${escapeXml(`${SITE_URL}/events/${slug}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
          ),
          // Dynamic project pages
          ...projectSlugs.map(
            ({ slug }) => `  <url>
    <loc>${escapeXml(`${SITE_URL}/projects/${slug}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
          ),
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

        return new Response(sitemap, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
