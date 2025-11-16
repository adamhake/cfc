import { defineArrayMember, defineField, defineType } from "sanity"

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
                source: "title",
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
                  { title: "Playground", value: "playground" },
                  { title: "Gazebo", value: "gazebo" },
                  { title: "Monument", value: "monument" },
                  { title: "Restroom", value: "restroom" },
                  { title: "Dog", value: "dog" },
                  { title: "Trail", value: "trail" },
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
            defineField({
              name: "order",
              title: "Display Order",
              type: "number",
              description: "Order within its section",
              validation: (rule) => rule.required().min(0),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "section",
              order: "order",
              media: "image.image",
            },
            prepare({ title, subtitle, order, media }) {
              return {
                title: `${order + 1}. ${title}`,
                subtitle: subtitle,
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
