import type { Metadata } from "next";
import {
  getAppearanceBootstrapScript,
} from "@/lib/appearance-shared";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import { generateOrganizationStructuredData, SITE_CONFIG } from "@/utils/seo";
import { Providers } from "./providers";
import "./globals.css";

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
};

/**
 * Root layout - fully static shell.
 *
 * Appearance (theme/palette) is handled entirely client-side:
 * 1. The inline bootstrap script reads cookies and sets class/data attributes immediately (no FOUC)
 * 2. The Providers client component reads cookies client-side and syncs React state
 *
 * This avoids `cookies()` in the layout, keeping it statically renderable.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bootstrapScript = getAppearanceBootstrapScript({
    theme: "system",
    resolvedTheme: "light",
    palette: "olive",
  });
  const structuredData = generateOrganizationStructuredData();

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: bootstrapScript }}
        />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://us.i.posthog.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
              .replace(/</g, "\\u003c")
              .replace(/>/g, "\\u003e"),
          }}
        />
      </head>
      <body
        className="min-h-screen bg-grey-50 dark:bg-primary-900"
        suppressHydrationWarning
      >
        <Providers
          initialTheme="system"
          initialResolvedTheme="light"
          initialPalette="olive"
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-primary-50 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:outline-none"
          >
            Skip to main content
          </a>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
