import { defineQuery } from "groq"
import { imageFieldProjection, imageFieldProjectionSlim } from "./imageProjections"
import { richTextProjection } from "./richTextProjection"

// Get all published projects
export const allProjectsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(startDate desc) {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImageV2{
      ${imageFieldProjectionSlim}
    },
    status,
    startDate,
    startDateOverride,
    completionDate,
    completionDateOverride,
    goal,
    location,
    budget,
    category,
    featured,
    publishedAt
  }
`)

// Get active projects
export const activeProjectsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current) && status == "active"] | order(startDate desc) {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImageV2{
      ${imageFieldProjectionSlim}
    },
    status,
    startDate,
    startDateOverride,
    completionDate,
    completionDateOverride,
    goal,
    location,
    budget,
    category,
    featured,
    publishedAt
  }
`)

// Get featured project (single)
export const featuredProjectQuery = defineQuery(`
  *[_type == "project" && defined(slug.current) && featured == true] | order(startDate desc) [0] {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImageV2{
      ${imageFieldProjectionSlim}
    },
    status,
    startDate,
    startDateOverride,
    completionDate,
    completionDateOverride,
    goal,
    location,
    budget,
    category,
    featured,
    publishedAt
  }
`)

// Get all featured projects
export const featuredProjectsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current) && featured == true] | order(startDate desc) {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImageV2{
      ${imageFieldProjectionSlim}
    },
    status,
    startDate,
    startDateOverride,
    completionDate,
    completionDateOverride,
    goal,
    location,
    budget,
    category,
    featured,
    publishedAt
  }
`)

// Get project by slug with full details and relationships
export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImageV2{
      ${imageFieldProjection}
    },
    status,
    startDate,
    startDateOverride,
    completionDate,
    completionDateOverride,
    goal,
    location,
    budget,
    category,
    featured,
    publishedAt,
    body[]{
      ${richTextProjection}
    },
    gallery[]{
      ...,
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip,
          blurhash,
          palette
        }
      },
      alt,
      caption,
      hotspot,
      crop
    },
    "relatedEvents": relatedEvents[]->{
      _id,
      _type,
      title,
      slug,
      description,
      "heroImage": heroImage{
        ${imageFieldProjection}
      },
      date,
      time,
      location
    },
    "partners": partners[]->{
      _id,
      _type,
      name,
      logo{
        ${imageFieldProjection}
      }
    }
  }
`)

export const projectCardBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImageV2{
      ${imageFieldProjection}
    }
  }
`)

// Get project slugs for static paths
export const projectSlugsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current
  }
`)
