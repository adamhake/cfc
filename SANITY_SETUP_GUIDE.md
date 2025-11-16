# Sanity CMS Integration - Setup Guide

## ✅ Completed Infrastructure

The Turborepo monorepo with Sanity CMS integration is now set up! Here's what's been built:

### 1. Monorepo Structure ✓
- **Turborepo** configured with 3 workspaces
- **apps/web** - Existing website migrated and working
- **apps/studio** - Sanity Studio ready to configure
- **packages/sanity-config** - Shared schemas and utilities

### 2. Sanity Schemas ✓
Defined content models for:
- **Events** - title, slug, description, hero image, date/time, location, body (portable text)
- **Media Images** - image with metadata, categorization, featured flag

### 3. Integration Code ✓
- Sanity client configured in `apps/web/src/lib/sanity.ts`
- Environment variables set up with T3 Env validation
- GROQ queries ready to use
- Image URL builder helpers
- TypeScript types for type-safe CMS integration

### 4. Build System ✓
- All three packages build successfully
- Turborepo caching configured
- Ready for deployment

## 🚧 Next Steps

### **STEP 1: Create Sanity Project**

1. Go to [sanity.io](https://sanity.io) and sign up/login
2. Create a new project:
   - Click "Create new project"
   - Name: "Chimborazo Park Conservancy"
   - Note your **Project ID**
3. Create an API token:
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Select your project
   - Navigate to: **API** → **Tokens**
   - Click "Add API token"
   - Name: "Development Token"
   - Permissions: **Editor** (or Admin)
   - Copy the token (you won't see it again!)

### **STEP 2: Configure Environment Variables**

**For the Web App:**

Create `apps/web/.env`:
```env
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_api_token_here
```

**For the Studio:**

Create `apps/studio/.env`:
```env
SANITY_STUDIO_PROJECT_ID=your_project_id_here
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
```

### **STEP 3: Start the Studio**

```bash
# Install dependencies if needed
pnpm install

# Start the Studio
pnpm --filter @chimborazo/studio dev
```

The Studio will open at http://localhost:3333

### **STEP 4: Configure CORS Origins**

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Navigate to: **API** → **CORS Origins**
4. Add these origins:
   - `http://localhost:3333` (Studio dev)
   - `http://localhost:3000` (Web app dev)
   - Your production Studio URL (later)
   - Your production website URL (later)

### **STEP 5: Add Sample Content**

In the Sanity Studio (http://localhost:3333):

1. **Create your first event:**
   - Click "Event" in the sidebar
   - Click "+ Create new Event"
   - Fill in:
     - Title: "Spring Clean-up 2025"
     - Generate slug from title
     - Description: Brief summary
     - Upload a hero image
     - Set date, time, location
     - Add rich text body content
   - Click "Publish"

2. **Create media images:**
   - Click "Media Image" in the sidebar
   - Upload images from your library
   - Add titles, alt text, captions
   - Categorize them
   - Publish!

## 📋 Remaining Implementation Tasks

### Phase 1: Web App Integration (Next Priority)

1. **Update data fetching** - `apps/web/src/routes/events/index.tsx`
   - Replace static events data with Sanity queries
   - Use TanStack Query for caching

2. **Update event detail pages** - `apps/web/src/routes/events/$slug.tsx`
   - Fetch event by slug from Sanity
   - Render portable text body

3. **Update components**
   - Event card component
   - Image rendering with Sanity image URLs
   - Portable text rendering

### Phase 2: Content Migration

Create migration scripts to move:
- Events from `apps/web/src/data/events.ts` → Sanity
- Media from Netlify Blobs → Sanity Assets

### Phase 3: Advanced Features

1. **Live Preview (Presentation Tool)**
   - Add preview route to web app
   - Configure visual editing overlays
   - Test draft content previews

2. **Webhooks for Cache Invalidation**
   - Create Netlify function handler
   - Configure Sanity webhooks
   - Implement cache purge logic

### Phase 4: Deployment

1. **Deploy Web App to Netlify**
   - Update build command
   - Set environment variables
   - Configure functions

2. **Deploy Studio to Netlify**
   - Create separate site
   - Set custom domain
   - Update CORS origins

## 🎯 Quick Wins

You can start seeing results immediately by:

1. **Start the Studio** and explore the UI:
   ```bash
   pnpm --filter @chimborazo/studio dev
   ```

2. **Add one test event** in the Studio

3. **Test querying it** from the web app:
   ```typescript
   // Add to any route loader
   import { sanityClient } from '@/lib/sanity'
   import { allEventsQuery } from '@chimborazo/sanity-config'

   const events = await sanityClient.fetch(allEventsQuery)
   console.log('Sanity events:', events)
   ```

## 🔍 Architecture Decisions

### Why Turborepo?
- **Shared code** - Schemas and types used by both Studio and web app
- **Incremental builds** - Only rebuild what changed
- **Parallel execution** - Run dev servers simultaneously

### Why This Schema Design?
- **Event body as Portable Text** - Replaces markdown files, more flexible
- **Media categorization** - Better organization than flat blob storage
- **Featured flags** - Easy content curation for homepage

### Content Update Strategy
- **SSR with Sanity CDN** - Fast, globally distributed
- **TanStack Query caching** - 5 min staleTime for good UX
- **Webhooks for instant updates** - Clear cache on publish
- **No full site rebuilds** - Dynamic SSR handles content updates

## 🆘 Troubleshooting

### "Cannot find module '@chimborazo/sanity-config'"
```bash
# Build the shared package
pnpm --filter @chimborazo/sanity-config build
```

### Studio shows "Invalid project ID"
- Check `SANITY_STUDIO_PROJECT_ID` in `apps/studio/.env`
- Verify the project exists at sanity.io/manage

### Web app can't fetch from Sanity
- Check `VITE_SANITY_PROJECT_ID` in `apps/web/.env`
- Ensure CORS origins are configured
- Check browser console for errors

## 📚 Resources

- **Sanity Docs**: https://www.sanity.io/docs
- **GROQ Query Language**: https://www.sanity.io/docs/groq
- **Portable Text**: https://www.portabletext.org/
- **TanStack Query**: https://tanstack.com/query/latest

## ✨ What You Have Now

A modern, professional CMS setup:
- ✅ Type-safe content schemas
- ✅ Real-time collaborative editing
- ✅ Rich text editing with Portable Text
- ✅ Image management with automatic optimization
- ✅ Draft/publish workflow
- ✅ Version history
- ✅ Ready for webhooks and live preview

**The foundation is solid - now it's time to migrate content and connect the dots!** 🚀
