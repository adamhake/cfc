import { defineQuery } from "groq"
import { imageFieldProjection, imageFieldProjectionSlim } from "./imageProjections"
import { richTextProjection } from "./richTextProjection"

// Get all published events
export const allEventsQuery = defineQuery(`
  *[_type == "event" && defined(slug.current)] | order(date desc) {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImage{
      ${imageFieldProjectionSlim}
    },
    date,
    time,
    location,
    featured,
    publishedAt
  }
`)

// Get upcoming events
export const upcomingEventsQuery = defineQuery(`
  *[_type == "event" && defined(slug.current) && date >= now()] | order(date asc) {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImage{
      ${imageFieldProjectionSlim}
    },
    date,
    time,
    location,
    featured,
    publishedAt
  }
`)

// Get past events
export const pastEventsQuery = defineQuery(`
  *[_type == "event" && defined(slug.current) && date < now()] | order(date desc) {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImage{
      ${imageFieldProjectionSlim}
    },
    date,
    time,
    location,
    featured,
    publishedAt
  }
`)

// Get featured events
export const featuredEventsQuery = defineQuery(`
  *[_type == "event" && defined(slug.current) && featured == true] | order(date desc) [0...3] {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImage{
      ${imageFieldProjectionSlim}
    },
    date,
    time,
    location,
    featured,
    publishedAt
  }
`)

// Get recent events (3 most recent by date)
export const recentEventsQuery = defineQuery(`
  *[_type == "event" && defined(slug.current)] | order(date desc) [0...3] {
    _id,
    _type,
    title,
    slug,
    description,
    "heroImage": heroImage{
      ${imageFieldProjectionSlim}
    },
    date,
    time,
    location,
    featured,
    publishedAt
  }
`)

// Get event by slug
export const eventBySlugQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
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
    location,
    featured,
    publishedAt,
    body[]{
      ${richTextProjection}
    },
    recap[]{
      ${richTextProjection}
    },
    "recapGallery": recapGallery->{
      _id,
      title,
      images[]{
        "image": imageV2{
          ${imageFieldProjection}
        },
        showOnMobile
      }
    }
  }
`)

// Get event slugs for static paths
export const eventSlugsQuery = defineQuery(`
  *[_type == "event" && defined(slug.current)] {
    "slug": slug.current
  }
`)
