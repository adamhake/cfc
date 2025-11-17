# Sanity Webhook Setup for Instant Cache Invalidation

This guide explains how to configure Sanity webhooks to automatically invalidate Netlify's cache when content is published, ensuring users see fresh content immediately.

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│ Content Flow with Webhook Cache Invalidation                │
└─────────────────────────────────────────────────────────────┘

1. Content Editor publishes in Sanity
   ↓
2. Sanity triggers webhook to your API endpoint
   ↓
3. Webhook validates signature for security
   ↓
4. Netlify cache is purged for affected pages
   ↓
5. Next visitor triggers fresh SSR
   ↓
6. Fresh SSR fetches latest data from Sanity via TanStack Query
   ↓
7. User sees updated content immediately (0-2 second delay)
```

**Without webhooks:** Users might wait 5-30 minutes (depending on `staleTime`) before seeing updates.

**With webhooks:** Cache is invalidated instantly, fresh content visible on next page load.

## Prerequisites

- Sanity Studio project with webhook support
- Netlify site deployed with your TanStack Start app
- Access to both Sanity and Netlify admin panels

## Step 1: Generate Webhook Secret

Generate a strong random secret for webhook authentication:

```bash
# Option 1: Use openssl
openssl rand -hex 32

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Online generator
# Visit: https://www.random.org/strings/
```

Save this secret - you'll need it for both Sanity and your environment variables.

## Step 2: Get Netlify Credentials

### 2.1 Get Your Netlify Site ID

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **Site settings** → **General**
4. Find **Site details** → **Site ID**
5. Copy the Site ID (e.g., `abc123-def456-ghi789`)

### 2.2 Create Netlify Personal Access Token

1. Go to [Netlify User Settings](https://app.netlify.com/user/applications)
2. Click **Personal access tokens**
3. Click **New access token**
4. Name it: `Sanity Webhook - [Your Site Name]`
5. Click **Generate token**
6. **IMPORTANT:** Copy the token immediately - you won't be able to see it again!
7. Store it securely

## Step 3: Configure Environment Variables

Add these variables to your deployment environment:

### For Local Development (.env.local)

Create or update `apps/web/.env.local`:

```bash
# Sanity Webhook Configuration
SANITY_WEBHOOK_SECRET="your-webhook-secret-from-step-1"

