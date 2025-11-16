import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { presentationTool } from "sanity/presentation"
import { schemas } from "@chimborazo/sanity-config"
import type { StructureResolver } from "sanity/structure"

// Get environment variables
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || ""
const dataset = process.env.SANITY_STUDIO_DATASET || "production"

// Define custom structure for organizing content
const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Settings group
      S.listItem()
        .title("Settings")
        .child(
          S.list()
            .title("Site Settings")
            .items([
              S.listItem()
                .title("Site Settings")
                .icon(() => "⚙️")
                .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            ])
        ),
      S.divider(),
      // Pages group
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Homepage")
                .icon(() => "🏠")
                .child(S.document().schemaType("homePage").documentId("homePage")),
              S.listItem()
                .title("Amenities Page")
                .icon(() => "🌳")
                .child(S.document().schemaType("amenitiesPage").documentId("amenitiesPage")),
            ])
        ),
      S.divider(),
      // Content types (excluding singletons)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !["siteSettings", "homePage", "amenitiesPage"].includes(listItem.getId() ?? "")
      ),
    ])

export default defineConfig({
  name: "chimborazo-park-conservancy",
  title: "Chimborazo Park Conservancy",

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000",
        draftMode: {
          enable: "/api/draft",
        },
      },
    }),
  ],

  schema: {
    types: schemas,
  },

  document: {
    // Customize document behavior
    productionUrl: async (prev, context) => {
      const { document } = context
      const baseUrl = process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000"

      if (document._type === "event") {
        return `${baseUrl}/events/${document.slug?.current}`
      }

      return prev
    },
  },
})
