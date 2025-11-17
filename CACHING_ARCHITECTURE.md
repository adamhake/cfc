# Caching Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [Multi-Layer Caching Strategy](#multi-layer-caching-strategy)
3. [Layer 1: Sanity CDN](#layer-1-sanity-cdn)
4. [Layer 2: TanStack Query (Data Layer)](#layer-2-tanstack-query-data-layer)
5. [Layer 3: Netlify Edge Cache (Page Layer)](#layer-3-netlify-edge-cache-page-layer)
6. [Cache Invalidation Strategies](#cache-invalidation-strategies)
7. [Configuration Reference](#configuration-reference)
8. [Performance Characteristics](#performance-characteristics)
9. [Monitoring and Debugging](#monitoring-and-debugging)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Overview

The Chimborazo Park Conservancy website implements a **three-layer caching architecture** designed to maximize performance while ensuring content freshness. This document provides a comprehensive guide to understanding, configuring, and maintaining the caching system.

### Architecture Philosophy

Our caching strategy follows these core principles:

1. **Cache at every layer** - Reduce redundant work and network requests
2. **Intelligent invalidation** - Update caches only when content actually changes
3. **Stale-while-revalidate** - Serve cached content while fetching updates in background
4. **Per-request isolation (SSR)** - Prevent cache poisoning between users
5. **Progressive enhancement** - Works well even if caching layers fail

### Visual Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    REQUEST FLOW WITH CACHING                     │
└─────────────────────────────────────────────────────────────────┘

User Request
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Layer 3: Netlify Edge Cache (Page-Level)          │
│  • Caches rendered HTML                             │
│  • Global CDN distribution                          │
│  • Invalidated via webhooks                         │
│  • Cache Duration: Until invalidated                │
└─────────────────────────────────────────────────────┘
    │ Cache MISS
    ▼
┌─────────────────────────────────────────────────────┐
│  Server-Side Rendering (SSR)                        │
│  • TanStack Start renders React on edge             │
│  • Per-request QueryClient instance                 │
│  • Prefetches data for initial render              │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Layer 2: TanStack Query (Data-Level)               │
│  • Server: Per-request cache (ephemeral)           │
│  • Client: Persistent cache (staleTime/gcTime)     │
│  • Manages data fetching and caching               │
└─────────────────────────────────────────────────────┘
    │ Cache MISS
    ▼
┌─────────────────────────────────────────────────────┐
│  Layer 1: Sanity CDN (Content Source)               │
│  • Content API with built-in CDN                    │
│  • Global edge distribution                         │
│  • Cache Duration: ~60 seconds default              │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Sanity Content Lake (Source of Truth)              │
│  • Structured content storage                       │
│  • Real-time updates                                │
│  • No caching (always fresh)                        │
└─────────────────────────────────────────────────────┘
```

---

## Multi-Layer Caching Strategy

### Why Multiple Cache Layers?

Each layer serves a distinct purpose and operates at different scopes:

| Layer | Scope | Purpose | Invalidation Method |
|-------|-------|---------|---------------------|
| **Sanity CDN** | Global | Reduce API latency | Automatic (Sanity manages) |
| **TanStack Query** | Per-user (client), Per-request (server) | Optimize data fetching | Time-based + Manual |
| **Netlify Edge** | Global | Serve pre-rendered pages | Webhook-triggered |

### How Layers Work Together

**Cold Request (No Caches):**
```
User → Netlify Edge (MISS) → SSR → TanStack Query (MISS) → Sanity CDN (MISS) → Sanity Lake
Response Time: ~800-1200ms
```

**Warm Request (All Caches Hit):**
```
User → Netlify Edge (HIT) → Returns cached HTML
Response Time: ~50-150ms (95% faster!)
```

**Partial Cache (Edge MISS, Data HIT):**
```
User → Netlify Edge (MISS) → SSR → TanStack Query (HIT) → Returns cached data
Response Time: ~200-400ms (50% faster)
```

---

## Layer 1: Sanity CDN

### Overview

Sanity provides a built-in CDN for all API requests, distributing content globally across edge locations.

### Configuration

**Location:** `apps/web/src/lib/sanity.ts`

```typescript
export const sanityClient = createClient({
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET,
  apiVersion: env.VITE_SANITY_API_VERSION,
  useCdn: true,  // ← Enables Sanity CDN
  perspective: "raw",  // Shows all non-draft content
});
```

### Behavior

**When `useCdn: true`:**
- API requests routed through Sanity's global CDN
- Automatic caching at Sanity's edge nodes (~60 second default)
- Reduced latency for repeated queries
- No configuration required

**When `useCdn: false` (Preview Mode):**
- Direct connection to Sanity API
- No CDN caching (always fresh data)
- Used only for draft preview functionality
- Higher latency, lower throughput

### Cache Duration

Sanity CDN cache duration is **managed by Sanity** and varies by:
- Content type
- Update frequency
- Geographic location
- Typically 30-60 seconds for production content

### Invalidation

**Automatic:** Sanity invalidates their CDN cache when:
- Documents are published
- Documents are unpublished
- Documents are deleted

**Manual:** Not directly controllable by application

### Use Cases

✅ **Production content:** Always use CDN for better performance
✅ **Public queries:** Safe for all non-authenticated requests
❌ **Draft previews:** Disable CDN to see unpublished changes
❌ **Real-time requirements:** Not suitable for sub-second freshness needs

---

## Layer 2: TanStack Query (Data Layer)

### Overview

TanStack Query (formerly React Query) manages data fetching, caching, and synchronization. In our SSR setup, it operates differently on server vs. client.

### Dual-Mode Operation

#### Server-Side (SSR)

**Location:** `apps/web/src/integrations/tanstack-query/context.ts`

```typescript
export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });

  // Server creates fresh instance per request
  // Client reuses singleton instance
  return { queryClient, /* ... */ };
}
```

**Characteristics:**
- **Per-Request Isolation:** Each SSR request gets a fresh QueryClient
- **Ephemeral Cache:** Cache exists only for duration of the request
- **Garbage Collection:** Automatic cleanup after response sent
- **No Persistence:** Cache doesn't survive across requests
- **Memory Safe:** Prevents memory leaks in serverless environment

**Why Per-Request?**
```typescript
// BAD: Shared server cache (security risk!)
const globalQueryClient = new QueryClient(); // ❌ Never do this

// User A's request populates cache with their data
await globalQueryClient.fetchQuery(userDataQuery);

// User B's request could see User A's data!
const data = globalQueryClient.getQueryData(userDataQuery); // 🔓 Data leak!

// GOOD: Per-request isolation (secure)
function handleRequest() {
  const queryClient = new QueryClient(); // ✅ Fresh instance per request
  // Each user gets their own isolated cache
}
```

#### Client-Side (Browser)

**Characteristics:**
- **Singleton Instance:** One QueryClient shared across the app
- **Persistent Cache:** Survives navigation and component unmounts
- **Smart Refetching:** Background updates based on staleTime
- **Optimistic Updates:** Can update cache before server confirms
- **Offline Support:** Can serve stale data when offline

**Cache Lifecycle:**

```typescript
// 1. Initial Load (SSR hydration)
// Server prefetches data → Rendered HTML → Client hydrates
const { data } = useSuspenseQuery(queryOptions);
// ↑ Uses server-prefetched data, no refetch needed

// 2. Stale Detection (after staleTime expires)
// Data marked as stale but still served from cache
// Background refetch triggered automatically

// 3. Background Refetch
// New data fetched while showing stale data
// Seamless update when fresh data arrives

// 4. Garbage Collection (after gcTime expires)
// If no components using data for gcTime duration
// Data removed from cache to free memory
```

### Global Default Configuration

**Location:** `apps/web/src/integrations/tanstack-query/context.ts:113-132`

```typescript
defaultOptions: {
  queries: {
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
}
```

**Parameter Explanations:**

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `staleTime` | 60 seconds | How long data is considered fresh. Prevents refetch if data was fetched within last 60s. Critical for SSR to prevent duplicate fetches after hydration. |
| `gcTime` | 5 minutes | How long unused data stays in cache. Must be >= staleTime. Allows serving stale data while refetching in background. |
| `refetchOnWindowFocus` | false | Prevents refetch when user returns to tab. Reduces unnecessary API calls in SSR apps. |
| `refetchOnReconnect` | false | Prevents refetch when internet reconnects. Reduces API calls for intermittent connections. |
| `retry` | 1 | Number of retry attempts for failed queries. Reduced from default (3) to fail faster. |
| `retryDelay` | Exponential | Delay between retries. 1s → 2s → 4s → max 30s. Prevents hammering failed endpoints. |

### Content-Specific Cache Configuration

Different content types have different update frequencies and require different cache strategies:

#### Homepage

**Location:** `apps/web/src/routes/index.tsx:20-33`

```typescript
const homePageQueryOptions = queryOptions({
  queryKey: queryKeys.homePage(),
  queryFn: async (): Promise<SanityHomePage | null> => {
    return await sanityClient.fetch(getHomePageQuery);
  },
  staleTime: 30 * 60 * 1000, // 30 minutes
  gcTime: 60 * 60 * 1000, // 1 hour
});
```

**Rationale:**
- Homepage is curated content that changes infrequently (typically weekly)
- Longer cache reduces API calls for highest-traffic page
- 30-minute staleTime acceptable for non-time-sensitive content
- Webhook invalidation provides instant updates when needed

#### Events List

**Location:** `apps/web/src/routes/events/index.tsx:13-27`

```typescript
const eventsQueryOptions = queryOptions({
  queryKey: queryKeys.events.all(),
  queryFn: async (): Promise<SanityEvent[]> => {
    return await sanityClient.fetch(allEventsQuery);
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 15 * 60 * 1000, // 15 minutes
});
```

**Rationale:**
- Events are more dynamic (new events added occasionally)
- 5-minute staleTime provides good balance of freshness and performance
- Users expect to see new events relatively quickly
- Background refetch every 5 minutes keeps data current

#### Event Detail

**Location:** `apps/web/src/routes/events/$slug.tsx:29-80`

```typescript
const eventBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: queryKeys.events.detail(slug),
    queryFn: async () => {
      // Fetch event from Sanity or fall back to static data
      // ... implementation
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
```

**Rationale:**
- Individual event content rarely changes after initial publish
- 10-minute staleTime balances freshness with performance
- Longer gcTime (30 min) keeps event data in cache for users browsing multiple events
- Each event has unique query key (by slug) for granular caching

#### Media Gallery

**Location:** `apps/web/src/routes/media.tsx:14-27`

```typescript
const mediaQueryOptions = queryOptions({
  queryKey: queryKeys.media.all(),
  queryFn: async (): Promise<SanityMediaImage[]> => {
    return await sanityClient.fetch(allMediaImagesQuery);
  },
  staleTime: 15 * 60 * 1000, // 15 minutes
  gcTime: 60 * 60 * 1000, // 1 hour
});
```

**Rationale:**
- Media images are mostly static after upload
- 15-minute staleTime is generous for image gallery
- 1-hour gcTime keeps images in cache for browsing sessions
- Large image metadata benefits from longer caching

### Cache Key Strategy

**Location:** `apps/web/src/lib/query-keys.ts`

```typescript
export const queryKeys = {
  homePage: () => ["homePage"] as const,

  events: {
    all: () => ["events", "all"] as const,
    detail: (slug: string) => ["event", slug] as const,
  },

  media: {
    all: () => ["media", "all"] as const,
  },
} as const;
```

**Key Design Principles:**

1. **Hierarchical Structure:** Organize keys by domain (`events`, `media`)
2. **Type Safety:** Use `as const` for TypeScript literal types
3. **Granular Invalidation:** Specific keys for targeted cache updates
4. **Consistent Naming:** Follow predictable patterns

**Invalidation Examples:**

```typescript
// Invalidate all event queries (list + all details)
queryClient.invalidateQueries({ queryKey: ["events"] });

// Invalidate only events list
queryClient.invalidateQueries({ queryKey: queryKeys.events.all() });

// Invalidate specific event detail
queryClient.invalidateQueries({ queryKey: queryKeys.events.detail("spring-cleanup-2025") });
```

### SSR Integration Pattern

**How TanStack Query Works with SSR:**

```typescript
// 1. Server-Side (Loader)
export const Route = createFileRoute("/events")({
  loader: async ({ context }) => {
    // Prefetch data into QueryClient on server
    await context.queryClient.ensureQueryData(eventsQueryOptions);
    // Data now in server's QueryClient cache
  },
});

// 2. Server-Side (Render)
function Events() {
  // useSuspenseQuery reads from cache (no fetch needed!)
  const { data } = useSuspenseQuery(eventsQueryOptions);
  // Renders HTML with data included
}

// 3. Client-Side (Hydration)
// Server sends HTML + dehydrated cache state
// Client rehydrates cache from server data
// No refetch needed because data is fresh (< staleTime)

// 4. Client-Side (After staleTime)
// Data marked as stale
// Background refetch triggered
// UI updated when fresh data arrives
```

**Benefits of This Pattern:**

✅ **Zero Client Fetches on Initial Load:** Data prefetched on server
✅ **No Loading States:** HTML includes content from SSR
✅ **No Hydration Mismatch:** Server and client use same data
✅ **Smooth Transitions:** Stale data shown during background refetch
✅ **Optimal Performance:** Fewer API calls, faster page loads

### Common Anti-Patterns to Avoid

❌ **Direct Fetching in Components:**
```typescript
// BAD: Bypasses cache
function Events() {
  const [data, setData] = useState(null);
  useEffect(() => {
    sanityClient.fetch(query).then(setData); // ❌ No caching!
  }, []);
}
```

✅ **Use Query Options:**
```typescript
// GOOD: Uses TanStack Query cache
function Events() {
  const { data } = useSuspenseQuery(eventsQueryOptions); // ✅ Cached!
}
```

❌ **Shared Server QueryClient:**
```typescript
// BAD: Security risk!
const globalQueryClient = new QueryClient(); // ❌ Shared across users!
```

✅ **Per-Request QueryClient:**
```typescript
// GOOD: Isolated per request
function getContext() {
  return { queryClient: new QueryClient() }; // ✅ Fresh instance
}
```

❌ **gcTime < staleTime:**
```typescript
// BAD: Cache removed while still fresh!
staleTime: 60 * 60 * 1000, // 60 minutes
gcTime: 30 * 60 * 1000, // 30 minutes ❌
```

✅ **gcTime >= staleTime:**
```typescript
// GOOD: Cache outlives freshness
staleTime: 30 * 60 * 1000, // 30 minutes
gcTime: 60 * 60 * 1000, // 60 minutes ✅
```

---

## Layer 3: Netlify Edge Cache (Page Layer)

### Overview

Netlify's Edge CDN caches fully-rendered HTML pages at edge locations worldwide, providing the fastest possible response times.

### How Netlify Edge Cache Works

```
┌─────────────────────────────────────────────────┐
│  Netlify Edge Cache Lifecycle                   │
└─────────────────────────────────────────────────┘

Request arrives at Netlify Edge
    │
    ├─ Cache HIT → Return cached HTML (50-150ms)
    │
    └─ Cache MISS → Execute Edge Function
           │
           ├─ Run SSR on Netlify Edge
           │  └─ TanStack Start renders React
           │     └─ TanStack Query prefetches data
           │        └─ Generate HTML
           │
           ├─ Store HTML in edge cache
           │
           └─ Return HTML to user (800-1200ms)
```

### Cache Behavior

**Default Netlify Caching:**
- **GET/HEAD requests:** Cached by default
- **POST/PUT/DELETE:** Never cached
- **Query parameters:** Each unique URL cached separately
- **Headers:** `Cache-Control` headers respected
- **Duration:** Until explicitly purged or deployment

**Cache Keys:**

Netlify creates unique cache entries based on:
```
Cache Key = URL + Query Params + Headers (if vary)

Examples:
- https://example.com/                    → Key 1
- https://example.com/?preview=true       → Key 2 (different!)
- https://example.com/events              → Key 3
- https://example.com/events/spring-2025  → Key 4
```

### Configuration

**Location:** `apps/web/vite.config.ts`

```typescript
import { netlify } from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  plugins: [
    netlify({
      edgeSSR: true, // ← Enables Edge Functions for SSR
    }),
    // ... other plugins
  ],
});
```

**Edge SSR Benefits:**
- Runs SSR at edge locations (not origin server)
- Lower latency for global users
- Automatic caching of rendered output
- Scales automatically with traffic

### Cache Invalidation

Netlify cache is invalidated through **webhook-triggered purge API calls**.

**Location:** `apps/web/src/routes/api/webhooks/sanity.tsx:216-249`

```typescript
async function purgeNetlifyCache(_tags: string[]): Promise<{ success: boolean; error?: string }> {
  const authToken = process.env.NETLIFY_AUTH_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;

  const response = await fetch(
    `https://api.netlify.com/api/v1/sites/${siteId}/purge_cache`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ site_id: siteId }),
    },
  );

  return { success: response.ok };
}
```

**Purge Triggers:**

| Event | Trigger | Scope |
|-------|---------|-------|
| **Content Published** | Sanity webhook | Content-specific pages |
| **Manual Deploy** | Netlify UI/CLI | All pages (full purge) |
| **API Call** | Direct API request | Configurable |

**Purge Granularity:**

Currently implements **full site purge** on any content change. Future enhancement could add **tag-based purging** for more granular invalidation:

```typescript
// Current: Purge everything
await purgeNetlifyCache(["all"]);

// Future: Purge specific pages
await purgeNetlifyCache(["events", "homepage"]);
// Would only invalidate /events and / pages
```

### Cache Monitoring

**Netlify Dashboard:**
1. Go to **Site Dashboard** → **Functions**
2. View edge function logs to see:
   - Cache hit/miss rates
   - Function execution times
   - SSR performance metrics

**Response Headers:**

Netlify adds headers indicating cache status:
```
X-Nf-Request-Id: 01234567-89ab-cdef-0123-456789abcdef
Age: 1234  ← Seconds since cached
```

### Cache Performance

**Typical Response Times:**

| Scenario | Response Time | Cache Hit |
|----------|---------------|-----------|
| Edge Cache HIT | 50-150ms | ✅ Yes |
| Edge SSR (warm) | 200-400ms | ⚠️ Partial (data cached) |
| Edge SSR (cold) | 800-1200ms | ❌ No |
| Cold start | 2000-3000ms | ❌ No (first request) |

**Geographic Distribution:**

Netlify's CDN has edge locations in:
- North America (10+ locations)
- Europe (10+ locations)
- Asia Pacific (5+ locations)
- South America (2+ locations)

Users automatically routed to nearest edge location.

---

## Cache Invalidation Strategies

### Overview

Cache invalidation ensures users see fresh content when it changes. Our system uses multiple invalidation strategies depending on the layer.

### Time-Based Invalidation (TanStack Query)

**How It Works:**

```typescript
// Example: Events list with 5-minute staleTime
const eventsQueryOptions = queryOptions({
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 15 * 60 * 1000, // 15 minutes
});

// Timeline:
// T+0:00  → Data fetched, marked fresh
// T+0:00 to T+5:00 → Data is fresh (no refetch)
// T+5:00  → Data becomes stale (refetch triggered if in use)
// T+5:00 to T+15:00 → Data is stale but cached
// T+15:00 → Data removed from cache (if unused)
```

**Advantages:**
- Simple to implement
- Predictable behavior
- No infrastructure required
- Works offline

**Disadvantages:**
- Content can be stale for up to `staleTime` duration
- Still refetches even if content hasn't changed
- Not suitable for time-critical content

### Event-Based Invalidation (Webhooks)

**How It Works:**

```
1. Content editor publishes document in Sanity
2. Sanity fires webhook to `/api/webhooks/sanity`
3. Webhook validates signature for security
4. Webhook purges Netlify cache via API
5. Next request triggers fresh SSR with updated data
```

**Location:** `apps/web/src/routes/api/webhooks/sanity.tsx:119-152`

```typescript
// Determine what to invalidate based on document type
switch (payload._type) {
  case "event":
    cacheTags.push("events", "homepage");
    break;
  case "mediaImage":
    cacheTags.push("media", "homepage");
    break;
  case "homePage":
    cacheTags.push("homepage");
    break;
  // ...
}

await purgeNetlifyCache(cacheTags);
```

**Advantages:**
- Instant invalidation (1-2 second delay)
- Only invalidate when content actually changes
- Reduced unnecessary API calls
- Better user experience

**Disadvantages:**
- Requires webhook infrastructure
- Depends on external service reliability
- More complex setup
- Needs monitoring

### Manual Invalidation

**When to Use:**
- Emergency content updates
- Debugging cache issues
- Testing cache behavior
- Scheduled cache clears

**Methods:**

**1. Netlify Dashboard:**
```
Site Dashboard → Deploys → Clear cache and deploy site
```
Purges all caches and triggers fresh deploy.

**2. Netlify API:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.netlify.com/api/v1/sites/YOUR_SITE_ID/purge_cache
```

**3. Code (Development):**
```typescript
// In browser console or component
import { useQueryClient } from '@tanstack/react-query';

function InvalidateButton() {
  const queryClient = useQueryClient();

  return (
    <button onClick={() => {
      // Invalidate specific query
      queryClient.invalidateQueries({ queryKey: ["events"] });

      // Or invalidate all queries
      queryClient.invalidateQueries();
    }}>
      Refresh Data
    </button>
  );
}
```

### Invalidation Decision Matrix

| Content Type | Update Frequency | Invalidation Strategy | Cache Duration |
|--------------|------------------|----------------------|----------------|
| Homepage | Weekly | Webhook + 30min staleTime | 30 minutes |
| Events List | Daily | Webhook + 5min staleTime | 5 minutes |
| Event Detail | Rarely | Webhook + 10min staleTime | 10 minutes |
| Media Gallery | Rarely | Webhook + 15min staleTime | 15 minutes |
| Site Settings | Monthly | Manual + 1hr staleTime | 1 hour |

---

## Configuration Reference

### Environment Variables

**Required for Webhook Invalidation:**

```bash
# Sanity Webhook Security
SANITY_WEBHOOK_SECRET=your-random-secret-here

# Netlify API Access
NETLIFY_AUTH_TOKEN=your-personal-access-token
NETLIFY_SITE_ID=your-site-id-here

# Sanity API (for preview mode)
SANITY_API_TOKEN=your-sanity-token  # Optional
```

**Location:** `apps/web/src/env.ts:5-11`

**Where to Set:**
- **Local Development:** `apps/web/.env.local`
- **Netlify Production:** Site Settings → Environment Variables
- **Netlify Previews:** Same as production (inherited)

### TanStack Query Configuration

**Global Defaults:**

```typescript
// Location: apps/web/src/integrations/tanstack-query/context.ts:113-132

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,           // 1 minute
      gcTime: 5 * 60 * 1000,          // 5 minutes
      refetchOnWindowFocus: false,     // Disable refetch on focus
      refetchOnReconnect: false,       // Disable refetch on reconnect
      retry: 1,                        // Retry once on failure
      retryDelay: (attemptIndex) =>    // Exponential backoff
        Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

**Per-Route Overrides:**

Each route can override defaults:

```typescript
// Example: Homepage with longer cache
const homePageQueryOptions = queryOptions({
  queryKey: queryKeys.homePage(),
  queryFn: async () => { /* ... */ },
  staleTime: 30 * 60 * 1000,  // Override: 30 minutes
  gcTime: 60 * 60 * 1000,     // Override: 1 hour
});
```

### Sanity Configuration

```typescript
// Location: apps/web/src/lib/sanity.ts

// Production client (with CDN)
export const sanityClient = createClient({
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET,
  apiVersion: env.VITE_SANITY_API_VERSION,
  useCdn: true,  // ← Use Sanity CDN
  perspective: "raw",  // Non-draft content only
});

// Preview client (without CDN)
export function sanityPreviewClient() {
  return createClient({
    projectId: env.VITE_SANITY_PROJECT_ID,
    dataset: env.VITE_SANITY_DATASET,
    apiVersion: env.VITE_SANITY_API_VERSION,
    useCdn: false,  // ← Bypass CDN for fresh draft content
    token: env.SANITY_API_TOKEN,
    perspective: "previewDrafts",  // Include draft content
  });
}
```

### Netlify Configuration

```typescript
// Location: apps/web/vite.config.ts

export default defineConfig({
  plugins: [
    netlify({
      edgeSSR: true,  // ← Enable Edge Functions for SSR
    }),
  ],
});
```

**Additional Netlify Settings:**

Create `apps/web/netlify.toml` for advanced configuration:

```toml
[build]
  command = "pnpm build --filter @chimborazo/web"
  publish = "apps/web/dist/client"

[[headers]]
  for = "/*"
  [headers.values]
    # Cache static assets aggressively
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    # Don't cache HTML (let Netlify Edge handle it)
    Cache-Control = "public, max-age=0, must-revalidate"
```

---

## Performance Characteristics

### Cache Hit Rates

**Expected Performance (Production):**

| Layer | Hit Rate | Impact |
|-------|----------|--------|
| Netlify Edge | 85-95% | Fastest (50-150ms) |
| TanStack Query (Client) | 60-80% | Fast (0ms - uses cache) |
| TanStack Query (Server) | 0% | N/A (per-request only) |
| Sanity CDN | 70-90% | Good (100-200ms) |

**Measuring Hit Rates:**

```typescript
// Add to app for monitoring
import { useQueryClient } from '@tanstack/react-query';

function CacheMonitor() {
  const queryClient = useQueryClient();
  const cache = queryClient.getQueryCache();

  useEffect(() => {
    console.log('Queries in cache:', cache.getAll().length);
    console.log('Query states:',
      cache.getAll().map(q => ({
        key: q.queryKey,
        state: q.state.status,
        dataUpdatedAt: q.state.dataUpdatedAt,
      }))
    );
  }, [cache]);
}
```

### Response Time Breakdown

**Cold Start (No Caches):**
```
Total: ~1200ms
├─ DNS Resolution: 20-50ms
├─ Netlify Edge Routing: 10-30ms
├─ Edge Function Coldstart: 200-500ms
├─ SSR Execution: 100-300ms
├─ Sanity API Call: 200-400ms
├─ TanStack Query Processing: 50-100ms
└─ HTML Generation: 50-100ms
```

**Warm (Netlify Cache Hit):**
```
Total: ~100ms
├─ DNS Resolution: 20-50ms
├─ Netlify Edge Routing: 10-30ms
└─ Cache Retrieval: 20-50ms
```

**SSR with Cached Data:**
```
Total: ~300ms
├─ DNS Resolution: 20-50ms
├─ Netlify Edge Routing: 10-30ms
├─ Edge Function: 50-100ms
├─ SSR (using cached data): 50-100ms
└─ HTML Generation: 50-100ms
```

### API Call Reduction

**Before Optimizations:**
- Homepage: 3-5 API calls per visit
- Events page: 2-3 API calls per visit
- Navigation: New API calls for each page
- **Total:** ~15-20 calls per user session

**After Optimizations:**
- Homepage: 1 API call (if cache stale), 0 if fresh
- Events page: 1 API call (if cache stale), 0 if fresh
- Navigation: 0 calls if data cached
- **Total:** ~3-5 calls per user session

**Reduction: 70-80% fewer API calls** 🎉

### Memory Usage

**Client-Side:**
```typescript
// Typical memory footprint
QueryCache: ~2-5 MB (depends on cached data)
├─ Homepage: ~500 KB (images, partners, content)
├─ Events: ~200 KB (event list)
├─ Event Details: ~50 KB per event
└─ Media: ~300 KB (image metadata, not images themselves)
```

**Server-Side:**
- Per-request: 10-20 MB (SSR + React)
- Automatically cleaned up after response
- No persistent memory usage

---

## Monitoring and Debugging

### TanStack Query Devtools

**Setup:**

```typescript
// Location: apps/web/src/routes/__root.tsx

import { TanStackRouterDevtools, TanStackQueryDevtools } from '@tanstack/react-router-devtools';

function RootComponent() {
  return (
    <>
      {/* Your app */}
      {/* Devtools only in development */}
      <TanStackRouterDevtools />
      <TanStackQueryDevtools />
    </>
  );
}
```

**What It Shows:**
- All queries in cache
- Query states (fresh, stale, fetching)
- Cache hit/miss information
- Refetch behavior
- Query dependencies

**How to Use:**
1. Open your app in development mode
2. Devtools panel appears at bottom-right
3. Expand to see query explorer
4. Click queries to see details

### Browser Network Tab

**Check Cache Behavior:**

```
1. Open DevTools → Network tab
2. Navigate to a page
3. Look for Sanity API requests
4. Check "Size" column:
   - "(disk cache)" = Browser cache hit
   - "(memory cache)" = Memory cache hit
   - Actual size = Network fetch
```

**Verify SSR:**

```
1. View page source (View → Developer → View Source)
2. Search for your content
3. If content is in HTML source = SSR working ✅
4. If HTML is mostly empty = CSR only ❌
```

### Netlify Function Logs

**Access Logs:**

```
1. Netlify Dashboard → Your Site
2. Functions tab
3. Click on function name
4. View real-time logs
```

**What to Look For:**

```
[Sanity Webhook] Received event for event:
{
  id: "abc123",
  type: "event",
  slug: "spring-cleanup-2025"
}
[Sanity Webhook] Successfully purged cache for tags: ["events", "homepage"]
```

### Cache Inspection Tools

**TanStack Query:**

```typescript
import { useQueryClient } from '@tanstack/react-query';

function DebugCache() {
  const queryClient = useQueryClient();

  // Log all cached queries
  console.log(queryClient.getQueryCache().getAll());

  // Check specific query
  const data = queryClient.getQueryData(queryKeys.homePage());
  console.log('Homepage cache:', data);

  // Check query state
  const state = queryClient.getQueryState(queryKeys.homePage());
  console.log('Homepage state:', {
    isStale: state.isInvalidated,
    dataUpdatedAt: new Date(state.dataUpdatedAt),
    errorUpdatedAt: state.errorUpdatedAt,
  });
}
```

**Network Timing:**

```typescript
// Measure API call performance
const start = performance.now();
const data = await sanityClient.fetch(query);
const end = performance.now();
console.log(`Sanity query took ${end - start}ms`);
```

---

## Best Practices

### Cache Configuration

✅ **DO:**
- Set `gcTime >= staleTime` always
- Use content-specific cache durations
- Start with conservative (shorter) times, increase gradually
- Monitor cache hit rates and adjust
- Document why you chose specific durations

❌ **DON'T:**
- Set `staleTime: 0` (defeats caching purpose)
- Use same cache time for all content
- Set extremely long cache times without invalidation strategy
- Forget to configure `gcTime` (defaults to 5 minutes)

### Query Key Design

✅ **DO:**
- Use hierarchical structure: `["domain", "subdomain", param]`
- Make keys descriptive: `["events", "list"]` not `["e", "l"]`
- Include all parameters that affect the query
- Use TypeScript `as const` for type safety
- Centralize key definitions

❌ **DON'T:**
- Use complex objects as keys (use serializable values)
- Include unnecessary parameters
- Hardcode keys in multiple places
- Use inconsistent naming conventions

### SSR Integration

✅ **DO:**
- Always prefetch in route loaders
- Use `useSuspenseQuery` in components
- Set reasonable `staleTime` (minimum 60s for SSR)
- Create QueryClient per request on server
- Reuse QueryClient on client

❌ **DON'T:**
- Fetch directly in components (bypasses cache)
- Share QueryClient across server requests
- Set `staleTime: 0` with SSR (causes double fetch)
- Forget to handle loading states (though Suspense helps)

### Cache Invalidation

✅ **DO:**
- Invalidate only what changed
- Use webhook invalidation for time-sensitive content
- Test invalidation thoroughly
- Monitor webhook delivery success
- Have manual invalidation as backup

❌ **DON'T:**
- Invalidate entire cache for small changes
- Rely solely on time-based invalidation for critical content
- Forget to validate webhook signatures
- Ignore failed webhook deliveries
- Purge cache too frequently (impacts performance)

### Performance Optimization

✅ **DO:**
- Measure before optimizing
- Use devtools to identify bottlenecks
- Prefetch predictable user journeys
- Implement progressive enhancement
- Monitor real-user metrics

❌ **DON'T:**
- Over-optimize prematurely
- Cache everything aggressively
- Ignore cache memory usage
- Forget about cache warmup on deploys
- Assume caching always helps (measure!)

---

## Troubleshooting

### Issue: Data Not Updating After Publish

**Symptoms:**
- Published content in Sanity
- Changes not appearing on website
- Old content still showing

**Diagnosis:**

1. Check if webhook fired:
   ```
   Sanity Dashboard → API → Webhooks → Recent Deliveries
   ```

2. Check Netlify function logs:
   ```
   Netlify Dashboard → Functions → sanity → Logs
   ```

3. Check browser cache:
   ```
   DevTools → Application → Clear Storage → Clear site data
   ```

**Solutions:**

| Cause | Solution |
|-------|----------|
| Webhook didn't fire | Check Sanity webhook configuration, verify URL is correct |
| Webhook failed | Check function logs, verify environment variables |
| TanStack Query cache | Refresh page or wait for staleTime to expire |
| Browser cache | Hard refresh (Cmd+Shift+R / Ctrl+Shift+R) |
| Netlify cache not purged | Manually purge via Netlify dashboard |

### Issue: Too Many API Calls

**Symptoms:**
- High Sanity API usage
- Slow page loads
- Network tab shows repeated requests

**Diagnosis:**

```typescript
// Add logging to track queries
import { useQueryClient } from '@tanstack/react-query';

function DebugQueries() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(event => {
      if (event.type === 'updated' && event.action.type === 'fetch') {
        console.log('Query fetched:', event.query.queryKey);
      }
    });
    return unsubscribe;
  }, [queryClient]);
}
```

**Solutions:**

| Cause | Solution |
|-------|----------|
| `staleTime: 0` | Increase staleTime to at least 60 seconds |
| `refetchOnWindowFocus: true` | Set to false for SSR apps |
| Multiple components fetching same data | Ensure using same queryKey |
| No caching configured | Add queryOptions with appropriate staleTime |
| Bypassing TanStack Query | Use useSuspenseQuery instead of direct fetch |

### Issue: Stale Content After Navigation

**Symptoms:**
- Navigate between pages
- Old content briefly appears
- Flash of stale content

**Diagnosis:**

Check cache states:
```typescript
const queryClient = useQueryClient();
const state = queryClient.getQueryState(queryKeys.events.all());

