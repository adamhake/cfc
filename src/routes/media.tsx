import { createFileRoute } from "@tanstack/react-router";
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
import type { MediaImage } from "@/data/media";

export const Route = createFileRoute("/media")({
  component: Media,
  loader: async () => {
    try {
      const response = await fetch("/.netlify/functions/get-media");
      if (!response.ok) {
        throw new Error("Failed to fetch media");
      }
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
      <div className="relative h-[50vh] w-full overflow-hidden px-4">
        <img
          src="/bike_sunset.webp"
          alt="Chimborazo Park landscape"
          width={2000}
          height={1262}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-green-800/50"></div>
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="mx-auto w-full max-w-6xl text-center">
            <h1 className="font-display text-5xl text-white">Media</h1>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl py-24">
        {images.length === 0 ? (
          <div className="text-center text-gray-600">
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
                  <div {...props} className={`${props.className} group relative overflow-hidden rounded-2xl`}>
                    {context.photo.title && (
                      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="text-sm text-white">{context.photo.title}</p>
                      </div>
                    )}
                  </div>
                ),
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
