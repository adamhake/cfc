import { eventSchema } from "./event"
import { projectSchema } from "./project"
import { mediaImageSchema } from "./mediaImage"
import siteSettingsSchema from "./siteSettings"
import homePageSchema from "./homePage"
import amenitiesPageSchema from "./amenitiesPage"
import eventsPageSchema from "./eventsPage"
import projectsPageSchema from "./projectsPage"
import partnerSchema from "./partner"
import quoteSchema from "./quote"
import gallerySchema from "./gallery"

export const schemas = [
  // Pages (singletons)
  siteSettingsSchema,
  homePageSchema,
  amenitiesPageSchema,
  eventsPageSchema,
  projectsPageSchema,
  // Content
  eventSchema,
  projectSchema,
  partnerSchema,
  quoteSchema,
  gallerySchema,
  // Media
  mediaImageSchema,
]

export {
  eventSchema,
  projectSchema,
  mediaImageSchema,
  siteSettingsSchema,
  homePageSchema,
  amenitiesPageSchema,
  eventsPageSchema,
  projectsPageSchema,
  partnerSchema,
  quoteSchema,
  gallerySchema,
}
