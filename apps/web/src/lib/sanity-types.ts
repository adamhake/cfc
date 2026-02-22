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

export interface SanityFile {
  _type: "fileAttachment";
  asset: {
    _id: string;
    url: string;
    originalFilename?: string;
    size?: number;
    extension?: string;
    mimeType?: string;
  };
  title?: string;
  description?: string;
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
  recap?: PortableTextBlock[];
  recapGallery?: SanityGallery;
  featured?: boolean;
  publishedAt?: string;
}

export interface SanityProject {
  _id: string;
  _type: "project";
  title: string;
  slug: {
    current: string;
  };
  description: string;
  heroImage: SanityImage;
  status: "planned" | "active" | "completed";
  startDate: string;
  startDateOverride?: string;
  completionDate?: string;
  completionDateOverride?: string;
  goal?: string;
  location?: string;
  budget?: string;
  category?: "restoration" | "recreation" | "connection" | "preservation";
  body?: PortableTextBlock[];
  gallery?: SanityImage[];
  relatedEvents?: SanityEvent[];
  partners?: SanityPartner[];
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

// Helper types for when we just need the slug
export interface EventSlug {
  slug: string;
}

export interface ProjectSlug {
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
    heroImage: SanityImage;
    ctaButton: {
      text: string;
      link: string;
    };
  };
  partners?: SanityPartner[];
  quote?: SanityQuote;
  gallery?: SanityGallery;
  parkGallery?: SanityGallery;
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
  getInvolvedGallery?: SanityGallery;
  featuredQuote?: SanityQuote;
}

export interface SanityAmenitiesPage {
  pageHero: {
    title: string;
    description?: string;
    image?: SanityImage;
  };
  introduction?: PortableTextBlock[];
  amenities?: Array<{
    title: string;
    slug: { current: string };
    icon: string;
    description: string;
    details?: string[];
    images?: SanityImage[];
    externalLink?: string;
    linkText?: string;
    section: "upper-park" | "lower-park" | "both";
  }>;
}

export interface SanityHistoryPage {
  pageHero: {
    title: string;
    description?: string;
    image?: SanityImage;
  };
  content?: PortableTextBlock[];
}

export interface SanityGetInvolvedPage {
  pageHero: {
    title: string;
    description?: string;
    image?: SanityImage;
  };
}

export interface SanityEventsPage {
  pageHero: {
    title: string;
    description?: string;
    image?: SanityImage;
  };
  introduction?: PortableTextBlock[];
}

export interface SanityProjectsPage {
  pageHero: {
    title: string;
    description?: string;
    image?: SanityImage;
  };
  introduction?: PortableTextBlock[];
}

export interface SanityMediaPage {
  pageHero: {
    title: string;
    description?: string;
    image?: SanityImage;
  };
}

export interface SanityAboutPage {
  pageHero: {
    title: string;
    description?: string;
    image?: SanityImage;
  };
}

export interface SanityDonatePage {
  pageHero: {
    title: string;
    description?: string;
    image?: SanityImage;
  };
}
