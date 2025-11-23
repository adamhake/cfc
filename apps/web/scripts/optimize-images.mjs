#!/usr/bin/env node
import sharp from "sharp";
import { readdirSync, statSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, "..", "public");
const optimizedDir = join(publicDir, "optimized");

// Images that need compression (>200KB)
const priorityImages = [
  "grove_cleanup.webp", // 844KB
  "chimbo_sign.webp", // 652KB
  "bike_sunset.webp", // 548KB
  "roundhouse_evening.webp", // 504KB
  "oaks.webp", // 488KB
  "rock_sunset.webp", // 448KB
  "sign_cleanup_2022.webp", // 384KB
  "cleanup_2024.webp", // 312KB
  "volunteers.webp", // 308KB
  "get_involved.webp", // 280KB
];

// Responsive widths to generate (optimized for typical display sizes)
const widths = [640, 1024, 1536];

// Quality setting for compression (85 for better quality-to-size ratio)
const quality = 85;

async function optimizeImage(filename, inputPath) {
  console.log(`\nProcessing: ${filename}`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const originalSize = statSync(inputPath).size;

    console.log(
      `  Original: ${Math.round(originalSize / 1024)}KB (${metadata.width}x${metadata.height})`,
    );

    // Create optimized directory if it doesn't exist
    if (!existsSync(optimizedDir)) {
      mkdirSync(optimizedDir, { recursive: true });
    }

    // Generate compressed original size with better compression
    const originalWidth = metadata.width;
    const outputPath = join(optimizedDir, filename);

    await sharp(inputPath)
      .webp({
        quality,
        effort: 6,
        smartSubsample: true,
        // Use mixed mode for better compression
        lossless: false,
        // Enable near-lossless for better quality at slight size cost
        nearLossless: false,
      })
      .toFile(outputPath);

    const newSize = statSync(outputPath).size;
    const savings = Math.round(((originalSize - newSize) / originalSize) * 100);

    console.log(
      `  Compressed: ${Math.round(newSize / 1024)}KB (${savings > 0 ? "saved" : "increased"} ${Math.abs(savings)}%)`,
    );

    // Generate responsive variants
    for (const width of widths) {
      if (width >= originalWidth) {
        console.log(`  Skipping ${width}w (larger than original)`);
        continue;
      }

      const variantFilename = filename.replace(".webp", `-${width}w.webp`);
      const variantPath = join(optimizedDir, variantFilename);

      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toFile(variantPath);

      const variantSize = statSync(variantPath).size;
      console.log(`  Generated ${width}w: ${Math.round(variantSize / 1024)}KB`);
    }

    console.log(`  ✅ Complete!`);
  } catch (error) {
    console.error(`  ❌ Error processing ${filename}:`, error.message);
  }
}

async function main() {
  console.log("🖼️  Image Optimization Script");
  console.log("============================\n");
  console.log(`Source: ${publicDir}`);
  console.log(`Output: ${optimizedDir}`);
  console.log(`Quality: ${quality}`);
  console.log(`Responsive widths: ${widths.join(", ")}w\n`);

  // Process priority images
  console.log("Processing priority images (>400KB)...");

  for (const filename of priorityImages) {
    const inputPath = join(publicDir, filename);

    if (!existsSync(inputPath)) {
      console.log(`⚠️  File not found: ${filename}`);
      continue;
    }

    await optimizeImage(filename, inputPath);
  }

  console.log("\n✨ Optimization complete!");
  console.log("\nNext steps:");
  console.log("1. Review optimized images in public/optimized/");
  console.log("2. Compare quality and file sizes");
  console.log("3. Replace original images with optimized versions if satisfied");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
