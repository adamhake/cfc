import { ErrorBoundary } from "@/components/ErrorBoundary/error-boundary";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import { NotFound } from "@/components/NotFound/not-found";
import { DisablePreview, VisualEditing } from "@/components/VisualEditing";
import { PostHogProvider } from "@/integrations/posthog/provider";
import { getInitialAppearance } from "@/lib/appearance-server";
import { getAppearanceBootstrapScript } from "@/lib/appearance-shared";
import { getIsPreviewMode } from "@/lib/preview";
import type { PaletteMode } from "@/utils/palette";
import { JsonLd } from "@/components/JsonLd/json-ld";
import { generateOrganizationStructuredData, SITE_CONFIG } from "@/utils/seo";
import type { ResolvedTheme, ThemeMode } from "@/utils/theme";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Suspense } from "react";
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
  component: RootComponent,
  notFoundComponent: NotFound,
  loader: async () => {
    // Detect preview mode for Visual Editing and fetch first-paint appearance
    const [preview, appearance] = await Promise.all([getIsPreviewMode(), getInitialAppearance()]);
    return { preview, appearance };
  },
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
    ],
    links: [
      {
        rel: "dns-prefetch",
        href: "https://cdn.sanity.io",
      },
      {
        rel: "dns-prefetch",
        href: "https://us.i.posthog.com",
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

/**
 * Root component that wraps all routes.
 * Visual Editing is enabled only when draft/preview mode is active.
 */
function RootComponent() {
  const { preview } = Route.useLoaderData();

  return (
    <>
      <Outlet />
      {preview && (
        <Suspense>
          <VisualEditing />
        </Suspense>
      )}
      {preview && <DisablePreview />}
    </>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { preview, appearance } = Route.useLoaderData();
  const structuredData = generateOrganizationStructuredData();
  const appearanceBootstrapScript = getAppearanceBootstrapScript(appearance);

  return (
    <html
      lang="en"
      className={appearance.resolvedTheme === "dark" ? "dark" : undefined}
      data-palette={appearance.palette === "olive" ? undefined : appearance.palette}
      style={{ colorScheme: appearance.resolvedTheme }}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: appearanceBootstrapScript,
          }}
        />
        <HeadContent />
        <JsonLd data={structuredData} />
      </head>
      <body className="min-h-screen bg-grey-50 dark:bg-primary-900" suppressHydrationWarning>
        <PostHogProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-primary-50 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:outline-none"
          >
            Skip to main content
          </a>
          <div className="flex min-h-screen flex-col">
            <ErrorBoundary>
              <Header preview={preview} />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer preview={preview} />
            </ErrorBoundary>
          </div>
        </PostHogProvider>
        <Scripts />
      </body>
    </html>
  );
}
