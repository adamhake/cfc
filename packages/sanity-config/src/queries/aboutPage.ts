import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"
import { richTextProjection } from "./richTextProjection"

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
      ${richTextProjection}
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
        ${imageFieldProjection}
      }
    }
  }
`)
