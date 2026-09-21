import { ImagesIcon } from "@sanity/icons/Images"
import { defineType } from "sanity"
import { createPageHeroField } from "./shared"

export default defineType({
  name: "mediaPage",
  title: "Media Page",
  type: "document",
  icon: ImagesIcon,
  fields: [createPageHeroField()],
  preview: {
    prepare() {
      return {
        title: "Media Page",
        subtitle: "Photo gallery and media",
      }
    },
  },
})
