#!/usr/bin/env tsx
import { createClient } from "@sanity/client";
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
 * Fix uploadedAt field for all mediaImage documents
 * Sets uploadedAt to _createdAt if it's invalid or missing
 */
async function fixUploadedAtField(dryRun = false) {
  console.log("🔧 Fixing uploadedAt field for mediaImage documents\n");
  console.log("═".repeat(60));

  if (dryRun) {
    console.log("🔍 DRY RUN MODE - No changes will be made\n");
  }

  // Verify environment variables
  if (!process.env.VITE_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error("\n❌ Missing required environment variables!");
    console.error("Please ensure these are set in apps/web/.env:");
    console.error("  - VITE_SANITY_PROJECT_ID");
    console.error("  - VITE_SANITY_DATASET");
    console.error("  - VITE_SANITY_API_VERSION");
    console.error("  - SANITY_API_TOKEN");
    process.exit(1);
  }

  try {
    // Fetch all mediaImage documents
    const query = `*[_type == "mediaImage"] {
      _id,
      _createdAt,
      title,
      uploadedAt
    }`;

    console.log("📊 Fetching mediaImage documents...");
    const documents = await sanityClient.fetch(query);
    console.log(`Found ${documents.length} mediaImage documents\n`);

    if (documents.length === 0) {
      console.log("ℹ️  No documents found. Nothing to fix!");
      return;
    }

    const results = {
      fixed: 0,
      skipped: 0,
      failed: 0,
    };

    for (const doc of documents) {
      console.log(`\n📄 Processing: ${doc.title}`);
      console.log(`  ID: ${doc._id}`);
      console.log(`  Current uploadedAt: ${doc.uploadedAt}`);
      console.log(`  _createdAt: ${doc._createdAt}`);

      // Check if uploadedAt is invalid or missing
      let needsUpdate = false;

      if (!doc.uploadedAt) {
        console.log("  ⚠️  uploadedAt is missing");
        needsUpdate = true;
      } else {
        const date = new Date(doc.uploadedAt);
        if (isNaN(date.getTime())) {
          console.log("  ⚠️  uploadedAt is invalid");
          needsUpdate = true;
        } else {
          console.log("  ✓ uploadedAt is valid - skipping");
          results.skipped++;
          continue;
        }
      }

      if (!needsUpdate) {
        results.skipped++;
        continue;
      }

      if (dryRun) {
        console.log(`  🔍 DRY RUN - Would update uploadedAt to ${doc._createdAt}`);
        results.fixed++;
        continue;
      }

      try {
        // Update the document
        await sanityClient.patch(doc._id).set({ uploadedAt: doc._createdAt }).commit();

        console.log(`  ✅ Successfully updated uploadedAt to ${doc._createdAt}`);
        results.fixed++;
      } catch (error) {
        console.error(`  ❌ Failed to update:`, error);
        results.failed++;
      }

      // Add a small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Print summary
    console.log("\n");
    console.log("═".repeat(60));
    console.log("📈 Fix Summary");
    console.log("═".repeat(60));
    console.log(`✅ Fixed:    ${results.fixed}`);
    console.log(`⏭️  Skipped:  ${results.skipped} (already valid)`);
    console.log(`❌ Failed:   ${results.failed}`);
    console.log("═".repeat(60));

    if (results.failed > 0) {
      console.log("\n⚠️  Some updates failed. Check the errors above.");
      process.exit(1);
    }

    if (dryRun) {
      console.log("\n✨ Dry run complete! Run without --dry-run to apply fixes.");
    } else {
      console.log("\n✨ Fix complete! Check your Sanity Studio - the error should be resolved.");
    }
  } catch (error) {
    console.error("\n❌ Failed to fetch documents:", error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run") || args.includes("-d");

// Run fix
fixUploadedAtField(dryRun).catch((error) => {
  console.error("\n💥 Fix failed:", error);
  process.exit(1);
});
