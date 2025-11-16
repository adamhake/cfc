#!/usr/bin/env tsx
import { createClient } from "@sanity/client";
import { getStore } from "@netlify/blobs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

// Create Sanity client
const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID!,
  dataset: process.env.VITE_SANITY_DATASET!,
  apiVersion: process.env.VITE_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

/**
 * Categorize media based on filename or metadata
 */
function categorizeMedia(filename: string, metadata?: any): string {
  const lower = filename.toLowerCase();

  if (metadata?.category) return metadata.category;

  if (lower.includes("cleanup") || lower.includes("volunteer")) return "events";
  if (lower.includes("tree") || lower.includes("oak") || lower.includes("nature")) return "nature";
  if (lower.includes("roundhouse") || lower.includes("sign") || lower.includes("chimbo"))
    return "park-views";
  if (lower.includes("history") || lower.includes("historic")) return "history";
  if (lower.includes("community") || lower.includes("festival")) return "community";

  return "park-views"; // default category
}

/**
 * Check if a media image already exists by checking for matching asset
 */
async function mediaExists(assetId: string): Promise<boolean> {
  const query = `*[_type == "mediaImage" && image.asset._ref == $assetId][0]._id`;
  const existingId = await sanityClient.fetch(query, { assetId });
  return !!existingId;
}

/**
 * Migrate a single media image to Sanity
 */
async function migrateMediaImage(blob: any, metadata: any, store: any, dryRun = false) {
  console.log(`\n📸 Processing: ${blob.key}`);

  try {
    // Get the image data directly from Netlify Blobs
    console.log(`  🔗 Fetching blob data...`);
    const imageData = await store.get(blob.key, { type: "arrayBuffer" });

    if (!imageData) {
      throw new Error(`Failed to fetch blob data for ${blob.key}`);
    }

    const imageBuffer = Buffer.from(imageData);
    console.log(`  ✓ Downloaded ${(imageBuffer.length / 1024).toFixed(2)} KB`);

    if (dryRun) {
      console.log("  🔍 DRY RUN - Would upload to Sanity");
      console.log(`  📋 Metadata:`, metadata);
      return { success: true, dryRun: true };
    }

    // Upload to Sanity Assets
    console.log("  📤 Uploading to Sanity...");
    const asset = await sanityClient.assets.upload("image", imageBuffer, {
      filename: blob.key,
    });
    console.log(`  ✓ Asset uploaded: ${asset._id}`);

    // Check if this asset is already used in a mediaImage document
    if (await mediaExists(asset._id)) {
      console.log(`  ⚠️  Media document already exists for this asset`);
      console.log(`  ℹ️  Skipping to avoid duplicates`);
      return { skipped: true, reason: "already_exists" };
    }

    // Determine category
    const category = categorizeMedia(blob.key, metadata);

    // Create mediaImage document
    const sanityDoc = {
      _type: "mediaImage",
      title: metadata?.caption || metadata?.alt || blob.key.replace(/\.[^/.]+$/, ""),
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
        alt: metadata?.alt || "",
        caption: metadata?.caption,
      },
      category,
      featured: false,
      uploadedAt: new Date().toISOString(),
    };

    console.log("  💾 Creating media document...");
    const result = await sanityClient.create(sanityDoc);
    console.log(`  ✅ Successfully created: ${result._id}`);

    return { success: true, documentId: result._id };
  } catch (error) {
    console.error(`  ❌ Failed to migrate media:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * Main migration function
 */
async function migrateAllMedia(dryRun = false) {
  console.log("🚀 Starting Media Migration to Sanity\n");
  console.log("═".repeat(60));

  if (dryRun) {
    console.log("🔍 DRY RUN MODE - No changes will be made");
  }

  // Verify environment variables
  if (
    !process.env.VITE_SANITY_PROJECT_ID ||
    !process.env.SANITY_API_TOKEN ||
    !process.env.NETLIFY_SITE_ID
  ) {
    console.error("\n❌ Missing required environment variables!");
    console.error("Please ensure these are set in apps/web/.env:");
    console.error("  - VITE_SANITY_PROJECT_ID");
    console.error("  - VITE_SANITY_DATASET");
    console.error("  - VITE_SANITY_API_VERSION");
    console.error("  - SANITY_API_TOKEN");
    console.error("  - NETLIFY_SITE_ID (for accessing Netlify Blobs)");
    process.exit(1);
  }

  console.log("🔌 Connecting to Netlify Blobs...");
  const store = getStore({
    name: "media",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_TOKEN,
  });

  try {
    const { blobs } = await store.list();
    console.log(`📊 Found ${blobs.length} images in Netlify Blobs`);
    console.log("═".repeat(60));

    if (blobs.length === 0) {
      console.log("\nℹ️  No media found in Netlify Blobs. Migration complete!");
      return;
    }

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
    };

    for (const blob of blobs) {
      // Get metadata for this blob
      const metadata = await store.getMetadata(blob.key);

      const result = await migrateMediaImage(blob, metadata, store, dryRun);

      if (result.skipped) {
        results.skipped++;
      } else if (result.success) {
        results.success++;
      } else {
        results.failed++;
      }

      // Add a small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Print summary
    console.log("\n");
    console.log("═".repeat(60));
    console.log("📈 Migration Summary");
    console.log("═".repeat(60));
    console.log(`✅ Successful: ${results.success}`);
    console.log(`⚠️  Skipped:    ${results.skipped}`);
    console.log(`❌ Failed:     ${results.failed}`);
    console.log("═".repeat(60));

    if (results.failed > 0) {
      console.log("\n⚠️  Some migrations failed. Check the errors above.");
      process.exit(1);
    }

    if (dryRun) {
      console.log("\n✨ Dry run complete! Run without --dry-run to perform migration.");
    } else {
      console.log("\n✨ Migration complete! Check your Sanity Studio to verify.");
      console.log(
        "\n💡 Tip: You can now update the media route to fetch from Sanity instead of Netlify Blobs.",
      );
    }
  } catch (error) {
    console.error("\n❌ Failed to access Netlify Blobs:", error);
    console.error("\nℹ️  Make sure NETLIFY_SITE_ID is set correctly in .env");
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run") || args.includes("-d");

// Run migration
migrateAllMedia(dryRun).catch((error) => {
  console.error("\n💥 Migration failed:", error);
  process.exit(1);
});
