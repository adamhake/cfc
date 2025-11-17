// TypeScript types for Sanity content
// These match the schemas defined in @chimborazo/sanity-config

import type { PortableTextBlock } from "@portabletext/react";

export interface SanityImage {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
      lqip?: string;
      blurhash?: string;
      palette?: {
        dominant?: {
          background: string;
          foreground: string;
        };
      };
    };
  };
  alt: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SanityEvent {
  _id: string;
  _type: "event";
  title: string;
  slug: {
    current: string;
  };
  description: string;
  heroImage: SanityImage;
  date: string;
  time: string;
  location: string;
  body?: PortableTextBlock[];
  featured?: boolean;
  publishedAt?: string;
}

export interface SanityMediaImage {
  _id: string;
  _type: "mediaImage";
  title: string;
  image: SanityImage;
  category: "park-views" | "events" | "nature" | "community" | "history";
  featured?: boolean;
  uploadedAt: string;
}

// Helper type for when we just need the slug
export interface EventSlug {
  slug: string;
}

export interface SanityPartner {
  _id: string;
  _type: "partner";
  name: string;
  slug: {
    current: string;
  };
  logo: SanityImage;
  description?: string;
  websiteUrl?: string;
  order: number;
}

export interface SanityQuote {
  _id: string;
  _type: "quote";
  quoteText: string;
  attribution: string;
  backgroundImage: SanityImage;
}

export interface SanityGalleryImage {
  image: SanityImage;
  showOnMobile: boolean;
}

export interface SanityGallery {
  _id: string;
  _type: "gallery";
  title: string;
  images: SanityGalleryImage[];
}

export interface SanityHomePage {
  hero: {
    heading: string;
    subheading: string;
    heroImage: SanityMediaImage;
    ctaButton: {
      text: string;
      link: string;
    };
  };
  partners?: SanityPartner[];
  quote?: SanityQuote;
  gallery?: SanityGallery;
}

export interface SanitySiteSettings {
  organizationName: string;
  alternativeName?: string;
  description: string;
  parkAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  parkHours: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
  };
  donationUrl: string;
  contactEmail?: string;
  metaDefaults?: {
    siteTitle?: string;
    ogImage?: SanityImage;
  };
}

export interface SanityAmenitiesPage {
  pageHero: {
    title: string;
    description?: string;
    image?: SanityMediaImage;
  };
  introduction?: PortableTextBlock[];
  amenities?: Array<{
    title: string;
    slug: { current: string };
    icon: string;
    description: string;
    details?: string[];
    image?: SanityMediaImage;
    externalLink?: string;
    linkText?: string;
    section: "upper-park" | "lower-park" | "both";
  }>;
}
