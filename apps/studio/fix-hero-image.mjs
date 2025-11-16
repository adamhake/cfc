/**
 * Quick fix script to clear the old homepage hero image field
 * Run with: node fix-hero-image.mjs
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'pntpob7k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN || '',
})

async function fixHeroImage() {
  try {
    console.log('Fetching homepage document...')

    const homePage = await client.fetch(`*[_type == "homePage"][0]`)

    if (!homePage) {
      console.log('No homepage document found.')
      return
    }

    console.log('Found homepage:', homePage._id)
    console.log('Current hero.heroImage:', JSON.stringify(homePage.hero?.heroImage, null, 2))

    if (!homePage.hero?.heroImage) {
      console.log('No hero image to clear.')
      return
    }

    console.log('\nClearing hero.heroImage field...')

    const result = await client
      .patch(homePage._id)
      .unset(['hero.heroImage'])
      .commit()

    console.log('Success! Field cleared.')
    console.log('Result:', result)
    console.log('\nNow you can go to Sanity Studio and select a mediaImage for the hero.')

  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

fixHeroImage()
