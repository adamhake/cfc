import type { MetadataRoute } from "next"
import { sanityClient } from "@/lib/sanity"
import { SITE_CONFIG } from "@/utils/seo"

export const revalidate = 3600

const sitemapSlugsQuery = `{
  "events": *[_type == "event"] { "slug": slug.current, _updatedAt },
  "projects": *[_type == "project"] { "slug": slug.current, _updatedAt },
  "updates": *[_type == "update"] { "slug": slug.current, _updatedAt },
  "pages": {
    "home": *[_type == "homePage"][0]._updatedAt,
    "about": *[_type == "aboutPage"][0]._updatedAt,
    "events": *[_type == "eventsPage"][0]._updatedAt,
    "projects": *[_type == "projectsPage"][0]._updatedAt,
    "updates": *[_type == "updatesPage"][0]._updatedAt,
    "amenities": *[_type == "amenitiesPage"][0]._updatedAt,
    "history": *[_type == "historyPage"][0]._updatedAt,
    "getInvolved": *[_type == "getInvolvedPage"][0]._updatedAt,
    "donate": *[_type == "donatePage"][0]._updatedAt,
    "media": *[_type == "mediaPage"][0]._updatedAt,
    "surveyResults": *[_type == "surveyResultsPage"][0]._updatedAt,
  }
}`

interface SitemapData {
  events: Array<{ slug: string; _updatedAt: string }>
  projects: Array<{ slug: string; _updatedAt: string }>
  updates: Array<{ slug: string; _updatedAt: string }>
  pages: Record<string, string | null>
}

function toDate(isoString: string | null | undefined): Date {
  return isoString ? new Date(isoString) : new Date()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityClient.fetch<SitemapData>(sitemapSlugsQuery)
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
