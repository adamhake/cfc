# Remaining Tasks - Sanity CMS Integration

## 📊 Current Status

### ✅ Completed (Phases 1 & 2)
- [x] Turborepo monorepo structure with 3 workspaces
- [x] Sanity Studio app configured
- [x] Shared sanity-config package with schemas and queries
- [x] Web app Sanity client integration
- [x] PortableText component for rich text rendering
- [x] Events listing page fetches from Sanity (with fallback)
- [x] Event detail page fetches from Sanity (with fallback)
- [x] TypeScript types for Sanity content
- [x] Environment variables configured
- [x] All builds passing
- [x] Node 22 enforced across monorepo

### 🔄 In Progress / Remaining

## Task 1: Create Events Migration Script

**Priority:** High
**Estimated Time:** 2-3 hours
**Dependencies:** Sanity project must be created first

### What It Does
Migrates existing events from `apps/web/src/data/events.ts` to Sanity, including:
- Event metadata (title, date, time, location, etc.)
- Hero images (upload to Sanity Assets)
- Markdown content converted to Portable Text
- Preserves slugs for SEO

### Implementation Steps

1. **Create migration script:** `apps/web/scripts/migrate-events-to-sanity.ts`

```typescript
import { createClient } from '@sanity/client'
import { events } from '../src/data/events'
import { fromMarkdown } from '@sanity/block-tools'
import fs from 'fs/promises'
import path from 'path'

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID!,
  dataset: process.env.VITE_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

async function migrateEvents() {
  for (const event of events) {
    // 1. Upload hero image to Sanity
    const imageAsset = await uploadImageToSanity(event.image.src)

    // 2. Convert markdown to portable text (if exists)
    let bodyContent = null
    if (event.markdownFile) {
      const mdContent = await fs.readFile(
        path.join(__dirname, '../src/data/events', event.markdownFile),
        'utf-8'
      )
      bodyContent = await convertMarkdownToPortableText(mdContent)
    }

    // 3. Create Sanity document
    await sanityClient.create({
      _type: 'event',
      title: event.title,
      slug: { current: event.slug },
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      heroImage: {
        _type: 'image',
        asset: { _ref: imageAsset._id },
        alt: event.image.alt,
      },
      body: bodyContent,
      featured: false,
      publishedAt: new Date().toISOString(),
    })

    console.log(`✓ Migrated: ${event.title}`)
  }
}

async function uploadImageToSanity(imagePath: string) {
  const fullPath = path.join(__dirname, '../../public', imagePath)
  const imageBuffer = await fs.readFile(fullPath)
  return await sanityClient.assets.upload('image', imageBuffer)
}

async function convertMarkdownToPortableText(markdown: string) {
  // Use @sanity/block-tools or a custom converter
  // This is a simplified version - you'll need to add full conversion logic
  return fromMarkdown(markdown)
}

migrateEvents().catch(console.error)
```

2. **Add script to package.json:**
```json
{
  "scripts": {
    "migrate:events": "tsx scripts/migrate-events-to-sanity.ts"
  }
}
```

3. **Install dependencies:**
```bash
npm install --save-dev tsx @sanity/block-tools
```

4. **Run migration:**
```bash
cd apps/web
npm run migrate:events
```

5. **Verify in Studio:**
- Open Studio at http://localhost:3333
- Check that all 6 events are present
- Verify images uploaded correctly
- Check portable text content renders properly

### Edge Cases to Handle
- Duplicate slugs (check before creating)
- Missing images (skip or use placeholder)
- Markdown conversion errors (log and continue)
- API rate limits (add delays between uploads)

---

## Task 2: Create Media Migration Script

**Priority:** Medium
**Estimated Time:** 3-4 hours
**Dependencies:** Task 1 completed

### What It Does
Migrates images from Netlify Blobs to Sanity Assets:
- Fetches all images from Netlify Blobs
- Uploads to Sanity Assets
- Creates `mediaImage` documents
- Preserves metadata (captions, alt text)

### Implementation Steps

1. **Create migration script:** `apps/web/scripts/migrate-media-to-sanity.ts`

