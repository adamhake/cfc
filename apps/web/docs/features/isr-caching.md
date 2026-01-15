# Incremental Static Regeneration (ISR) & Caching Strategy

This document outlines the ISR implementation for the Chimborazo Park Conservancy website, which uses TanStack Start with Netlify Edge SSR.

## Overview

ISR allows us to serve statically cached content from Netlify's CDN while periodically regenerating pages in the background. This provides:

- **Fast page loads** - Content served from edge locations closest to users
- **Fresh content** - Pages automatically update after cache expires
- **On-demand invalidation** - Sanity webhook purges cache when content changes

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│ Netlify CDN │────▶│  Origin     │
│             │◀────│  (Edge)     │◀────│  (SSR)      │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    Cache Headers:
                    - Netlify-CDN-Cache-Control
                    - Netlify-Cache-Tag
```

### Multi-Tier Caching

1. **CDN Edge Cache** (Netlify) - Configured via `Netlify-CDN-Cache-Control` header
2. **Client Cache** (TanStack Query) - Configured via `CACHE_PRESETS` in `query-config.ts`

Both tiers use aligned cache durations to ensure consistency.

## Implementation

### Cache Header Utility

**File:** `src/lib/cache-headers.ts`

```typescript
import { generateCacheHeaders, CACHE_TAGS } from "@/lib/cache-headers";

// In route definition:
headers: ({ loaderData }) => {
  return generateCacheHeaders({
    preset: "CURATED_CONTENT",
    tags: [CACHE_TAGS.HOMEPAGE],
    isPreview: loaderData?.preview ?? false,
  });
},
```

The utility generates Netlify-specific headers:

| Header | Purpose |
|--------|---------|
| `Cache-Control` | Browser cache (set to `max-age=0, must-revalidate`) |
| `Netlify-CDN-Cache-Control` | CDN cache with `stale-while-revalidate` |
| `Netlify-Cache-Tag` | Tags for granular cache invalidation |

### Cache Tags

Cache tags enable selective purging when content changes:

| Tag | Used By |
|-----|---------|
| `homepage` | Homepage route |
| `events` | All event-related routes |
| `events-list` | Events listing page |
| `event-detail` | Individual event pages |
| `projects` | All project-related routes |
| `projects-list` | Projects listing page |
| `project-detail` | Individual project pages |
| `media` | Media gallery page |

### Route Configuration

| Route | Preset | CDN max-age | stale-while-revalidate | Cache Tags |
|-------|--------|-------------|------------------------|------------|
| `/` | `CURATED_CONTENT` | 30 min | 1 hour | `homepage` |
| `/events/` | `EVENTS_LIST` | 5 min | 10 min | `events-list`, `events` |
| `/events/$slug` | `EVENT_DETAIL` | 10 min | 20 min | `event-detail`, `events` |
| `/projects/` | `EVENTS_LIST` | 5 min | 10 min | `projects-list`, `projects` |
| `/projects/$slug` | `PROJECT_CONTENT` | 15 min | 30 min | `project-detail`, `projects` |
| `/media` | `MEDIA_CONTENT` | 15 min | 30 min | `media` |

### Preview Mode Bypass

When Sanity Visual Editing preview mode is active (detected via `sanity-preview` cookie), all CDN caching is bypassed:

```typescript
if (isPreview) {
  return {
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
    "Netlify-CDN-Cache-Control": "no-store",
  };
}
```

This ensures editors always see fresh draft content.

## On-Demand Revalidation

### Sanity Webhook

**File:** `src/routes/api/webhooks/sanity.tsx`

When content is published in Sanity Studio, a webhook triggers cache invalidation:

1. Webhook receives document change event
2. Maps document type to cache tags
3. Calls Netlify's cache purge API with specific tags
4. Falls back to full site purge if tag purge fails

#### Document Type to Cache Tag Mapping

| Document Type | Purged Tags |
|---------------|-------------|
| `event` | `events`, `events-list`, `event-detail`, `homepage` |
| `project` | `projects`, `projects-list`, `project-detail`, `homepage` |
| `mediaImage` | `media`, `homepage` |
| `homePage` | `homepage` |
| `eventsPage` | `events-list` |
| `projectsPage` | `projects-list` |
| `mediaPage` | `media` |
| `partner`, `quote`, `gallery` | `homepage` |

### Webhook Setup

1. In Sanity Studio: **Settings > API > Webhooks > Create webhook**
2. URL: `https://your-domain.com/api/webhooks/sanity`
3. Trigger on: Create, Update, Delete events
4. Secret: Set `SANITY_WEBHOOK_SECRET` env var

