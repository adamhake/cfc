import { createGenerateMetadataAction, schemas } from "@chimborazo/sanity-config"
import { CogIcon, DocumentTextIcon, HomeIcon } from "@sanity/icons"
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { presentationTool } from "sanity/presentation"
import type { StructureResolver } from "sanity/structure"
import { structureTool } from "sanity/structure"
import { StudioLogo } from "./components/StudioLogo"
import { env } from "./src/env"
import "./studio.css"

// Get environment variables from validated env config
const projectId = env.SANITY_STUDIO_PROJECT_ID
const dataset = env.SANITY_STUDIO_DATASET
const apiUrl = env.SANITY_STUDIO_API_URL

if (!apiUrl) {
  console.error("SANITY_STUDIO_API_URL is not defined")
}

// Create the generate metadata action with the configured API URL
const generateMetadataAction = createGenerateMetadataAction({
  apiUrl: apiUrl ?? "",
})

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
                .icon(CogIcon)
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
                .icon(HomeIcon)
                .child(S.document().schemaType("homePage").documentId("homePage")),
              S.listItem()
                .title("Amenities Page")
                .icon(DocumentTextIcon)
                .child(S.document().schemaType("amenitiesPage").documentId("amenitiesPage")),
              S.listItem()
                .title("Events Page")
                .icon(DocumentTextIcon)
                .child(S.document().schemaType("eventsPage").documentId("eventsPage")),
              S.listItem()
                .title("History Page")
                .icon(DocumentTextIcon)
                .child(S.document().schemaType("historyPage").documentId("historyPage")),
              S.listItem()
                .title("Projects Page")
                .icon(DocumentTextIcon)
                .child(S.document().schemaType("projectsPage").documentId("projectsPage")),
              S.listItem()
                .title("Media Page")
                .icon(DocumentTextIcon)
                .child(S.document().schemaType("mediaPage").documentId("mediaPage")),
              S.listItem()
                .title("Donate Page")
                .icon(DocumentTextIcon)
                .child(S.document().schemaType("donatePage").documentId("donatePage")),
              S.listItem()
                .title("Get Involved Page")
                .icon(DocumentTextIcon)
                .child(S.document().schemaType("getInvolvedPage").documentId("getInvolvedPage")),
            ])
        ),
      S.divider(),
      // Content types (excluding singletons)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "siteSettings",
            "homePage",
            "amenitiesPage",
            "eventsPage",
            "historyPage",
            "projectsPage",
            "getInvolvedPage",
            "mediaPage",
            "donatePage",
          ].includes(listItem.getId() ?? "")
      ),
    ])

export default defineConfig({
  name: "chimborazo-park-conservancy",
  title: "Chimborazo Park Conservancy",

  projectId,
  dataset,

  studio: {
    components: {
      logo: StudioLogo,
    },
  },

  plugins: [
    structureTool({ structure }),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: env.SANITY_STUDIO_PREVIEW_URL,
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
      const baseUrl = env.SANITY_STUDIO_PREVIEW_URL

      if (document._type === "event") {
        return `${baseUrl}/events/${(document.slug as { current?: string })?.current}`
      }

      return prev
    },
    // Add custom document actions
    actions: (prev, context) => {
      // Add the AI metadata generation action for mediaImage documents
      if (context.schemaType === "mediaImage") {
        return [...prev, generateMetadataAction]
      }
      return prev
    },
  },
})
