# Chimborazo Park Conservancy - Turborepo Monorepo

This is the monorepo for the Chimborazo Park Conservancy website and Sanity CMS integration.

## 📁 Project Structure

```
chimborazo-park-conservancy/
├── apps/
│   ├── web/           # Main website (TanStack Start + React)
│   └── studio/        # Sanity Studio CMS
├── packages/
│   └── sanity-config/ # Shared Sanity schemas, queries, and types
├── turbo.json         # Turborepo configuration
└── package.json       # Root package.json with workspaces
```

## 🚀 Getting Started

### Prerequisites

- **Node.js >= 22.0.0** (enforced via `.nvmrc` and `engines` field)
- **pnpm >= 8.0.0** (package manager)
- A Sanity account (sign up at [sanity.io](https://sanity.io))

**Note:** If you use `nvm`, run `nvm use` in the project root to automatically switch to Node 22.

### Initial Setup

1. **Clone the repository** (if you haven't already)

2. **Install pnpm** (if not already installed)
   ```bash
   npm install -g pnpm
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Sanity Project**
   - Create a new project at [sanity.io/manage](https://sanity.io/manage)
   - Note your Project ID and Dataset name (usually "production")
   - Create an API token with Editor permissions at:
     `https://sanity.io/manage/project/[YOUR_PROJECT_ID]/api`

4. **Configure environment variables**

   **For the web app** (`apps/web/.env`):
   ```bash
   # Copy the example file
   cp apps/web/.env.example apps/web/.env
   ```

   Then edit `apps/web/.env` and add:
   ```
   VITE_SANITY_PROJECT_ID=your_project_id_here
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2024-01-01
   SANITY_API_TOKEN=your_api_token_here
   ```

   **For the Studio** (`apps/studio/.env`):
   ```bash
   # Copy the example file
   cp apps/studio/.env.example apps/studio/.env
   ```

   Then edit `apps/studio/.env` and add:
   ```
   SANITY_STUDIO_PROJECT_ID=your_project_id_here
   SANITY_STUDIO_DATASET=production
   SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
   ```

## 💻 Development

### Run everything in dev mode
```bash
pnpm run dev
```

This will start:
- **Web app** on http://localhost:3000
- **Sanity Studio** on http://localhost:3333

### Run individual apps

**Web app only:**
```bash
pnpm --filter @chimborazo/web dev
# or
cd apps/web && pnpm run dev
```

**Sanity Studio only:**
```bash
pnpm --filter @chimborazo/studio dev
# or
cd apps/studio && pnpm run dev
```

## 🏗️ Building

### Build all apps
```bash
pnpm run build
```

### Build individual apps
```bash
pnpm --filter @chimborazo/web build
pnpm --filter @chimborazo/studio build
```

## 🧪 Testing & Quality

### Run tests
```bash
pnpm run test
```

### Linting
```bash
pnpm run lint
```

### Type checking
```bash
pnpm run type-check
```

### Code formatting
```bash
pnpm run format
```

## 📦 Packages

### `@chimborazo/web`
The main website built with:
- **TanStack Start** - Full-stack React framework with SSR
- **TanStack Router** - File-based routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS v4** - Utility-first styling
- **Sanity Client** - CMS integration

**Key files:**
- `apps/web/src/lib/sanity.ts` - Sanity client configuration
- `apps/web/src/env.ts` - Environment variable validation
- `apps/web/netlify.toml` - Netlify deployment config

### `@chimborazo/studio`
Sanity Studio for content management.

**Features:**
- Event management with portable text editor
- Media library with categorization
- Live preview integration (Presentation tool)
- Custom branding

**Key files:**
- `apps/studio/sanity.config.ts` - Studio configuration
- `apps/studio/netlify.toml` - Netlify deployment config

### `@chimborazo/sanity-config`
Shared package containing:
- **Schemas** - Sanity document schemas (event, mediaImage)
- **Queries** - GROQ queries for fetching data
- **Client utilities** - Sanity client creation and image URL builders
- **TypeScript types** - Generated types for type-safe CMS integration

**Usage in web app:**
```typescript
import { sanityClient, urlForImage } from '@/lib/sanity'
import { allEventsQuery, eventBySlugQuery } from '@chimborazo/sanity-config'

// Fetch all events
const events = await sanityClient.fetch(allEventsQuery)

// Get image URL with transformations
const imageUrl = urlForImage(event.heroImage)
  .width(800)
  .height(600)
  .url()
```

## 🚢 Deployment

### Web App (Netlify)

1. **Connect your repo to Netlify**
2. **Configure build settings:**
   - Build command: `pnpm run build --filter=@chimborazo/web`
   - Publish directory: `apps/web/dist/client`
   - Functions directory: `apps/web/.netlify/functions`

3. **Add environment variables** in Netlify Dashboard:
   - `VITE_SANITY_PROJECT_ID`
   - `VITE_SANITY_DATASET`
   - `VITE_SANITY_API_VERSION`
   - `SANITY_API_TOKEN`

4. **Deploy!** 🎉

### Sanity Studio (Netlify)

1. **Create a new Netlify site** for the Studio
2. **Configure build settings:**
   - Build command: `pnpm run build --filter=@chimborazo/studio`
   - Publish directory: `apps/studio/dist`

3. **Add environment variables:**
   - `SANITY_STUDIO_PROJECT_ID`
   - `SANITY_STUDIO_DATASET`
   - `SANITY_STUDIO_PREVIEW_URL` (your production web app URL)

4. **Set custom domain** (e.g., `studio.chimborazopark.org`)

5. **Add CORS origin** in Sanity project settings:
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Navigate to your project > API > CORS Origins
   - Add your Studio URL (e.g., `https://studio.chimborazopark.org`)

## 🗂️ Content Schemas

### Event
```typescript
{
  title: string
  slug: slug
  description: text
  heroImage: image { alt, caption }
  date: date
  time: string
  location: string
  body: portableText[] // Rich text content
  featured: boolean
  publishedAt: datetime
}
```

### Media Image
```typescript
{
  title: string
  image: image { alt, caption, metadata }
  category: 'park-views' | 'events' | 'nature' | 'community' | 'history'
  featured: boolean
  uploadedAt: datetime
}
```

## 🔧 Troubleshooting

### Build errors
```bash
# Clean all build artifacts and reinstall
pnpm run clean
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Type errors in shared package
```bash
# Rebuild the sanity-config package
pnpm --filter @chimborazo/sanity-config build
```

### Sanity Studio won't start
- Ensure `SANITY_STUDIO_PROJECT_ID` is set correctly
- Check that your Sanity project exists at [sanity.io/manage](https://sanity.io/manage)
- Verify CORS origins are configured

## 📚 Additional Resources

- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Netlify Documentation](https://docs.netlify.com/)

## 🎯 Next Steps

The monorepo infrastructure is set up! Here's what remains:

1. **Migrate existing content to Sanity**
   - Events from `apps/web/src/data/events.ts`
   - Media from Netlify Blobs

2. **Update web app to fetch from Sanity**
   - Replace static data with Sanity queries
   - Update components to render Sanity data

3. **Set up live preview** (Presentation tool)
4. **Configure webhooks** for instant cache invalidation
5. **Deploy both apps** to Netlify

## 📝 License

This project is for the Chimborazo Park Conservancy, a 501(c)(3) non-profit organization.
