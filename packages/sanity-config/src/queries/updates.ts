import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"
import { richTextProjection } from "./richTextProjection"

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
      ${imageFieldProjection}
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
export const allUpdatesQuery = defineQuery(`
  *[_type == "update" && defined(slug.current)] | order(publishedAt desc) {
    ${updateFields}
  }
`)

// Get featured updates (for homepage)
export const featuredUpdatesQuery = defineQuery(`
  *[_type == "update" && defined(slug.current)] | order(featured desc, publishedAt desc) [0...3] {
    ${updateFields}
  }
`)

// Get updates by category slug
export const updatesByCategoryQuery = defineQuery(`
  *[_type == "update" && defined(slug.current) && category->slug.current == $categorySlug] | order(publishedAt desc) {
    ${updateFields}
  }
`)

// Get update by slug (for detail page)
export const updateBySlugQuery = defineQuery(`
  *[_type == "update" && slug.current == $slug][0] {
    ${updateFieldsExtended},
    body[]{
      ${richTextProjection}
    }
  }
`)

// Get update slugs for static paths
export const updateSlugsQuery = defineQuery(`
  *[_type == "update" && defined(slug.current)] {
    "slug": slug.current
  }
`)

// Get updates that reference a specific event
export const updatesByEventQuery = defineQuery(`
  *[_type == "update" && defined(slug.current) && references($eventId)] | order(publishedAt desc) {
    ${updateFields}
  }
`)

// Get updates that reference a specific project
export const updatesByProjectQuery = defineQuery(`
  *[_type == "update" && defined(slug.current) && references($projectId)] | order(publishedAt desc) {
    ${updateFields}
  }
`)

// Get all update categories
export const updateCategoriesQuery = defineQuery(`
  *[_type == "updateCategory"] | order(title asc) {
    _id,
    title,
    slug,
    color
  }
`)

// Get previous and next updates for navigation
export const updateNavigationQuery = defineQuery(`
  {
    "previous": *[_type == "update" && publishedAt < $publishedAt] | order(publishedAt desc) [0] {
      _id,
      title,
      slug
    },
    "next": *[_type == "update" && publishedAt > $publishedAt] | order(publishedAt asc) [0] {
      _id,
      title,
      slug
    }
  }
`)

// Updates page singleton
export const updatesPageQuery = defineQuery(`
  *[_type == "updatesPage"][0] {
    _id,
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
    introduction
  }
`)
