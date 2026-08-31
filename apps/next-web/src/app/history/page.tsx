import { getHistoryPageQuery } from "@chimborazo/sanity-config/queries"
import type { PortableTextBlock } from "@portabletext/react"
import type { Metadata } from "next"
import Container from "@/components/Container/container"
import PageHeroOptimistic from "@/components/PageHero/page-hero-optimistic"
import { PortableText } from "@/components/PortableText/portable-text"
import { CACHE_TAGS, cachedSanityFetch, getDynamicFetchOptions } from "@/lib/sanity-fetch"
import type { SanityHistoryPage } from "@/lib/sanity-types"
import { SITE_CONFIG } from "@/utils/seo"

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
  const { data: pageData } = (await cachedSanityFetch({
    ...(await getDynamicFetchOptions()),
    query: getHistoryPageQuery,
    tags: [CACHE_TAGS.HISTORY],
  })) as { data: SanityHistoryPage | null }

  return (
    <div className="space-y-14 pb-16 md:space-y-20 md:pb-24">
      <PageHeroOptimistic
        document={pageData}
        fallback={{
          title: "History of Chimborazo Park",
          subtitle:
            "Explore the rich and complex history of Chimborazo Park, from its role as a Civil War hospital to the emancipated community that called it home during Reconstruction.",
        }}
        variant="section"
      />

      <Container spacing="none">
        <article className="mx-auto max-w-3xl">
          <PortableText
            value={(pageData?.content || []) as PortableTextBlock[]}
            className="[&>p]:mb-6 [&>p]:text-base [&>p:first-child]:text-xl [&>p:first-child]:leading-snug [&>p:first-child]:font-medium [&>h2]:mt-12 [&>h2]:mb-5 [&>h2]:text-balance [&>h2]:leading-tight [&>figure]:mx-auto [&>figure]:my-10 [&>figure]:table [&>figure]:max-w-full [&>blockquote]:my-10 [&>blockquote]:rounded-r-2xl [&>blockquote]:border-accent-600 [&>blockquote]:bg-neutral-100 [&_a]:text-accent-700 [&_a]:decoration-accent-300 [&_figure_img]:rounded-2xl [&_figure_img]:border [&_figure_img]:border-neutral-200 [&_figure_img]:shadow-none [&_figure_figcaption]:table-caption [&_figure_figcaption]:caption-bottom [&_figure_figcaption]:mt-3 [&_figure_figcaption]:text-left [&_figure_figcaption]:leading-relaxed [&_strong]:font-semibold md:[&>p]:text-lg md:[&>p:first-child]:text-2xl md:[&>h2]:mt-16 lg:[&>figure]:relative lg:[&>figure]:left-1/2 lg:[&>figure]:mx-0 lg:[&>figure]:max-w-[calc(100%+8rem)] lg:[&>figure]:-translate-x-1/2 dark:[&>blockquote]:border-accent-500 dark:[&>blockquote]:bg-primary-950 dark:[&_a]:text-accent-400 dark:[&_a]:decoration-accent-600 dark:[&_figure_img]:border-primary-700"
          />
        </article>
      </Container>
    </div>
  )
}
