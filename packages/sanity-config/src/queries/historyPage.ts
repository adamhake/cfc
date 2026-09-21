import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"
import { richTextProjection } from "./richTextProjection"

export const getHistoryPageQuery = defineQuery(`
  *[_type == "historyPage"][0]{
    _id,
    _type,
    content[]{
      ${richTextProjection}
    },
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
  }
`)
