import { createGenerateMetadataAction, schemas } from "@chimborazo/sanity-config"
import { CogIcon, DocumentTextIcon, HomeIcon } from "@sanity/icons"
import { createPreviewSecret } from "@sanity/preview-url-secret/create-secret"
import {
  urlSearchParamPreviewPathname,
  urlSearchParamPreviewSecret,
} from "@sanity/preview-url-secret/constants"
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
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

// Singleton document types (managed as single instances, not lists)
const singletonTypes = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "amenitiesPage",
  "eventsPage",
  "projectsPage",
  "updatesPage",
  "mediaPage",
  "donatePage",
  "getInvolvedPage",
  "historyPage",
]

function getPreviewPathForDocument(document: { _type?: string; slug?: { current?: string } }) {
  const slug = document.slug?.current

  switch (document._type) {
    case "homePage":
      return "/"
    case "aboutPage":
      return "/about"
    case "historyPage":
      return "/history"
    case "amenitiesPage":
      return "/amenities"
    case "getInvolvedPage":
      return "/get-involved"
    case "donatePage":
      return "/donate"
    case "mediaPage":
      return "/media"
    case "eventsPage":
      return "/events"
    case "projectsPage":
      return "/projects"
    case "updatesPage":
      return "/updates"
    case "event":
      return slug ? `/events/${slug}` : null
    case "project":
      return slug ? `/projects/${slug}` : null
    case "update":
      return slug ? `/updates/${slug}` : null
    default:
      return null
  }
}

function buildDraftPreviewUrl(options: { baseUrl: string; path: string; secret: string }) {
  const previewUrl = new URL("/api/draft", options.baseUrl)
  previewUrl.searchParams.set(urlSearchParamPreviewSecret, options.secret)
  previewUrl.searchParams.set(urlSearchParamPreviewPathname, options.path)
  return previewUrl.toString()
}

