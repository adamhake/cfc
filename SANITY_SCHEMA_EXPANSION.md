# Sanity Schema Expansion - Implementation Complete

## Summary

Successfully implemented a hybrid approach for Sanity CMS integration with **6 new schemas** (4 new + 2 existing) that balances simplicity with flexibility.

## What Was Built

### 1. Schemas Created (packages/sanity-config/src/schemas/)

#### Page Singletons (page-specific content):
- **`siteSettings.ts`** - Global site configuration
  - Organization name, description, contact info
  - Park address and hours
  - Social media links (Facebook, Instagram)
  - Donation form URL
  - Meta defaults (OG image, site title)

- **`homePage.ts`** - All homepage content
  - Hero section (heading, subheading, image, CTA)
  - Vision pillars array (title, icon, description, order)
  - Featured partners (references to partner documents)
  - Featured quote (reference to quote document)
  - Homepage gallery (reference to gallery document)

- **`amenitiesPage.ts`** - All amenities page content
  - Page hero (title, description, image)
  - Introduction (portable text)
  - Amenities array (title, icon, description, details, image, section, order)

#### Reusable Document Types (content used across pages):
- **`partner.ts`** - Partner organizations
  - Name, slug, logo, description, website URL
  - Featured flag, display order

- **`quote.ts`** - Inspirational quotes
  - Quote text, attribution, background image
  - Featured flag, category (nature, community, conservation, history)

- **`gallery.ts`** - Image galleries
  - Title, gallery type (homepage, amenities, events, about)
  - Images array (image, alt, caption, showOnMobile)
  - Display order

### 2. Studio Structure Configuration (apps/studio/sanity.config.ts)

Organized content into logical groups:
- **Settings** group (Site Settings singleton)
- **Pages** group (Homepage, Amenities Page singletons)
- **Content types** (Events, Partners, Quotes, Gallery, Media)

Singletons are filtered from the main list and only allow one instance each.

### 3. GROQ Queries Created (packages/sanity-config/src/queries/)

All queries use modern `defineQuery` from 'groq' for automatic type inference:

- **siteSettings.ts** - `getSiteSettingsQuery`
- **homePage.ts** - `getHomePageQuery` (with expanded references)
- **amenitiesPage.ts** - `getAmenitiesPageQuery`, `getAmenitiesBySectionQuery`
- **partners.ts** - `getPartnersQuery`, `getFeaturedPartnersQuery`, `getPartnerBySlugQuery`
- **quotes.ts** - `getQuotesQuery`, `getFeaturedQuoteQuery`, `getQuotesByCategoryQuery`
- **gallery.ts** - `getGalleriesQuery`, `getGalleryByTypeQuery`, `getGalleryByIdQuery`

### 4. TypeScript Types Generated

- Generated types for 19 schema types and 13 GROQ queries
- Located in `packages/sanity-config/src/sanity.types.ts`
- Exported from package index for use in web app
- Configured via `apps/studio/sanity-typegen.json`

## Benefits of This Approach

✅ **Simplified Content Management**
- Edit all homepage content in one place
- Edit all amenities in one place
- Fewer schemas to manage (6 instead of 10+)

✅ **Maintained Flexibility**
- Partners reusable across pages via references
- Quotes reusable across pages via references
- Galleries reusable across pages via references
- Individual revision history for reusable content

✅ **Better Editor UX**
- Logical grouping in Studio (Settings → Pages → Content)
- Page-level editing for page-specific content
- Clear structure with icons for easy navigation

✅ **Performance**
- Fewer queries needed (one per page)
- References expanded in single GROQ query
- Efficient data fetching with TanStack Query

## Next Steps

### Phase 1: Populate Content in Sanity Studio

1. **Start the Studio**
   ```bash
   pnpm dev --filter @chimborazo/studio
   ```
   Visit http://localhost:3333

