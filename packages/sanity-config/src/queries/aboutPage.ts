import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getAboutPageQuery = defineQuery(`
  *[_type == "aboutPage" && !(_id in path("drafts.**"))][0]{
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
  }
`)
