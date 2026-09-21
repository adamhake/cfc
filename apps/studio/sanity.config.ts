import { createGenerateMetadataAction, schemas } from "@chimborazo/sanity-config"
import { CalendarIcon } from "@sanity/icons/Calendar"
import { CogIcon } from "@sanity/icons/Cog"
import { DocumentTextIcon } from "@sanity/icons/DocumentText"
import { HomeIcon } from "@sanity/icons/Home"
import { ImagesIcon } from "@sanity/icons/Images"
import { RocketIcon } from "@sanity/icons/Rocket"
import {
  urlSearchParamPreviewPathname,
  urlSearchParamPreviewSecret,
} from "@sanity/preview-url-secret/constants"
import { createPreviewSecret } from "@sanity/preview-url-secret/create-secret"
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import {
  type DocumentLocationResolvers,
  defineDocuments,
  defineLocations,
  presentationTool,
} from "sanity/presentation"
import type { StructureResolver } from "sanity/structure"
import { structureTool } from "sanity/structure"
import { StudioLogo } from "./components/StudioLogo"
import { resolveDocumentBadges } from "./src/badges"
import { env } from "./src/env"
import {
  CONTENT_ROUTES,
  getPreviewPathForDocument,
  SINGLETON_PAGES,
  SINGLETON_TYPES,
} from "./src/routes"
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

function buildDraftPreviewUrl(options: { baseUrl: string; path: string; secret: string }) {
  const previewUrl = new URL("/api/draft", options.baseUrl)
  previewUrl.searchParams.set(urlSearchParamPreviewSecret, options.secret)
  previewUrl.searchParams.set(urlSearchParamPreviewPathname, options.path)
  return previewUrl.toString()
}

type S = Parameters<StructureResolver>[0]

/** A singleton list item that locks the document to a fixed ID. */
const singletonItem = (S: S, type: string, title: string, icon = DocumentTextIcon) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title))

/**
 * A content section: the listing page's own settings sit alongside the
 * documents that appear on it, so an editor changing the Events intro and an
 * editor adding an event start from the same place.
 */
const contentSection = (
  S: S,
  options: {
    title: string
    icon: typeof DocumentTextIcon
    pageType: string
    pageTitle: string
    documents: Array<{ type: string; title: string }>
  },
) =>
  S.listItem()
    .title(options.title)
    .icon(options.icon)
    .child(
      S.list()
        .title(options.title)
        .items([
          singletonItem(S, options.pageType, options.pageTitle, CogIcon),
          S.divider(),
          ...options.documents.map((doc) => S.documentTypeListItem(doc.type).title(doc.title)),
        ]),
    )

// Define custom structure for organizing content
const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // --- Homepage (most frequently edited) ---
      singletonItem(S, "homePage", "Homepage", HomeIcon),

      S.divider(),

      // --- Content sections: listing page settings + their documents ---
      contentSection(S, {
        title: "Events",
        icon: CalendarIcon,
        pageType: "eventsPage",
        pageTitle: "Events Page Settings",
        documents: [{ type: "event", title: "All Events" }],
      }),
      contentSection(S, {
        title: "Projects",
        icon: RocketIcon,
        pageType: "projectsPage",
        pageTitle: "Projects Page Settings",
        documents: [{ type: "project", title: "All Projects" }],
      }),
      contentSection(S, {
        title: "Updates",
        icon: DocumentTextIcon,
        pageType: "updatesPage",
        pageTitle: "Updates Page Settings",
        documents: [
          { type: "update", title: "All Updates" },
          { type: "updateCategory", title: "Categories" },
        ],
      }),
      contentSection(S, {
        title: "Media",
        icon: ImagesIcon,
        pageType: "mediaPage",
        pageTitle: "Media Page Settings",
        documents: [{ type: "mediaImage", title: "All Media Items" }],
      }),

      S.divider(),

      // --- Standalone pages ---
      singletonItem(S, "aboutPage", "About Page"),
      singletonItem(S, "historyPage", "History Page"),
      singletonItem(S, "amenitiesPage", "Amenities Page"),
      singletonItem(S, "getInvolvedPage", "Get Involved Page"),
      singletonItem(S, "donatePage", "Donate Page"),
      singletonItem(S, "surveyResultsPage", "Survey Results Page"),

      S.divider(),

      // --- Reusable content referenced from many pages ---
      S.documentTypeListItem("partner").title("Partners"),
      S.documentTypeListItem("quote").title("Quotes"),
      S.documentTypeListItem("gallery").title("Galleries"),

      S.divider(),

      // --- Settings ---
      singletonItem(S, "siteSettings", "Site Settings", CogIcon),
    ])