```typescript
import { createClient } from '@sanity/client'
import { getStore } from '@netlify/blobs'

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID!,
  dataset: process.env.VITE_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

async function migrateMedia() {
  const store = getStore('media')
  const { blobs } = await store.list()

  for (const blob of blobs) {
    // 1. Get blob metadata
    const metadata = await store.getMetadata(blob.key)

    // 2. Fetch image data
    const imageUrl = store.getURL(blob.key)
    const response = await fetch(imageUrl)
    const imageBuffer = await response.arrayBuffer()

    // 3. Upload to Sanity
    const asset = await sanityClient.assets.upload(
      'image',
      Buffer.from(imageBuffer),
      {
        filename: blob.key,
      }
    )

    // 4. Create mediaImage document
    await sanityClient.create({
      _type: 'mediaImage',
      title: metadata?.caption || blob.key,
      image: {
        _type: 'image',
        asset: { _ref: asset._id },
        alt: metadata?.alt || '',
        caption: metadata?.caption,
      },
      category: 'park-views', // Categorize based on metadata
      featured: false,
      uploadedAt: blob.etag || new Date().toISOString(),
    })

    console.log(`✓ Migrated: ${blob.key}`)
  }
}

migrateMedia().catch(console.error)
```

2. **Add to package.json:**
```json
{
  "scripts": {
    "migrate:media": "tsx scripts/migrate-media-to-sanity.ts"
  }
}
```

3. **Run migration:**
```bash
cd apps/web
npm run migrate:media
```

4. **Update media page route:** `apps/web/src/routes/media.tsx`
```typescript
// Replace Netlify Blobs fetch with Sanity query
import { allMediaImagesQuery } from '@chimborazo/sanity-config'

const mediaQueryOptions = queryOptions({
  queryKey: ['media', 'all'],
  queryFn: () => sanityClient.fetch(allMediaImagesQuery),
})
```

---

## Task 3: Set Up Live Preview (Presentation Tool)

**Priority:** Medium
**Estimated Time:** 2-3 hours
**Dependencies:** Sanity project configured

### What It Does
Enables real-time preview of draft content in the Studio:
- See changes before publishing
- Visual editing with overlays
- Works with the Presentation tool

### Implementation Steps

1. **Install visual editing dependency:**
```bash
cd apps/web
npm install @sanity/visual-editing@^1.8.0
```

2. **Create draft API route:** `apps/web/src/routes/api/draft.tsx`

```typescript
import { createAPIFileRoute } from '@tanstack/react-router'
import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { sanityPreviewClient } from '@/lib/sanity'

export const Route = createAPIFileRoute('/api/draft')({
  GET: async ({ request }) => {
    const { isValid, redirectTo = '/' } = await validatePreviewUrl(
      sanityPreviewClient,
      request.url
    )

    if (!isValid) {
      return new Response('Invalid secret', { status: 401 })
    }

    // Enable draft mode (set cookie or session)
    const response = Response.redirect(redirectTo)
    response.headers.set('Set-Cookie', 'sanity-preview=true; Path=/; HttpOnly')
    return response
  },
})
```

3. **Update Studio config:** `apps/studio/sanity.config.ts`

```typescript
import { presentationTool } from 'sanity/presentation'

export default defineConfig({
  // ... existing config
  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
        draftMode: {
          enable: '/api/draft',
        },
      },
    }),
  ],
})
```

4. **Add visual editing to web app:** `apps/web/src/routes/__root.tsx`

```typescript
import { VisualEditing } from '@sanity/visual-editing/react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const isDraftMode = /* check cookie/session */

  return (
    <>
      <Outlet />
      {isDraftMode && <VisualEditing />}
    </>
  )
}
```

5. **Test:**
- Open Studio
- Click "Presentation" tab
- Select an event
- Edit content and see live preview

---

## Task 4: Create Webhook Handler for Cache Invalidation

**Priority:** High (for production)
**Estimated Time:** 2-3 hours
**Dependencies:** Netlify deployment

### What It Does
Invalidates cached pages when content is published in Sanity:
- Receives webhook from Sanity
- Purges specific pages from Netlify CDN
- Ensures instant content updates

### Implementation Steps

1. **Create webhook function:** `apps/web/netlify/functions/sanity-webhook.ts`

