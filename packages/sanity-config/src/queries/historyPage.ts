import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getHistoryPageQuery = defineQuery(`
  *[_type == "historyPage"][0]{
    content,
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
  }
`)
