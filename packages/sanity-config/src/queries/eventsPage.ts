import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getEventsPageQuery = defineQuery(`
  *[_type == "eventsPage"][0]{
    _id,
    _type,
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
    introduction
  }
`)
