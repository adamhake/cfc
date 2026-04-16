/**
 * Convenience type aliases derived from generated Sanity TypeGen query result types.
 * These provide friendly names for use in consuming applications.
 *
 * All types are grounded in the generated `sanity.types.ts` — do not hand-edit shapes here.
 * To update, run: pnpm schema:generate
 */

export type {
	// Re-export schema primitives used by consumers
	SanityImageCrop,
	SanityImageDimensions,
	SanityImageHotspot,
	SanityImagePalette,
	Slug,
} from "./sanity.types"

export type {
	// Re-export all generated query result types
	AllEventsQueryResult,
	AllMediaImagesQueryResult,
	AllProjectsQueryResult,
	AllUpdatesQueryResult,
	EventBySlugQueryResult,
	EventSlugsQueryResult,
	GetAboutPageQueryResult,
	GetAmenitiesPageQueryResult,
	GetDonatePageQueryResult,
	GetEventsPageQueryResult,
	GetGetInvolvedPageQueryResult,
	GetHistoryPageQueryResult,
	GetHomePageQueryResult,
	GetMediaPageQueryResult,
	GetProjectsPageQueryResult,
	GetSiteSettingsQueryResult,
	GetSurveyResultsPageQueryResult,
	MediaImageByIdQueryResult,
	MediaImagesByCategoryQueryResult,
	PaginatedMediaImagesQueryResult,
	ProjectBySlugQueryResult,
	ProjectCardBySlugQueryResult,
	ProjectSlugsQueryResult,
	UpdateBySlugQueryResult,
	UpdateCategoriesQueryResult,
	UpdateSlugsQueryResult,
	UpdatesPageQueryResult,
} from "./sanity.types"

import type {
	AllEventsQueryResult,
	AllMediaImagesQueryResult,
	AllProjectsQueryResult,
	AllUpdatesQueryResult,
	EventBySlugQueryResult,
	EventSlugsQueryResult,
	GetAboutPageQueryResult,
	GetAmenitiesPageQueryResult,
	GetDonatePageQueryResult,
	GetEventsPageQueryResult,
	GetGetInvolvedPageQueryResult,
	GetHistoryPageQueryResult,
	GetHomePageQueryResult,
	GetMediaPageQueryResult,
	GetProjectsPageQueryResult,
	GetSiteSettingsQueryResult,
	GetSurveyResultsPageQueryResult,
	ProjectBySlugQueryResult,
	ProjectCardBySlugQueryResult,
	ProjectSlugsQueryResult,
	UpdateBySlugQueryResult,
	UpdateSlugsQueryResult,
	UpdatesPageQueryResult,
} from "./sanity.types"

// ---------------------------------------------------------------------------
// Shared image type — the dereferenced shape from imageFieldProjection
// ---------------------------------------------------------------------------
export type SanityImage = NonNullable<AllEventsQueryResult[number]["heroImage"]>

// ---------------------------------------------------------------------------
// Entity types — list item shapes (from list queries)
// ---------------------------------------------------------------------------
export type SanityEvent = AllEventsQueryResult[number]
export type SanityProject = AllProjectsQueryResult[number]
export type SanityUpdate = AllUpdatesQueryResult[number]
export type SanityMediaImage = AllMediaImagesQueryResult[number]

// ---------------------------------------------------------------------------
// Entity types — detail shapes (from by-slug queries, non-null)
// ---------------------------------------------------------------------------
export type SanityEventDetail = NonNullable<EventBySlugQueryResult>
export type SanityProjectDetail = NonNullable<ProjectBySlugQueryResult>
export type SanityUpdateDetail = NonNullable<UpdateBySlugQueryResult>

// ---------------------------------------------------------------------------
// Card / condensed shapes
// ---------------------------------------------------------------------------
export type SanityProjectCard = NonNullable<ProjectCardBySlugQueryResult>

// ---------------------------------------------------------------------------
// Singleton page types (non-null wrappers)
// ---------------------------------------------------------------------------
export type SanityHomePage = NonNullable<GetHomePageQueryResult>
export type SanityAboutPage = NonNullable<GetAboutPageQueryResult>
export type SanityAmenitiesPage = NonNullable<GetAmenitiesPageQueryResult>
export type SanityDonatePage = NonNullable<GetDonatePageQueryResult>
export type SanityEventsPage = NonNullable<GetEventsPageQueryResult>
export type SanityGetInvolvedPage = NonNullable<GetGetInvolvedPageQueryResult>
export type SanityHistoryPage = NonNullable<GetHistoryPageQueryResult>
export type SanityMediaPage = NonNullable<GetMediaPageQueryResult>
export type SanityProjectsPage = NonNullable<GetProjectsPageQueryResult>
export type SanitySiteSettings = NonNullable<GetSiteSettingsQueryResult>
export type SanitySurveyResultsPage = NonNullable<GetSurveyResultsPageQueryResult>
export type SanityUpdatesPage = NonNullable<UpdatesPageQueryResult>

// ---------------------------------------------------------------------------
// Sub-types extracted from page/entity types
// ---------------------------------------------------------------------------
export type SanityPartner = NonNullable<SanityHomePage["partners"]>[number]
export type SanityQuote = NonNullable<SanityHomePage["quote"]>
export type SanityGallery = NonNullable<SanityHomePage["gallery"]>
export type SanityGalleryImage = NonNullable<SanityGallery["images"]>[number]
export type SanityVisionPillar = NonNullable<NonNullable<SanityHomePage["visionSection"]>["pillars"]>[number]
export type SanitySectionHeader = NonNullable<SanityHomePage["projectsSectionHeader"]>
export type SanityBoardMember = NonNullable<SanityAboutPage["boardMembers"]>[number]
export type SanityHighlight = NonNullable<SanityAboutPage["highlights"]>[number]
export type SanityUpdateCategory = NonNullable<SanityUpdate["category"]>
export type SanityUpdateEventReference = NonNullable<SanityUpdateDetail["relatedEvents"]>[number]
export type SanityUpdateProjectReference = NonNullable<SanityUpdateDetail["relatedProjects"]>[number]

// ---------------------------------------------------------------------------
// Slug result types for generateStaticParams
// ---------------------------------------------------------------------------
export type EventSlug = EventSlugsQueryResult[number]
export type ProjectSlug = ProjectSlugsQueryResult[number]
export type UpdateSlug = UpdateSlugsQueryResult[number]
