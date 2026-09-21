import { PinIcon } from "@sanity/icons/Pin"
import type { SlugSourceContext } from "sanity"
import { defineField, defineType } from "sanity"
import { createIntroductionField, createPageHeroField, requiredImageList } from "./shared"

export default defineType({
  name: "amenitiesPage",
  title: "Amenities Page",
  type: "document",
  icon: PinIcon,
  fields: [
    createPageHeroField(),
    createIntroductionField(),
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
              description: "Photos of this amenity. The first one is used as the card image.",
              validation: (rule) => rule.custom(requiredImageList()),
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
              validation: (rule) =>
                rule.custom((value, context) => {
                  const hasLink = Boolean(
                    (context.parent as { externalLink?: string } | undefined)?.externalLink,
                  )
                  if (!hasLink) return true
                  return value ? true : "Add link text so the button has a label"
                }),
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
                title: title || "Untitled amenity",
                subtitle: sectionLabel ? `${sectionLabel} Park` : "No section set",
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
