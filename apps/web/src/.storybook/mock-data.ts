/**
 * Centralized mock data utilities for Storybook stories
 *
 * This file provides consistent mock data across all component stories,
 * making it easier to maintain and update test data.
 */

import type { SanityImageObject } from "@sanity/image-url/lib/types/types";

/**
 * Mock Sanity image objects
 */
export const mockImages = {
  landscape: {
    asset: {
      _id: "image-landscape-123",
      url: "https://cdn.sanity.io/images/projectid/production/landscape-1920x1080.jpg",
      metadata: {
        dimensions: {
          width: 1920,
          height: 1080,
          aspectRatio: 1.7778,
        },
        lqip: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAALABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFBv/EACQQAAIBAwMDBQAAAAAAAAAAAAECAwAEEQUhMQZBUhMiUWGR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAwAB/8QAGREAAwEBAQAAAAAAAAAAAAAAAAECESEx/9oADAMBAAIRAxEAPwDR6RpGmWMaSLpkKsrY+I/FeU/VGm2em65LBZWscMS8KqDH3XoMOnR7a/t7W3iWKNAPtA+K5X1rpEeoa5I8M6MrKPbu3GB/a7vS0s2H0f/Z",
      },
    },
    alt: "Chimborazo Park scenic view",
  } as SanityImageObject,

  portrait: {
    asset: {
      _id: "image-portrait-456",
      url: "https://cdn.sanity.io/images/projectid/production/portrait-800x1200.jpg",
      metadata: {
        dimensions: {
          width: 800,
          height: 1200,
          aspectRatio: 0.6667,
        },
        lqip: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAYABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAQFAgP/xAAjEAACAQMEAgMBAAAAAAAAAAABAgMABBEFEiExQVETImFx/8QAFgEBAQEAAAAAAAAAAAAAAAAAAwEC/8QAGhEBAQACAwAAAAAAAAAAAAAAAAECESExQf/aAAwDAQACEQMRAD8A4WemXdzOiQQszE4wK9G0X0+1tbhLi8ZpmjOQiDAzXG10O6gkV7i2lVl3bScA/teyxtbpHRmRj7WOeRSy72mZYf/Z",
      },
    },
    alt: "Community event poster",
  } as SanityImageObject,

  square: {
    asset: {
      _id: "image-square-789",
      url: "https://cdn.sanity.io/images/projectid/production/square-1000x1000.jpg",
      metadata: {
        dimensions: {
          width: 1000,
          height: 1000,
          aspectRatio: 1,
        },
        lqip: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABQAEBv/EACQQAAEEAQMEAwAAAAAAAAAAAAEAAgMEBREhMQYSQVETYXH/xAAWAQEBAQAAAAAAAAAAAAAAAAADAgH/xAAYEQEBAQEBAAAAAAAAAAAAAAABABECIf/aAAwDAQACEQMRAD8AzukIIbFWTmWZqsSEteGMdp91r3uj6F2NxE1oPoqXpCMxYeFrjkhWA1c8rnMbGN8Qfk3Yo9H/2Q==",
      },
    },
    alt: "Park activity",
  } as SanityImageObject,
};

/**
 * Mock event data
 */
export const mockEvents = {
  upcoming: {
    _id: "event-upcoming",
    title: "Spring Garden Cleanup",
    slug: { current: "spring-garden-cleanup" },
    description:
      "Join us for our annual spring garden cleanup! We'll be planting flowers, removing weeds, and preparing the park for the season.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    time: "9:00 AM - 12:00 PM",
    location: "Chimborazo Park Main Entrance",
    image: mockImages.landscape,
  },

  past: {
    _id: "event-past",
    title: "Winter Festival",
    slug: { current: "winter-festival" },
    description:
      "A celebration of the winter season with activities for all ages, including ice skating, hot cocoa, and live music.",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    time: "2:00 PM - 6:00 PM",
    location: "Chimborazo Park Pavilion",
    image: mockImages.portrait,
  },

  noImage: {
    _id: "event-no-image",
    title: "Community Meeting",
    slug: { current: "community-meeting" },
    description: "Monthly community meeting to discuss park improvements and upcoming events.",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    time: "6:30 PM - 8:00 PM",
    location: "Chimborazo Park Community Center",
  },

  longDescription: {
    _id: "event-long",
    title: "Annual Chimborazo Park Heritage Festival",
    slug: { current: "heritage-festival" },
    description:
      "Join us for a full day of celebration honoring the rich history and cultural heritage of Chimborazo Park and the Church Hill neighborhood. This annual festival features historical reenactments, traditional music performances, artisan craft demonstrations, local food vendors, guided historical tours of the park's Civil War fortifications, children's educational activities, and much more. The event is free and open to the public, with activities suitable for all ages. Rain or shine!",
    date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    time: "10:00 AM - 6:00 PM",
    location: "Throughout Chimborazo Park",
    image: mockImages.landscape,
  },
};

/**
 * Mock partner data
 */
export const mockPartners = [
  {
    _id: "partner-1",
    name: "Richmond Parks & Recreation",
    logo: { asset: { url: "/partners/richmond-parks.png" } },
    url: "https://example.com",
  },
  {
    _id: "partner-2",
    name: "Church Hill Association",
    logo: { asset: { url: "/partners/church-hill.png" } },
    url: "https://example.com",
  },
  {
    _id: "partner-3",
    name: "Virginia Historical Society",
    logo: { asset: { url: "/partners/va-historical.png" } },
    url: "https://example.com",
  },
];

/**
 * Mock gallery image data
 */
export const mockGalleryImages = [
  {
    asset: mockImages.landscape.asset,
    alt: "Spring flowers in bloom",
    caption: "Colorful tulips along the walking path",
  },
  {
    asset: mockImages.square.asset,
    alt: "Community volunteers",
    caption: "Volunteers planting trees",
  },
  {
    asset: mockImages.portrait.asset,
    alt: "Historical monument",
    caption: "Civil War memorial at sunset",
  },
  {
    asset: mockImages.landscape.asset,
    alt: "Children playing",
    caption: "Kids enjoying the playground",
  },
];

/**
 * Mock portable text content
 */
export const mockPortableTextContent = [
  {
    _type: "block",
    style: "normal",
    children: [
      {
        _type: "span",
        text: "Chimborazo Park is a ",
      },
      {
        _type: "span",
        marks: ["strong"],
        text: "historic treasure",
      },
      {
        _type: "span",
        text: " in Richmond's Church Hill neighborhood.",
      },
    ],
  },
  {
    _type: "block",
    style: "h2",
    children: [
      {
        _type: "span",
        text: "Our Mission",
      },
    ],
  },
  {
    _type: "block",
    style: "normal",
    children: [
      {
        _type: "span",
        text: "We are dedicated to preserving and enhancing Chimborazo Park for future generations.",
      },
    ],
  },
];

/**
 * Helper function to create a delay (useful for loading states)
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock router for components that need routing context
 */
export const mockRouter = {
  state: {
    location: {
      pathname: "/",
      search: "",
      hash: "",
    },
  },
  navigate: (to: string) => console.log("Navigate to:", to),
  buildLink: (to: string) => ({ href: to }),
};
