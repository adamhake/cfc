import {
  getMediaPageQuery,
  mediaImagesCountQuery,
  paginatedMediaImagesQuery,
} from "@chimborazo/sanity-config/queries"
import type { Metadata } from "next"
import Container from "@/components/Container/container"
import PageHeroOptimistic from "@/components/PageHero/page-hero-optimistic"
import { CACHE_TAGS, sanityFetch } from "@/lib/sanity-fetch"
import type { SanityMediaImage, SanityMediaPage } from "@/lib/sanity-types"
import { SITE_CONFIG } from "@/utils/seo"
import MediaGalleryClient from "./media-gallery-client"

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
}

const PAGE_SIZE = 9

export default async function MediaPage() {
  const [{ data: mediaPageData }, { data: initialImages }, { data: totalCount }] =
    (await Promise.all([
      sanityFetch({
        query: getMediaPageQuery,
        tags: [CACHE_TAGS.MEDIA],
      }),
      sanityFetch({
        query: paginatedMediaImagesQuery,
        params: { start: 0, end: PAGE_SIZE },
        tags: [CACHE_TAGS.MEDIA],
      }),
      sanityFetch({
        query: mediaImagesCountQuery,
        tags: [CACHE_TAGS.MEDIA],
      }),
    ])) as [{ data: SanityMediaPage | null }, { data: SanityMediaImage[] }, { data: number }]

  return (
    <div className="min-h-screen">
      <PageHeroOptimistic
        document={mediaPageData}
        fallback={{
          title: "Media Gallery",
          subtitle: "Explore photos of our park, community events, and restoration efforts",
          imageSrc: "/bike_sunset.webp",
          imageAlt: "Chimborazo Park landscape",
          imageWidth: 2000,
          imageHeight: 1262,
        }}
        height="small"
        priority={true}
      />
      <Container maxWidth="6xl" spacing="md" className="py-16 md:py-24">
        <MediaGalleryClient
          initialImages={initialImages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
        />
      </Container>
    </div>
  )
}
