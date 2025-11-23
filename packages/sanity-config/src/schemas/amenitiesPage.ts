import { defineArrayMember, defineField, defineType } from "sanity"
import type { SlugSourceContext } from "sanity"
import React from "react"

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
          name: "image",
          title: "Hero Image",
          type: "reference",
          to: [{ type: "mediaImage" }],
          description: "Select an image from the media library to use as the hero image",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "array",
      description: "Rich text content for the page introduction",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            {
              title: "Leading",
              value: "leading",
              component: ({ children }: { children?: React.ReactNode }) =>
                React.createElement(
                  "p",
                  { style: { fontSize: "1rem", lineHeight: "1.6" } },
                  children
                ),
            },
            {
              title: "Leading Large",
              value: "leading-lg",
              component: ({ children }: { children?: React.ReactNode }) =>
                React.createElement(
                  "p",
                  { style: { fontSize: "1.25rem", lineHeight: "1.6" } },
                  children
                ),
            },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
        }),
      ],
    }),
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
              name: "image",
              title: "Image",
              type: "reference",
              to: [{ type: "mediaImage" }],
              description: "Select an image from the media library",
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
              media: "image.image",
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
                media,
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
