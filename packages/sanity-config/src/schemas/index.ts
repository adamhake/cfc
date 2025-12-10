import amenitiesPageSchema from "./amenitiesPage"
import donatePageSchema from "./donatePage"
import { eventSchema } from "./event"
import eventsPageSchema from "./eventsPage"
import gallerySchema from "./gallery"
import getInvolvedPageSchema from "./getInvolvedPage"
import historyPageSchema from "./historyPage"
import homePageSchema from "./homePage"
import { mediaImageSchema } from "./mediaImage"
import mediaPageSchema from "./mediaPage"
import partnerSchema from "./partner"
import { projectSchema } from "./project"
import projectsPageSchema from "./projectsPage"
import quoteSchema from "./quote"
import siteSettingsSchema from "./siteSettings"
import { updateSchema } from "./update"
import { updateCategorySchema } from "./updateCategory"
import updatesPageSchema from "./updatesPage"

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
  getInvolvedPageSchema,
  historyPageSchema,
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
  amenitiesPageSchema,
  donatePageSchema,
  eventSchema,
  eventsPageSchema,
  gallerySchema,
  getInvolvedPageSchema,
  historyPageSchema,
  homePageSchema,
  mediaImageSchema,
  mediaPageSchema,
  partnerSchema,
  projectSchema,
  projectsPageSchema,
  quoteSchema,
  siteSettingsSchema,
  updateCategorySchema,
  updateSchema,
  updatesPageSchema,
}
