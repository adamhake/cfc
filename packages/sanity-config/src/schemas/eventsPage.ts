import { defineArrayMember, defineField, defineType } from "sanity"
import React from "react"

export default defineType({
  name: "eventsPage",
  title: "Events Page",
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
  ],
  preview: {
    prepare() {
      return {
        title: "Events Page",
        subtitle: "Events page configuration",
      }
    },
  },
})
