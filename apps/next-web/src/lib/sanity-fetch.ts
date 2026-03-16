export { sanityFetch } from "./sanity-live"

/**
 * Cache tag constants for Next.js revalidation
 */
export const CACHE_TAGS = {
  HOMEPAGE: "homepage",
  EVENTS: "events",
  EVENTS_LIST: "events-list",
  EVENT_DETAIL: "event-detail",
  UPDATES: "updates",
  UPDATES_LIST: "updates-list",
  UPDATE_DETAIL: "update-detail",
  PROJECTS: "projects",
  PROJECTS_LIST: "projects-list",
  PROJECT_DETAIL: "project-detail",
  MEDIA: "media",
  ABOUT: "about",
  HISTORY: "history",
  DONATE: "donate",
  GET_INVOLVED: "get-involved",
  AMENITIES: "amenities",
  SITE_SETTINGS: "site-settings",
} as const

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]
