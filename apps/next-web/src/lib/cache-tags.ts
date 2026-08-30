/**
 * Cache tag constants for Next.js revalidation.
 *
 * Deliberately kept in a module with no imports. `sanity-fetch.ts` pulls in
 * `sanity-live.ts`, which validates env at import time — so anything importing
 * these constants from there has to mock the whole chain. Tests previously
 * hand-copied this object into a `vi.mock`, and the copy silently drifted
 * (`SURVEY_RESULTS` was missing), hiding a webhook that never invalidated the
 * survey page. Import from here instead of duplicating.
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
  SURVEY_RESULTS: "survey-results",
  SITE_SETTINGS: "site-settings",
} as const

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]
