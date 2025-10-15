import { createFileRoute } from "@tanstack/react-router";
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";

export const Route = createFileRoute("/media")({
  component: Media,
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
      <div className="relative h-[50vh] w-full overflow-hidden bg-[url(/chimbo_hero_adj.webp)] bg-cover px-4">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="mx-auto w-full max-w-6xl text-center">
            <h1 className="font-display text-5xl text-white">Media</h1>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-900/70 to-green-800/50"></div>
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
