import { ErrorBoundary } from "@/components/ErrorBoundary/error-boundary";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import type { PaletteMode } from "@/utils/palette";
import type { ResolvedTheme, ThemeMode } from "@/utils/theme";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: ResolvedTheme;
  _themeManager?: unknown; // Internal theme manager for reactivity
  palette: PaletteMode;
  setPalette: (palette: PaletteMode) => void;
  _paletteManager?: unknown; // Internal palette manager for reactivity
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    // scripts: [
    //   {
    //     defer: true,
    //     src: "https://zeffy-scripts.s3.ca-central-1.amazonaws.com/embed-form-script.min.js",
    //   },
    // ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "theme-color",
        content: "#166534",
      },
      {
        title: "Chimborazo Park Conservancy",
      },
      {
        name: "description",
        content:
          "A 501(c)(3) non-profit dedicated to preserving and enhancing Chimborazo Park in Richmond, VA's Church Hill neighborhood through community stewardship.",
      },
      {
        property: "og:site_name",
        content: "Chimborazo Park Conservancy",
      },
      {
        property: "og:locale",
        content: "en_US",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Vollkorn+SC:wght@400;600;700;900&display=swap",
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Chimborazo Park Conservancy",
    alternateName: "Friends of Chimborazo Park",
    url: "https://chimboparkconservancy.org",
    logo: "https://chimboparkconservancy.org/logo512.png",
    description:
      "A 501(c)(3) non-profit organization dedicated to preserving and enhancing Chimborazo Park in Richmond, Virginia's Church Hill neighborhood through community stewardship.",
    foundingDate: "2023",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Richmond",
      addressRegion: "VA",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "Place",
      name: "Church Hill, Richmond, Virginia",
    },
    sameAs: [
      // Add social media URLs here when available
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Apply theme
                  const stored = localStorage.getItem('theme');
                  const preference = stored || 'system';
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = preference === 'dark' || (preference === 'system' && systemDark);
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  }

                  // Apply palette (default is now 'olive')
                  const palette = localStorage.getItem('palette-preference');
                  if (palette && palette !== 'olive') {
                    document.documentElement.setAttribute('data-palette', palette);
                  }
                } catch (e) {
                  // Ignore localStorage errors
                }
              })();
            `,
          }}
        />
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-grey-50 dark:bg-green-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-primary-50 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:outline-none"
        >
          Skip to main content
        </a>
        <ErrorBoundary>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </ErrorBoundary>
        <Scripts />
      </body>
    </html>
  );
}
