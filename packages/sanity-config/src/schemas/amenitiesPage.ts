import { defineField, defineType } from "sanity"
import type { SlugSourceContext } from "sanity"
import { createIntroductionField } from "./shared"

export default defineType({
  name: "amenitiesPage",
  title: "Amenities Page",
  type: "document",
  fields: [
    defineField({
      name: "pageHero",
      title: "Page Hero",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          validation: (rule) => rule.max(500),
        }),
        defineField({
          name: "imageV2",
          title: "Hero Image (Direct Upload)",
          type: "contentImage",
          description: "Upload/select an image directly. Preferred for new content.",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField(createIntroductionField()),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "slug",
              title: "Slug",
              type: "slug",
              options: {
                source: (_doc: unknown, context: SlugSourceContext) => {
                  const parent = context.parent as { title?: string } | undefined
                  return parent?.title || ""
                },
                maxLength: 96,
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Building / Round House", value: "building" },
                  { title: "Gazebo / Picnic Area", value: "gazebo" },
                  { title: "Monument / Statue", value: "monument" },
                  { title: "Restroom", value: "restroom" },
                  { title: "Dog Park", value: "dog" },
                  { title: "Trail / Path", value: "trail" },
                  { title: "Trees / Woodland", value: "trees" },
                  { title: "Bench / Seating", value: "bench" },
                  { title: "Parking", value: "parking" },
                  { title: "Playground", value: "playground" },
                  { title: "Fountain / Water Feature", value: "fountain" },
                  { title: "Garden / Flowers", value: "garden" },
                ],
                layout: "dropdown",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              validation: (rule) => rule.required().max(500),
            }),
            defineField({
              name: "details",
              title: "Details",
              type: "array",
              of: [{ type: "string" }],
              description: "Bullet points highlighting key features",
            }),
            defineField({
              name: "imagesV2",
              title: "Images (Direct Upload)",
              type: "array",
              of: [{ type: "contentImage" }],
              description: "Upload/select images directly. Preferred for new content.",
              validation: (rule) =>
                rule.custom((value) => {
                  const hasV2 = Array.isArray(value) && value.length > 0
                  return hasV2 ? true : "At least one image is required"
                }),
            }),
            defineField({
              name: "externalLink",
              title: "External Link",
              type: "url",
              description: "Optional link to external resource (e.g., reservation system)",
              validation: (rule) =>
                rule.uri({
                  scheme: ["http", "https"],
                }),
            }),
            defineField({
              name: "linkText",
              title: "Link Text",
              type: "string",
              description: "Display text for the external link (e.g., 'Reserve the Round House')",
              hidden: ({ parent }) => !parent?.externalLink,
            }),
            defineField({
              name: "section",
              title: "Park Section",
              type: "string",
              options: {
                list: [
                  { title: "Upper Park", value: "upper-park" },
                  { title: "Lower Park", value: "lower-park" },
                  { title: "Both", value: "both" },
                ],
                layout: "radio",
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              section: "section",
              media: "imagesV2.0",
            },
            prepare({ title, section, media }) {
              const sectionLabels: Record<string, string> = {
                "upper-park": "Upper",
                "lower-park": "Lower",
                both: "Both",
              }
              const sectionLabel = sectionLabels[section as string] || section

              return {
                title: title,
                subtitle: `${sectionLabel} Park`,
                media: media,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Amenities Page",
        subtitle: "Park amenities and features",
      }
    },
  },
})
