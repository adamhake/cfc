/**
 * Single source of truth for the Studio's document -> URL mapping.
 *
 * Previously this map was written out three times inside `sanity.config.ts`
 * (`getPreviewPathForDocument`, `resolve.mainDocuments`, and
 * `resolve.locations`), which made it easy for the three copies to drift.
 * Everything below is derived from these two tables.
 */

/** Singleton page documents: one document, one fixed URL. */
export const SINGLETON_PAGES = [
  { type: "homePage", path: "/", title: "Homepage" },
  { type: "aboutPage", path: "/about", title: "About Page" },
  { type: "historyPage", path: "/history", title: "History Page" },
  { type: "amenitiesPage", path: "/amenities", title: "Amenities Page" },
  { type: "getInvolvedPage", path: "/get-involved", title: "Get Involved Page" },
  { type: "donatePage", path: "/donate", title: "Donate Page" },
  { type: "mediaPage", path: "/media", title: "Media Page" },
  { type: "eventsPage", path: "/events", title: "Events Page" },
  { type: "projectsPage", path: "/projects", title: "Projects Page" },
  { type: "updatesPage", path: "/updates", title: "Updates Page" },
  { type: "surveyResultsPage", path: "/2022-park-survey", title: "Survey Results Page" },
] as const

/** Slugged content documents: many documents under a shared base path. */
export const CONTENT_ROUTES = [
  { type: "event", basePath: "/events", label: "Event", listingTitle: "Events Listing" },
  { type: "project", basePath: "/projects", label: "Project", listingTitle: "Projects Listing" },
  { type: "update", basePath: "/updates", label: "Update", listingTitle: "Updates Listing" },
] as const

/**
 * Document types that exist as a single instance. `siteSettings` has no public
 * URL of its own so it is not in `SINGLETON_PAGES`, but it is still a singleton
 * for the purposes of hiding delete/duplicate and create-new templates.
 */
export const SINGLETON_TYPES: string[] = [
  "siteSettings",
  ...SINGLETON_PAGES.map((page) => page.type),
]

/**
 * Resolves the public path for a document, or `null` when the document has no
 * page of its own (or has no slug yet).
 */
export function getPreviewPathForDocument(document: {
  _type?: string
  slug?: { current?: string }
}): string | null {
  const singleton = SINGLETON_PAGES.find((page) => page.type === document._type)
  if (singleton) return singleton.path

  const content = CONTENT_ROUTES.find((route) => route.type === document._type)
  if (content) {
    const slug = document.slug?.current
    return slug ? `${content.basePath}/${slug}` : null
  }

  return null
}
