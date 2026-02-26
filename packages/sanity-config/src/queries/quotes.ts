import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getQuotesQuery = defineQuery(`
  *[_type == "quote"] | order(_createdAt desc){
    _id,
    quoteText,
    attribution,
    "backgroundImage": backgroundImageV2{
      ${imageFieldProjection}
    },
    featured,
    category
  }
`)

export const getFeaturedQuoteQuery = defineQuery(`
  *[_type == "quote" && featured == true][0]{
    _id,
    quoteText,
    attribution,
    "backgroundImage": backgroundImageV2{
      ${imageFieldProjection}
    },
    category
  }
`)

export const getQuotesByCategoryQuery = defineQuery(`
  *[_type == "quote" && category == $category] | order(_createdAt desc){
    _id,
    quoteText,
    attribution,
    "backgroundImage": backgroundImageV2{
      ${imageFieldProjection}
    },
    featured
  }
`)
