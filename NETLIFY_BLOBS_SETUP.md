# Netlify Blobs Media Storage Setup

This document explains how to use Netlify Blobs for storing and managing images in the media gallery.

## Overview

The media page now uses Netlify Blobs to store images instead of keeping them in the codebase. This provides several benefits:

- **Scalability**: Store unlimited images without bloating the git repository
- **Performance**: Images are served with optimal caching headers
- **Metadata**: Each image includes alt text, captions, and dimensions
- **Easy Management**: Upload new images without redeploying the site

## Architecture

### Components

1. **Data Type** (`src/data/media.ts`): TypeScript interface defining image metadata structure
2. **Netlify Functions**:
   - `functions/get-media.ts`: Fetches all media with metadata from blob storage
   - `functions/upload-media.ts`: Uploads images with metadata (admin only, requires auth)
3. **Netlify Edge Functions**:
   - `edge-functions/media-image.ts`: Serves individual images from blob storage via global edge network
4. **Media Page** (`src/routes/media.tsx`): Displays images in masonry layout with hover captions
5. **Migration Script** (`scripts/migrate-images.ts`): One-time migration of existing images to blob storage

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# Required for Netlify Blobs
NETLIFY_SITE_ID=your-site-id-here

# Required for running migration script locally
NETLIFY_TOKEN=your-netlify-token-here

# Required for upload function (generate a secure random string)
ADMIN_API_KEY=your-secure-admin-key-here
```

**To find your Site ID:**
1. Go to your Netlify dashboard at https://app.netlify.com
2. Select your site
3. Navigate to Site settings > General > Project information
4. Copy the "Site ID"

**To get your Personal Access Token:**
1. Go to https://app.netlify.com/user/applications#personal-access-tokens
2. Click "New access token"
3. Give it a name like "Blobs Migration"
4. Copy the token and add it to your `.env` file
5. ⚠️ **Keep this secret!** Never commit it to git

**For the Admin API Key:**
- Generate a secure random string (e.g., using `openssl rand -base64 32`)
- This is used for the upload function to prevent unauthorized uploads

### 2. Migrate Existing Images

Run the migration script to upload your existing images from the `/public` directory:

```bash
npx tsx scripts/migrate-images.ts
```

This will:
- Read all `.webp` images from the `public/` directory
- Extract dimensions using `sharp`
- Upload to Netlify Blobs with metadata (alt text, captions, dimensions)
- Skip images that already exist in blob storage

### 3. Deploy to Netlify

The functions will automatically work on Netlify. Make sure to set the environment variables in your Netlify dashboard:

1. Go to Site settings > Environment variables
2. Add `ADMIN_API_KEY` with a secure value

Note: `NETLIFY_SITE_ID` is automatically available in Netlify's environment.

## Usage

### Viewing Images

Simply visit `/media` on your site. Images will load from Netlify Blobs with:
- Responsive masonry layout (1-3 columns based on screen size)
- Captions appear on hover
- Proper alt text for accessibility
- Optimized caching

### Uploading New Images

To upload a new image, send a POST request to `/.netlify/functions/upload-media`:

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/upload-media \
  -H "Authorization: Bearer YOUR_ADMIN_API_KEY" \
  -F "image=@path/to/image.webp" \
  -F "key=unique-image-key.webp" \
  -F "alt=Description of the image" \
  -F "caption=Optional caption text" \
  -F "width=1600" \
  -F "height=900"
```

Required fields:
- `image`: The image file
- `key`: Unique identifier (usually the filename)
- `alt`: Alt text for accessibility
- `width`: Image width in pixels
- `height`: Image height in pixels

Optional fields:
- `caption`: Caption displayed on hover

### Image Metadata Structure

Each image stored in Netlify Blobs includes:

```typescript
{
  key: string;          // Unique identifier (filename)
  src: string;          // URL to fetch the image
  width: number;        // Image width in pixels
  height: number;       // Image height in pixels
  alt: string;          // Alt text for accessibility
  caption?: string;     // Optional caption
  uploadedAt: string;   // ISO timestamp
}
```

## Development

### Local Testing

The Netlify CLI automatically emulates Blobs in local development. Just run:

```bash
npm run dev
```

Images uploaded in development are stored locally and won't persist to production.

### Adding New Images Locally

