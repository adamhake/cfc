import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getHomePageQuery = defineQuery(`
  *[_type == "homePage"][0]{
    hero{
      heading,
      subheading,
      "heroImage": heroImageV2{
        ${imageFieldProjection}
      },
      ctaButton
    },
    introSection{
      heading,
      body
    },
    visionSection{
      title,
      description,
      pillars[]{
        _key,
        title,
        pillar,
        description
      }
    },
    projectsSectionHeader{
      title,
      description
    },
    parkSection{
      title,
      intro,
      body,
      today,
      callout
    },
    eventsSectionHeader{
      title,
      description
    },
    getInvolvedSection{
      title,
      description
    },
    partnersSectionHeader{
      title,
      description
    },
    "partners": featuredPartners[]->{
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
    } | order(order asc),
    "quote": featuredQuote->{
      _id,
      quoteText,
      attribution,
      "backgroundImage": backgroundImageV2{
        ${imageFieldProjection}
      }
    },
    "gallery": homepageGallery->{
      _id,
      title,
      images[]{
        "image": imageV2{
          ${imageFieldProjection}
        },
        showOnMobile
      }
    },
    "parkGallery": parkGallery->{
      _id,
      title,
      images[]{
        "image": imageV2{
          ${imageFieldProjection}
        },
        showOnMobile
      }
    }
  }
`)
