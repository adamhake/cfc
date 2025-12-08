import Container from "@/components/Container/container";
import Update, { type UpdateData, UpdateFeatured } from "@/components/Update/update";
import PageHero from "@/components/PageHero/page-hero";
import { PortableText } from "@/components/PortableText/portable-text";
import type { SanityImageObject } from "@/components/SanityImage/sanity-image";
import { queryKeys } from "@/lib/query-keys";
import { sanityClient } from "@/lib/sanity";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { cn } from "@/utils/cn";
import {
  allUpdatesQuery,
  updateCategoriesQuery,
  updatesPageQuery,
} from "@chimborazo/sanity-config";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Filter, X } from "lucide-react";

interface UpdateCategory {
  _id: string;
  title: string;
  slug: { current: string };
  color?: string;
}

interface UpdatesPageData {
  pageHero?: {
    title: string;
    description?: string;
    image?: {
      _id: string;
      title?: string;
      alt?: string;
      image: {
        asset: {
          _id: string;
          url: string;
          metadata?: {
            dimensions?: { width: number; height: number };
            lqip?: string;
            blurhash?: string;
          };
        };
        hotspot?: { x: number; y: number };
        crop?: { top: number; bottom: number; left: number; right: number };
      };
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  introduction?: any[];
}

// Query options for TanStack Query
const updatesQueryOptions = queryOptions({
  queryKey: queryKeys.updates.all(),
  queryFn: async (): Promise<UpdateData[]> => {
    try {
      return await sanityClient.fetch(allUpdatesQuery);
    } catch (error) {
      console.warn("Failed to fetch updates from Sanity:", error);
      return [];
    }
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 15 * 60 * 1000, // 15 minutes
});

const categoriesQueryOptions = queryOptions({
  queryKey: queryKeys.updates.categories(),
  queryFn: async (): Promise<UpdateCategory[]> => {
    try {
      return await sanityClient.fetch(updateCategoriesQuery);
    } catch (error) {
      console.warn("Failed to fetch update categories from Sanity:", error);
      return [];
    }
  },
  staleTime: 30 * 60 * 1000, // 30 minutes
  gcTime: 60 * 60 * 1000, // 1 hour
});

const updatesPageQueryOptions = queryOptions({
  queryKey: queryKeys.updatesPage(),
  queryFn: async (): Promise<UpdatesPageData | null> => {
    try {
      return await sanityClient.fetch(updatesPageQuery);
    } catch (error) {
      console.warn("Failed to fetch updates page from Sanity:", error);
      return null;
    }
  },
  staleTime: 30 * 60 * 1000, // 30 minutes
  gcTime: 60 * 60 * 1000, // 1 hour
});

interface UpdatesSearch {
  category?: string;
}

export const Route = createFileRoute("/updates/")({
  component: Updates,
  validateSearch: (search: Record<string, unknown>): UpdatesSearch => {
    return {
      category: typeof search.category === "string" ? search.category : undefined,
    };
  },
  loaderDeps: ({ search: { category } }) => ({ category }),
  loader: async ({ context }) => {
    const [updates, categories, pageData] = await Promise.all([
      context.queryClient.ensureQueryData(updatesQueryOptions),
      context.queryClient.ensureQueryData(categoriesQueryOptions),
      context.queryClient.ensureQueryData(updatesPageQueryOptions),
    ]);
    return { updates, categories, pageData };
  },
  head: () => ({
    meta: generateMetaTags({
      title: "Updates",
      description:
        "Stay informed about the latest news, volunteer spotlights, and happenings at Chimborazo Park. Read our updates to see the impact of your community involvement.",
      type: "website",
      url: `${SITE_CONFIG.url}/updates`,
      image: {
        url: `${SITE_CONFIG.url}/park-overlook.webp`,
        width: 2000,
        height: 1333,
        alt: "Chimborazo Park overlook",
      },
    }),
    links: generateLinkTags({
      canonical: `${SITE_CONFIG.url}/updates`,
    }),
  }),
});

const ITEMS_PER_PAGE = 6;

function CategoryChip({
  category,
  isActive,
  onClick,
}: {
  category: UpdateCategory;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-body text-sm font-medium transition-all",
        isActive
          ? "bg-primary-600 text-white dark:bg-primary-500"
          : "bg-grey-100 text-grey-700 hover:bg-grey-200 dark:bg-grey-800 dark:text-grey-300 dark:hover:bg-grey-700",
      )}
    >
      {category.title}
      {isActive && <X className="h-3.5 w-3.5" />}
    </button>
  );
}

function Updates() {
  const { updates, categories, pageData } = Route.useLoaderData();
  const { category: selectedCategorySlug } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Filter updates by category
  const filteredUpdates = useMemo(() => {
    if (!selectedCategorySlug) return updates;
    return updates.filter(
      (update: UpdateData) => update.category?.slug.current === selectedCategorySlug,
    );
  }, [updates, selectedCategorySlug]);

  // Get featured update (first featured or most recent)
  const featuredUpdate = useMemo(() => {
    const featured = filteredUpdates.find((u: UpdateData) => u.featured);
    return featured || (filteredUpdates.length > 0 ? filteredUpdates[0] : null);
  }, [filteredUpdates]);

  // Get remaining updates (excluding featured)
  const remainingUpdates = useMemo(() => {
    if (!featuredUpdate) return filteredUpdates;
    return filteredUpdates.filter((u: UpdateData) => u._id !== featuredUpdate._id);
  }, [filteredUpdates, featuredUpdate]);

  // Paginated updates
  const visibleUpdates = remainingUpdates.slice(0, visibleCount);
  const hasMore = visibleCount < remainingUpdates.length;

  const handleCategoryClick = (categorySlug: string) => {
    if (selectedCategorySlug === categorySlug) {
      // Clear filter
      navigate({ search: { category: undefined } });
    } else {
      navigate({ search: { category: categorySlug } });
    }
    setVisibleCount(ITEMS_PER_PAGE); // Reset pagination
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  // Prepare hero data from Sanity or use fallbacks
  const heroData = pageData?.pageHero?.image?.image
    ? {
        title: pageData.pageHero.title,
        subtitle: pageData.pageHero.description,
        sanityImage: pageData.pageHero.image.image as SanityImageObject,
      }
    : {
        title: "Updates",
        subtitle: "News and stories from Chimborazo Park",
        imageSrc: "/park-overlook.webp",
        imageAlt: "Chimborazo Park overlook",
        imageWidth: 2000,
        imageHeight: 1333,
      };

  return (
    <div className="space-y-24 pb-24">
      <PageHero {...heroData} height="small" priority={true} />

      <Container spacing="md">
        {pageData?.introduction && pageData.introduction.length > 0 ? (
          <div className="mx-auto max-w-3xl text-center">
            <PortableText value={pageData.introduction} />
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="font-body text-xl leading-relaxed text-grey-800 md:text-2xl dark:text-grey-200">
              Stay connected with what's happening at Chimborazo Park. From volunteer spotlights to
              project updates, discover how our community is making a difference.
            </p>
          </div>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Filter className="h-5 w-5 text-grey-500 dark:text-grey-400" />
            {categories.map((cat: UpdateCategory) => (
              <CategoryChip
                key={cat._id}
                category={cat}
                isActive={selectedCategorySlug === cat.slug.current}
                onClick={() => handleCategoryClick(cat.slug.current)}
              />
            ))}
          </div>
        )}

        {/* No results message */}
        {filteredUpdates.length === 0 && (
          <div className="mt-20 text-center">
            <p className="font-body text-lg text-grey-600 dark:text-grey-400">
              No updates found
              {selectedCategorySlug && " in this category"}. Check back soon for more news!
            </p>
          </div>
        )}

        {/* Featured Update */}
        {featuredUpdate && (
          <div className="mt-16">
            <UpdateFeatured {...featuredUpdate} />
          </div>
        )}

        {/* Updates Grid */}
        {visibleUpdates.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
            {visibleUpdates.map((update: UpdateData) => (
              <Update key={update._id} {...update} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-16 text-center">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-3 font-body font-semibold text-white transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              Load More Updates
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
