import { defineQuery } from "groq"

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
    }
  }
`)
