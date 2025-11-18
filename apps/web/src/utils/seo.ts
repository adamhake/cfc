/**
 * SEO Utilities for Chimborazo Park Conservancy
 *
 * Centralized utilities for managing page metadata, Open Graph tags,
 * Twitter cards, and structured data consistently across the site.
 */

/**
 * Site-wide SEO configuration
 */
export const SITE_CONFIG = {
  name: "Chimborazo Park Conservancy",
  alternateName: "Friends of Chimborazo Park",
  url: "https://chimborazoparkconservancy.org",
  description:
    "A 501(c)(3) non-profit dedicated to preserving and enhancing Chimborazo Park in Richmond, VA's Church Hill neighborhood through community stewardship.",
  locale: "en_US",
  themeColor: "#166534",
  twitterHandle: undefined, // Add when available
  defaultImage: {
    url: "https://chimborazoparkconservancy.org/bike_sunset.webp",
    width: 2000,
    height: 1262,
    alt: "Chimborazo Park at sunset",
  },
} as const;

/**
 * Type-safe metadata configuration
 */
export interface PageMetadata {
  title?: string;
  description?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  type?: "website" | "article" | "profile";
  url?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Generates a formatted page title with site name
 */
export function formatTitle(pageTitle?: string): string {
  if (!pageTitle) {
    return SITE_CONFIG.name;
  }
  return `${pageTitle} | ${SITE_CONFIG.name}`;
}

/**
 * Generates complete meta tags for a page
 */
export function generateMetaTags(config: PageMetadata): Array<Record<string, string>> {
  const {
    title,
    description = SITE_CONFIG.description,
    image = SITE_CONFIG.defaultImage,
    type = "website",
    url = SITE_CONFIG.url,
    publishedTime,
    modifiedTime,
    author,
    section,
    tags,
    noIndex = false,
  } = config;

  const formattedTitle = formatTitle(title);
  const imageUrl = image.url.startsWith("http") ? image.url : `${SITE_CONFIG.url}${image.url}`;

  const meta: Array<Record<string, string>> = [
    // Primary Meta Tags
    {
      title: formattedTitle,
    },
    {
      name: "description",
      content: description,
    },
  ];

  // Robots
  if (noIndex) {
    meta.push({
      name: "robots",
      content: "noindex, nofollow",
    });
  }

  // Open Graph
  meta.push(
    {
      property: "og:title",
      content: title || SITE_CONFIG.name,
    },
    {
      property: "og:description",
      content: description,
    },
    {
      property: "og:type",
      content: type,
    },
    {
      property: "og:url",
      content: url,
    },
    {
      property: "og:image",
      content: imageUrl,
    },
    {
      property: "og:site_name",
      content: SITE_CONFIG.name,
    },
    {
      property: "og:locale",
      content: SITE_CONFIG.locale,
    },
  );

  // Optional Open Graph image dimensions
  if (image.width) {
    meta.push({
      property: "og:image:width",
      content: image.width.toString(),
    });
  }
  if (image.height) {
    meta.push({
      property: "og:image:height",
      content: image.height.toString(),
    });
  }
  if (image.alt) {
    meta.push({
      property: "og:image:alt",
      content: image.alt,
    });
  }

  // Article-specific Open Graph tags
  if (type === "article") {
    if (publishedTime) {
      meta.push({
        property: "article:published_time",
        content: publishedTime,
      });
    }
    if (modifiedTime) {
      meta.push({
        property: "article:modified_time",
        content: modifiedTime,
      });
    }
    if (author) {
      meta.push({
        property: "article:author",
        content: author,
      });
    }
    if (section) {
      meta.push({
        property: "article:section",
        content: section,
      });
    }
    if (tags && tags.length > 0) {
      tags.forEach((tag) => {
        meta.push({
          property: "article:tag",
          content: tag,
        });
      });
    }
  }

  // Twitter Card
  meta.push(
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: title || SITE_CONFIG.name,
    },
    {
      name: "twitter:description",
      content: description,
    },
    {
      name: "twitter:image",
      content: imageUrl,
    },
  );

  if (image.alt) {
    meta.push({
      name: "twitter:image:alt",
      content: image.alt,
    });
  }

  if (SITE_CONFIG.twitterHandle) {
    meta.push({
      name: "twitter:site",
      content: SITE_CONFIG.twitterHandle,
    });
  }

  return meta;
}

/**
 * Generates link tags including canonical URL
 */
export function generateLinkTags(config: {
  canonical?: string;
  preloadImage?: string;
  preloadImagePriority?: "high" | "low";
}): Array<Record<string, string>> {
  const links: Array<Record<string, string>> = [];

  if (config.canonical) {
    links.push({
      rel: "canonical",
      href: config.canonical,
    });
  }

  if (config.preloadImage) {
    links.push({
      rel: "preload",
      as: "image",
      href: config.preloadImage,
      ...(config.preloadImagePriority && { fetchPriority: config.preloadImagePriority }),
    });
  }

  return links;
}

/**
 * Generates JSON-LD structured data for an article/event
 */
export function generateArticleStructuredData(config: {
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
  publisher?: {
    name: string;
    logo?: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: config.headline,
    description: config.description,
    image: config.image,
    datePublished: config.datePublished,
    dateModified: config.dateModified || config.datePublished,
    author: config.author
      ? {
          "@type": "Person",
          name: config.author.name,
          ...(config.author.url && { url: config.author.url }),
        }
      : {
          "@type": "Organization",
          name: SITE_CONFIG.name,
        },
    publisher: {
      "@type": "Organization",
      name: config.publisher?.name || SITE_CONFIG.name,
      logo: config.publisher?.logo || `${SITE_CONFIG.url}/logo512.png`,
    },
  };
}

/**
 * Generates JSON-LD structured data for an event
 */
export function generateEventStructuredData(config: {
  name: string;
  description: string;
  image: string | string[];
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address?: {
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
  };
  organizer?: {
    name: string;
    url?: string;
  };
  url?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability: string;
    url?: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: config.name,
    description: config.description,
    image: config.image,
    startDate: config.startDate,
    ...(config.endDate && { endDate: config.endDate }),
    location: {
      "@type": "Place",
      name: config.location.name,
      ...(config.location.address && {
        address: {
          "@type": "PostalAddress",
          ...config.location.address,
        },
      }),
    },
    organizer: {
      "@type": "Organization",
      name: config.organizer?.name || SITE_CONFIG.name,
      ...(config.organizer?.url && { url: config.organizer.url }),
    },
    ...(config.url && { url: config.url }),
    ...(config.offers && { offers: { "@type": "Offer", ...config.offers } }),
  };
}

/**
 * Generates the organization structured data (for site-wide use)
 */
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.alternateName,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo512.png`,
    description: SITE_CONFIG.description,
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
}
