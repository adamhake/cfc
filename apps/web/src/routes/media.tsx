import { Button } from "@/components/Button/button";
import Container from "@/components/Container/container";
import ImageGallery, { type SanityGalleryImage } from "@/components/ImageGallery/image-gallery";
import PageHero from "@/components/PageHero/page-hero";
import { getIsPreviewMode } from "@/lib/preview";
import { queryKeys } from "@/lib/query-keys";
import { getSanityClient } from "@/lib/sanity";
import type { SanityMediaImage, SanityMediaPage } from "@/lib/sanity-types";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import {
  getMediaPageQuery,
  mediaImagesCountQuery,
  paginatedMediaImagesQuery,
} from "@chimborazo/sanity-config";
import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const PAGE_SIZE = 9;

// Query options for media page content - accept preview flag for Visual Editing
const mediaPageQueryOptions = (preview = false) =>
  queryOptions({
    queryKey: [...queryKeys.mediaPage(), { preview }],
    queryFn: async (): Promise<SanityMediaPage | null> => {
      try {
        return await getSanityClient(preview).fetch(getMediaPageQuery);
      } catch (error) {
        console.warn("Failed to fetch media page from Sanity:", error);
        return null;
      }
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

interface MediaPageData {
  images: SanityMediaImage[];
  nextCursor: number | null;
  totalCount: number;
}

async function fetchMediaPage(pageParam: number, preview = false): Promise<MediaPageData> {
  const start = pageParam;
  const end = pageParam + PAGE_SIZE;
  const client = getSanityClient(preview);

  const [images, totalCount] = await Promise.all([
    client.fetch<SanityMediaImage[]>(paginatedMediaImagesQuery, { start, end }),
    client.fetch<number>(mediaImagesCountQuery),
  ]);

  return {
    images,
    nextCursor: end < totalCount ? end : null,
    totalCount,
  };
}

export const Route = createFileRoute("/media")({
  component: Media,
  loader: async ({ context }) => {
    // Check if we're in preview mode for Visual Editing
    const preview = await getIsPreviewMode();

    // Prefetch media page content and first page of images
    await Promise.all([
      context.queryClient.ensureQueryData(mediaPageQueryOptions(preview)),
      context.queryClient.prefetchInfiniteQuery({
        queryKey: [...queryKeys.media.paginated(), { preview }],
        queryFn: ({ pageParam }) => fetchMediaPage(pageParam, preview),
        initialPageParam: 0,
      }),
    ]);

    return { preview };
  },
  head: () => ({
    meta: generateMetaTags({
      title: "Media Gallery",
      description:
        "Browse photos of Chimborazo Park, our community events, volunteer activities, and the ongoing restoration of this historic Richmond landmark.",
      type: "website",
      url: `${SITE_CONFIG.url}/media`,
    }),
    links: generateLinkTags({
      canonical: `${SITE_CONFIG.url}/media`,
    }),
  }),
});

function Media() {
  const { preview } = Route.useLoaderData();
  const { data: mediaPageData } = useQuery(mediaPageQueryOptions(preview));
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [...queryKeys.media.paginated(), { preview }],
    queryFn: ({ pageParam }) => fetchMediaPage(pageParam, preview),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  // Prepare hero data from Sanity or use defaults
  const heroData = mediaPageData?.pageHero?.image?.image
    ? {
        title: mediaPageData.pageHero.title,
        subtitle: mediaPageData.pageHero.description,
        sanityImage: mediaPageData.pageHero.image.image,
      }
    : {
        title: "Media Gallery",
        subtitle: "Explore photos of our park, community events, and restoration efforts",
        imageSrc: "/bike_sunset.webp",
        imageAlt: "Chimborazo Park landscape",
        imageWidth: 2000,
        imageHeight: 1262,
      };

  // Flatten all pages into a single array of gallery images
  const galleryImages: SanityGalleryImage[] =
    data?.pages.flatMap((page) =>
      page.images
        .filter((img) => {
          const isValid =
            img?.image?.asset?.url &&
            img?.image?.asset?.metadata?.dimensions?.width &&
            img?.image?.asset?.metadata?.dimensions?.height;

          if (!isValid) {
            console.warn("[Media] Filtering out invalid image:", img);
          }

          return isValid;
        })
        .map((img) => ({
          ...img.image,
          alt: img.image.alt || img.title || "Park image",
        })),
    ) ?? [];

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  if (status === "pending") {
    return (
      <div className="min-h-screen">
        <PageHero {...heroData} height="small" priority={true} />
        <Container maxWidth="6xl" spacing="md" className="py-16 md:py-24">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        </Container>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen">
        <PageHero {...heroData} height="small" priority={true} />
        <Container maxWidth="6xl" spacing="md" className="py-16 md:py-24">
          <div className="border-red-200 bg-red-50/30 dark:border-red-700/30 dark:bg-red-900/20 mx-auto max-w-2xl rounded-2xl border p-12 text-center">
            <h2 className="mb-3 font-display text-2xl font-semibold text-grey-900 dark:text-grey-100">
              Error Loading Images
            </h2>
            <p className="font-body text-lg text-grey-700 dark:text-grey-300">
              Something went wrong while loading the gallery. Please try again later.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHero {...heroData} height="small" priority={true} />
      <Container maxWidth="6xl" spacing="md" className="py-16 md:py-24">
        {totalCount === 0 ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-primary-200 bg-primary-50/30 p-12 text-center dark:border-primary-700/30 dark:bg-primary-900/20">
            <div className="mb-4 text-6xl">📷</div>
            <h2 className="mb-3 font-display text-2xl font-semibold text-grey-900 dark:text-grey-100">
              No Images Yet
            </h2>
            <p className="font-body text-lg text-grey-700 dark:text-grey-300">
              Check back soon for photos of our park and community events!
            </p>
          </div>
        ) : galleryImages.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-primary-200 bg-primary-50/30 p-12 text-center dark:border-primary-700/30 dark:bg-primary-900/20">
            <div className="mb-4 text-6xl">📷</div>
            <h2 className="mb-3 font-display text-2xl font-semibold text-grey-900 dark:text-grey-100">
              No Valid Images
            </h2>
            <p className="font-body text-lg text-grey-700 dark:text-grey-300">
              Some images were found but they're missing required metadata. Check the console for
              details.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <ImageGallery
              images={galleryImages}
              variant="masonry"
              columns={{ default: 1, sm: 2, md: 3, lg: 3 }}
              showCaptions={true}
              captionPosition="hover"
              gap="lg"
            />
            {hasNextPage && (
              <div className="flex justify-center">
                <Button
                  onClick={() => fetchNextPage()}
                  variant="primary"
                  size="standard"
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load More Photos"}
                </Button>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
