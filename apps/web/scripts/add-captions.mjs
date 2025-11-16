#!/usr/bin/env node
import { getStore } from "@netlify/blobs";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "..", ".env") });

// Sample captions for your existing images
const captions = {
  "bike_sunset.webp": "Cyclists enjoying a beautiful sunset at Chimborazo Park",
  "chimbo_aerial.webp": "Aerial view of the 42-acre historic park",
  "chimbo_circle.webp": "The iconic circular overlook with panoramic city views",
  "chimbo_hero_adj.webp": "Chimborazo Park's scenic landscape",
  "chimbo_prom.webp": "Historic promenade from the early 1900s",
  "chimbo_sign.webp": "Welcome to Chimborazo Park",
  "chimbo_sitting.webp": "Peaceful sitting area with river views",
  "chimob_gaz.webp": "Historic gazebo gathering space",
  "oaks.webp": "Majestic century-old oak trees",
  "recreation.webp": "Active community recreation spaces",
  "rock_sunset.webp": "Stunning sunset view from the overlook",
  "roundhouse_evening.webp": "The park's iconic Round House at evening",
  "sign_cleanup.webp": "Community volunteers restoring park signage",
  "sign_cleanup_2022.webp": "2022 park beautification effort",
  "tree_planting_plan.webp": "Community tree planting initiative",
  "volunteers.webp": "Dedicated volunteers working to improve the park",
};

async function addCaptions() {
  const siteId = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_TOKEN;

  if (!siteId || !token) {
    console.error("Missing NETLIFY_SITE_ID or NETLIFY_TOKEN environment variables");
    process.exit(1);
  }

  console.log("Connecting to Netlify Blobs...");

  const store = getStore({
    name: "media",
    siteID: siteId,
    token: token,
  });

  // List all blobs
  const { blobs } = await store.list();
  console.log(`Found ${blobs.length} blobs\n`);

  for (const blob of blobs) {
    try {
      console.log(`Processing: ${blob.key}`);

      // Get existing metadata
      const result = await store.getMetadata(blob.key);

      if (!result) {
        console.log(`  ⚠️  No metadata found, skipping`);
        continue;
      }

      const existingMetadata = result.metadata;
      const caption = captions[blob.key];

      if (!caption) {
        console.log(`  ℹ️  No caption defined for this image`);
        continue;
      }

      // Update metadata with caption
      const updatedMetadata = {
        ...existingMetadata,
        caption,
      };

      // Get the blob data and re-set it with updated metadata
      const blobData = await store.get(blob.key, { type: "arrayBuffer" });

      if (!blobData) {
        console.log(`  ⚠️  Could not fetch blob data, skipping`);
        continue;
      }

      await store.set(blob.key, blobData, {
        metadata: updatedMetadata,
      });

      console.log(`  ✅ Added caption: "${caption}"`);
    } catch (error) {
      console.error(`  ❌ Error processing ${blob.key}:`, error.message);
    }
  }

  console.log("\n✨ Done!");
}

addCaptions().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
