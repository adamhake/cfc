import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getSurveyResultsPageQuery = defineQuery(`
  *[_type == "surveyResultsPage"][0]{
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
