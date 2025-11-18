# SEO Metadata Management Guide

This guide explains how to systematically handle SEO metadata across the Chimborazo Park Conservancy website.

## Overview

The SEO utilities are centralized in `apps/web/src/utils/seo.ts`, providing:

- **Site-wide configuration** (`SITE_CONFIG`)
- **Type-safe metadata helpers** for meta tags, Open Graph, and Twitter Cards
- **Structured data generators** for JSON-LD schema markup
- **Consistent formatting** across all pages

## Table of Contents

- [Site Configuration](#site-configuration)
- [Basic Page Metadata](#basic-page-metadata)
- [Dynamic Content Metadata](#dynamic-content-metadata)
- [Structured Data](#structured-data)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Site Configuration

All site-wide constants are defined in `SITE_CONFIG`:

```typescript
import { SITE_CONFIG } from "@/utils/seo";

// Available properties:
SITE_CONFIG.name; // "Chimborazo Park Conservancy"
SITE_CONFIG.alternateName; // "Friends of Chimborazo Park"
SITE_CONFIG.url; // "https://chimborazoparkconservancy.org/"
SITE_CONFIG.description; // Default site description
SITE_CONFIG.locale; // "en_US"
SITE_CONFIG.themeColor; // "#166534"
SITE_CONFIG.twitterHandle; // undefined (add when available)
SITE_CONFIG.defaultImage; // Default OG image configuration
```

**To update site-wide settings:** Edit `apps/web/src/utils/seo.ts` and modify the `SITE_CONFIG` object.

## Basic Page Metadata

For static pages (like homepage, about, contact), use `generateMetaTags()` and `generateLinkTags()`:

```typescript
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: generateMetaTags({
      title: "About Us",
      description: "Learn about our mission to preserve Chimborazo Park...",
      type: "website",
      url: `${SITE_CONFIG.url}/about`,
    }),
    links: generateLinkTags({
      canonical: `${SITE_CONFIG.url}/about`,
    }),
  }),
});
```

### generateMetaTags() Options

| Option          | Type                                  | Default                    | Description                                            |
| --------------- | ------------------------------------- | -------------------------- | ------------------------------------------------------ |
| `title`         | `string`                              | -                          | Page title (will be formatted as "Title \| Site Name") |
| `description`   | `string`                              | `SITE_CONFIG.description`  | Page description                                       |
| `type`          | `"website" \| "article" \| "profile"` | `"website"`                | Open Graph type                                        |
| `url`           | `string`                              | `SITE_CONFIG.url`          | Canonical URL                                          |
| `image`         | `object`                              | `SITE_CONFIG.defaultImage` | Social media image                                     |
| `publishedTime` | `string`                              | -                          | Article publish date (ISO 8601)                        |
| `modifiedTime`  | `string`                              | -                          | Article modified date (ISO 8601)                       |
| `author`        | `string`                              | -                          | Article author name                                    |
| `section`       | `string`                              | -                          | Article section/category                               |
| `tags`          | `string[]`                            | -                          | Article tags                                           |
| `noIndex`       | `boolean`                             | `false`                    | Prevent search engine indexing                         |

### generateLinkTags() Options

| Option                 | Type              | Description                            |
| ---------------------- | ----------------- | -------------------------------------- |
| `canonical`            | `string`          | Canonical URL for the page             |
| `preloadImage`         | `string`          | Image URL to preload (for hero images) |
| `preloadImagePriority` | `"high" \| "low"` | Fetch priority hint                    |

## Dynamic Content Metadata

For dynamic pages (like blog posts, events), use loader data:

```typescript
export const Route = createFileRoute("/events/$slug")({
  component: EventPage,
  loader: async ({ params }) => {
    const event = await fetchEvent(params.slug);
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.event) return { meta: [] };

    const { event } = loaderData;
    const eventUrl = `${SITE_CONFIG.url}/events/${event.slug}`;

    return {
      meta: generateMetaTags({
        title: event.title,
        description: event.description,
        type: "article",
        url: eventUrl,
        image: {
          url: event.imageUrl,
          width: event.imageWidth,
          height: event.imageHeight,
          alt: event.imageAlt,
        },
        publishedTime: event.date,
      }),
      links: generateLinkTags({
        canonical: eventUrl,
      }),
    };
  },
});
```

## Structured Data

### Organization Structured Data

Used in the root layout (`__root.tsx`) to describe the organization:

```typescript
import { generateOrganizationStructuredData } from "@/utils/seo";

function RootDocument({ children }) {
  const structuredData = generateOrganizationStructuredData();

  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Event Structured Data

For event pages, add JSON-LD structured data to help search engines understand event details:

```typescript
import { generateEventStructuredData } from "@/utils/seo";

function EventPage() {
  const { event } = Route.useLoaderData();

  const structuredData = generateEventStructuredData({
    name: event.title,
    description: event.description,
    image: event.imageUrl,
    startDate: event.date, // ISO 8601 format
    location: {
      name: event.location,
      address: {
        addressLocality: "Richmond",
        addressRegion: "VA",
        addressCountry: "US",
      },
    },
    url: `${SITE_CONFIG.url}/events/${event.slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Page content */}
    </>
  );
}
```

### Article Structured Data

For blog posts or news articles:

```typescript
import { generateArticleStructuredData } from "@/utils/seo";

const structuredData = generateArticleStructuredData({
  headline: "Park Restoration Project Complete",
  description: "After months of work...",
  image: "https://chimborazoparkconservancy.org/restoration.webp",
  datePublished: "2025-01-15T10:00:00Z",
  dateModified: "2025-01-16T14:30:00Z",
  author: {
    name: "Jane Smith",
  },
});
```

## Best Practices

### 1. Always Use SITE_CONFIG for URLs

**Good:**

```typescript
url: `${SITE_CONFIG.url}/events/${slug}`;
```

**Bad:**

```typescript
url: `https://chimborazoparkconservancy.org/events/${slug}`; // Hardcoded
```

### 2. Provide Custom Descriptions

Each page should have a unique, descriptive meta description:

**Good:**

```typescript
description: "Join us for our annual Spring Clean-up on March 15th...";
```

**Bad:**

```typescript
// Using default description for every page
```

### 3. Use Appropriate Open Graph Types

- `website` - Static pages (homepage, about, contact)
- `article` - Blog posts, news, events
- `profile` - Author/team member pages

### 4. Include Image Dimensions

Always provide image width and height for better performance and social sharing:

```typescript
image: {
  url: imageUrl,
  width: 1200,
  height: 630,
  alt: "Descriptive alt text",
}
```

### 5. Canonical URLs

Always set canonical URLs to prevent duplicate content issues:

```typescript
links: generateLinkTags({
  canonical: `${SITE_CONFIG.url}/events/${slug}`,
});
```

### 6. Preload Hero Images

For pages with hero images, preload them for better performance:

```typescript
links: generateLinkTags({
  canonical: `${SITE_CONFIG.url}`,
  preloadImage: "/hero-image.webp",
  preloadImagePriority: "high",
});
```

## Examples

### Example 1: Simple Static Page

```typescript
// apps/web/src/routes/privacy-policy.tsx
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicy,
  head: () => ({
    meta: generateMetaTags({
      title: "Privacy Policy",
      description: "Our commitment to protecting your privacy and personal information.",
      type: "website",
      url: `${SITE_CONFIG.url}/privacy-policy`,
      noIndex: true, // Don't index legal pages
    }),
    links: generateLinkTags({
      canonical: `${SITE_CONFIG.url}/privacy-policy`,
    }),
  }),
});
```

### Example 2: Blog Post with Custom Image

```typescript
// apps/web/src/routes/blog/$slug.tsx
export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
  loader: async ({ params }) => {
    const post = await fetchBlogPost(params.slug);
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.post) return { meta: [] };

    const { post } = loaderData;
    const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;

    return {
      meta: generateMetaTags({
        title: post.title,
        description: post.excerpt,
        type: "article",
        url: postUrl,
        image: {
          url: post.coverImage.url,
          width: post.coverImage.width,
          height: post.coverImage.height,
          alt: post.coverImage.alt,
        },
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        author: post.author.name,
        section: post.category,
        tags: post.tags,
      }),
      links: generateLinkTags({
        canonical: postUrl,
        preloadImage: post.coverImage.url,
        preloadImagePriority: "high",
      }),
    };
  },
});
```

### Example 3: Event with Structured Data

```typescript
// apps/web/src/routes/events/$slug.tsx
import {
  generateEventStructuredData,
  generateLinkTags,
  generateMetaTags,
  SITE_CONFIG,
} from "@/utils/seo";

export const Route = createFileRoute("/events/$slug")({
  component: EventPage,
  loader: async ({ params }) => {
    const event = await fetchEvent(params.slug);
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.event) return { meta: [] };

    const { event } = loaderData;
    const eventUrl = `${SITE_CONFIG.url}/events/${event.slug}`;

    return {
      meta: generateMetaTags({
        title: event.title,
        description: event.description,
        type: "article",
        url: eventUrl,
        image: {
          url: event.image.url,
          width: event.image.width,
          height: event.image.height,
          alt: event.image.alt,
        },
        publishedTime: event.date,
      }),
      links: generateLinkTags({
        canonical: eventUrl,
      }),
    };
  },
});

function EventPage() {
  const { event } = Route.useLoaderData();

  const structuredData = generateEventStructuredData({
    name: event.title,
    description: event.description,
    image: event.image.url,
    startDate: event.date,
    location: {
      name: event.location,
      address: {
        addressLocality: "Richmond",
        addressRegion: "VA",
        addressCountry: "US",
      },
    },
    url: `${SITE_CONFIG.url}/events/${event.slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Event content */}
    </>
  );
}
```

## Testing SEO

### Validate Metadata

1. **View Source**: Right-click → View Page Source and check `<head>` tags
2. **Browser DevTools**: Inspect → Elements → `<head>` section
3. **Meta Tags**: Look for `<meta>`, `<link>`, and `<script type="application/ld+json">` tags

### Test Social Sharing

- **Facebook**: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter**: [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn**: [Post Inspector](https://www.linkedin.com/post-inspector/)

### Test Structured Data

- **Google**: [Rich Results Test](https://search.google.com/test/rich-results)
- **Schema.org**: [Schema Markup Validator](https://validator.schema.org/)

## Troubleshooting

### Meta tags not appearing

- Ensure you've imported `generateMetaTags` correctly
- Check that the `head` function returns the correct structure
- Verify no TypeScript errors in the route file

### Social sharing previews not updating

- Social platforms cache previews for 24-48 hours
- Use platform-specific debuggers to force a refresh
- Check that the URL is publicly accessible

### Images not displaying in previews

- Verify image URLs are absolute (not relative)
- Ensure images are publicly accessible (not behind authentication)
- Check image dimensions meet platform requirements (minimum 200x200, recommended 1200x630)

## Future Enhancements

Consider adding these features as needed:

- **Sitemap generation**: Automatically generate XML sitemaps
- **Robots.txt management**: Programmatic robots.txt generation
- **Multi-language support**: i18n metadata handling
- **Dynamic OG images**: Generate custom social images per page
- **Analytics integration**: Track social sharing performance
