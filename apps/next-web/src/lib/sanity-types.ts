// Re-export all Sanity types from the shared config package.
// These types are derived from generated TypeGen query result types.
// To regenerate: pnpm --filter @chimborazo/sanity-config schema:generate

export type {
  EventSlug,
  ProjectSlug,
  SanityAboutPage,
  SanityAmenitiesPage,
  SanityBoardMember,
  SanityDonatePage,
  SanityEvent,
  SanityEventDetail,
  SanityEventsPage,
  SanityGallery,
  SanityGalleryImage,
  SanityGetInvolvedPage,
  SanityHighlight,
  SanityHistoryPage,
  SanityHomePage,
  SanityImage,
  SanityMediaImage,
  SanityMediaPage,
  SanityPartner,
  SanityProject,
  SanityProjectDetail,
  SanityProjectsPage,
  SanityQuote,
  SanitySectionHeader,
  SanitySiteSettings,
  SanitySurveyResultsPage,
  SanityUpdate,
  SanityUpdateCategory,
  SanityUpdateDetail,
  SanityUpdateEventReference,
  SanityUpdateProjectReference,
  SanityUpdatesPage,
  SanityVisionPillar,
  UpdateSlug,
} from "@chimborazo/sanity-config/types"

import type { StegaBranded } from "@sanity/client/stega"

/**
 * A query result as it may actually arrive at a component.
 *
 * With Visual Editing on, `sanityFetch` returns strings branded as
 * `StegaString`. The brand is assignable to `string`, so plain text fields need
 * no special handling -- but a string-literal union does: `StegaString<"active">`
 * is deliberately *not* assignable to `"active"`, which is how TypeScript
 * catches an enum being used as logic before it becomes a runtime bug.
 *
 * Type a component prop as `MaybeStega<T>` when it receives fetched data (and
 * possibly also a clean literal fallback), then run any enum through
 * `cleanEnum()` from `@/lib/stega` before comparing or keying on it.
 */
export type MaybeStega<T> = T | StegaBranded<T>
