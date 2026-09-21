import { RocketIcon } from "@sanity/icons/Rocket"
import { defineType } from "sanity"
import { createIntroductionField, createPageHeroField } from "./shared"

export default defineType({
  name: "projectsPage",
  title: "Projects Page",
  type: "document",
  icon: RocketIcon,
  fields: [createPageHeroField(), createIntroductionField()],
  preview: {
    prepare() {
      return {
        title: "Projects Page",
        subtitle: "Projects page configuration",
      }
    },
  },
})
