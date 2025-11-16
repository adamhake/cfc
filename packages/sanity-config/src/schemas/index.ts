import { eventSchema } from './event'
import { mediaImageSchema } from './mediaImage'
import siteSettingsSchema from './siteSettings'
import homePageSchema from './homePage'
import amenitiesPageSchema from './amenitiesPage'
import partnerSchema from './partner'
import quoteSchema from './quote'
import gallerySchema from './gallery'

export const schemas = [
  // Pages (singletons)
  siteSettingsSchema,
  homePageSchema,
  amenitiesPageSchema,
  // Content
  eventSchema,
  partnerSchema,
  quoteSchema,
  gallerySchema,
  // Media
  mediaImageSchema,
]

export {
  eventSchema,
  mediaImageSchema,
  siteSettingsSchema,
  homePageSchema,
  amenitiesPageSchema,
  partnerSchema,
  quoteSchema,
  gallerySchema,
}
