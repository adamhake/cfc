import { defineField, defineType } from "sanity"

type ReferenceLike = {
  _ref?: string
}

type ImageValueLike = {
  asset?: ReferenceLike
}

const hasAssetRef = (value: unknown): boolean =>
  typeof (value as ImageValueLike | undefined)?.asset?._ref === "string"

export const mediaImageSchema = defineType({
  name: "mediaImage",
  title: "Media Image",
  type: "document",
  fields: [
    defineField({
      name: "imageV2",
      title: "Image (Direct Upload)",
      type: "contentImage",
      description: "Upload/select an image with title, category, tags, alt text, and caption.",
      validation: (Rule) =>
        Rule.custom((value) => {
          return hasAssetRef(value) ? true : "Image is required."
        }),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show in featured gallery sections",
    }),
    defineField({
      name: "hideFromMediaPage",
      title: "Hide from Media Page",
      type: "boolean",
      initialValue: false,
      description: "Hide this image from the public media gallery (use for reference images only)",
    }),
    defineField({
      name: "uploadedAt",
      title: "Uploaded at",
      type: "datetime",
      description: "When this image was uploaded",
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
      by: [{ field: "uploadedAt", direction: "desc" }],
    },
    {
      title: "Upload Date, Oldest",
      name: "uploadDateAsc",
      by: [{ field: "uploadedAt", direction: "asc" }],
    },
    {
      title: "Title, A-Z",
      name: "titleAsc",
      by: [{ field: "imageV2.title", direction: "asc" }],
    },
  ],
})
