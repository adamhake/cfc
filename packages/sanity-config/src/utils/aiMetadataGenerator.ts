/**
 * TypeScript type definitions for AI-generated image metadata
 *
 * NOTE: The actual metadata generation has been moved to a Netlify serverless function
 * at apps/web/netlify/functions/generate-metadata.ts to keep the Anthropic API key
 * secure on the server side.
 *
 * The Sanity Studio action in packages/sanity-config/src/actions/generateMetadata.ts
 * calls this function via HTTP instead of importing client-side code.
 */

export interface ImageMetadata {
  title: string;
  alt: string;
  caption: string;
  category: "park-views" | "events" | "nature" | "community" | "history";
}
