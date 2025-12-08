import { eventSchema } from "./event"
import { projectSchema } from "./project"
import { mediaImageSchema } from "./mediaImage"
import siteSettingsSchema from "./siteSettings"
import homePageSchema from "./homePage"
import amenitiesPageSchema from "./amenitiesPage"
import eventsPageSchema from "./eventsPage"
import projectsPageSchema from "./projectsPage"
import updatesPageSchema from "./updatesPage"
import mediaPageSchema from "./mediaPage"
import donatePageSchema from "./donatePage"
import partnerSchema from "./partner"
import quoteSchema from "./quote"
import gallerySchema from "./gallery"
import { updateSchema } from "./update"
import { updateCategorySchema } from "./updateCategory"

export const schemas = [
  // Pages (singletons)
  siteSettingsSchema,
  homePageSchema,
  amenitiesPageSchema,
  eventsPageSchema,
  projectsPageSchema,
  updatesPageSchema,
  mediaPageSchema,
  donatePageSchema,
  // Content
  eventSchema,
  projectSchema,
  updateSchema,
  updateCategorySchema,
  partnerSchema,
  quoteSchema,
  gallerySchema,
  // Media
  mediaImageSchema,
]

export {
  eventSchema,
  projectSchema,
  updateSchema,
  updateCategorySchema,
  mediaImageSchema,
  siteSettingsSchema,
  homePageSchema,
  amenitiesPageSchema,
  eventsPageSchema,
  projectsPageSchema,
  updatesPageSchema,
  mediaPageSchema,
  donatePageSchema,
  partnerSchema,
  quoteSchema,
  gallerySchema,
}