1. Place your image in the `public/` directory
2. Add metadata to `scripts/migrate-images.ts` in the `imageMetadata` object
3. Run the migration script: `npx tsx scripts/migrate-images.ts`

## Performance & Caching Strategy

### Edge Function Architecture

Images are served via **Netlify Edge Functions** running on Deno Deploy's global network:
- ✅ **Low latency worldwide** - Functions execute close to users
- ✅ **No cold starts** - Edge Functions are always warm
- ✅ **Optimized for reads** - Perfect for frequently-accessed media
- ✅ **Strong consistency** - Ensures new uploads are immediately available

### Caching Headers

**Images** (Edge Function at `/media-img/{key}`):
```
Cache-Control: public, max-age=31536000, immutable
CDN-Cache-Control: public, max-age=31536000, immutable
```
- **1 year browser cache** - After first load, served from local cache (no network!)
- **1 year CDN cache** - Netlify CDN caches at the edge globally
- **immutable** - Browser knows file never changes (optimizes refresh behavior)

**Media List** (Function at `/.netlify/functions/get-media`):
```
Cache-Control: public, max-age=300, s-maxage=600
```
- **5 minutes client cache** - Reduces API calls
- **10 minutes CDN cache** - Faster list retrieval, balances freshness
- New images appear within 10 minutes without redeployment

### Performance Characteristics

**First Load:**
1. Client requests `/media`
2. Loader fetches list from `get-media` (~50-200ms)
3. Browser loads images from edge function (~20-100ms per image)
4. Subsequent images load in parallel

**Subsequent Loads:**
1. List served from browser/CDN cache (~0-10ms)
2. Images served from browser cache (~0ms, no network request!)

**Upload New Image:**
1. Upload via `upload-media` with strong consistency
2. Appears in feed within 10 minutes (CDN cache expiry)
3. First load ~20-100ms, then cached for 1 year

### Why This is Fast

1. **Edge Functions** - Images served from 300+ edge locations worldwide
2. **Aggressive caching** - After first page load, images load instantly from cache
3. **Parallel loading** - Browser loads multiple images simultaneously
4. **Immutable content** - Browsers can optimize caching behavior
5. **CDN integration** - Netlify's CDN caches at multiple layers

### Comparison to Traditional Approaches

| Approach | First Load | Cached Load | Global Performance |
|----------|------------|-------------|-------------------|
| Git + Public folder | ~50-200ms | ~0-10ms | Varies by CDN |
| Regular Functions | ~200-500ms | ~0-10ms | Single region bottleneck |
| **Edge Functions (ours)** | **~20-100ms** | **~0ms** | **Globally optimized** |
| AWS S3 + CloudFront | ~50-150ms | ~0-10ms | Excellent (but more setup) |

### Expected Performance Metrics

For a typical gallery visit:
- **Initial page load**: 0.5-2 seconds (depending on # of images)
- **Return visit**: <100ms (everything cached)
- **New image upload**: Available within 10 minutes
- **Image loading**: Waterfall completes in 1-3 seconds for 20-30 images

### Monitoring Performance

Check your site's performance in:
1. Netlify Analytics - Real user monitoring
2. Browser DevTools Network tab - See cache hits
3. Lighthouse - Should score 90+ for performance

## Troubleshooting

### Images Not Loading

1. Check that `NETLIFY_SITE_ID` is set correctly
2. Verify the migration script ran successfully
3. Check the browser console for errors
4. Ensure Netlify Blobs is enabled for your plan

### Upload Fails

1. Verify `ADMIN_API_KEY` is set in environment
2. Check image file size (Netlify Blobs has size limits per plan)
3. Ensure all required fields are provided

### Local Development Issues

1. Make sure you're using Netlify Dev: `npm run dev`
2. Check that `.netlify` directory exists (auto-created)
3. Restart the dev server if blob storage seems stuck

## Future Enhancements

Potential improvements you could add:

- [ ] Admin UI for uploading images through the browser
- [ ] Image resizing/optimization in upload function
- [ ] Pagination for large galleries
- [ ] Image categories/tags
- [ ] Lightbox for full-size viewing
- [ ] Delete functionality
- [ ] Bulk upload support

## Cost Considerations

Netlify Blobs pricing (as of 2025):
- **Free tier**: Included in free plan with limits
- **Pro tier**: Higher limits, check Netlify pricing page

Monitor your usage in the Netlify dashboard under Blobs section.
