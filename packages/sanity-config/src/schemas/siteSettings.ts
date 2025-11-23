import { defineField, defineType } from "sanity"

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "organizationName",
      title: "Organization Name",
      type: "string",
      description: 'Primary name of the organization (e.g., "Chimborazo Park Conservancy")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alternativeName",
      title: "Alternative Name",
      type: "string",
      description: 'Alternative name (e.g., "Friends of Chimborazo Park")',
    }),
    defineField({
      name: "description",
      title: "Organization Description",
      type: "text",
      description: "Brief description used in footer and meta tags",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "parkAddress",
      title: "Park Address",
      type: "object",
      fields: [
        defineField({
          name: "street",
          title: "Street Address",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "state",
          title: "State",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "zipCode",
          title: "ZIP Code",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "parkHours",
      title: "Park Hours",
      type: "string",
      description: 'e.g., "Dawn to Dusk"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "socialMedia",
      title: "Social Media",
      type: "object",
      fields: [
        defineField({
          name: "facebook",
          title: "Facebook URL",
          type: "url",
          validation: (rule) =>
            rule.uri({
              scheme: ["http", "https"],
            }),
        }),
        defineField({
          name: "instagram",
          title: "Instagram URL",
          type: "url",
          validation: (rule) =>
            rule.uri({
              scheme: ["http", "https"],
            }),
        }),
      ],
    }),
    defineField({
      name: "donationUrl",
      title: "Donation Form URL",
      type: "url",
      description: "URL to the Zeffy donation form",
      validation: (rule) =>
        rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "metaDefaults",
      title: "Meta Tag Defaults",
      type: "object",
      fields: [
        defineField({
          name: "siteTitle",
          title: "Default Site Title",
          type: "string",
          description: "Used as the default title in meta tags",
        }),
        defineField({
          name: "ogImage",
          title: "Default OG Image",
          type: "image",
          description: "Default Open Graph image for social sharing",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "getInvolvedGallery",
      title: "Get Involved Gallery",
      type: "reference",
      to: [{ type: "gallery" }],
      description: "Gallery to display in the 'Get Involved' section",
    }),
    defineField({
      name: "featuredQuote",
      title: "Featured Quote",
      type: "reference",
      to: [{ type: "quote" }],
      description: "Quote to display on the homepage",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Global site configuration",
      }
    },
  },
})
