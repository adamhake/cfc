import { projectBySlugQuery } from "@chimborazo/sanity-config/queries"
import type { Metadata } from "next"
import { draftMode } from "next/headers"
import Footer from "@/components/Footer/footer"
import Header from "@/components/Header/header"
import { DisablePreview } from "@/components/VisualEditing/disable-preview"
import { VisualEditing } from "@/components/VisualEditing/visual-editing"
import { getAppearanceBootstrapScript } from "@/lib/appearance-shared"
import { CACHE_TAGS, sanityFetch } from "@/lib/sanity-fetch"
import { SanityLive } from "@/lib/sanity-live"
import type { SanityProject } from "@/lib/sanity-types"
import { getSiteSettings } from "@/lib/site-settings"
import {
  generateOrganizationStructuredData,
  generateParkStructuredData,
  SITE_CONFIG,
} from "@/utils/seo"
import { Providers } from "./providers"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.name,
    images: [SITE_CONFIG.defaultImage],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": SITE_CONFIG.themeColor,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode()
  const bootstrapScript = getAppearanceBootstrapScript({
    theme: "system",
    resolvedTheme: "light",
    palette: "olive",
  })
  const structuredData = generateOrganizationStructuredData()
  const parkStructuredData = generateParkStructuredData()

  // Fetch shared data server-side to avoid client-side waterfalls
  const [siteSettings, { data: featuredProject }] = await Promise.all([
    getSiteSettings(),
    sanityFetch({
      query: projectBySlugQuery,
      params: { slug: "parkwide-native-tree-planting" },
      tags: [CACHE_TAGS.PROJECTS],
    }) as Promise<{ data: SanityProject | null }>,
  ])

  const facebookUrl = siteSettings?.socialMedia?.facebook
  const instagramUrl = siteSettings?.socialMedia?.instagram

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: bootstrap script for theme/palette init
          dangerouslySetInnerHTML={{ __html: bootstrapScript }}
        />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://d.chimborazoparkconservancy.org" />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
              .replace(/</g, "\\u003c")
              .replace(/>/g, "\\u003e"),
          }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(parkStructuredData)
              .replace(/</g, "\\u003c")
              .replace(/>/g, "\\u003e"),
          }}
        />
      </head>
      <body className="min-h-screen bg-grey-50 dark:bg-primary-900" suppressHydrationWarning>
        <Providers initialTheme="system" initialResolvedTheme="light" initialPalette="olive">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-primary-50 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:outline-none"
          >
            Skip to main content
          </a>
          <div className="flex min-h-screen flex-col">
            <Header
              featuredProject={featuredProject}
              facebookUrl={facebookUrl}
              instagramUrl={instagramUrl}
            />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer facebookUrl={facebookUrl} instagramUrl={instagramUrl} />
          </div>
        </Providers>
        <SanityLive />
        {isDraftMode && (
          <>
            <VisualEditing />
            <DisablePreview />
          </>
        )}
      </body>
    </html>
  )
}
