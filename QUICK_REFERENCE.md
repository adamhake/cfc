# Quick Reference - Sanity Integration

## 📁 Key Files

| File | Purpose |
|------|---------|
| `REMAINING_TASKS.md` | **Complete guide** for all remaining work (686 lines) |
| `INTEGRATION_COMPLETE.md` | What's been done + how to test |
| `SANITY_SETUP_GUIDE.md` | Step-by-step Sanity configuration |
| `README.md` | Monorepo documentation |
| `apps/web/src/lib/sanity.ts` | Sanity client config |
| `packages/sanity-config/` | Shared schemas & queries |

## ✅ Completed

- Turborepo monorepo (3 workspaces)
- Sanity Studio app
- Shared sanity-config package
- Web app integration with fallback
- PortableText component
- Events pages fetch from Sanity
- Node 22 enforced

## 🔄 Remaining (5 Tasks)

### 1. Events Migration Script
**File:** `apps/web/scripts/migrate-events-to-sanity.ts`
**Time:** 2-3 hours
**See:** `REMAINING_TASKS.md` - Task 1 (lines 25-135)

### 2. Media Migration Script
**File:** `apps/web/scripts/migrate-media-to-sanity.ts`
**Time:** 3-4 hours
**See:** `REMAINING_TASKS.md` - Task 2 (lines 137-242)

### 3. Live Preview Setup
**Files:** `apps/web/src/routes/api/draft.tsx` + Studio config
**Time:** 2-3 hours
**See:** `REMAINING_TASKS.md` - Task 3 (lines 244-337)

### 4. Webhook Handler
**File:** `apps/web/netlify/functions/sanity-webhook.ts`
**Time:** 2-3 hours
**See:** `REMAINING_TASKS.md` - Task 4 (lines 339-476)

### 5. Deployment Config
**Files:** Update `netlify.toml` files
**Time:** 1-2 hours
**See:** `REMAINING_TASKS.md` - Task 5 (lines 478-573)

## 🚀 Quick Start Commands

```bash
# Install dependencies
pnpm install

# Start both apps
pnpm run dev

# Start just Studio
pnpm --filter @chimborazo/studio dev

# Start just web app
pnpm --filter @chimborazo/web dev

# Build everything
pnpm run build

# Run migrations (once created)
cd apps/web
pnpm run migrate:events
pnpm run migrate:media
```

## 🎯 Next Step

1. **Create Sanity project** at [sanity.io/manage](https://sanity.io/manage)
2. **Configure .env files** (see `SANITY_SETUP_GUIDE.md`)
3. **Pick a task** from `REMAINING_TASKS.md`
4. **Follow the detailed instructions** with copy-paste code examples

## 📊 Progress Tracking

**Completed:** 14/19 tasks (74%)
**Remaining:** 5/19 tasks (26%)
**Estimated time:** 14-21 hours to complete

## 🆘 Need Help?

- **Setup questions:** See `SANITY_SETUP_GUIDE.md`
- **What's done:** See `INTEGRATION_COMPLETE.md`
- **What's left:** See `REMAINING_TASKS.md`
- **General info:** See `README.md`

## 💡 Pro Tip

The site **works perfectly right now** with static data. Each remaining task adds CMS functionality but won't break anything. You can:
- Deploy the current version
- Add Sanity features incrementally
- Test thoroughly at each step