// --- Presentation: document locations, derived from the shared route table ---

const singletonLocations = Object.fromEntries(
  SINGLETON_PAGES.map((page) => [
    page.type,
    defineLocations({
      message: `This document controls the ${page.title.replace(/ Page$/, "")} page`,
      locations: [{ title: page.title.replace(/ Page$/, ""), href: page.path }],
    }),
  ]),
)

const contentLocations = Object.fromEntries(
  CONTENT_ROUTES.map((route) => [
    route.type,
    defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: doc?.slug
          ? [
              {
                title: doc.title || `Untitled ${route.label}`,
                href: `${route.basePath}/${doc.slug}`,
              },
              { title: route.listingTitle, href: route.basePath },
            ]
          : [],
      }),
    }),
  ]),
)

/**
 * Types with no page of their own. Without an entry here the Presentation tool
 * shows nothing at all, which reads as "this document is unused".
 */
const sharedContentLocations: DocumentLocationResolvers = {
  siteSettings: defineLocations({
    message: "This document is used across the entire site",
    tone: "caution",
  }),
  gallery: defineLocations({
    message: "Galleries appear wherever a page or event references them",
    tone: "caution",
  }),
  partner: defineLocations({
    message: "Partners appear on the homepage and on any project that references them",
    tone: "caution",
    locations: [{ title: "Homepage", href: "/" }],
  }),
  quote: defineLocations({
    message:
      "Quotes appear wherever they are referenced. The homepage uses Homepage > Quote if set, otherwise Site Settings > Featured Quote.",
    tone: "caution",
    locations: [{ title: "Homepage", href: "/" }],
  }),
  updateCategory: defineLocations({
    message: "Categories appear as filter chips on the Updates page",
    tone: "caution",
    locations: [{ title: "Updates", href: "/updates" }],
  }),
  mediaImage: defineLocations({
    message: "Media items appear in the Media page gallery",
    tone: "caution",
    locations: [{ title: "Media", href: "/media" }],
  }),
}

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
    visionTool({
      defaultApiVersion: apiVersion,
      defaultDataset: dataset,
    }),
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
          ...SINGLETON_PAGES.map((page) => ({ route: page.path, type: page.type })),
          ...CONTENT_ROUTES.map((route) => ({
            route: `${route.basePath}/:slug`,
            filter: `_type == "${route.type}" && slug.current == $slug`,
          })),
        ]),
        locations: {
          ...singletonLocations,
          ...contentLocations,
          ...sharedContentLocations,
        },
      },
    }),
  ],

  schema: {
    types: schemas,

    // Singletons are created by Structure at a fixed document ID. Without this
    // filter the global "Create new" menu can still mint a second homePage,
    // which would then compete with the real one in `*[_type == "homePage"][0]`.
    templates: (prev) => prev.filter((template) => !SINGLETON_TYPES.includes(template.schemaType)),
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
      // `createPreviewSecret` wants the Studio's own origin. The Studio only
      // ever runs in a browser, so `window.location.origin` is the real value;
      // the SSR branch is a build-time fallback that is never exercised.
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
      if (SINGLETON_TYPES.includes(context.schemaType)) {
        return prev.filter((action) => !["delete", "duplicate"].includes(action.action ?? ""))
      }
      // Add AI metadata generation action for mediaImage documents
      if (context.schemaType === "mediaImage") {
        return [...prev, generateMetadataAction]
      }
      return prev
    },
    badges: resolveDocumentBadges,
  },
})
