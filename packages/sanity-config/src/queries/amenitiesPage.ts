import { defineQuery } from "groq"

export const getAmenitiesPageQuery = defineQuery(`
  *[_type == "amenitiesPage"][0]{
    pageHero{
      title,
      description,
      image->{
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
          hotspot,
          crop
        }
      }
    },
    introduction,
    amenities[]{
      title,
      slug,
      icon,
      description,
      details,
      images[]->{
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
          hotspot,
          crop
        }
      },
      externalLink,
      linkText,
      section
    }
  }
`)

export const getAmenitiesBySectionQuery = defineQuery(`
  *[_type == "amenitiesPage"][0]{
    "upperParkAmenities": amenities[section == "upper-park" || section == "both"],
    "lowerParkAmenities": amenities[section == "lower-park" || section == "both"]
  }
`)
