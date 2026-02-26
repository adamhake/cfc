import { createGenerateMetadataAction, schemas } from "@chimborazo/sanity-config"
import { CogIcon, DocumentTextIcon, HomeIcon } from "@sanity/icons"
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { media } from "sanity-plugin-media"
import { defineDocuments, defineLocations, presentationTool } from "sanity/presentation"
import type { StructureResolver } from "sanity/structure"
import { structureTool } from "sanity/structure"
import { StudioLogo } from "./components/StudioLogo"
import { env } from "./src/env"
import "./studio.css"

// Get environment variables from validated env config
const projectId = env.SANITY_STUDIO_PROJECT_ID
const dataset = env.SANITY_STUDIO_DATASET
const apiVersion = env.SANITY_STUDIO_API_VERSION
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
                .title("About Page")
                .icon(DocumentTextIcon)
                .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
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
            "aboutPage",
            "donatePage",
            "media.tag",
          ].includes(listItem.getId() ?? "")
      ),
    ])

export default defineConfig({
  name: "chimborazo-park-conservancy",
  title: "Chimborazo Park Conservancy",

  projectId,
  dataset,
  apiVersion,

  studio: {
    components: {
      logo: StudioLogo,
    },
  },

  plugins: [
    structureTool({ structure }),
    media(),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: env.SANITY_STUDIO_PREVIEW_URL,
        draftMode: {
          enable: "/api/draft",
          disable: "/api/draft/disable",
        },
      },
      allowOrigins: [
        "http://localhost:3000",
        "https://chimborazoparkconservancy.org",
        "https://*.chimborazoparkconservancy.org",
        "https://*.netlify.app",
      ],
      resolve: {
        mainDocuments: defineDocuments([
          // Singleton pages - match URL to document type
          { route: "/", type: "homePage" },
          { route: "/events", type: "eventsPage" },
          { route: "/projects", type: "projectsPage" },
          { route: "/amenities", type: "amenitiesPage" },
          { route: "/projects", type: "projectsPage" },
          { route: "/about", type: "aboutPage" },
          { route: "/media", type: "mediaPage" },
          { route: "/donate", type: "donatePage" },
          { route: "/get-involved", type: "getInvolvedPage" },
          { route: "/history", type: "historyPage" },
          // Dynamic routes - use filter to match by slug
          {
            route: "/events/:slug",
            filter: `_type == "event" && slug.current == $slug`,
          },
          {
            route: "/projects/:slug",
            filter: `_type == "project" && slug.current == $slug`,
          },
        ]),
        locations: {
          // Singleton pages
          homePage: defineLocations({
            message: "This document controls the homepage content",
            locations: [{ title: "Homepage", href: "/" }],
          }),
          eventsPage: defineLocations({
            message: "This document controls the Events listing page",
            locations: [{ title: "Events", href: "/events" }],
          }),
          projectsPage: defineLocations({
            message: "This document controls the Projects listing page",
            locations: [{ title: "Projects", href: "/projects" }],
          }),
          amenitiesPage: defineLocations({
            message: "This document controls the Amenities page",
            locations: [{ title: "Amenities", href: "/amenities" }],
          }),
          aboutPage: defineLocations({
            message: "This document controls the About page",
            locations: [{ title: "About", href: "/about" }],
          }),
          mediaPage: defineLocations({
            message: "This document controls the Media page",
            locations: [{ title: "Media", href: "/media" }],
          }),
          donatePage: defineLocations({
            message: "This document controls the Donate page",
            locations: [{ title: "Donate", href: "/donate" }],
          }),
          getInvolvedPage: defineLocations({
            message: "This document controls the Get Involved page",
            locations: [{ title: "Get Involved", href: "/get-involved" }],
          }),
          historyPage: defineLocations({
            message: "This document controls the History page",
            locations: [{ title: "History", href: "/history" }],
          }),
          // Dynamic content types
          event: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [
                    { title: doc.title || "Untitled Event", href: `/events/${doc.slug}` },
                    { title: "Events Listing", href: "/events" },
                  ]
                : [],
            }),
          }),
          project: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [
                    { title: doc.title || "Untitled Project", href: `/projects/${doc.slug}` },
                    { title: "Projects Listing", href: "/projects" },
                  ]
                : [],
            }),
          }),
          // Site settings appears across all pages
          siteSettings: defineLocations({
            message: "This document is used across the entire site",
            tone: "caution",
          }),
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
