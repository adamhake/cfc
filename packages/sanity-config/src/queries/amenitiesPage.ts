import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getAmenitiesPageQuery = defineQuery(`
  *[_type == "amenitiesPage"][0]{
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
    introduction,
    amenities[]{
      title,
      slug,
      icon,
      description,
      details,
      "images": imagesV2[defined(asset)][]{
        ${imageFieldProjection}
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
