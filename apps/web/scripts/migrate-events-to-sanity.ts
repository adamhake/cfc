#!/usr/bin/env tsx
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { events } from '../src/data/events.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') })

// Create Sanity client
const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID!,
  dataset: process.env.VITE_SANITY_DATASET!,
  apiVersion: process.env.VITE_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

/**
 * Upload an image to Sanity Assets
 */
async function uploadImageToSanity(imagePath: string, altText: string) {
  try {
    const fullPath = path.join(__dirname, '../public', imagePath)
    console.log(`  📷 Uploading image: ${imagePath}`)

    const imageBuffer = await fs.readFile(fullPath)
    const asset = await sanityClient.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath),
    })

    console.log(`  ✓ Image uploaded: ${asset._id}`)
    return asset
  } catch (error) {
    console.error(`  ✗ Failed to upload image ${imagePath}:`, error)
    throw error
  }
}

/**
 * Simple markdown to Portable Text converter
 * Converts markdown sections to basic portable text blocks
 */
async function convertMarkdownToPortableText(markdownPath: string) {
  try {
    const fullPath = path.join(__dirname, '../src/data/events', markdownPath)
    console.log(`  📝 Reading markdown: ${markdownPath}`)

    const markdownContent = await fs.readFile(fullPath, 'utf-8')

    // Simple conversion: split by paragraphs and headers
    const blocks: any[] = []
    const lines = markdownContent.split('\n')
    let currentParagraph = ''

    for (const line of lines) {
      const trimmed = line.trim()

      // Handle headers
      if (trimmed.startsWith('## ')) {
        if (currentParagraph) {
          blocks.push(createTextBlock(currentParagraph))
          currentParagraph = ''
        }
        blocks.push(createHeadingBlock(trimmed.substring(3), 'h2'))
      } else if (trimmed.startsWith('# ')) {
        if (currentParagraph) {
          blocks.push(createTextBlock(currentParagraph))
          currentParagraph = ''
        }
        blocks.push(createHeadingBlock(trimmed.substring(2), 'h1'))
      } else if (trimmed.startsWith('- ')) {
        // List item
        if (currentParagraph) {
          blocks.push(createTextBlock(currentParagraph))
          currentParagraph = ''
        }
        blocks.push(createListItemBlock(trimmed.substring(2)))
      } else if (trimmed === '') {
        // Empty line - end current paragraph
        if (currentParagraph) {
          blocks.push(createTextBlock(currentParagraph))
          currentParagraph = ''
        }
      } else {
        // Regular text
        if (currentParagraph) {
          currentParagraph += ' ' + trimmed
        } else {
          currentParagraph = trimmed
        }
      }
    }

    // Add final paragraph if exists
    if (currentParagraph) {
      blocks.push(createTextBlock(currentParagraph))
    }

    console.log(`  ✓ Converted to ${blocks.length} content blocks`)
    return blocks
  } catch (error) {
    console.error(`  ✗ Failed to convert markdown ${markdownPath}:`, error)
    throw error
  }
}

/**
 * Create a portable text block
 */
function createTextBlock(text: string) {
  return {
    _type: 'block',
    _key: generateKey(),
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: generateKey(),
        text,
        marks: [],
      },
    ],
    markDefs: [],
  }
}

/**
 * Create a heading block
 */
function createHeadingBlock(text: string, style: string) {
  return {
    _type: 'block',
    _key: generateKey(),
    style,
    children: [
      {
        _type: 'span',
        _key: generateKey(),
        text,
        marks: [],
      },
    ],
    markDefs: [],
  }
}

/**
 * Create a list item block
 */
function createListItemBlock(text: string) {
  return {
    _type: 'block',
    _key: generateKey(),
    style: 'normal',
    listItem: 'bullet',
    children: [
      {
        _type: 'span',
        _key: generateKey(),
        text,
        marks: [],
      },
    ],
    markDefs: [],
  }
}

