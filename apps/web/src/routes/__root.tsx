import { ErrorBoundary } from "@/components/ErrorBoundary/error-boundary";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import { NotFound } from "@/components/NotFound/not-found";
import type { PaletteMode } from "@/utils/palette";
import { generateOrganizationStructuredData, SITE_CONFIG } from "@/utils/seo";
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
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      {
        name: "theme-color",
        content: SITE_CONFIG.themeColor,
      },
      {
        title: SITE_CONFIG.name,
      },
      {
        name: "description",
        content: SITE_CONFIG.description,
      },
      {
        property: "og:site_name",
        content: SITE_CONFIG.name,
      },
      {
        property: "og:locale",
        content: SITE_CONFIG.locale,
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
    links: [
      {
        rel: "dns-prefetch",
        href: "https://cdn.sanity.io",
      },
      {
        rel: "preload",
        href: appCss,
        as: "style",
      },
      {
        rel: "stylesheet",
        href: appCss,
        suppressHydrationWarning: true,
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
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const structuredData = generateOrganizationStructuredData();

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
      <body className="bg-grey-50 dark:bg-primary-900" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-primary-50 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:outline-none"
        >
          Skip to main content
        </a>
        <ErrorBoundary>
          <Header />
          <main id="main-content" className="overflow-x-hidden">{children}</main>
          <Footer />
        </ErrorBoundary>
        <Scripts />
      </body>
    </html>
  );
}
