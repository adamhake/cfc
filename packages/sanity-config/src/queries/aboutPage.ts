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
  }
`)