# Netlify API Credentials
NETLIFY_AUTH_TOKEN="your-netlify-personal-access-token"
NETLIFY_SITE_ID="your-site-id"
```

### For Netlify Deployment

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `SANITY_WEBHOOK_SECRET` | Your generated secret | Same secret used in Sanity |
| `NETLIFY_AUTH_TOKEN` | Your personal access token | Keep this secure! |
| `NETLIFY_SITE_ID` | Your site ID | Found in Site settings |

4. Click **Save**
5. **Important:** Trigger a new deploy to apply the environment variables

## Step 4: Configure Sanity Webhook

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Navigate to **API** → **Webhooks**
4. Click **Create webhook**

### Webhook Configuration

Fill in the following details:

**Name:** `Netlify Cache Invalidation`

**URL:**
```
https://your-domain.netlify.app/api/webhooks/sanity
```
Replace `your-domain` with your actual Netlify domain.

**Dataset:** `production` (or your target dataset)

**Trigger on:**
- ✅ Create
- ✅ Update
- ✅ Delete

**Filter (Optional):**
Add a GROQ filter to only trigger for specific document types:
```groq
_type in ["event", "mediaImage", "homePage", "partner", "quote"]
```

**Secret:**
Paste the webhook secret you generated in Step 1

**HTTP method:** `POST`

**HTTP Headers:** (Leave default)

**API version:** Use latest available

5. Click **Save**

## Step 5: Test the Webhook

### 5.1 Test Webhook Connection

Visit your webhook endpoint directly:
```
GET https://your-domain.netlify.app/api/webhooks/sanity
```

You should see:
```json
{
  "service": "Sanity Webhook Handler",
  "status": "active",
  "configured": true
}
```

If `configured: false`, check your environment variables.

### 5.2 Test with Real Content

1. Go to your Sanity Studio
2. Edit any document (e.g., update an event title)
3. Click **Publish**
4. Check your **Netlify Function Logs**:
   - Go to Netlify Dashboard → **Functions** → **sanity**
   - You should see: `[Sanity Webhook] Received event for event:`
   - Followed by: `[Sanity Webhook] Successfully purged cache for tags: ["events", "homepage"]`

5. Visit your website and verify the change appears immediately

## Step 6: Monitor Webhook Activity

### In Sanity

1. Go to **API** → **Webhooks**
2. Click on your webhook
3. View **Recent deliveries** to see:
   - Delivery status (success/failure)
   - Response codes
   - Request/response payloads

### In Netlify

1. Go to **Functions**
2. Select the `sanity` function
3. View logs for webhook processing details

## Troubleshooting

### Webhook Returns 401 Unauthorized

**Problem:** Invalid signature or missing secret

**Solutions:**
- Verify `SANITY_WEBHOOK_SECRET` matches in both Sanity and your environment
- Ensure the environment variable is deployed (trigger new build)
- Check Netlify function logs for exact error message

### Webhook Returns 500 Server Configuration Error

**Problem:** Missing Netlify credentials

**Solutions:**
- Verify `NETLIFY_AUTH_TOKEN` is set correctly
- Verify `NETLIFY_SITE_ID` is set correctly
- Check the GET endpoint shows `configured: true`

### Cache Not Invalidating

**Problem:** Webhook succeeds but cache doesn't clear

**Solutions:**
- Check Netlify function logs for "Successfully purged cache" message
- Verify your Netlify token has the correct permissions
- Try manually triggering a deploy to clear all caches
- Check if you're testing in a browser with aggressive caching (try incognito mode)

### Webhook Not Triggering

**Problem:** Content changes but webhook never fires

**Solutions:**
- Check **Recent deliveries** in Sanity webhook settings
- Verify the webhook filter includes your document type
- Ensure you're publishing (not just saving draft)
- Check that the webhook is enabled

## Cache Invalidation Strategy

The webhook intelligently invalidates different caches based on content type:

| Content Type | Pages Invalidated | Reason |
|--------------|-------------------|--------|
| `event` | Events list, Event detail, Homepage | Events appear on multiple pages |
| `mediaImage` | Media gallery, Homepage | Images shown in gallery and homepage |
| `homePage` | Homepage only | Direct homepage content |
| `partner` | Homepage | Partners displayed on homepage |
| `quote` | Homepage | Quotes displayed on homepage |
| Unknown types | All pages | Safety fallback |

## Performance Impact

**Before Webhooks:**
- Cache invalidation: Based on `staleTime` (5-30 minutes)
- User sees updates: After staleTime expires
- Unnecessary API calls: Periodic refetching

**After Webhooks:**
- Cache invalidation: Instant (< 2 seconds)
- User sees updates: Next page load after publish
- API efficiency: Only fetch when content actually changes

## Security Considerations

1. **Keep webhook secret secure:** Never commit to version control
2. **Rotate secrets periodically:** Update both Sanity and environment variables
3. **Use HTTPS only:** Webhook endpoint must be HTTPS (Netlify provides this)
4. **Monitor failed attempts:** Check Sanity delivery logs for suspicious activity
5. **Limit webhook scope:** Use GROQ filter to only trigger for necessary document types

## Advanced: Granular Cache Invalidation

Currently, the webhook purges the entire Netlify cache. For more granular control, you could:

1. **Implement cache tags in Netlify headers** (if/when Netlify supports this)
2. **Track individual page caches** and invalidate specific URLs
3. **Use Netlify's On-Demand Builders** for static page regeneration

These approaches require additional implementation and aren't necessary for most sites.

## Maintenance

### Monthly Checklist

- [ ] Review webhook delivery logs for failures
- [ ] Verify webhook secret hasn't been exposed
- [ ] Check cache invalidation is working as expected
- [ ] Monitor API call volume to Sanity

### When Making Changes

**If you change the webhook endpoint:**
1. Update URL in Sanity webhook settings
2. Verify new endpoint works before disabling old one

**If rotating secrets:**
1. Generate new secret
2. Update in environment variables
3. Trigger new deploy
4. Update in Sanity webhook settings (in that order)

## Support

- **Sanity Webhooks Docs:** https://www.sanity.io/docs/webhooks
- **Netlify API Docs:** https://docs.netlify.com/api/get-started/
- **TanStack Query SSR:** https://tanstack.com/query/latest/docs/framework/react/guides/ssr

## Summary

✅ **Completed Setup Checklist:**

- [ ] Generated webhook secret
- [ ] Retrieved Netlify Site ID
- [ ] Created Netlify Personal Access Token
- [ ] Added environment variables to Netlify
- [ ] Configured webhook in Sanity Studio
- [ ] Tested webhook endpoint (GET request)
- [ ] Tested with real content publish
- [ ] Verified cache invalidation in logs
- [ ] Confirmed changes appear immediately on site

Once all steps are complete, your site will automatically show fresh content within seconds of publishing in Sanity!
