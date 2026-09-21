import { CalendarIcon } from "@sanity/icons/Calendar"
import { defineType } from "sanity"
import { createIntroductionField, createPageHeroField } from "./shared"

export default defineType({
  name: "eventsPage",
  title: "Events Page",
  type: "document",
  icon: CalendarIcon,
  fields: [createPageHeroField(), createIntroductionField()],
  preview: {
    prepare() {
      return {
        title: "Events Page",
        subtitle: "Events page configuration",
      }
    },
  },
})