/**
 * Generate a random key for Sanity blocks
 */
function generateKey() {
  return Math.random().toString(36).substring(2, 11)
}

/**
 * Check if an event already exists by slug
 */
async function eventExists(slug: string): Promise<boolean> {
  const query = `*[_type == "event" && slug.current == $slug][0]._id`
  const existingId = await sanityClient.fetch(query, { slug })
  return !!existingId
}

/**
 * Migrate a single event to Sanity
 */
async function migrateEvent(event: typeof events[0], dryRun = false) {
  console.log(`\n📌 Processing: ${event.title}`)

  try {
    // Check if event already exists
    if (await eventExists(event.slug)) {
      console.log(`  ⚠️  Event already exists with slug: ${event.slug}`)
      console.log(`  ℹ️  Skipping to avoid duplicates`)
      return { skipped: true, reason: 'already_exists' }
    }

    // Upload hero image
    const imageAsset = await uploadImageToSanity(event.image.src, event.image.alt)

    // Convert markdown to portable text (if exists)
    let bodyContent = null
    if (event.markdownFile) {
      bodyContent = await convertMarkdownToPortableText(event.markdownFile)
    }

    // Prepare the Sanity document
    const sanityDoc = {
      _type: 'event',
      title: event.title,
      slug: { current: event.slug },
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      heroImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id,
        },
        alt: event.image.alt,
      },
      body: bodyContent,
      featured: false,
      publishedAt: new Date().toISOString(),
    }

    if (dryRun) {
      console.log('  🔍 DRY RUN - Would create document:')
      console.log('  ', JSON.stringify(sanityDoc, null, 2))
      return { success: true, dryRun: true }
    }

    // Create the document in Sanity
    console.log('  💾 Creating Sanity document...')
    const result = await sanityClient.create(sanityDoc)
    console.log(`  ✅ Successfully created: ${result._id}`)

    return { success: true, documentId: result._id }
  } catch (error) {
    console.error(`  ❌ Failed to migrate event:`, error)
    return { success: false, error: String(error) }
  }
}

/**
 * Main migration function
 */
async function migrateAllEvents(dryRun = false) {
  console.log('🚀 Starting Events Migration to Sanity\n')
  console.log('═'.repeat(60))

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made')
  }

  console.log(`📊 Found ${events.length} events to migrate`)
  console.log('═'.repeat(60))

  // Verify environment variables
  if (!process.env.VITE_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('\n❌ Missing required environment variables!')
    console.error('Please ensure these are set in apps/web/.env:')
    console.error('  - VITE_SANITY_PROJECT_ID')
    console.error('  - VITE_SANITY_DATASET')
    console.error('  - VITE_SANITY_API_VERSION')
    console.error('  - SANITY_API_TOKEN')
    process.exit(1)
  }

  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
  }

  for (const event of events) {
    const result = await migrateEvent(event, dryRun)

    if (result.skipped) {
      results.skipped++
    } else if (result.success) {
      results.success++
    } else {
      results.failed++
    }

    // Add a small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Print summary
  console.log('\n')
  console.log('═'.repeat(60))
  console.log('📈 Migration Summary')
  console.log('═'.repeat(60))
  console.log(`✅ Successful: ${results.success}`)
  console.log(`⚠️  Skipped:    ${results.skipped}`)
  console.log(`❌ Failed:     ${results.failed}`)
  console.log('═'.repeat(60))

  if (results.failed > 0) {
    console.log('\n⚠️  Some migrations failed. Check the errors above.')
    process.exit(1)
  }

  if (dryRun) {
    console.log('\n✨ Dry run complete! Run without --dry-run to perform migration.')
  } else {
    console.log('\n✨ Migration complete! Check your Sanity Studio to verify.')
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run') || args.includes('-d')

// Run migration
migrateAllEvents(dryRun).catch((error) => {
  console.error('\n💥 Migration failed:', error)
  process.exit(1)
})
