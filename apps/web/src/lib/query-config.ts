/**
 * Centralized cache configuration for TanStack Query
 *
 * These presets provide consistent caching behavior across the application.
 * Use these instead of hardcoding staleTime and gcTime values.
 */

// Time constants for readability
const MINUTE = 60 * 1000;

/**
 * Cache presets for different content types
 */
export const CACHE_PRESETS = {
  /**
   * Curated/editorial content that changes infrequently
   * Examples: homepage data, site settings, featured content
   */
  CURATED_CONTENT: {
    staleTime: 30 * MINUTE, // 30 minutes
    gcTime: 60 * MINUTE, // 1 hour (must be >= staleTime)
  },

  /**
   * Event details that rarely change after publication
   */
  EVENT_DETAIL: {
    staleTime: 10 * MINUTE, // 10 minutes
    gcTime: 30 * MINUTE, // 30 minutes
  },

  /**
   * Event listings that may update more frequently
   */
  EVENTS_LIST: {
    staleTime: 5 * MINUTE, // 5 minutes
    gcTime: 15 * MINUTE, // 15 minutes
  },

  /**
   * Project content that changes occasionally
   */
  PROJECT_CONTENT: {
    staleTime: 15 * MINUTE, // 15 minutes
    gcTime: 30 * MINUTE, // 30 minutes
  },

  /**
   * Media/gallery content
   */
  MEDIA_CONTENT: {
    staleTime: 15 * MINUTE, // 15 minutes
    gcTime: 30 * MINUTE, // 30 minutes
  },

  /**
   * Static/rarely-changing pages (privacy policy, legal, etc.)
   * No Sanity data or very infrequently updated content
   */
  STATIC_CONTENT: {
    staleTime: 60 * MINUTE, // 1 hour
    gcTime: 120 * MINUTE, // 2 hours
  },

  /**
   * Real-time or frequently changing data
   * Use sparingly - most content benefits from caching
   */
  REALTIME: {
    staleTime: 1 * MINUTE, // 1 minute
    gcTime: 5 * MINUTE, // 5 minutes
  },
} as const;

export type CachePreset = keyof typeof CACHE_PRESETS;
