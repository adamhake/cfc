#!/usr/bin/env node

/**
 * Script to check Netlify Blobs in the media store
 * Usage: node scripts/check-blobs.mjs
 */

import { getStore } from "@netlify/blobs";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "..", ".env") });

async function checkBlobs() {
  const siteId = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_TOKEN;

  if (!siteId) {
    console.error("❌ NETLIFY_SITE_ID environment variable is required");
    console.log("Make sure .env file exists with NETLIFY_SITE_ID");
    process.exit(1);
  }

  console.log("🔍 Checking Netlify Blobs...");
  console.log("Site ID:", siteId);
  console.log("Token exists:", !!token);

  try {
    const store = getStore({
      name: "media",
      siteID: siteId,
      token: token,
    });

    console.log("\n📋 Listing all blobs in 'media' store...");
    const { blobs } = await store.list();

    if (blobs.length === 0) {
      console.log("❌ No blobs found in the media store");
      return;
    }

    console.log(`✅ Found ${blobs.length} blob(s):\n`);

    for (const blob of blobs) {
      console.log(`📦 Blob: ${blob.key}`);
      console.log(`   Size: ${blob.size} bytes`);
      console.log(`   ETag: ${blob.etag}`);

      // Try to get metadata
      const metadata = await store.getMetadata(blob.key, {
        consistency: "strong",
      });

      if (metadata) {
        console.log("   Metadata:", JSON.stringify(metadata.metadata, null, 2));
      } else {
        console.log("   ⚠️  No metadata found");
      }
      console.log("");
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkBlobs();
