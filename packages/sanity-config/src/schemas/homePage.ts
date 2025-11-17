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
    defineField({
      name: "parkGallery",
      title: "Park Section Gallery",
      type: "reference",
      to: [{ type: "gallery" }],
      description: "Select the rotating image gallery to display in 'The Park' section",
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
