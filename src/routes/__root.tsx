import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import type { QueryClient } from "@tanstack/react-query";
import {
  ClientOnly,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import type { ThemeMode, ResolvedTheme } from "@/utils/theme";

interface MyRouterContext {
  queryClient: QueryClient;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: ResolvedTheme;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
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
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-stone-50 dark:bg-stone-900">
        <ClientOnly>
          <Header />
        </ClientOnly>
        {children}
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}
