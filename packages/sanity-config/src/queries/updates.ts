import { defineQuery } from "groq"
import { imageFieldProjection, imageFieldProjectionSlim } from "./imageProjections"
import { richTextProjection } from "./richTextProjection"

// Get all published updates
export const allUpdatesQuery = defineQuery(`
  *[_type == "update" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImageV2{
      ${imageFieldProjectionSlim}
    },
    "category": category->{
      _id,
      title,
      slug,
      color
    },
    featured,
    publishedAt
  }
`)

// Up to 3 updates, featured first; falls back to most recent when fewer than 3 are featured.
export const featuredUpdatesQuery = defineQuery(`
  *[_type == "update" && defined(slug.current)] | order(featured desc, publishedAt desc) [0...3] {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImageV2{
      ${imageFieldProjectionSlim}
    },
    "category": category->{
      _id,
      title,
      slug,
      color
    },
    featured,
    publishedAt
  }
`)

// Get updates by category slug
export const updatesByCategoryQuery = defineQuery(`
  *[_type == "update" && defined(slug.current) && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImageV2{
      ${imageFieldProjectionSlim}
    },
    "category": category->{
      _id,
      title,
      slug,
      color
    },
    featured,
    publishedAt
  }
`)

// Get update by slug (for detail page)
export const updateBySlugQuery = defineQuery(`
  *[_type == "update" && slug.current == $slug][0] {
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
    publishedAt,
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
    },
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
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImageV2{
      ${imageFieldProjectionSlim}
    },
    "category": category->{
      _id,
      title,
      slug,
      color
    },
    featured,
    publishedAt
  }
`)

// Get updates that reference a specific project
export const updatesByProjectQuery = defineQuery(`
  *[_type == "update" && defined(slug.current) && references($projectId)] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImageV2{
      ${imageFieldProjectionSlim}
    },
    "category": category->{
      _id,
      title,
      slug,
      color
    },
    featured,
    publishedAt
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
    "previous": *[_type == "update" && (publishedAt < $publishedAt || (publishedAt == $publishedAt && _id < $id))] | order(publishedAt desc, _id desc) [0] {
      _id,
      title,
      slug
    },
    "next": *[_type == "update" && (publishedAt > $publishedAt || (publishedAt == $publishedAt && _id > $id))] | order(publishedAt asc, _id asc) [0] {
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
