import { defineField, defineType } from "sanity"

export default defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: (rule) => rule.required().max(100),
        }),
        defineField({
          name: "subheading",
          title: "Subheading",
          type: "text",
          validation: (rule) => rule.required().max(300),
        }),
        defineField({
          name: "heroImage",
          title: "Hero Image",
          type: "reference",
          to: [{ type: "mediaImage" }],
          description: "Select an image from the media library to use as the hero image",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "ctaButton",
          title: "Call-to-Action Button",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Button Text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "link",
              title: "Button Link",
              type: "string",
              description: 'Internal path (e.g., "/donate") or anchor (e.g., "#get-involved")',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "visionPillars",
      title: "Vision Pillars",
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
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Leafy Green", value: "leafy-green" },
                  { title: "Trees", value: "trees" },
                  { title: "Heart Handshake", value: "heart-handshake" },
                  { title: "Book Open Text", value: "book-open-text" },
                ],
                layout: "dropdown",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              validation: (rule) => rule.required().max(300),
            }),
            defineField({
              name: "order",
              title: "Display Order",
              type: "number",
              validation: (rule) => rule.required().min(0),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "icon",
              order: "order",
            },
            prepare({ title, subtitle, order }) {
              return {
                title: `${order + 1}. ${title}`,
                subtitle: subtitle,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1).max(6),
    }),
    defineField({
      name: "featuredPartners",
      title: "Featured Partners",
      type: "array",
      of: [{ type: "reference", to: [{ type: "partner" }] }],
      description: "Select partner organizations to display on the homepage",
    }),
    defineField({
      name: "featuredQuote",
      title: "Featured Quote",
      type: "reference",
      to: [{ type: "quote" }],
      description: "Select a quote to display on the homepage",
    }),
    defineField({
      name: "homepageGallery",
      title: "Homepage Gallery",
      type: "reference",
      to: [{ type: "gallery" }],
      description: "Select the image gallery to display on the homepage",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Homepage",
        subtitle: "Site homepage content",
      }
    },
  },
})
