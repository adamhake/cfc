import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import type { MediaImage } from "@/data/media";
import { createFileRoute } from "@tanstack/react-router";
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";

export const Route = createFileRoute("/media")({
  component: Media,
  loader: async () => {
    try {
      const response = await fetch("/.netlify/functions/get-media");
      if (!response.ok) {
        throw new Error("Failed to fetch media");
      }
      console.log("Fetched media");
      const images: MediaImage[] = await response.json();
      return { images };
    } catch (error) {
      console.error("Error loading media:", error);
      // Return empty array on error - we'll show a fallback message
      return { images: [] };
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

function Media() {
  const { images } = Route.useLoaderData();

  // Convert MediaImage format to react-photo-album format
  const photos = images.map((img) => ({
    src: img.src,
    width: img.width,
    height: img.height,
    alt: img.alt,
    title: img.caption, // Used for hover text
  }));

  return (
    <div>
      <PageHero
        title="Media"
        imageSrc="/bike_sunset.webp"
        imageAlt="Chimborazo Park landscape"
        imageWidth={2000}
        imageHeight={1262}
      />
      <Container className="py-24">
        {images.length === 0 ? (
          <div className="text-gray-600 text-center">
            <p className="text-lg">No images available yet.</p>
            <p className="mt-2 text-sm">Check back soon for photos of our park and events!</p>
          </div>
        ) : (
          <>
            <MasonryPhotoAlbum
              photos={photos}
              columns={(containerWidth) => {
                if (containerWidth < 640) return 1;
                if (containerWidth < 1024) return 2;
                return 3;
              }}
              render={{
                wrapper: (props, context) => (
                  <div
                    {...props}
                    className={`${props.className} group relative overflow-hidden rounded-2xl`}
                  >
                    {context.photo.title && (
                      <div className="absolute right-0 bottom-0 left-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="text-sm text-white">{context.photo.title}</p>
                      </div>
                    )}
                  </div>
                ),
              }}
            />
          </>
        )}
      </Container>
    </div>
  );
}
