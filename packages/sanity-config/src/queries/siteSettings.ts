import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getSiteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    organizationName,
    alternativeName,
    description,
    parkAddress,
    parkHours,
    socialMedia,
    donationUrl,
    contactEmail,
    metaDefaults{
      siteTitle,
      ogImage{
        asset->{
          _id,
          url,
          metadata{
            dimensions,
            lqip
          }
        },
        alt
      }
    },
    getInvolvedGallery->{
      _id,
      title,
      images[]{
        "image": imageV2{
          ${imageFieldProjection}
        }
      }
    },
    featuredQuote->{
      _id,
      quoteText,
      attribution,
      "backgroundImage": backgroundImageV2{
        ${imageFieldProjection}
      }
    }
  }
`)