```typescript
import type { Handler } from '@netlify/functions'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

const handler: Handler = async (event) => {
  // 1. Validate webhook signature
  const signature = event.headers[SIGNATURE_HEADER_NAME]
  const isValid = await isValidSignature(
    event.body!,
    signature!,
    process.env.SANITY_WEBHOOK_SECRET!
  )

  if (!isValid) {
    return { statusCode: 401, body: 'Invalid signature' }
  }

  // 2. Parse webhook payload
  const body = JSON.parse(event.body!)
  const { _type, slug } = body

  // 3. Determine which pages to purge
  const pagesToPurge: string[] = []

  if (_type === 'event') {
    pagesToPurge.push('/events')
    if (slug?.current) {
      pagesToPurge.push(`/events/${slug.current}`)
    }
    pagesToPurge.push('/') // Homepage might show featured events
  }

  if (_type === 'mediaImage') {
    pagesToPurge.push('/media')
  }

  // 4. Purge Netlify CDN cache
  await purgeCDNCache(pagesToPurge)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Cache purged',
      pages: pagesToPurge,
    }),
  }
}

async function purgeCDNCache(paths: string[]) {
  // Use Netlify's Purge Cache API
  const response = await fetch(
    `https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}/purge`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NETLIFY_PURGE_TOKEN}`,
      },
      body: JSON.stringify({ paths }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to purge cache')
  }
}

export { handler }
```

2. **Add dependencies:**
```bash
cd apps/web
npm install @sanity/webhook
```

3. **Configure environment variables:**

In Netlify Dashboard:
```env
SANITY_WEBHOOK_SECRET=your_webhook_secret_here
NETLIFY_PURGE_TOKEN=your_purge_token_here
```

4. **Set up webhook in Sanity:**
- Go to [sanity.io/manage](https://sanity.io/manage)
- Select your project
- Navigate to API → Webhooks
- Create new webhook:
  - URL: `https://yoursite.com/.netlify/functions/sanity-webhook`
  - Dataset: production
  - Trigger on: Create, Update, Delete
  - Filter: `_type == "event" || _type == "mediaImage"`
  - Secret: (use same value as `SANITY_WEBHOOK_SECRET`)

5. **Test:**
- Publish an event in Studio
- Check Netlify function logs
- Verify page cache is purged
- Visit page and confirm fresh content

---

## Task 5: Update Netlify Deployment Configuration

**Priority:** High (before production launch)
**Estimated Time:** 1-2 hours
**Dependencies:** All above tasks completed

### What It Does
Configures Netlify for monorepo builds:
- Updates build commands for Turborepo
- Sets correct publish directories
- Configures environment variables
- Sets up edge functions

### Implementation Steps

1. **Update web app netlify.toml:**

```toml
[build]
  command = "cd ../.. && npm run build --filter=@chimborazo/web"
  publish = "apps/web/dist/client"
  functions = "apps/web/.netlify/functions"

[build.environment]
  NODE_VERSION = "22"
  # Sanity env vars set in Netlify Dashboard

[functions]
  directory = "apps/web/.netlify/functions"
  node_bundler = "esbuild"

[[edge_functions]]
  path = "/media-img/*"
  function = "media-image"

# Redirect rules (if needed)
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

2. **Update studio netlify.toml:**

```toml
[build]
  command = "cd ../.. && npm run build --filter=@chimborazo/studio"
  publish = "apps/studio/dist"

[build.environment]
  NODE_VERSION = "22"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. **Create deployment guide:** `DEPLOYMENT.md`

```markdown
# Deployment Guide

## Web App Deployment

1. Create new Netlify site
2. Connect to GitHub repo
3. Configure build settings:
   - Base directory: (leave empty or set to root)
   - Build command: `npm run build --filter=@chimborazo/web`
   - Publish directory: `apps/web/dist/client`
   - Functions directory: `apps/web/.netlify/functions`

4. Set environment variables:
   - `VITE_SANITY_PROJECT_ID`
   - `VITE_SANITY_DATASET`
   - `VITE_SANITY_API_VERSION`
   - `SANITY_API_TOKEN`
   - `SANITY_WEBHOOK_SECRET`
   - `NETLIFY_PURGE_TOKEN`

5. Deploy!

## Studio Deployment

1. Create separate Netlify site
2. Configure build settings:
   - Build command: `npm run build --filter=@chimborazo/studio`
   - Publish directory: `apps/studio/dist`

3. Set environment variables:
   - `SANITY_STUDIO_PROJECT_ID`
   - `SANITY_STUDIO_DATASET`
   - `SANITY_STUDIO_PREVIEW_URL` (your web app URL)

4. Set custom domain (e.g., studio.chimborazopark.org)

5. Update Sanity CORS origins with Studio URL
```

