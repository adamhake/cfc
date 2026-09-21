import { defineQuery } from "groq"

/**
 * Every URL the sitemap needs, plus the `_updatedAt` that drives
 * `lastModified`, in one round trip.
 *
 * The slugged lists carry the `defined(slug.current)` guard required by the
 * package's slug-safety convention -- without it a draft-shaped document with
 * no slug emits `/events/undefined` into the sitemap.
 */
export const sitemapQuery = defineQuery(`{
  "events": *[_type == "event" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "projects": *[_type == "project" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "updates": *[_type == "update" && defined(slug.current)] { "slug": slug.current, _updatedAt },
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
    "surveyResults": *[_type == "surveyResultsPage"][0]._updatedAt
  }
}`)
