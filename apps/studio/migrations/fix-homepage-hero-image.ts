/**
 * Migration to fix homepage hero image from direct image to mediaImage reference
 *
 * This migration clears the old hero.heroImage field so it can be replaced
 * with a proper mediaImage reference.
 *
 * Run this from the studio directory:
 * npx sanity@latest exec migrations/fix-homepage-hero-image.ts --with-user-token
 */

const fixHomePageHeroImage = async (client: any) => {
  console.log('Starting migration: fix homepage hero image...')

  // Fetch the homepage document
  const homePage = await client.fetch(`*[_type == "homePage"][0]`)

  if (!homePage) {
    console.log('No homepage document found. Nothing to migrate.')
    return
  }

  console.log('Found homepage document:', homePage._id)

  // Check if heroImage exists and has the old structure
  if (homePage.hero?.heroImage && 'asset' in homePage.hero.heroImage) {
    console.log('Found old hero image structure. Clearing it...')

    // Clear the heroImage field
    await client.patch(homePage._id).unset(['hero.heroImage']).commit()

    console.log('Successfully cleared hero.heroImage field.')
    console.log('Please go to Sanity Studio and select a media image for the hero.')
  } else {
    console.log('Hero image is already using reference structure or not set. No migration needed.')
  }

  console.log('Migration complete!')
}

export default fixHomePageHeroImage
