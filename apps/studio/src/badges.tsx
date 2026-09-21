import type { DocumentBadgeComponent, DocumentBadgeDescription } from "sanity"

/**
 * Document badges surface a document's real-world state in the Studio header
 * and in list panes, so editors can tell a past event from an upcoming one (or
 * a completed project from a planned one) without opening it.
 */

type DatedDoc = { date?: string }
type StatusDoc = { status?: string }

/** Midnight today, local time -- an event on today's date still counts as upcoming. */
function startOfToday(): number {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}

const eventTimingBadge: DocumentBadgeComponent = (props): DocumentBadgeDescription | null => {
  const doc = (props.draft ?? props.published) as DatedDoc | null
  if (!doc?.date) return null

  const eventTime = new Date(doc.date).getTime()
  if (Number.isNaN(eventTime)) return null

  return eventTime < startOfToday()
    ? { label: "Past", title: "This event has already happened" }
    : { label: "Upcoming", title: "This event has not happened yet", color: "success" }
}

const PROJECT_STATUS_BADGES: Record<string, DocumentBadgeDescription> = {
  planned: { label: "Planned" },
  active: { label: "Active", color: "primary" },
  completed: { label: "Completed", color: "success" },
}

const projectStatusBadge: DocumentBadgeComponent = (props): DocumentBadgeDescription | null => {
  const doc = (props.draft ?? props.published) as StatusDoc | null
  if (!doc?.status) return null
  return PROJECT_STATUS_BADGES[doc.status] ?? null
}

const featuredBadge: DocumentBadgeComponent = (props): DocumentBadgeDescription | null => {
  const doc = (props.draft ?? props.published) as { featured?: boolean } | null
  if (!doc?.featured) return null
  return { label: "Featured", title: "Shown prominently on the homepage", color: "primary" }
}

const BADGES_BY_TYPE: Record<string, DocumentBadgeComponent[]> = {
  event: [eventTimingBadge, featuredBadge],
  project: [projectStatusBadge, featuredBadge],
  update: [featuredBadge],
}

/** Appends this project's badges to Sanity's defaults for the relevant types. */
export function resolveDocumentBadges(
  prev: DocumentBadgeComponent[],
  context: { schemaType: string },
): DocumentBadgeComponent[] {
  return [...prev, ...(BADGES_BY_TYPE[context.schemaType] ?? [])]
}
