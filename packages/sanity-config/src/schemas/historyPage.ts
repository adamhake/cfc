import React from "react"
import { defineField, defineType } from "sanity"

export default defineType({
  name: "historyPage",
  title: "History Page",
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
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
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
            { title: "Quote", value: "blockquote" },
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
                title: "URL",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
        {
          type: "file",
          name: "fileAttachment",
          title: "File Attachment",
          options: {
            accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.csv,.txt",
          },
          fields: [
            {
              name: "title",
              type: "string",
              title: "File Title",
              description: "Optional custom label for the file",
            },
            {
              name: "description",
              type: "text",
              title: "Description",
              description: "Optional description of the file content",
            },
          ],
        },
      ],
      validation: (rule) => rule.required(),
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
