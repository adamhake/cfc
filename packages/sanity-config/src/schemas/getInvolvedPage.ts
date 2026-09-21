import { UsersIcon } from "@sanity/icons/Users"
import { defineType } from "sanity"
import { createPageHeroField } from "./shared"

export default defineType({
  name: "getInvolvedPage",
  title: "Get Involved Page",
  type: "document",
  icon: UsersIcon,
  fields: [createPageHeroField()],
  preview: {
    prepare() {
      return {
        title: "Get Involved Page",
        subtitle: "Volunteer and engagement opportunities",
      }
    },
  },
})
