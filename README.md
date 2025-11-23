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

   This project uses [T3 Env](https://env.t3.gg/) for type-safe environment variable validation. Each workspace has its own `.env.example` file showing required variables.

   **For the web app** (`apps/web/.env`):
   ```bash
   # Copy the example file
   cp apps/web/.env.example apps/web/.env
   ```

   Then edit `apps/web/.env` with your values:
   ```bash
   # Required - Sanity CMS Configuration
   VITE_SANITY_PROJECT_ID=your_project_id_here
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2024-01-01

   # Optional - Server-side only (not exposed to browser)
   SANITY_API_TOKEN=your_api_token_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   ```

   **For the Studio** (`apps/studio/.env`):
   ```bash
   # Copy the example file
   cp apps/studio/.env.example apps/studio/.env
   ```

   Then edit `apps/studio/.env` with your values:
   ```bash
   # Required - Sanity CMS Configuration
   SANITY_STUDIO_PROJECT_ID=your_project_id_here
   SANITY_STUDIO_DATASET=production
   SANITY_STUDIO_API_VERSION=2024-01-01

   # Optional - defaults provided
   SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
   SANITY_STUDIO_API_URL=http://localhost:3000/api/generate-metadata
   ```

   **Environment Variable Validation:**
   - All environment variables are validated at build/startup time using Zod schemas
   - Type errors will occur if required variables are missing or invalid
   - See `apps/web/src/env.ts` and `apps/studio/src/env.ts` for validation schemas
   - Shared Sanity schemas are defined in `packages/sanity-config/src/env-schema.ts`

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
- **T3 Env** - Type-safe environment variable validation

**Key files:**
- `apps/web/src/lib/sanity.ts` - Sanity client configuration
- `apps/web/src/env.ts` - Environment variable validation with T3 Env
- `apps/web/netlify.toml` - Netlify deployment config

**Environment variables:**
- **Client-side** (VITE_ prefix): `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_SANITY_API_VERSION`
- **Server-side only**: `SANITY_API_TOKEN`, `ANTHROPIC_API_KEY`, `NETLIFY_AUTH_TOKEN`, etc.

### `@chimborazo/studio`
Sanity Studio for content management.

**Features:**
- Event management with portable text editor
- Media library with categorization
- Live preview integration (Presentation tool)
- AI-powered image metadata generation
- Custom branding
- T3 Env for environment variable validation

**Key files:**
- `apps/studio/sanity.config.ts` - Studio configuration
- `apps/studio/src/env.ts` - Environment variable validation with T3 Env
- `apps/studio/netlify.toml` - Netlify deployment config

**Environment variables:**
- All use `SANITY_STUDIO_*` prefix: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_STUDIO_PREVIEW_URL`, etc.

### `@chimborazo/sanity-config`
Shared package containing:
- **Schemas** - Sanity document schemas (event, mediaImage)
- **Queries** - GROQ queries for fetching data
- **Client utilities** - Sanity client creation and image URL builders
- **TypeScript types** - Generated types for type-safe CMS integration
- **Environment schemas** - Shared Zod schemas for Sanity env vars (used by both web and studio)

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

   **Required:**
   - `VITE_SANITY_PROJECT_ID` - Your Sanity project ID
   - `VITE_SANITY_DATASET` - Dataset name (usually "production")
   - `VITE_SANITY_API_VERSION` - API version (e.g., "2024-01-01")

   **Optional (server-side only):**
   - `SANITY_API_TOKEN` - For mutations and preview mode
   - `ANTHROPIC_API_KEY` - For AI metadata generation
   - `NETLIFY_AUTH_TOKEN` - For cache purging
   - `NETLIFY_SITE_ID` - For cache purging
   - `SANITY_WEBHOOK_SECRET` - For webhook validation

   > **Note:** All env vars are validated using T3 Env. Missing required vars will cause build failures with clear error messages.

4. **Deploy!** 🎉

### Sanity Studio (Netlify)

1. **Create a new Netlify site** for the Studio
2. **Configure build settings:**
   - Build command: `pnpm run build --filter=@chimborazo/studio`
   - Publish directory: `apps/studio/dist`

3. **Add environment variables:**

   **Required:**
   - `SANITY_STUDIO_PROJECT_ID` - Your Sanity project ID
   - `SANITY_STUDIO_DATASET` - Dataset name (usually "production")
   - `SANITY_STUDIO_API_VERSION` - API version (e.g., "2024-01-01")

   **Optional (with defaults):**
   - `SANITY_STUDIO_PREVIEW_URL` - Your production web app URL (default: http://localhost:3000)
   - `SANITY_STUDIO_API_URL` - API endpoint for AI metadata (default: http://localhost:3000/api/generate-metadata)

   > **Note:** All env vars are validated using T3 Env. The Studio will fail to build if required vars are missing.

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
- Ensure `SANITY_STUDIO_PROJECT_ID` is set correctly in `.env`
- Check that your Sanity project exists at [sanity.io/manage](https://sanity.io/manage)
- Verify CORS origins are configured
- Check for T3 Env validation errors in the console

### Environment variable errors
```bash
# T3 Env will show clear errors if variables are missing or invalid
# Example: "VITE_SANITY_PROJECT_ID is required but was not set"

# Check your .env files match the .env.example templates
# Validation schemas are in:
# - apps/web/src/env.ts
# - apps/studio/src/env.ts
# - packages/sanity-config/src/env-schema.ts
```

## 📚 Additional Resources

- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [T3 Env Documentation](https://env.t3.gg/) - Type-safe environment variable validation

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
