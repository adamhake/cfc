import type { Metadata } from "next"
import { draftMode } from "next/headers"
import Footer from "@/components/Footer/footer"
import Header from "@/components/Header/header"
import { DisablePreview } from "@/components/VisualEditing/disable-preview"
import { VisualEditing } from "@/components/VisualEditing/visual-editing"
import { getAppearanceBootstrapScript } from "@/lib/appearance-shared"
import { SanityLive } from "@/lib/sanity-live"
import { getSiteSettings } from "@/lib/site-settings"
import {
  generateOrganizationStructuredData,
  generateParkStructuredData,
  SITE_CONFIG,
} from "@/utils/seo"
import "./globals.css"
import { Providers } from "./providers"

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
    palette: "heritage",
  })
  const structuredData = generateOrganizationStructuredData()
  const parkStructuredData = generateParkStructuredData()

  // Only fetch data that every page needs for header/footer chrome.
  // Feature-specific fetches stay on their own routes so TTFB isn't
  // inflated by data only used in a menu dropdown.
  const siteSettings = await getSiteSettings()

  const facebookUrl = siteSettings?.socialMedia?.facebook ?? undefined
  const instagramUrl = siteSettings?.socialMedia?.instagram ?? undefined

  return (
    // data-scroll-behavior="smooth" tells Next.js 16 to honor our CSS
    // `scroll-behavior: smooth` for in-page anchors but disable it during
    // client-side route transitions (which would otherwise animate scroll-to-top).
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: bootstrap script for theme/palette init
          dangerouslySetInnerHTML={{ __html: bootstrapScript }}
        />
        <link
          rel="preload"
          href="/fonts/Nebula_Sans/NebulaSans-Book.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Vollkorn_SC/VollkornSC-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
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
        <Providers initialTheme="system" initialResolvedTheme="light" initialPalette="heritage">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-primary-50 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:outline-none"
          >
            Skip to main content
          </a>
          <div className="flex min-h-screen flex-col">
            <Header facebookUrl={facebookUrl} instagramUrl={instagramUrl} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer facebookUrl={facebookUrl} instagramUrl={instagramUrl} />
          </div>
        </Providers>
        {/* Draft events need a draft-capable live connection; published
            visitors get the published-only stream. */}
        <SanityLive includeDrafts={isDraftMode} />
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
