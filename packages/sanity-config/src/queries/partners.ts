import { defineQuery } from 'groq'

export const getPartnersQuery = defineQuery(`
  *[_type == "partner"] | order(order asc){
    _id,
    name,
    slug,
    logo{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt
    },
    description,
    websiteUrl,
    featured,
    order
  }
`)

export const getFeaturedPartnersQuery = defineQuery(`
  *[_type == "partner" && featured == true] | order(order asc){
    _id,
    name,
    slug,
    logo{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt
    },
    description,
    websiteUrl,
    order
  }
`)

export const getPartnerBySlugQuery = defineQuery(`
  *[_type == "partner" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    logo{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt
    },
    description,
    websiteUrl,
    featured,
    order
  }
`)
