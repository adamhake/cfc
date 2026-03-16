/**
 * TypeScript type definitions for AI-generated image metadata
 *
 * NOTE: The actual metadata generation is handled by the Next.js route handler at
 * apps/next-web/src/app/api/generate-metadata/route.ts so the Anthropic API key
 * stays on the server.
 *
 * The Sanity Studio action in packages/sanity-config/src/actions/generateMetadata.ts
 * calls this function via HTTP instead of importing client-side code.
 */

export interface ImageMetadata {
  title: string
  alt: string
  caption: string
  category: "park-views" | "events" | "nature" | "community" | "history"
}
