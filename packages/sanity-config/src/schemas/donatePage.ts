import { HeartIcon } from "@sanity/icons/Heart"
import { defineType } from "sanity"
import { createPageHeroField } from "./shared"

export default defineType({
  name: "donatePage",
  title: "Donate Page",
  type: "document",
  icon: HeartIcon,
  fields: [createPageHeroField()],
  preview: {
    prepare() {
      return {
        title: "Donate Page",
        subtitle: "Donation and support information",
      }
    },
  },
})
