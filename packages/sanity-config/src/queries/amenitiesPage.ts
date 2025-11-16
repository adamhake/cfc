import { defineQuery } from 'groq'

export const getAmenitiesPageQuery = defineQuery(`
  *[_type == "amenitiesPage"][0]{
    pageHero{
      title,
      description,
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
        hotspot
      }
    },
    introduction,
    amenities[] | order(order asc){
      title,
      slug,
      icon,
      description,
      details,
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
      },
      externalLink,
      section,
      order
    }
  }
`)

export const getAmenitiesBySectionQuery = defineQuery(`
  *[_type == "amenitiesPage"][0]{
    "upperParkAmenities": amenities[section == "upper-park" || section == "both"] | order(order asc),
    "lowerParkAmenities": amenities[section == "lower-park" || section == "both"] | order(order asc)
  }
`)
