import { createFileRoute } from "@tanstack/react-router";
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";

export const Route = createFileRoute("/media")({
  component: Media,
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

const photos = [
  { src: "/chimbo_arial.webp", width: 800, height: 600 },
  { src: "/chimbo_circle.webp", width: 1600, height: 900 },
  { src: "/chimbo_prom.webp", width: 1200, height: 1200 },
  { src: "/chimbo_prom.webp", width: 1200, height: 1200 },
];

function Media() {
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
        <MasonryPhotoAlbum
          photos={photos}
          columns={3}
          render={{
            wrapper: (props) => (
              <div {...props} className={`${props.className} overflow-hidden rounded-2xl`} />
            ),
          }}
        />
      </div>
    </div>
  );
}
