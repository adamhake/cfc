import { defineQuery } from "groq"

export const getPartnersQuery = defineQuery(`
  *[_type == "partner" && !(_id in path("drafts.**"))] | order(order asc){
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
  *[_type == "partner" && featured == true && !(_id in path("drafts.**"))] | order(order asc){
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
  *[_type == "partner" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
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
