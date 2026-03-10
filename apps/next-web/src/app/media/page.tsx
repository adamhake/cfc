import type { Metadata } from "next";
import { sanityFetch, CACHE_TAGS } from "@/lib/sanity-fetch";
import type { SanityMediaImage, SanityMediaPage } from "@/lib/sanity-types";
import { SITE_CONFIG } from "@/utils/seo";
import {
  getMediaPageQuery,
  paginatedMediaImagesQuery,
  mediaImagesCountQuery,
} from "@chimborazo/sanity-config/queries";
import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import MediaGalleryClient from "./media-gallery-client";

export const metadata: Metadata = {
  title: "Media Gallery",
  description:
    "Browse photos of Chimborazo Park, our community events, volunteer activities, and the ongoing restoration of this historic Richmond landmark.",
  alternates: { canonical: `${SITE_CONFIG.url}/media` },
  openGraph: {
    title: "Media Gallery",
    description:
      "Browse photos of Chimborazo Park, our community events, volunteer activities, and the ongoing restoration of this historic Richmond landmark.",
    type: "website",
    url: `${SITE_CONFIG.url}/media`,
  },
};

const PAGE_SIZE = 9;

export default async function MediaPage() {
  const [mediaPageData, initialImages, totalCount] = await Promise.all([
    sanityFetch<SanityMediaPage | null>({
      query: getMediaPageQuery,
      tags: [CACHE_TAGS.MEDIA],
    }),
    sanityFetch<SanityMediaImage[]>({
      query: paginatedMediaImagesQuery,
      params: { start: 0, end: PAGE_SIZE },
      tags: [CACHE_TAGS.MEDIA],
    }),
    sanityFetch<number>({
      query: mediaImagesCountQuery,
      tags: [CACHE_TAGS.MEDIA],
    }),
  ]);

  // Prepare hero data from Sanity or use defaults
  const heroData = mediaPageData?.pageHero?.image
    ? {
        title: mediaPageData.pageHero.title,
        subtitle: mediaPageData.pageHero.description,
        sanityImage: mediaPageData.pageHero.image,
      }
    : {
        title: "Media Gallery",
        subtitle: "Explore photos of our park, community events, and restoration efforts",
        imageSrc: "/bike_sunset.webp",
        imageAlt: "Chimborazo Park landscape",
        imageWidth: 2000,
        imageHeight: 1262,
      };

  return (
    <div className="min-h-screen">
      <PageHero {...heroData} height="small" priority={true} />
      <Container maxWidth="6xl" spacing="md" className="py-16 md:py-24">
        <MediaGalleryClient
          initialImages={initialImages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
        />
      </Container>
    </div>
  );
}
