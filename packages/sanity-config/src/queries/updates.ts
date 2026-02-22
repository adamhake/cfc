import { imageFieldProjection } from "./imageProjections"

// Base update fields projection
export const updateFields = `
  _id,
  _type,
  title,
  slug,
  description,
  "heroImage": heroImageV2{
    ${imageFieldProjection}
  },
  "category": category->{
    _id,
    title,
    slug,
    color
  },
  featured,
  publishedAt
`

// Extended update fields with related content (for detail pages)
export const updateFieldsExtended = `
  ${updateFields},
  "relatedEvents": relatedEvents[]->{
    _id,
    _type,
    title,
    slug,
    description,
    date,
    "heroImage": heroImage{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip,
          blurhash
        }
      },
      alt,
      hotspot,
      crop
    }
  },
  "relatedProjects": relatedProjects[]->{
    _id,
    _type,
    title,
    slug,
    description,
    status,
    "heroImage": heroImageV2{
      ${imageFieldProjection}
    }
  }
`

// Get all published updates
export const allUpdatesQuery = `
  *[_type == "update" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    ${updateFields}
  }
`

// Get featured updates (for homepage)
export const featuredUpdatesQuery = `
  *[_type == "update" && !(_id in path("drafts.**"))] | order(featured desc, publishedAt desc) [0...3] {
    ${updateFields}
  }
`

// Get updates by category slug
export const updatesByCategoryQuery = `
  *[_type == "update" && !(_id in path("drafts.**")) && category->slug.current == $categorySlug] | order(publishedAt desc) {
    ${updateFields}
  }
`

// Get update by slug (for detail page)
export const updateBySlugQuery = `
  *[_type == "update" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    ${updateFieldsExtended},
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          _id,
          url,
          metadata{
            dimensions,
            lqip,
            blurhash
          }
        }
      }
    }
  }
`

// Get update slugs for static paths
export const updateSlugsQuery = `
  *[_type == "update" && !(_id in path("drafts.**"))] {
    "slug": slug.current
  }
`

// Get updates that reference a specific event
export const updatesByEventQuery = `
  *[_type == "update" && !(_id in path("drafts.**")) && references($eventId)] | order(publishedAt desc) {
    ${updateFields}
  }
`

// Get updates that reference a specific project
export const updatesByProjectQuery = `
  *[_type == "update" && !(_id in path("drafts.**")) && references($projectId)] | order(publishedAt desc) {
    ${updateFields}
  }
`

// Get all update categories
export const updateCategoriesQuery = `
  *[_type == "updateCategory" && !(_id in path("drafts.**"))] | order(title asc) {
    _id,
    title,
    slug,
    color
  }
`

// Get previous and next updates for navigation
export const updateNavigationQuery = `
  {
    "previous": *[_type == "update" && !(_id in path("drafts.**")) && publishedAt < $publishedAt] | order(publishedAt desc) [0] {
      _id,
      title,
      slug
    },
    "next": *[_type == "update" && !(_id in path("drafts.**")) && publishedAt > $publishedAt] | order(publishedAt asc) [0] {
      _id,
      title,
      slug
    }
  }
`

// Updates page singleton
export const updatesPageQuery = `
  *[_type == "updatesPage" && !(_id in path("drafts.**"))][0] {
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
    introduction
  }
`