2. **Populate Singletons (Settings → Site Settings)**
   - Organization Name: "Chimborazo Park Conservancy"
   - Alternative Name: "Friends of Chimborazo Park"
   - Description: "A 501(c)(3) non-profit dedicated to preserving and enhancing Chimborazo Park in Richmond, VA's Church Hill neighborhood."
   - Park Address: "3215 E. Broad St, Richmond, VA 23223"
   - Park Hours: "Dawn to Dusk"
   - Social Media:
     - Facebook: https://www.facebook.com/friendsofchimborazopark
     - Instagram: https://www.instagram.com/friendsofchimborazopark/
   - Donation URL: https://www.zeffy.com/embed/donation-form/general-donation-125?modal=true

3. **Populate Homepage (Pages → Homepage)**
   - Hero Section:
     - Heading: "Restoring Chimborazo Park for Our Community"
     - Subheading: "We're dedicated to preserving and beautifying this historic East End treasure—creating a safe, inclusive greenspace that honors the past and serves future generations."
     - Hero Image: Upload bike_sunset.webp
     - CTA Button: Text: "Get Involved", Link: "#get-involved"

   - Vision Pillars (create 4):
     1. Title: "Restoration", Icon: "leafy-green", Description: [from existing], Order: 0
     2. Title: "Recreation", Icon: "trees", Description: [from existing], Order: 1
     3. Title: "Connection", Icon: "heart-handshake", Description: [from existing], Order: 2
     4. Title: "Preservation", Icon: "book-open-text", Description: [from existing], Order: 3

   - Create Partners first (see below), then reference them
   - Create Quote first (see below), then reference it
   - Create Gallery first (see below), then reference it

4. **Create Partners (Partners document type)**
   1. Church Hill Rotary Club
      - Logo: Upload ch_rotary.png
      - Description: [from existing]
      - Website: https://www.churchhillrotary.org/
      - Featured: true, Order: 0

   2. Church Hill Association
      - Logo: Upload cha.png
      - Description: [from existing]
      - Website: [add URL]
      - Featured: true, Order: 1

5. **Create Quote (Quotes document type)**
   - Quote Text: "Nature is not a luxury, but a necessity. We need the calming influences of green spaces to cleanse our souls and rejuvenate our spirits."
   - Attribution: "Frederick Law Olmstead"
   - Background Image: Upload rock_sunset.webp
   - Featured: true
   - Category: "nature"

6. **Create Gallery (Gallery document type)**
   - Title: "Homepage Gallery"
   - Gallery Type: "homepage"
   - Images: Upload and add 8 images from existing gallery with captions
   - Order: 0

7. **Populate Amenities Page (Pages → Amenities Page)**
   - Page Hero:
     - Title: "Park Amenities"
     - Description: [from existing]
     - Image: Upload appropriate hero image

   - Introduction: Add existing introduction paragraphs

   - Amenities (create 6):
     - Chimborazo Round House (Upper Park)
     - Picnic Gazebo (Upper Park)
     - Statue of Liberty Replica (Upper Park)
     - Restroom Facilities (Upper Park)
     - Bark Park (Lower Park)
     - Woodland Trails (Lower Park)

### Phase 2: Integrate Queries in Web App

Once content is populated, update the web app to fetch from CMS:

#### Example: Homepage Loader

```typescript
// apps/web/src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { createSanityClient, getHomePageQuery } from '@chimborazo/sanity-config'
import type { GetHomePageQueryResult } from '@chimborazo/sanity-config'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const sanityClient = createSanityClient()
    const homePage = await context.queryClient.ensureQueryData({
      queryKey: ['homePage'],
      queryFn: () => sanityClient.fetch(getHomePageQuery),
    })
    return { homePage }
  },
  component: HomePage,
})

function HomePage() {
  const { homePage } = Route.useLoaderData()

  return (
    <>
      <Hero
        heading={homePage.hero.heading}
        subheading={homePage.hero.subheading}
        image={homePage.hero.heroImage}
        cta={homePage.hero.ctaButton}
      />

      <Vision pillars={homePage.visionPillars} />

      <Partners partners={homePage.partners} />

      {homePage.quote && <Quote {...homePage.quote} />}

      {homePage.gallery && <Gallery images={homePage.gallery.images} />}
    </>
  )
}
```

#### Example: Site Settings in Root Layout