4. **Test deployment:**
- Deploy to staging first
- Verify all environment variables
- Test content updates
- Confirm webhooks work
- Check Studio preview functionality

---

## Testing Checklist

Before considering the integration complete:

### Content Management
- [ ] Can create new events in Studio
- [ ] Can upload images in Studio
- [ ] Can edit existing content
- [ ] Can preview drafts
- [ ] Can publish content
- [ ] Can unpublish content

### Web App
- [ ] Events listing shows Sanity events
- [ ] Event detail pages render correctly
- [ ] Images load from Sanity CDN
- [ ] Portable text renders properly
- [ ] Fallback to static data works (if Sanity fails)
- [ ] SSR works correctly
- [ ] Meta tags are correct

### Webhooks & Performance
- [ ] Publishing triggers webhook
- [ ] Cache is purged correctly
- [ ] Content updates appear within seconds
- [ ] No broken images
- [ ] No console errors

### Deployment
- [ ] Web app builds successfully on Netlify
- [ ] Studio builds successfully on Netlify
- [ ] Environment variables are set
- [ ] Custom domains work
- [ ] CORS is configured
- [ ] Functions deploy correctly

---

## Post-Migration Cleanup

After everything is working:

1. **Remove legacy code:**
```bash
# Delete static event data (keep as backup initially)
mv apps/web/src/data/events.ts apps/web/src/data/events.ts.backup
mv apps/web/src/data/events/ apps/web/src/data/events.backup/

# Remove Netlify Blobs dependencies (after media migration)
npm uninstall @netlify/blobs --workspace=@chimborazo/web

# Delete Netlify Blobs functions
rm apps/web/netlify/functions/get-media.ts
rm apps/web/netlify/functions/upload-media.ts
rm apps/web/netlify/edge-functions/media-image.ts
```

2. **Update documentation:**
- Update README with Sanity workflow
- Document content editing process
- Add troubleshooting guide
- Update CLAUDE.md

3. **Archive migration scripts:**
```bash
mkdir apps/web/scripts/archive
mv apps/web/scripts/migrate-*.ts apps/web/scripts/archive/
```

---

## Support & Resources

### Sanity Help
- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Cheat Sheet](https://www.sanity.io/docs/query-cheat-sheet)
- [Sanity Community Slack](https://slack.sanity.io/)

### Troubleshooting
- Check `INTEGRATION_COMPLETE.md` for common issues
- Review Netlify function logs for webhook errors
- Use Sanity Vision tool to test queries
- Check browser console for client-side errors

### Getting Help
- File issues in GitHub repo
- Check Turborepo docs for build issues
- Review TanStack Query docs for caching questions

---

## Timeline Estimate

| Task | Time | Priority |
|------|------|----------|
| Events migration script | 2-3h | High |
| Run events migration | 30min | High |
| Media migration script | 3-4h | Medium |
| Run media migration | 1h | Medium |
| Live preview setup | 2-3h | Medium |
| Webhook handler | 2-3h | High |
| Deployment config | 1-2h | High |
| Testing & QA | 2-3h | High |
| Cleanup & docs | 1h | Low |

**Total: 14-21 hours** for complete integration

---

## Success Criteria

The integration is complete when:
1. ✅ All 6 events are in Sanity
2. ✅ All media is in Sanity Assets
3. ✅ Web app fetches from Sanity (no fallbacks needed)
4. ✅ Content editors can publish without code deploys
5. ✅ Webhooks trigger cache invalidation
6. ✅ Live preview works in Studio
7. ✅ Both apps deployed to Netlify
8. ✅ Documentation is up to date
9. ✅ Legacy code is removed
10. ✅ Site is faster/better than before! 🚀
