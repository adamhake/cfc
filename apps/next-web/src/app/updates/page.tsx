import {
  allUpdatesQuery,
  updateCategoriesQuery,
  updatesPageQuery,
} from "@chimborazo/sanity-config/queries"
import type { Metadata } from "next"
import { Suspense } from "react"
import Container from "@/components/Container/container"
import PageHeroOptimistic from "@/components/PageHero/page-hero-optimistic"
import { PageIntroduction } from "@/components/PageIntroduction/page-introduction"
import { CACHE_TAGS, cachedSanityFetch, getDynamicFetchOptions } from "@/lib/sanity-fetch"
import type { SanityUpdate, SanityUpdateCategory, SanityUpdatesPage } from "@/lib/sanity-types"
import { generateItemListStructuredData, SITE_CONFIG } from "@/utils/seo"
import UpdatesListClient from "./updates-list-client"

export const metadata: Metadata = {
  title: "Updates",
  description:
    "Read seasonal news, construction updates, and park access notices from Chimborazo Park Conservancy.",
  alternates: { canonical: `${SITE_CONFIG.url}/updates` },
  openGraph: {
    title: "Updates",
    description:
      "Read seasonal news, construction updates, and park access notices from Chimborazo Park Conservancy.",
    type: "website",
    url: `${SITE_CONFIG.url}/updates`,
    images: [SITE_CONFIG.defaultImage],
  },
}

export default async function UpdatesPage() {
  const [{ data: updates }, { data: pageData }, { data: categories }] = (await Promise.all([
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: allUpdatesQuery,
      tags: [CACHE_TAGS.UPDATES_LIST, CACHE_TAGS.UPDATES],
    }),
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: updatesPageQuery,
      tags: [CACHE_TAGS.UPDATES_LIST],
    }),
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: updateCategoriesQuery,
      tags: [CACHE_TAGS.UPDATES],
    }),
  ])) as [
    { data: SanityUpdate[] },
    { data: SanityUpdatesPage | null },
    { data: SanityUpdateCategory[] },
  ]

  const itemListData = generateItemListStructuredData(
    updates.map((update) => ({
      name: update.title ?? "",
      url: `${SITE_CONFIG.url}/updates/${update.slug?.current}`,
    })),
  )

  return (
    <div className="space-y-14 pb-16 md:space-y-20 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListData).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <PageHeroOptimistic
        document={pageData}
        fallback={{
          title: "Updates",
          subtitle: "Seasonal news, construction updates, and access notices for Chimborazo Park.",
          imageSrc: "/volunteers.webp",
          imageAlt: "Volunteers working in Chimborazo Park",
          imageWidth: 2000,
          imageHeight: 1333,
        }}
        variant="section"
        priority={true}
      />

      <Container spacing="md">
        <PageIntroduction
          content={pageData?.introduction}
          fallback={[
            "Stay informed about what is happening in and around the park, from seasonal changes to construction and temporary road closures.",
            "These updates give neighbors and supporters a clearer view into what is changing, why it matters, and where help is still needed.",
          ]}
        />

        <Suspense fallback={<p className="mt-12 font-body">Loading updates…</p>}>
          <UpdatesListClient updates={updates} categories={categories} />
        </Suspense>
      </Container>
    </div>
  )
}