```typescript
// apps/web/src/routes/__root.tsx
import { createSanityClient, getSiteSettingsQuery } from '@chimborazo/sanity-config'

export const Route = createRootRoute({
  loader: async ({ context }) => {
    const sanityClient = createSanityClient()
    const siteSettings = await context.queryClient.ensureQueryData({
      queryKey: ['siteSettings'],
      queryFn: () => sanityClient.fetch(getSiteSettingsQuery),
    })
    return { siteSettings }
  },
  // Pass siteSettings to Header and Footer components
})
```

### Phase 3: Update Components

Update these components to accept CMS data:

1. **Header** (apps/web/src/components/Header/header.tsx)
   - Accept siteSettings prop
   - Use social links, donation URL, organization name from CMS

2. **Footer** (apps/web/src/components/Footer/footer.tsx)
   - Accept siteSettings prop
   - Use organization info, social links from CMS

3. **Hero** (apps/web/src/components/Hero/hero.tsx)
   - Update props to match hero schema fields
   - Use Sanity image URLs

4. **Amenities Page** (apps/web/src/routes/amenities.tsx)
   - Add loader for amenitiesPage
   - Map over amenities array

## Regenerating Types

Whenever you modify schemas, regenerate types:

```bash
cd apps/studio
pnpm exec sanity schema extract
pnpm exec sanity typegen generate
```

## Files Modified/Created

### Schemas
- ✅ packages/sanity-config/src/schemas/siteSettings.ts
- ✅ packages/sanity-config/src/schemas/homePage.ts
- ✅ packages/sanity-config/src/schemas/amenitiesPage.ts
- ✅ packages/sanity-config/src/schemas/partner.ts
- ✅ packages/sanity-config/src/schemas/quote.ts
- ✅ packages/sanity-config/src/schemas/gallery.ts
- ✅ packages/sanity-config/src/schemas/index.ts (updated)

### Queries
- ✅ packages/sanity-config/src/queries/siteSettings.ts
- ✅ packages/sanity-config/src/queries/homePage.ts
- ✅ packages/sanity-config/src/queries/amenitiesPage.ts
- ✅ packages/sanity-config/src/queries/partners.ts
- ✅ packages/sanity-config/src/queries/quotes.ts
- ✅ packages/sanity-config/src/queries/gallery.ts
- ✅ packages/sanity-config/src/queries/index.ts (updated)

### Configuration
- ✅ apps/studio/sanity.config.ts (added structure)
- ✅ apps/studio/sanity-typegen.json (created)
- ✅ packages/sanity-config/src/index.ts (updated exports)
- ✅ packages/sanity-config/package.json (added groq dependency)

### Generated
- ✅ packages/sanity-config/src/sanity.types.ts
- ✅ apps/studio/schema.json

## Testing

1. **Studio Build**: ✅ Passed
   ```bash
   pnpm build --filter @chimborazo/studio
   ```

2. **Next: Test Studio UI**
   ```bash
   pnpm dev --filter @chimborazo/studio
   ```
   - Verify Settings group appears
   - Verify Pages group appears
   - Verify singletons only allow one instance
   - Test creating content in each schema

3. **Next: Test Web App Integration**
   ```bash
   pnpm dev --filter @chimborazo/web
   ```
   - After populating content and updating components
   - Verify homepage displays CMS content
   - Verify amenities page displays CMS content
   - Verify header/footer use site settings

## Schema Architecture Benefits

### Before (Original Plan): 10 Schemas
- siteSettings, hero, amenity, visionPillar, quote, gallery, partner
- Plus existing: event, mediaImage
- Total: 9 new + 2 existing = 11 schemas

### After (Hybrid Approach): 6 New Schemas
- **Singletons**: siteSettings, homePage, amenitiesPage
- **Reusable**: partner, quote, gallery
- **Existing**: event, mediaImage
- Total: 6 new + 2 existing = **8 schemas** (-27% reduction)

### Why This Works
- **Page-specific content** (vision pillars, amenities) embedded in page singletons
- **Reusable content** (partners, quotes, galleries) as separate documents
- **Best of both worlds**: Simplicity + Flexibility
