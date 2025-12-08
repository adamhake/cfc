// Base event fields projection
// Note: These are plain GROQ query strings
export const eventFields = `
  _id,
  _type,
  title,
  slug,
  description,
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
    caption,
    hotspot,
    crop
  },
  date,
  time,
  location,
  featured,
  publishedAt
`

// Get all published events
export const allEventsQuery = `
  *[_type == "event" && !(_id in path("drafts.**"))] | order(date desc) {
    ${eventFields}
  }
`

// Get upcoming events
export const upcomingEventsQuery = `
  *[_type == "event" && !(_id in path("drafts.**")) && date >= now()] | order(date asc) {
    ${eventFields}
  }
`

// Get past events
export const pastEventsQuery = `
  *[_type == "event" && !(_id in path("drafts.**")) && date < now()] | order(date desc) {
    ${eventFields}
  }
`

// Get featured events
export const featuredEventsQuery = `
  *[_type == "event" && !(_id in path("drafts.**")) && featured == true] | order(date desc) [0...3] {
    ${eventFields}
  }
`

// Get event by slug
export const eventBySlugQuery = `
  *[_type == "event" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    ${eventFields},
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
    },
    recap[]{
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
    },
    "recapGallery": recapGallery->{
      _id,
      title,
      images[]{
        image->{
          _id,
          title,
          image{
            asset->{
              _id,
              url,
              metadata{
                dimensions,
                lqip
              }
            },
            alt,
            caption,
            hotspot
          }
        },
        showOnMobile
      }
    }
  }
`

// Get event slugs for static paths
export const eventSlugsQuery = `
  *[_type == "event" && !(_id in path("drafts.**"))] {
    "slug": slug.current
  }
`
