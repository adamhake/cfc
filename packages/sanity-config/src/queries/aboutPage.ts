import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getAboutPageQuery = defineQuery(`
  *[_type == "aboutPage"][0]{
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
    mission,
    vision,
    highlights[]{
      _key,
      value,
      label
    },
    "storyImage": storyImage{
      ${imageFieldProjection}
    },
    content[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          _id,
          url,
          metadata{
            dimensions,
            lqip
          }
        }
      }
    },
    "calloutImage": calloutImage{
      ${imageFieldProjection}
    },
    boardMembers[]{
      _key,
      name,
      role,
      bio,
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
  }
`)
