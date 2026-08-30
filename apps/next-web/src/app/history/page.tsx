import { getHistoryPageQuery } from "@chimborazo/sanity-config/queries"
import type { PortableTextBlock } from "@portabletext/react"
import type { Metadata } from "next"
import Container from "@/components/Container/container"
import PageHeroOptimistic from "@/components/PageHero/page-hero-optimistic"
import { PortableText } from "@/components/PortableText/portable-text"
import { CACHE_TAGS, getDynamicFetchOptions, sanityFetch } from "@/lib/sanity-fetch"
import type { SanityHistoryPage } from "@/lib/sanity-types"
import { SITE_CONFIG } from "@/utils/seo"

/**
 * Time-based ISR backstop. Content normally invalidates immediately via the
 * Sanity webhook (`/api/webhooks/sanity`) calling `revalidateTag`; this is the
 * safety net for a missed webhook. Previously supplied by `defineLive({
 * fetchOptions: { revalidate: 1800 } })`, removed in next-sanity v13.
 */
export const revalidate = 1800

export const metadata: Metadata = {
  title: "History of Chimborazo Park",
  description:
    "Discover Chimborazo Park's history, from Civil War hospital to the emancipated community of Reconstruction in Richmond, VA's Church Hill.",
  alternates: { canonical: `${SITE_CONFIG.url}/history` },
  openGraph: {
    title: "History of Chimborazo Park",
    description:
      "Discover Chimborazo Park's history, from Civil War hospital to the emancipated community of Reconstruction in Richmond, VA's Church Hill.",
    type: "website",
    url: `${SITE_CONFIG.url}/history`,
  },
}

export default async function HistoryPage() {
  const { data: pageData } = (await sanityFetch({
    ...(await getDynamicFetchOptions()),
    query: getHistoryPageQuery,
    tags: [CACHE_TAGS.HISTORY],
  })) as { data: SanityHistoryPage | null }

  return (
    <div>
      <PageHeroOptimistic
        document={pageData}
        fallback={{
          title: "History of Chimborazo Park",
          subtitle:
            "Explore the rich and complex history of Chimborazo Park, from its role as a Civil War hospital to the emancipated community that called it home during Reconstruction.",
        }}
        height="small"
      />

      <Container spacing="xl" className="py-16 pb-24">
        <article className="mx-auto max-w-3xl">
          <PortableText value={(pageData?.content || []) as PortableTextBlock[]} />
        </article>
      </Container>
    </div>
  )
}
