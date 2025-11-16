# Performance Improvement Recommendations

Based on Lighthouse audit results from October 15, 2025

## Current Performance Score: 85/100

### Core Web Vitals Summary

| Metric                             | Score | Value | Status                   |
| ---------------------------------- | ----- | ----- | ------------------------ |
| **First Contentful Paint (FCP)**   | 0.98  | 0.7s  | ✅ Excellent             |
| **Largest Contentful Paint (LCP)** | 0.88  | 1.3s  | ✅ Good                  |
| **Total Blocking Time (TBT)**      | 1.0   | 0ms   | ✅ Perfect               |
| **Cumulative Layout Shift (CLS)**  | 0.55  | 0.225 | ⚠️ **Needs Improvement** |
| **Speed Index**                    | 0.98  | 0.9s  | ✅ Excellent             |

---

## Priority 1: Fix Cumulative Layout Shift (CLS) - 0.225 ⚠️

**Impact:** Highest priority - accounts for 25% of performance score

### Problem

Layout shifts occur when images and other content load without reserved space, causing visual instability.

### Solutions

#### 1. Add Explicit Dimensions to Images

```typescript
// Bad - no dimensions specified
<img src="/festival.webp" alt="Festival" />

// Good - explicit dimensions
<img
  src="/festival.webp"
  width={800}
  height={600}
  alt="Festival"
/>
```

#### 2. Use CSS Aspect Ratio

```css
.hero-image {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.event-thumbnail {
  aspect-ratio: 4 / 3;
  width: 100%;
}
```

#### 3. Reserve Space for Dynamic Content

```typescript
// For TanStack Devtools or other dynamic UI
.devtools-container {
  min-height: 56px; /* Reserve space before load */
}
```

#### 4. Optimize Font Loading (Prevents FOIT/FOUT)

See "Priority 3" below for font optimization details.

### Expected Improvement

**+10-15 points** to performance score

---

## Priority 2: Implement Responsive Images 🖼️

**Impact:** Est. savings of 327 KiB

### Problem

Images are served at larger sizes than needed for the viewport:

- `festival.webp` - 146 KB wasted
- `recreation.webp` - 103 KB wasted
- `get_involved.webp` - 85 KB wasted

### Solution 1: Use @unpic/react (Already in dependencies!)

```typescript
import { Image } from '@unpic/react';

<Image
  src="/festival.webp"
  layout="constrained"
  width={800}
  height={600}
  breakpoints={[640, 768, 1024, 1280, 1536]}
  alt="Festival"
/>
```

### Solution 2: Native Picture Element

```tsx
<picture>
  <source
    srcSet="/festival-640.webp 640w, /festival-1024.webp 1024w, /festival-1536.webp 1536w"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  />
  <img src="/festival.webp" alt="Festival" width={1536} height={1024} />
</picture>
```

### Solution 3: Generate Multiple Image Sizes

Add a build step to generate responsive images:

```bash
npm install -D sharp
```

Create a script `scripts/generate-images.js`:

```javascript
import sharp from "sharp";
import { readdir } from "fs/promises";
import path from "path";

const sizes = [640, 768, 1024, 1280, 1536];
const inputDir = "./public";
const images = ["festival.webp", "recreation.webp", "get_involved.webp"];

for (const image of images) {
  const baseName = path.parse(image).name;

  for (const size of sizes) {
    await sharp(path.join(inputDir, image))
      .resize(size, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(inputDir, `${baseName}-${size}.webp`));
  }
}
```

Add to package.json:

```json
{
  "scripts": {
    "generate-images": "node scripts/generate-images.js",
    "prebuild": "npm run generate-images"
  }
}
```

### Expected Improvement

**+3-5 points** to performance score

---

## Priority 3: Optimize Font Loading 🔤

**Impact:** Est. savings of 386ms render blocking time

### Current Problem

Google Fonts CSS is blocking render.

### Solution 1: Async Load External Fonts (Quick Fix)

Update font loading in `src/routes/__root.tsx`:

```html
<!-- Preconnect to Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Load fonts asynchronously -->
<link
  href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Vollkorn+SC:wght@400;600;700;900&display=swap"
  rel="stylesheet"
  media="print"
  onload="this.media='all'"
/>
<noscript>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Vollkorn+SC:wght@400;600;700;900&display=swap"
    rel="stylesheet"
  />
</noscript>
```

### Solution 2: Self-Host Fonts (Best Practice)

```bash
npm install @fontsource/inter @fontsource/libre-baskerville @fontsource/montserrat @fontsource/vollkorn-sc
```

In `src/routes/__root.tsx` or `src/styles.css`:

```typescript
// Import only the weights you need
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/700.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/vollkorn-sc/400.css";
import "@fontsource/vollkorn-sc/700.css";
```