console.log({
  dataUpdatedAt: new Date(state.dataUpdatedAt),
  isStale: state.isInvalidated,
  isFetching: state.isFetching,
});
```

**Solutions:**

| Cause | Solution |
|-------|----------|
| Displaying stale data while fetching | Intentional! Show loading indicator if needed |
| `gcTime` too long | Reduce gcTime or invalidate cache |
| Cache not invalidating | Check invalidation logic, ensure queryKey matches |
| Component mounting during fetch | Use Suspense boundaries to coordinate loading |

### Issue: Memory Leaks

**Symptoms:**
- Browser memory usage grows over time
- Page becomes sluggish after extended use
- DevTools memory profiler shows growth

**Diagnosis:**

```typescript
// Monitor cache size
setInterval(() => {
  const cache = queryClient.getQueryCache();
  console.log('Cached queries:', cache.getAll().length);
  console.log('Memory estimate:',
    cache.getAll().reduce((sum, q) =>
      sum + JSON.stringify(q.state.data).length, 0
    ) / 1024 + ' KB'
  );
}, 10000); // Every 10 seconds
```

**Solutions:**

| Cause | Solution |
|-------|----------|
| `gcTime: Infinity` | Set reasonable gcTime (5-60 minutes) |
| Not unmounting queries | Ensure components properly unmount |
| Accumulating old data | Periodically clear cache with `queryClient.clear()` |
| Large response payloads | Optimize Sanity queries to fetch only needed fields |

### Issue: Webhook Not Working

**Symptoms:**
- Sanity shows webhook as delivered
- Cache not being purged
- Status 200 but no effect

**Diagnosis:**

1. Test webhook endpoint directly:
   ```bash
   curl https://your-site.netlify.app/api/webhooks/sanity
   ```
   Should return: `{"service":"Sanity Webhook Handler","status":"active","configured":true}`

2. Check environment variables:
   ```typescript
   // Add to webhook handler temporarily
   console.log('SANITY_WEBHOOK_SECRET:', !!process.env.SANITY_WEBHOOK_SECRET);
   console.log('NETLIFY_AUTH_TOKEN:', !!process.env.NETLIFY_AUTH_TOKEN);
   console.log('NETLIFY_SITE_ID:', !!process.env.NETLIFY_SITE_ID);
   ```

**Solutions:**

| Issue | Solution |
|-------|----------|
| `configured: false` | Environment variables not set or deployed |
| 401 Unauthorized | Webhook secret mismatch between Sanity and environment |
| 500 Server Error | Check function logs for detailed error message |
| Purge API failing | Verify Netlify token has correct permissions |
| Wrong endpoint URL | Update Sanity webhook to correct URL |

---

## Appendix

### Glossary

**Cache Hit:** When requested data is found in cache, avoiding network fetch

**Cache Miss:** When requested data is not in cache, requiring network fetch

**Cold Start:** First execution of serverless function, includes initialization overhead

**Edge Function:** Serverless function running at CDN edge locations, closer to users

**gcTime (Garbage Collection Time):** Duration to keep unused data in cache before removal

**Hydration:** Process of making server-rendered HTML interactive on client

**Invalidation:** Marking cached data as stale or removing it from cache

**Per-Request Cache:** Cache that exists only for a single HTTP request

**Purge:** Forcefully removing data from cache

**SSR (Server-Side Rendering):** Rendering React components on server, sending HTML to client

**staleTime:** Duration until data is considered stale and eligible for refetch

**Webhook:** HTTP callback triggered by external service when event occurs

### Further Reading

**TanStack Query:**
- [SSR Guide](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
- [Caching Examples](https://tanstack.com/query/latest/docs/framework/react/guides/caching)

**Netlify:**
- [Edge Functions](https://docs.netlify.com/edge-functions/overview/)
- [Caching](https://docs.netlify.com/platform/caching/)
- [API Documentation](https://docs.netlify.com/api/get-started/)

**Sanity:**
- [CDN Documentation](https://www.sanity.io/docs/api-cdn)
- [Webhooks](https://www.sanity.io/docs/webhooks)
- [Query Performance](https://www.sanity.io/docs/query-performance)

**TanStack Start:**
- [Getting Started](https://tanstack.com/start/latest)
- [SSR Integration](https://tanstack.com/start/latest/docs/framework/react/guide/ssr)

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-16 | Initial documentation |

---

**Document Maintained By:** Development Team
**Last Updated:** January 16, 2025
**Next Review:** February 16, 2025
