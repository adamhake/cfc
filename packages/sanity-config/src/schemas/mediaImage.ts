import { ImagesIcon } from "@sanity/icons/Images"
import { defineField, defineType } from "sanity"
import { requiredImage } from "./shared"

export const mediaImageSchema = defineType({
  name: "mediaImage",
  title: "Media Items",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "imageV2",
      title: "Image (Direct Upload)",
      type: "contentImage",
      description:
        "Upload an image, then fill in its title, category, alt text, and caption. Use Generate metadata to draft them automatically.",
      validation: (Rule) => Rule.custom(requiredImage("Image is required.")),
    }),
  ],
  preview: {
    select: {
      title: "imageV2.title",
      subtitle: "imageV2.category",
      media: "imageV2",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled image",
        subtitle: subtitle || "Uncategorized",
        media,
      }
    },
  },
  orderings: [
    {
      title: "Upload Date, Newest",
      name: "uploadDateDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Upload Date, Oldest",
      name: "uploadDateAsc",
      by: [{ field: "_createdAt", direction: "asc" }],
    },
    {
      title: "Title, A-Z",
      name: "titleAsc",
      by: [{ field: "imageV2.title", direction: "asc" }],
    },
  ],
})
