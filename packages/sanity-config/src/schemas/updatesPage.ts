import { DocumentTextIcon } from "@sanity/icons/DocumentText"
import { defineType } from "sanity"
import { createIntroductionField, createPageHeroField } from "./shared"

export default defineType({
  name: "updatesPage",
  title: "Updates Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [createPageHeroField(), createIntroductionField()],
  preview: {
    prepare() {
      return {
        title: "Updates Page",
        subtitle: "Updates page configuration",
      }
    },
  },
})
