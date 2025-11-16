#!/usr/bin/env tsx
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import dotenv from "dotenv";
import path from "path";
import readline from "readline";
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

// Create image URL builder
const builder = imageUrlBuilder(sanityClient);

// Create Anthropic client for AI vision
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Create readline interface for interactive mode
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Prompt user for input
 */
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Generate alt text from title and category
 */
function generateAltText(title: string, category: string): string {
  const categoryMap: Record<string, string> = {
    "park-views": "View of Chimborazo Park",
    events: "Event at Chimborazo Park",
    nature: "Nature in Chimborazo Park",
    community: "Community gathering at Chimborazo Park",
    history: "Historical view of Chimborazo Park",
  };

  const prefix = categoryMap[category] || "Chimborazo Park";

  // Clean up the title for use in alt text
  const cleanTitle = title
    .replace(/\.(jpg|jpeg|png|webp|gif)$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return `${prefix}: ${cleanTitle}`;
}

/**
 * Generate caption from title
 */
function generateCaption(title: string): string {
  return title
    .replace(/\.(jpg|jpeg|png|webp|gif)$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Analyze image using AI vision to generate better alt text and caption
 */
async function analyzeImageWithAI(
  imageUrl: string,
  title: string,
  category: string,
): Promise<{ alt: string; caption: string } | null> {
  if (!anthropic) {
    console.log("  ⚠️  ANTHROPIC_API_KEY not set - using basic generation");
    return null;
  }

  try {
    console.log("  🔍 Analyzing image with AI vision...");

    // Fetch the image and convert to base64
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Since we're explicitly requesting JPEG from Sanity, always use image/jpeg
    // This is more reliable than trying to detect from URL
    const mediaType = "image/jpeg";

    // Create a focused prompt for alt text and caption generation
    const prompt = `You are helping generate accessibility text for images on the Chimborazo Park Conservancy website. Chimborazo Park is a historic 180+ acre park in Richmond, Virginia's Church Hill neighborhood.

Current metadata:
- Category: ${category}
- Filename: ${title}

Please analyze this image and provide:
1. Alt text (1-2 sentences, descriptive for screen readers, focusing on what's visible)
2. Caption (1 short sentence, engaging for sighted users, can include context)

Guidelines:
- Alt text should describe what's IN the image (objects, people, scenery, actions)
- Caption can be more poetic or contextual
- Mention "Chimborazo Park" when relevant
- Keep it concise but descriptive
- For events: describe the activity and atmosphere
- For nature: describe specific features (trees, landscape, etc.)
- For park views: describe structures, viewpoints, or notable features

Return ONLY a JSON object with this exact format:
{"alt": "descriptive alt text here", "caption": "engaging caption here"}`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    // Parse the response
    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from AI");
    }

    // Extract JSON from the response (handle markdown code blocks)
    let jsonText = textContent.text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    const result = JSON.parse(jsonText);

    if (!result.alt || !result.caption) {
      throw new Error("Invalid response format from AI");
    }

    console.log("  ✓ AI analysis complete");
    return { alt: result.alt, caption: result.caption };
  } catch (error) {
    console.error("  ⚠️  AI analysis failed:", error);
    console.log("  ℹ️  Falling back to basic generation");
    return null;
  }
}

/**
 * Update alt text and caption for a single media image
 */
async function updateMediaImage(
  doc: any,
  interactive: boolean,
  dryRun: boolean,
  useAI: boolean,
): Promise<{ updated: boolean; skipped: boolean; error?: string }> {
  console.log(`\n📸 Processing: ${doc.title}`);
  console.log(`  ID: ${doc._id}`);
  console.log(`  Category: ${doc.category || "unknown"}`);

  const currentAlt = doc.image?.alt || "";
  const currentCaption = doc.image?.caption || "";

  console.log(`  Current alt: "${currentAlt}"`);
  console.log(`  Current caption: "${currentCaption}"`);

  // Check if updates are needed
  const needsAlt = !currentAlt || currentAlt.trim() === "";
  const needsCaption = !currentCaption || currentCaption.trim() === "";

  if (!needsAlt && !needsCaption) {
    console.log("  ✓ Already has alt text and caption - skipping");
    return { updated: false, skipped: true };
  }

  let newAlt = currentAlt;
  let newCaption = currentCaption;

  // Try AI analysis first if enabled
  let aiResult: { alt: string; caption: string } | null = null;
  if (useAI && doc.image?.asset) {
    try {
      // Build image URL from Sanity, always requesting JPEG format
      // This ensures consistent format for the AI vision API
      const imageUrl = builder.image(doc.image).width(1024).format("jpg").url();

      console.log(`  🔗 Image URL: ${imageUrl.substring(0, 60)}...`);
      aiResult = await analyzeImageWithAI(imageUrl, doc.title, doc.category || "park-views");
    } catch (error) {
      console.error("  ⚠️  Failed to analyze with AI:", error);
      console.error("  Error details:", error);
    }
  } else if (useAI && !doc.image?.asset) {
    console.log("  ⚠️  No image asset found - skipping AI analysis");
  }

  if (interactive) {
    // Interactive mode - let user review and edit
    console.log("\n  🤔 Suggestions:");

    if (needsAlt) {
      const suggestedAlt =
        aiResult?.alt || generateAltText(doc.title, doc.category || "park-views");
      console.log(`  Alt text: "${suggestedAlt}"`);
      if (aiResult) console.log("  (AI-generated)");
      const altInput = await prompt("  Enter alt text (or press Enter to use suggestion): ");
      newAlt = altInput.trim() || suggestedAlt;
    }

    if (needsCaption) {
      const suggestedCaption = aiResult?.caption || generateCaption(doc.title);
      console.log(`  Caption: "${suggestedCaption}"`);
      if (aiResult) console.log("  (AI-generated)");
      const captionInput = await prompt(
        '  Enter caption (or press Enter to use suggestion, or "skip" to leave empty): ',
      );
      newCaption = captionInput.trim() === "skip" ? "" : captionInput.trim() || suggestedCaption;
    }
  } else {
    // Automatic mode - use AI or generated values
    if (needsAlt) {
      newAlt = aiResult?.alt || generateAltText(doc.title, doc.category || "park-views");
      console.log(`  📝 ${aiResult ? "AI-generated" : "Generated"} alt: "${newAlt}"`);
    }

    if (needsCaption) {
      newCaption = aiResult?.caption || generateCaption(doc.title);
      console.log(`  📝 ${aiResult ? "AI-generated" : "Generated"} caption: "${newCaption}"`);
    }
  }

  if (dryRun) {
    console.log("  🔍 DRY RUN - Would update:");
    if (needsAlt) console.log(`    Alt: "${newAlt}"`);
    if (needsCaption) console.log(`    Caption: "${newCaption}"`);
    return { updated: true, skipped: false };
  }

  try {
    // Build the patch object
    const patchData: any = {
      "image.alt": newAlt,
    };

    if (newCaption) {
      patchData["image.caption"] = newCaption;
    }

    // Update the document
    await sanityClient.patch(doc._id).set(patchData).commit();

    console.log("  ✅ Successfully updated!");
    return { updated: true, skipped: false };
  } catch (error) {
    console.error("  ❌ Failed to update:", error);
    return { updated: false, skipped: false, error: String(error) };
  }
}

/**
 * Main function to add alt text and captions
 */
async function addAltTextToMedia(options: {
  interactive?: boolean;
  dryRun?: boolean;
  missingOnly?: boolean;
  useAI?: boolean;
}) {
  const { interactive = false, dryRun = false, missingOnly = true, useAI = true } = options;

  console.log("🖼️  Adding Alt Text and Captions to Media Images\n");
  console.log("═".repeat(60));

  if (dryRun) {
    console.log("🔍 DRY RUN MODE - No changes will be made");
  }

  if (interactive) {
    console.log("💬 INTERACTIVE MODE - You will be prompted for each image");
  }

  if (useAI && anthropic) {
    console.log("🤖 AI VISION MODE - Using Claude to analyze images");
    console.log(`   API Key: ${process.env.ANTHROPIC_API_KEY?.substring(0, 20)}...`);
  } else if (useAI && !anthropic) {
    console.log("⚠️  AI mode requested but ANTHROPIC_API_KEY not set");
    console.log("📝 Using basic generation instead");
  } else {
    console.log("📝 BASIC MODE - Using title-based generation");
  }

  if (missingOnly) {
    console.log("📋 Processing only images missing alt text or captions");
  }

  console.log("═".repeat(60));

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
    // Build query based on options
    let query = `*[_type == "mediaImage"] {
      _id,
      title,
      category,
      image {
        asset->{_id, url},
        alt,
        caption,
        hotspot,
        crop
      }
    }`;

    if (missingOnly) {
      query = `*[_type == "mediaImage" && (
        !defined(image.alt) ||
        image.alt == "" ||
        !defined(image.caption) ||
        image.caption == ""
      )] {
        _id,
        title,
        category,
        image {
          asset->{_id, url},
          alt,
          caption,
          hotspot,
          crop
        }
      }`;
    }

    console.log("\n📊 Fetching media images...");
    const documents = await sanityClient.fetch(query);
    console.log(`Found ${documents.length} media images to process\n`);

    if (documents.length === 0) {
      console.log("ℹ️  No images need updates. Great job!");
      rl.close();
      return;
    }

    if (interactive) {
      console.log("\n💡 Tips:");
      console.log("  - Press Enter to use the suggested text");
      console.log('  - Type "skip" for captions to leave them empty');
      console.log("  - Alt text is required for accessibility\n");
    }

    const results = {
      updated: 0,
      skipped: 0,
      failed: 0,
    };

    for (const doc of documents) {
      const result = await updateMediaImage(doc, interactive, dryRun, useAI);

      if (result.updated) {
        results.updated++;
      } else if (result.skipped) {
        results.skipped++;
      } else {
        results.failed++;
      }

      // Add a delay to avoid rate limits (longer for AI mode)
      if (!interactive) {
        const delay = useAI && anthropic ? 1000 : 300;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Print summary
    console.log("\n");
    console.log("═".repeat(60));
    console.log("📈 Update Summary");
    console.log("═".repeat(60));
    console.log(`✅ Updated:  ${results.updated}`);
    console.log(`⏭️  Skipped:  ${results.skipped}`);
    console.log(`❌ Failed:   ${results.failed}`);
    console.log("═".repeat(60));

    if (results.failed > 0) {
      console.log("\n⚠️  Some updates failed. Check the errors above.");
    }

    if (dryRun) {
      console.log("\n✨ Dry run complete! Run without --dry-run to apply changes.");
    } else {
      console.log("\n✨ Update complete! Your images now have better accessibility.");
      console.log("💡 Tip: Review the updates in Sanity Studio to ensure they look good.");
    }

    rl.close();
  } catch (error) {
    console.error("\n❌ Failed to fetch documents:", error);
    rl.close();
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run") || args.includes("-d");
const interactive = args.includes("--interactive") || args.includes("-i");
const all = args.includes("--all") || args.includes("-a");
const noAI = args.includes("--no-ai");

// Run the script
addAltTextToMedia({
  interactive,
  dryRun,
  missingOnly: !all,
  useAI: !noAI,
}).catch((error) => {
  console.error("\n💥 Update failed:", error);
  rl.close();
  process.exit(1);
});