// Define custom structure for organizing content
const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // --- Homepage (most frequently edited) ---
      S.listItem()
        .title("Homepage")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage")),

      S.divider(),

      // --- Content that drives pages ---
      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("update").title("Updates"),

      S.divider(),

      // --- Informational pages ---
      S.listItem()
        .title("About Page")
        .icon(DocumentTextIcon)
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("History Page")
        .icon(DocumentTextIcon)
        .child(S.document().schemaType("historyPage").documentId("historyPage")),
      S.listItem()
        .title("Amenities Page")
        .icon(DocumentTextIcon)
        .child(S.document().schemaType("amenitiesPage").documentId("amenitiesPage")),
      S.listItem()
        .title("Get Involved Page")
        .icon(DocumentTextIcon)
        .child(S.document().schemaType("getInvolvedPage").documentId("getInvolvedPage")),

      S.divider(),

      // --- Support & media pages ---
      S.listItem()
        .title("Donate Page")
        .icon(DocumentTextIcon)
        .child(S.document().schemaType("donatePage").documentId("donatePage")),
      S.listItem()
        .title("Media Page")
        .icon(DocumentTextIcon)
        .child(S.document().schemaType("mediaPage").documentId("mediaPage")),
      S.documentTypeListItem("mediaImage").title("Media Images"),

      S.divider(),

      // --- Listing page configuration ---
      S.listItem()
        .title("Events Page")
        .icon(DocumentTextIcon)
        .child(S.document().schemaType("eventsPage").documentId("eventsPage")),
      S.listItem()
        .title("Projects Page")
        .icon(DocumentTextIcon)
        .child(S.document().schemaType("projectsPage").documentId("projectsPage")),
      S.listItem()
        .title("Updates Page")
        .icon(DocumentTextIcon)
        .child(S.document().schemaType("updatesPage").documentId("updatesPage")),

      S.divider(),

      // --- Shared content ---
      S.documentTypeListItem("partner").title("Partners"),
      S.documentTypeListItem("quote").title("Quotes"),
      S.documentTypeListItem("gallery").title("Galleries"),
      S.documentTypeListItem("updateCategory").title("Update Categories"),

      S.divider(),

      // --- Settings ---
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
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
    visionTool(),
    presentationTool({
      previewUrl: {
        initial: env.SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: "/api/draft",
        },
      },
      allowOrigins: [
        "http://localhost:3001",
        "https://chimborazoparkconservancy.org",
        "https://*.chimborazoparkconservancy.org",
        "https://*.netlify.app",
      ],
      resolve: {
        mainDocuments: defineDocuments([
          // Singleton pages
          { route: "/", type: "homePage" },
          { route: "/about", type: "aboutPage" },
          { route: "/history", type: "historyPage" },
          { route: "/amenities", type: "amenitiesPage" },
          { route: "/get-involved", type: "getInvolvedPage" },
          { route: "/donate", type: "donatePage" },
          { route: "/media", type: "mediaPage" },
          { route: "/events", type: "eventsPage" },
          { route: "/projects", type: "projectsPage" },
          { route: "/updates", type: "updatesPage" },
          // Dynamic routes
          {
            route: "/events/:slug",
            filter: `_type == "event" && slug.current == $slug`,
          },
          {
            route: "/projects/:slug",
            filter: `_type == "project" && slug.current == $slug`,
          },
          {
            route: "/updates/:slug",
            filter: `_type == "update" && slug.current == $slug`,
          },
        ]),
        locations: {
          // Homepage
          homePage: defineLocations({
            message: "This document controls the homepage content",
            locations: [{ title: "Homepage", href: "/" }],
          }),
          // Informational pages
          aboutPage: defineLocations({
            message: "This document controls the About page",
            locations: [{ title: "About", href: "/about" }],
          }),
          historyPage: defineLocations({
            message: "This document controls the History page",
            locations: [{ title: "History", href: "/history" }],
          }),
          amenitiesPage: defineLocations({
            message: "This document controls the Amenities page",
            locations: [{ title: "Amenities", href: "/amenities" }],
          }),
          getInvolvedPage: defineLocations({
            message: "This document controls the Get Involved page",
            locations: [{ title: "Get Involved", href: "/get-involved" }],
          }),
          // Support pages
          donatePage: defineLocations({
            message: "This document controls the Donate page",
            locations: [{ title: "Donate", href: "/donate" }],
          }),
          mediaPage: defineLocations({
            message: "This document controls the Media page",
            locations: [{ title: "Media", href: "/media" }],
          }),
          // Listing pages
          eventsPage: defineLocations({
            message: "This document controls the Events listing page",
            locations: [{ title: "Events", href: "/events" }],
          }),
          projectsPage: defineLocations({
            message: "This document controls the Projects listing page",
            locations: [{ title: "Projects", href: "/projects" }],
          }),
          updatesPage: defineLocations({
            message: "This document controls the Updates page",
            locations: [{ title: "Updates", href: "/updates" }],
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
          update: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [
                    { title: doc.title || "Untitled Update", href: `/updates/${doc.slug}` },
                    { title: "Updates Listing", href: "/updates" },
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
    productionUrl: async (prev, context) => {
      const { document } = context
      const previewPath = getPreviewPathForDocument(
        document as {
          _type?: string
          slug?: { current?: string }
        },
      )

      if (!previewPath) {
        return prev
      }

      const previewSecretClient = context.getClient({ apiVersion })
      const studioUrl =
        typeof window === "undefined" ? env.SANITY_STUDIO_PREVIEW_URL : window.location.origin
      const { secret } = await createPreviewSecret(
        previewSecretClient,
        "document.productionUrl",
        studioUrl,
        context.currentUser?.id,
      )

      return buildDraftPreviewUrl({
        baseUrl: env.SANITY_STUDIO_PREVIEW_URL,
        path: previewPath,
        secret,
      })
    },
    actions: (prev, context) => {
      // Restrict actions for singleton documents
      if (singletonTypes.includes(context.schemaType)) {
        return prev.filter(
          (action) => !["delete", "duplicate", "unpublish"].includes(action.action ?? ""),
        )
      }
      // Add AI metadata generation action for mediaImage documents
      if (context.schemaType === "mediaImage") {
        return [...prev, generateMetadataAction]
      }
      return prev
    },
  },
})
