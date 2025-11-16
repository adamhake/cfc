import { defineQuery } from "groq"

export const getQuotesQuery = defineQuery(`
  *[_type == "quote"] | order(_createdAt desc){
    _id,
    quoteText,
    attribution,
    backgroundImage{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt,
      caption,
      hotspot
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
    backgroundImage{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt,
      caption,
      hotspot
    },
    category
  }
`)

export const getQuotesByCategoryQuery = defineQuery(`
  *[_type == "quote" && category == $category] | order(_createdAt desc){
    _id,
    quoteText,
    attribution,
    backgroundImage{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt,
      caption,
      hotspot
    },
    featured
  }
`)