Then update `src/styles.css` to use local fonts:

```css
/* Remove or comment out @import statements for Google Fonts */
/* @import url('https://fonts.googleapis.com/...'); */

/* Font families remain the same */
:root {
  --font-display: "Vollkorn SC", serif;
  --font-body: "Inter", sans-serif;
}
```

### Expected Improvement

**+2-3 points** to performance score

---

## Priority 4: Reduce Unused JavaScript 📦

**Impact:** Est. savings of 422 KiB (75 KB from main bundle)

### Problem

Main application bundle contains ~75 KB of unused JavaScript code.

### Solutions

#### 1. Lazy Load Routes

TanStack Router already supports code splitting. Use lazy loading for non-critical routes:

```typescript
// src/routes/media.tsx
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/media")({
  component: lazyRouteComponent(() => import("../components/MediaGallery/media-gallery")),
});
```

#### 2. Lazy Load Heavy Components

```typescript
import { lazy, Suspense } from 'react';

// Lazy load non-critical components
const EventCard = lazy(() => import('@/components/Event/event-card'));

function EventList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventCard {...props} />
    </Suspense>
  );
}
```

#### 3. Analyze Bundle Size

Add bundle analysis to identify optimization opportunities:

```bash
npm install -D vite-plugin-bundle-analyzer
```

Update `vite.config.ts`:

```typescript
import { analyzer } from "vite-plugin-bundle-analyzer";

export default defineConfig({
  plugins: [
    // ... other plugins
    process.env.ANALYZE && analyzer(),
  ],
});
```

Run analysis:

```bash
ANALYZE=true npm run build
```

#### 4. Tree Shake Unused Exports

Ensure you're using named imports where possible:

```typescript
// Bad - imports entire library
import _ from "lodash";

// Good - tree-shakeable
import { debounce } from "lodash-es";
```

### Expected Improvement

**+2-3 points** to performance score

---

## Additional Optimizations

### 5. TanStack Devtools Image Optimization

**Impact:** Minor (11 KB savings)

The devtools button uses a PNG data URI. Since this is development-only:

```typescript
// src/routes/__root.tsx
export const Route = createRootRoute({
  component: RootComponent,
  devtools: import.meta.env.PROD
    ? false
    : {
        // Only load in development
      },
});
```

### 6. Enable Text Compression

Ensure your hosting (Netlify) has gzip/brotli compression enabled. Check `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    # Enable compression
    Content-Encoding = "br"
```

Actually, Netlify handles this automatically, so this should already be working.

### 7. Preload Critical Assets

In `src/routes/__root.tsx`, preload critical resources:

```tsx
<head>
  <link rel="preload" as="image" href="/hero-image.webp" />
  <link rel="preload" as="font" href="/fonts/inter-regular.woff2" type="font/woff2" crossorigin />
</head>
```

---

## Implementation Checklist

### Phase 1: Quick Wins (1-2 hours)

- [ ] Add explicit width/height to all images
- [ ] Add CSS aspect-ratio to image containers
- [ ] Implement async font loading with preconnect
- [ ] Add font-display: swap to Google Fonts URL

### Phase 2: Image Optimization (2-3 hours)

- [ ] Create image generation script
- [ ] Generate responsive image sizes
- [ ] Implement @unpic/react or picture elements
- [ ] Update all image components

### Phase 3: Font Self-Hosting (1 hour)

- [ ] Install @fontsource packages
- [ ] Import fonts in root layout
- [ ] Remove Google Fonts links
- [ ] Test font rendering

### Phase 4: Code Splitting (2-3 hours)

- [ ] Set up bundle analyzer
- [ ] Identify heavy routes/components
- [ ] Implement lazy loading
- [ ] Test route transitions

---

## Expected Results

### Before

- Performance Score: **85/100**
- CLS: **0.225**
- LCP: **1.3s**

### After (Estimated)

- Performance Score: **95+/100**
- CLS: **<0.1** (Good)
- LCP: **<1.2s** (Good)
- Bundle Size: **-75 KB**
- Image Size: **-327 KB**

---

## Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [TanStack Router Code Splitting](https://tanstack.com/router/latest/docs/framework/react/guide/code-splitting)
- [@unpic/react Documentation](https://unpic.pics/img/react/)
- [Font Performance Best Practices](https://web.dev/font-best-practices/)
- [Cumulative Layout Shift Guide](https://web.dev/cls/)

---

## Monitoring

After implementing improvements, re-run Lighthouse audit:

```bash
# Install Lighthouse CLI (optional)
npm install -g lighthouse

# Run audit
lighthouse https://chimboparkconservancy.netlify.app --view
```

Or use:

- Chrome DevTools Lighthouse tab
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
