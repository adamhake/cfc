# Deployment Guide - Chimborazo Park Conservancy

Complete guide for deploying the web app and Sanity Studio to Netlify.

## 📋 Prerequisites

- [x] Sanity project created at [sanity.io/manage](https://sanity.io/manage)
- [x] Content migrated (events and media)
- [x] Netlify account
- [x] GitHub repository connected

## 🚀 Deployment Steps

### Part 1: Deploy Web App

#### 1. Create Netlify Site for Web App

1. Log into [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to your GitHub repository
4. Configure build settings:

**Build Settings:**
```
Base directory: (leave empty or use root)
Build command: pnpm run build --filter=@chimborazo/web
Publish directory: apps/web/dist/client
Functions directory: apps/web/netlify/functions
```

#### 2. Configure Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables, add:

**Required:**
```env
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_editor_token_here
SANITY_WEBHOOK_SECRET=generate_random_secret_here
NETLIFY_SITE_ID=your_netlify_site_id
```

**Optional (for cache purging):**
```env
NETLIFY_PURGE_TOKEN=your_purge_api_token
```

**Generate Secrets:**
```bash
# Generate webhook secret (use this value)
openssl rand -hex 32
```

#### 3. Deploy!

Click "Deploy site" and wait for the build to complete.

---

### Part 2: Deploy Sanity Studio

#### 1. Create Separate Netlify Site for Studio

1. In Netlify, create another new site
2. Connect to the same GitHub repository
3. Configure build settings:

**Build Settings:**
```
Base directory: (leave empty or use root)
Build command: pnpm run build --filter=@chimborazo/studio
Publish directory: apps/studio/dist
```

#### 2. Configure Studio Environment Variables

Add these in Netlify Dashboard:

```env
SANITY_STUDIO_PROJECT_ID=your_project_id_here
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=https://your-web-app-url.netlify.app
```

#### 3. Set Custom Domain (Recommended)

1. Go to Site Settings → Domain Management
2. Add custom domain (e.g., `studio.chimborazopark.org`)
3. Configure DNS with your domain provider

#### 4. Deploy Studio

Click "Deploy site" and wait for build.

---

### Part 3: Configure Sanity Webhooks

#### 1. Update CORS Origins in Sanity

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Navigate to **API** → **CORS Origins**
4. Add these origins:
   - `http://localhost:3000` (local development)
   - `http://localhost:3333` (local Studio)
   - `https://your-web-app-url.netlify.app` (production web)
   - `https://your-studio-url.netlify.app` (production Studio)

#### 2. Create Webhook in Sanity

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Navigate to **API** → **Webhooks**
4. Click "Create webhook"

**Webhook Configuration:**
```
Name: Production Cache Invalidation
URL: https://your-web-app-url.netlify.app/.netlify/functions/sanity-webhook
Dataset: production
Trigger on: Create, Update, Delete
Filter: _type == "event" || _type == "mediaImage"
Secret: (use same value as SANITY_WEBHOOK_SECRET env var)
HTTP method: POST
API version: v2021-06-07
Include drafts: No
```

5. Save webhook

#### 3. Test Webhook

1. Open Sanity Studio
2. Edit an event (make a small change)
3. Click "Publish"
4. Check Netlify Function logs:
   - Go to Netlify Dashboard → Functions → sanity-webhook
   - Look for successful execution
   - Verify cache purge occurred

---

## 🧪 Testing Checklist

### Web App Tests

- [ ] Site loads correctly
- [ ] Events page shows Sanity events
- [ ] Event detail pages render properly
- [ ] Images load from Sanity CDN
- [ ] Media gallery works
- [ ] Dark mode toggle works
- [ ] Mobile responsive
- [ ] No console errors

### Studio Tests

- [ ] Studio loads and you can login
- [ ] Can create new events
- [ ] Can upload images
- [ ] Can edit existing content
- [ ] Presentation tool works (live preview)
- [ ] Can publish content

### Webhook Tests

- [ ] Publishing an event updates the site within ~30 seconds
- [ ] Editing an event clears the cache
- [ ] Function logs show successful execution
- [ ] No errors in function logs

---

## 🔧 Live Preview Setup (Optional)

The Presentation tool in Studio allows real-time preview of changes before publishing.

### How It Works

1. In Studio, click the "Presentation" tab
2. Select an event to preview
3. Make edits in the Studio
4. See changes reflected in real-time on the right panel

**Note:** Live preview is already configured! The setup includes:
- ✅ Draft API route at `/api/draft`
- ✅ Presentation tool configured in Studio
- ✅ Preview URL set to production web app

---

## 🌐 Custom Domains

### Web App Domain

1. In Netlify: Site Settings → Domain Management
2. Add your custom domain (e.g., `chimborazopark.org`)
3. Configure DNS records:
   ```
   A record: @ → 75.2.60.5
   CNAME: www → your-site.netlify.app
   ```

### Studio Domain

1. Add subdomain (e.g., `studio.chimborazopark.org`)
2. Configure DNS:
   ```
   CNAME: studio → your-studio.netlify.app
   ```

3. **Update environment variables:**
   - Update `SANITY_STUDIO_PREVIEW_URL` in Studio env vars
   - Update CORS origins in Sanity project settings
   - Update webhook URL if needed

---

## 📊 Monitoring & Maintenance

### Check Site Health

- **Netlify Dashboard:** Monitor build status, function executions
- **Sanity Dashboard:** Check API usage, webhook deliveries
- **Analytics:** Set up Netlify Analytics or Google Analytics

### Common Issues

**Build Fails:**
```bash
# Clear build cache in Netlify Dashboard
Site Settings → Build & deploy → Clear cache and retry deploy
```

**Webhook Not Working:**
- Check function logs in Netlify
- Verify `SANITY_WEBHOOK_SECRET` matches in both places
- Test webhook delivery in Sanity Dashboard → Webhooks

**Images Not Loading:**
- Verify CORS origins include your domain
- Check Sanity CDN is accessible
- Ensure images are published (not drafts)

**Preview Not Working:**
- Verify `SANITY_STUDIO_PREVIEW_URL` is set correctly
- Check browser console for errors
- Ensure draft API route is deployed

---

## 🎯 Post-Deployment

### 1. Update README

Document your production URLs:
- Web app: `https://chimborazopark.org`
- Studio: `https://studio.chimborazopark.org`

### 2. Set Up Redirects (Optional)

Add to `apps/web/netlify.toml`:
```toml
[[redirects]]
  from = "https://www.chimborazopark.org/*"
  to = "https://chimborazopark.org/:splat"
  status = 301
  force = true
```

### 3. Enable HTTPS

Netlify automatically provisions SSL certificates. Verify:
- [ ] HTTPS is enabled
- [ ] HTTP redirects to HTTPS
- [ ] No mixed content warnings

---

## 🚀 Success!

Your site is now live with:
- ✅ Sanity CMS for content management
- ✅ Real-time cache invalidation
- ✅ Live preview capabilities
- ✅ Automatic deployments on content changes
- ✅ CDN-optimized image delivery

**Next Steps:**
1. Share Studio URL with content editors
2. Document content editing workflows
3. Set up backup/monitoring
4. Plan content update schedule

Need help? Check the [Sanity docs](https://www.sanity.io/docs) or [Netlify docs](https://docs.netlify.com/).
