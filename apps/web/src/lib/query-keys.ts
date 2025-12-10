/**
 * Centralized query keys for TanStack Query
 *
 * Using typed query key factories prevents typos and makes it easier to
 * invalidate specific queries (e.g., from Sanity webhooks).
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

export const queryKeys = {
  // Site settings
  siteSettings: () => ["siteSettings"] as const,

  // Homepage content
  homePage: () => ["homePage"] as const,

  // Amenities page
  amenitiesPage: () => ["amenitiesPage"] as const,

  // Events page
  eventsPage: () => ["eventsPage"] as const,

  // Projects page
  projectsPage: () => ["projectsPage"] as const,

  // Events
  events: {
    all: () => ["events", "all"] as const,
    detail: (slug: string) => ["event", slug] as const,
  },

  // Projects
  projects: {
    all: () => ["projects", "all"] as const,
    detail: (slug: string) => ["project", slug] as const,
    featured: () => ["projects", "featured"] as const,
  },

  // Updates
  updates: {
    all: () => ["updates", "all"] as const,
    detail: (slug: string) => ["update", slug] as const,
    featured: () => ["updates", "featured"] as const,
    categories: () => ["updates", "categories"] as const,
    byCategory: (categorySlug: string) => ["updates", "byCategory", categorySlug] as const,
    byEvent: (eventId: string) => ["updates", "byEvent", eventId] as const,
    byProject: (projectId: string) => ["updates", "byProject", projectId] as const,
  },

  // Updates page
  updatesPage: () => ["updatesPage"] as const,

  // Media page
  mediaPage: () => ["mediaPage"] as const,

  // Donate page
  donatePage: () => ["donatePage"] as const,

  // Media gallery
  media: {
    all: () => ["media", "all"] as const,
    paginated: () => ["media", "paginated"] as const,
  },

  historyPage: () => ["historyPage"] as const,

  getInvolvedPage: () => ["getInvolvedPage"] as const,
} as const;

/**
 * Helper to invalidate all events queries
 * Usage: queryClient.invalidateQueries({ queryKey: queryKeys.events.all() })
 */
export const invalidateEvents = (queryClient: {
  invalidateQueries: (opts: { queryKey: readonly string[] }) => void;
}) => {
  queryClient.invalidateQueries({ queryKey: ["events"] as const });
};

/**
 * Helper to invalidate all media queries
 */
export const invalidateMedia = (queryClient: {
  invalidateQueries: (opts: { queryKey: readonly string[] }) => void;
}) => {
  queryClient.invalidateQueries({ queryKey: ["media"] as const });
};

/**
 * Helper to invalidate all projects queries
 */
export const invalidateProjects = (queryClient: {
  invalidateQueries: (opts: { queryKey: readonly string[] }) => void;
}) => {
  queryClient.invalidateQueries({ queryKey: ["projects"] as const });
};

/**
 * Helper to invalidate homepage
 */
export const invalidateHomePage = (queryClient: {
  invalidateQueries: (opts: { queryKey: readonly string[] }) => void;
}) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.homePage() });
};

/**
 * Helper to invalidate all updates queries
 */
export const invalidateUpdates = (queryClient: {
  invalidateQueries: (opts: { queryKey: readonly string[] }) => void;
}) => {
  queryClient.invalidateQueries({ queryKey: ["updates"] as const });
};
