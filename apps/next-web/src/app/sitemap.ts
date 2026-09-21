import { sitemapQuery } from "@chimborazo/sanity-config/queries"
import type { MetadataRoute } from "next"
import { CACHE_TAGS, cachedSanityFetch } from "@/lib/sanity-fetch"
import { SITE_CONFIG } from "@/utils/seo"

/**
 * Falls back to `undefined` rather than `new Date()`. `lastModified` is
 * optional in the sitemap spec, and "now" can't be read while prerendering —
 * it would freeze a build timestamp into the output and claim every URL was
 * modified then.
 */
function toDate(isoString: string | null | undefined): Date | undefined {
  return isoString ? new Date(isoString) : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Tagged with every cache tag: any published document can change the set of
  // URLs or their lastModified, and regenerating a sitemap is cheap. Previously
  // this used a raw client fetch with a 1h timer and no tags, so new content
  // could take an hour to appear.
  const { data } = await cachedSanityFetch({
    query: sitemapQuery,
    tags: Object.values(CACHE_TAGS),
    perspective: "published",
    stega: false,
  })
  const pages = data.pages

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.url,
      lastModified: toDate(pages.home),
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.url}/about`,
      lastModified: toDate(pages.about),
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.url}/events`,
      lastModified: toDate(pages.events),
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.url}/projects`,
      lastModified: toDate(pages.projects),
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.url}/updates`,
      lastModified: toDate(pages.updates),
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.url}/amenities`,
      lastModified: toDate(pages.amenities),
      priority: 0.7,
    },
    {
      url: `${SITE_CONFIG.url}/history`,
      lastModified: toDate(pages.history),
      priority: 0.6,
    },
    {
      url: `${SITE_CONFIG.url}/get-involved`,
      lastModified: toDate(pages.getInvolved),
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.url}/donate`,
      lastModified: toDate(pages.donate),
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.url}/media`,
      lastModified: toDate(pages.media),
      priority: 0.6,
    },
    {
      url: `${SITE_CONFIG.url}/2022-park-survey`,
      lastModified: toDate(pages.surveyResults),
      priority: 0.5,
    },
    {
      url: `${SITE_CONFIG.url}/privacy-policy`,
      lastModified: new Date("2025-01-01"),
      priority: 0.2,
    },
  ]

  const eventRoutes: MetadataRoute.Sitemap = data.events.map(({ slug, _updatedAt }) => ({
    url: `${SITE_CONFIG.url}/events/${slug}`,
    lastModified: toDate(_updatedAt),
    priority: 0.7,
  }))

  const projectRoutes: MetadataRoute.Sitemap = data.projects.map(({ slug, _updatedAt }) => ({
    url: `${SITE_CONFIG.url}/projects/${slug}`,
    lastModified: toDate(_updatedAt),
    priority: 0.7,
  }))

  const updateRoutes: MetadataRoute.Sitemap = data.updates.map(({ slug, _updatedAt }) => ({
    url: `${SITE_CONFIG.url}/updates/${slug}`,
    lastModified: toDate(_updatedAt),
    priority: 0.6,
  }))

  return [...staticRoutes, ...eventRoutes, ...projectRoutes, ...updateRoutes]
}
