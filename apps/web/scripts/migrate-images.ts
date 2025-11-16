/**
 * Migration script to upload existing images from /public to Netlify Blobs
 *
 * Usage:
 *   1. Set NETLIFY_SITE_ID in your environment or .env file
 *   2. Run: npx tsx scripts/migrate-images.ts
 *
 * This script will:
 * - Read all .webp images from the public directory
 * - Extract image dimensions using sharp
 * - Upload to Netlify Blobs with metadata
 */

import "dotenv/config";
import { getStore } from "@netlify/blobs";
import { readFile, readdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

// Define images with their metadata
const imageMetadata: Record<string, { alt: string; caption?: string }> = {
  "chimbo_arial.webp": {
    alt: "Aerial view of Chimborazo Park",
    caption: "Aerial view showing the park's layout and surrounding neighborhood",
  },
  "chimbo_circle.webp": {
    alt: "Chimborazo Park center circle",
    caption: "The historic center circle of Chimborazo Park",
  },
  "chimbo_prom.webp": {
    alt: "Promenade at Chimborazo Park",
    caption: "Walking promenade through the park",
  },
  "bike_sunset.webp": {
    alt: "Sunset view from Chimborazo Park with bike",
    caption: "Beautiful sunset over Richmond from the park",
  },
  "chimbo_hero_adj.webp": {
    alt: "Chimborazo Park landscape",
    caption: "Scenic view of the park grounds",
  },
  "chimbo_sign.webp": {
    alt: "Chimborazo Park sign",
    caption: "Historic park entrance sign",
  },
  "chimob_gaz.webp": {
    alt: "Gazebo at Chimborazo Park",
    caption: "The park's gazebo, a gathering place for events",
  },
  "cleanup_2024.webp": {
    alt: "Community cleanup event 2024",
    caption: "Volunteers working together to beautify the park",
  },
  "festival.webp": {
    alt: "Festival at Chimborazo Park",
    caption: "Community gathering and celebration in the park",
  },
  "grove_cleanup.webp": {
    alt: "Grove cleanup volunteers",
    caption: "Community members cleaning the oak grove",
  },
  "oaks.webp": {
    alt: "Oak trees in Chimborazo Park",
    caption: "Majestic oak trees that define the park's character",
  },
  "recreation.webp": {
    alt: "Recreation at Chimborazo Park",
    caption: "Park visitors enjoying recreational activities",
  },
  "rock_sunset.webp": {
    alt: "Sunset view with rock outcropping",
    caption: "Sunset over the James River from the park overlook",
  },
  "roundhouse_evening.webp": {
    alt: "Chimborazo Park Round House at evening",
    caption: "The historic Round House building in evening light",
  },
  "sign_cleanup_2022.webp": {
    alt: "Cleanup event sign 2022",
    caption: "Community cleanup event announcement",
  },
  "sign_cleanup.webp": {
    alt: "Cleanup event signage",
    caption: "Volunteers gathering for park maintenance",
  },
  "tree_planting_plan.webp": {
    alt: "Tree planting plan for Chimborazo Park",
    caption: "2025 tree planting initiative map",
  },
  "volunteers.webp": {
    alt: "Volunteers at Chimborazo Park",
    caption: "Community volunteers working together",
  },
};

async function migrateImages() {
  console.log("🚀 Starting image migration to Netlify Blobs...\n");

  // Check for required environment variables
  const siteId = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_TOKEN;

  if (!siteId) {
    console.error("❌ Error: NETLIFY_SITE_ID environment variable is required");
    console.error("   Set it in your .env file or environment");
    process.exit(1);
  }

  if (!token) {
    console.error("❌ Error: NETLIFY_TOKEN environment variable is required for local migration");
    console.error(
      "   Get your token from: https://app.netlify.com/user/applications#personal-access-tokens",
    );
    console.error("   Then add it to your .env file:");
    console.error("   NETLIFY_TOKEN=your-token-here");
    process.exit(1);
  }

  const publicDir = join(process.cwd(), "public");

  try {
    // Get the media store
    const store = getStore({
      name: "media",
      siteID: siteId,
      token: token,
    });

    // Read all files from public directory
    const files = await readdir(publicDir);
    const imageFiles = files.filter((file) => file.endsWith(".webp"));

    console.log(`📁 Found ${imageFiles.length} images to migrate\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const filename of imageFiles) {
      try {
        const filePath = join(publicDir, filename);

        // Read the file
        const buffer = await readFile(filePath);

        // Get image dimensions
        const metadata = await sharp(buffer).metadata();
        const width = metadata.width || 800;
        const height = metadata.height || 600;

        // Get custom metadata or use defaults
        const customMeta = imageMetadata[filename] || {
          alt: filename.replace(/\.(webp|jpg|jpeg|png)$/, "").replace(/[_-]/g, " "),
          caption: undefined,
        };

        // Check if image already exists
        const existing = await store.get(filename);
        if (existing) {
          console.log(`⏭️  Skipping ${filename} (already exists)`);
          skipCount++;
          continue;
        }

        // Upload to Netlify Blobs (convert Buffer to ArrayBuffer)
        const arrayBuffer = buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength,
        ) as ArrayBuffer;
        await store.set(filename, arrayBuffer, {
          metadata: {
            width,
            height,
            alt: customMeta.alt,
            caption: customMeta.caption,
            uploadedAt: new Date().toISOString(),
          },
        });

        console.log(`✅ Uploaded ${filename} (${width}x${height})`);
        if (customMeta.caption) {
          console.log(`   Caption: "${customMeta.caption}"`);
        }
        successCount++;
      } catch (error) {
        console.error(`❌ Error uploading ${filename}:`, error);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("📊 Migration Summary:");
    console.log(`   ✅ Uploaded: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log("=".repeat(50));

    if (errorCount === 0) {
      console.log("\n🎉 Migration completed successfully!");
    } else {
      console.log("\n⚠️  Migration completed with some errors");
    }
  } catch (error) {
    console.error("❌ Fatal error during migration:", error);
    process.exit(1);
  }
}

// Run the migration
migrateImages();
