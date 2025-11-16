import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import ImageGallery, { type GalleryImage } from "@/components/ImageGallery/image-gallery";
import { getMediaImages } from "@/data/media-server";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/Button/button";

export const Route = createFileRoute("/media")({
  component: Media,
  loader: async () => {
    try {
      console.log("[media loader] Fetching media images...");
      const images = await getMediaImages();
      console.log(`[media loader] Received ${images.length} images`);

      return { images, error: null };
    } catch (error) {
      console.error("[media loader] Error loading media:", error);
      // Return error details for debugging
      return {
        images: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
  head: () => ({
    meta: [
      {
        title: "Media Gallery | Chimborazo Park Conservancy",
      },
      {
        name: "description",
        content:
          "Browse photos of Chimborazo Park, our community events, volunteer activities, and the ongoing restoration of this historic Richmond landmark.",
      },
      {
        property: "og:title",
        content: "Media Gallery | Chimborazo Park Conservancy",
      },
      {
        property: "og:description",
        content:
          "Photos of Chimborazo Park, community events, volunteer activities, and historic restoration efforts in Church Hill, Richmond, VA.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://chimboparkconservancy.org/media",
      },
      {
        property: "og:image",
        content: "https://chimboparkconservancy.org/bike_sunset.webp",
      },
      {
        property: "og:image:width",
        content: "2000",
      },
      {
        property: "og:image:height",
        content: "1262",
      },
      {
        name: "twitter:title",
        content: "Media Gallery | Chimborazo Park Conservancy",
      },
      {
        name: "twitter:description",
        content:
          "Photos of Chimborazo Park, community events, and volunteer activities in Church Hill, Richmond, VA.",
      },
      {
        name: "twitter:image",
        content: "https://chimboparkconservancy.org/bike_sunset.webp",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://chimboparkconservancy.org/media",
      },
    ],
  }),
});

const INITIAL_IMAGE_COUNT = 9;

function Media() {
  const loaderData = Route.useLoaderData();
  const { images, error } = loaderData;
  const [visibleCount, setVisibleCount] = useState(INITIAL_IMAGE_COUNT);

  // Convert MediaImage format to GalleryImage format
  const galleryImages: GalleryImage[] = (images || [])
    .filter((img) => {
      // Ensure all required properties exist and are valid numbers
      const isValid =
        img &&
        img.src &&
        typeof img.width === "number" &&
        typeof img.height === "number" &&
        img.width > 0 &&
        img.height > 0;

      if (!isValid) {
        console.warn("[Media] Filtering out invalid image:", img);
      }

      return isValid;
    })
    .map((img) => ({
      src: img.src,
      width: img.width,
      height: img.height,
      alt: img.alt || "Park image",
      caption: img.caption,
    }));

  const visibleImages = galleryImages.slice(0, visibleCount);
  const hasMore = visibleCount < galleryImages.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + INITIAL_IMAGE_COUNT, galleryImages.length));
  };

  return (
    <div className="min-h-screen">
      <PageHero
        title="Media Gallery"
        subtitle="Explore photos of our park, community events, and restoration efforts"
        imageSrc="/bike_sunset.webp"
        imageAlt="Chimborazo Park landscape"
        imageWidth={2000}
        imageHeight={1262}
      />
      <Container maxWidth="6xl" spacing="md" className="px-4 py-16 md:py-24">
        {error ? (
          <div className="border-red-200 bg-red-50/30 dark:border-red-700/30 dark:bg-red-900/20 mx-auto max-w-2xl rounded-2xl border p-12 text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2 className="mb-3 font-display text-2xl font-semibold text-grey-900 dark:text-grey-100">
              Error Loading Images
            </h2>
            <p className="font-body text-lg text-grey-700 dark:text-grey-300">{error}</p>
            <p className="mt-4 font-body text-sm text-grey-600 dark:text-grey-400">
              Check the browser console for more details.
            </p>
          </div>
        ) : images.length === 0 ? (
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
              images={visibleImages}
              variant="masonry"
              columns={{ default: 1, sm: 2, md: 3, lg: 3 }}
              showCaptions={true}
              captionPosition="below"
              gap="lg"
            />
            {hasMore && (
              <div className="flex justify-center">
                <Button onClick={handleLoadMore} variant="primary" size="standard">
                  Load More Photos
                </Button>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