### Required Environment Variables

```env
SANITY_WEBHOOK_SECRET=your-webhook-secret
NETLIFY_AUTH_TOKEN=your-netlify-personal-access-token
NETLIFY_SITE_ID=your-netlify-site-id
```

## Cache Behavior

### How stale-while-revalidate Works

1. **Fresh period** (0 to `max-age`): CDN serves cached content directly
2. **Stale period** (`max-age` to `max-age + stale-while-revalidate`): CDN serves stale content AND triggers background revalidation
3. **Expired**: CDN fetches fresh content from origin

```
Timeline: ─────────────────────────────────────────────▶

          │◄──── Fresh ────▶│◄── Stale-While-Revalidate ──▶│
          │                 │                               │
Request 1: Cache MISS, fetch from origin
Request 2: Cache HIT (fresh)
Request 3: Cache HIT (stale) + background refresh
Request 4: Cache HIT (fresh, newly revalidated)
```

### The `durable` Flag

The `Netlify-CDN-Cache-Control` header includes `durable`, which ensures cached content survives deployments. Without this, every deploy would invalidate the entire cache.

## Testing & Debugging

### Verify Headers

```bash
curl -I https://chimborazopark.org/
```

Expected response headers:
```
Cache-Control: public, max-age=0, must-revalidate
Netlify-CDN-Cache-Control: public, max-age=1800, stale-while-revalidate=3600, durable
Netlify-Cache-Tag: homepage
```

### Check Cache Status

Look for these Netlify headers in responses:

| Header | Meaning |
|--------|---------|
| `x-nf-request-id` | Unique request ID |
| `age` | Seconds since cached |
| `x-cache` | `HIT` or `MISS` |

### Test On-Demand Invalidation

1. Publish a content change in Sanity Studio
2. Check Netlify function logs for webhook execution
3. Verify `method: "tags"` in success response (granular purge worked)
4. Request the affected page and confirm fresh content

### Test Preview Mode

1. Navigate to `/api/draft` to enable preview
2. Check response headers show `no-store`
3. Verify draft content is visible
4. Navigate to `/api/draft/disable` to exit preview

## Monitoring

### Key Metrics to Track

- **Cache Hit Rate**: Higher is better (target: >80%)
- **Time to First Byte (TTFB)**: Should be low for cached content (<100ms)
- **Revalidation Time**: Time to regenerate stale content
- **Webhook Success Rate**: Monitor Netlify function logs

### Netlify Analytics

Use Netlify's analytics dashboard to monitor:
- Cache hit/miss ratios
- Edge response times
- Function invocations (webhook calls)

## Troubleshooting

### Cache Not Invalidating

1. Check webhook is configured in Sanity Studio
2. Verify `SANITY_WEBHOOK_SECRET` matches
3. Check Netlify function logs for errors
4. Verify `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` are set

### Preview Mode Not Working

1. Check `sanity-preview` cookie is set
2. Verify `getIsPreviewMode()` returns `true`
3. Check response headers show `no-store`

### Stale Content Persisting

1. Content may be within `stale-while-revalidate` window
2. Try forcing refresh: `curl -H "Cache-Control: no-cache" URL`
3. Manually purge via Netlify dashboard if needed

## Files Reference

| File | Purpose |
|------|---------|
| `src/lib/cache-headers.ts` | Cache header utility and tag constants |
| `src/lib/query-config.ts` | TanStack Query cache presets (client-side) |
| `src/routes/api/webhooks/sanity.tsx` | Webhook for on-demand cache invalidation |
| `src/routes/index.tsx` | Homepage with ISR headers |
| `src/routes/events/index.tsx` | Events list with ISR headers |
| `src/routes/events/$slug.tsx` | Event detail with ISR headers |
| `src/routes/projects/index.tsx` | Projects list with ISR headers |
| `src/routes/projects/$slug.tsx` | Project detail with ISR headers |
| `src/routes/media.tsx` | Media gallery with ISR headers |

## Resources

- [TanStack Start ISR Documentation](https://tanstack.com/start/latest/docs/framework/react/guide/isr)
- [Netlify Caching Overview](https://docs.netlify.com/build/caching/caching-overview/)
- [Netlify Cache Tags and Purge API](https://www.netlify.com/blog/cache-tags-and-purge-api-on-netlify/)
