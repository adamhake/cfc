import { ClockIcon } from "@sanity/icons/Clock"
import { defineType } from "sanity"
import { createBodyField, createPageHeroField } from "./shared"

export default defineType({
  name: "historyPage",
  title: "History Page",
  type: "document",
  icon: ClockIcon,
  fields: [
    createPageHeroField(),
    createBodyField({
      name: "content",
      title: "Content",
      description: "The history of the park, told in the editor's own sections and images.",
      required: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "History Page",
        subtitle: "Learn about the rich history of Chimborazo Park",
      }
    },
  },
})
