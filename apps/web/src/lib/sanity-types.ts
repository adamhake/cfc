// TypeScript types for Sanity content
// These match the schemas defined in @chimborazo/sanity-config

export interface SanityImage {
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions?: {
        width: number
        height: number
        aspectRatio: number
      }
      lqip?: string
      blurhash?: string
      palette?: {
        dominant?: {
          background: string
          foreground: string
        }
      }
    }
  }
  alt: string
  caption?: string
  hotspot?: {
    x: number
    y: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface SanityEvent {
  _id: string
  _type: 'event'
  title: string
  slug: {
    current: string
  }
  description: string
  heroImage: SanityImage
  date: string
  time: string
  location: string
  body?: any[] // Portable text blocks
  featured?: boolean
  publishedAt?: string
}

export interface SanityMediaImage {
  _id: string
  _type: 'mediaImage'
  title: string
  image: SanityImage
  category: 'park-views' | 'events' | 'nature' | 'community' | 'history'
  featured?: boolean
  uploadedAt: string
}

// Helper type for when we just need the slug
export interface EventSlug {
  slug: string
}
