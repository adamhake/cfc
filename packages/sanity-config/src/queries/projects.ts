// Base project fields projection
// Note: These are plain GROQ query strings
export const projectFields = `
  _id,
  _type,
  title,
  slug,
  description,
  "heroImage": heroImage->{
    _id,
    title,
    image{
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
    }
  },
  status,
  startDate,
  completionDate,
  goal,
  location,
  budget,
  category,
  featured,
  publishedAt
`

// Get all published projects
export const allProjectsQuery = `
  *[_type == "project" && !(_id in path("drafts.**"))] | order(startDate desc) {
    ${projectFields}
  }
`

// Get active projects
export const activeProjectsQuery = `
  *[_type == "project" && !(_id in path("drafts.**")) && status == "active"] | order(startDate desc) {
    ${projectFields}
  }
`

// Get featured project (single)
export const featuredProjectQuery = `
  *[_type == "project" && !(_id in path("drafts.**")) && featured == true] | order(startDate desc) [0] {
    ${projectFields}
  }
`

// Get all featured projects
export const featuredProjectsQuery = `
  *[_type == "project" && !(_id in path("drafts.**")) && featured == true] | order(startDate desc) {
    ${projectFields}
  }
`

// Get project by slug with full details and relationships
export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    ${projectFields},
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
    gallery[]{
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
    },
    "relatedEvents": relatedEvents[]->{
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
      location
    },
    "partners": partners[]->{
      _id,
      _type,
      name,
      logo{
        asset->{
          _id,
          url
        },
        alt
      }
    }
  }
`

// Get project slugs for static paths
export const projectSlugsQuery = `
  *[_type == "project" && !(_id in path("drafts.**"))] {
    "slug": slug.current
  }
`
