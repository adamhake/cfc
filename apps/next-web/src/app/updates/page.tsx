import { allUpdatesQuery, updatesPageQuery } from "@chimborazo/sanity-config/queries"
import type { Metadata } from "next"
import Link from "next/link"
import Container from "@/components/Container/container"
import PageHeroOptimistic from "@/components/PageHero/page-hero-optimistic"
import { PortableText } from "@/components/PortableText/portable-text"
import { SanityImage } from "@/components/SanityImage/sanity-image"
import { CACHE_TAGS, sanityFetch } from "@/lib/sanity-fetch"
import type { SanityUpdate, SanityUpdatesPage } from "@/lib/sanity-types"
import { generateItemListStructuredData, SITE_CONFIG } from "@/utils/seo"
import { formatDateString } from "@/utils/time"

export const metadata: Metadata = {
  title: "Updates",
  description:
    "Read the latest project notes, announcements, and stewardship updates from Chimborazo Park Conservancy.",
  alternates: { canonical: `${SITE_CONFIG.url}/updates` },
  openGraph: {
    title: "Updates",
    description:
      "Read the latest project notes, announcements, and stewardship updates from Chimborazo Park Conservancy.",
    type: "website",
    url: `${SITE_CONFIG.url}/updates`,
    images: [SITE_CONFIG.defaultImage],
  },
}

export default async function UpdatesPage() {
  const [{ data: updates }, { data: pageData }] = (await Promise.all([
    sanityFetch({
      query: allUpdatesQuery,
      tags: [CACHE_TAGS.UPDATES_LIST, CACHE_TAGS.UPDATES],
    }),
    sanityFetch({
      query: updatesPageQuery,
      tags: [CACHE_TAGS.UPDATES_LIST],
    }),
  ])) as [{ data: SanityUpdate[] }, { data: SanityUpdatesPage | null }]

  const itemListData = generateItemListStructuredData(
    updates.map((update) => ({
      name: update.title,
      url: `${SITE_CONFIG.url}/updates/${update.slug.current}`,
    })),
  )

  return (
    <div className="space-y-24 pb-24">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListData).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <PageHeroOptimistic
        document={pageData}
        fallback={{
          title: "Updates",
          subtitle:
            "Announcements, field notes, and progress reports from projects across Chimborazo Park.",
          imageSrc: "/volunteers.webp",
          imageAlt: "Volunteers working in Chimborazo Park",
          imageWidth: 2000,
          imageHeight: 1333,
        }}
        height="small"
        priority={true}
      />

      <Container spacing="md">
        {pageData?.introduction && pageData.introduction.length > 0 ? (
          <div className="mx-auto max-w-3xl text-center">
            <PortableText value={pageData.introduction} />
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="font-body text-xl leading-relaxed text-grey-800 md:text-2xl dark:text-grey-200">
              Follow the work happening across the park, from restoration milestones to community
              stewardship highlights.
            </p>
            <p className="font-body text-base text-grey-700 md:text-lg dark:text-grey-300">
              These updates give neighbors and supporters a clearer view into what is changing, why
              it matters, and where help is still needed.
            </p>
          </div>
        )}

        {updates.length > 0 ? (
          <div className="mt-12 space-y-8">
            {updates.map((update) => (
              <Link
                key={update._id}
                href={`/updates/${update.slug.current}`}
                className="group block overflow-hidden rounded-2xl border border-primary-200/70 bg-grey-50/70 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-primary-700/30 dark:bg-primary-900/20"
              >
                <div className="grid gap-0 md:grid-cols-[320px_minmax(0,1fr)]">
                  <div className="relative min-h-[240px] overflow-hidden bg-primary-100 dark:bg-primary-800/40">
                    <SanityImage
                      image={update.heroImage}
                      alt={update.heroImage.alt || update.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 320px"
                      maxWidth={960}
                      quality={72}
                      useHotspotPosition
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-primary-100 px-3 py-1 font-body font-medium text-primary-800 dark:bg-primary-900/60 dark:text-primary-200">
                        {formatDateString(update.publishedAt, "short")}
                      </span>
                      {update.category?.title && (
                        <span className="rounded-full bg-accent-100 px-3 py-1 font-body font-medium text-accent-800 dark:bg-accent-900/40 dark:text-accent-200">
                          {update.category.title}
                        </span>
                      )}
                      {update.featured && (
                        <span className="rounded-full bg-heather-100 px-3 py-1 font-body font-medium text-heather-800 dark:bg-heather-900/40 dark:text-heather-200">
                          Featured
                        </span>
                      )}
                    </div>
                    <h2 className="mt-5 font-display text-3xl leading-tight text-grey-900 dark:text-grey-100">
                      {update.title}
                    </h2>
                    <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
                      {update.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.12em] text-accent-700 transition-colors group-hover:text-accent-600 dark:text-accent-300 dark:group-hover:text-accent-200">
                      Read update
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-primary-200 bg-primary-50/30 p-12 text-center dark:border-primary-700/30 dark:bg-primary-900/20">
            <h2 className="mb-3 font-display text-2xl font-semibold text-grey-900 dark:text-grey-100">
              No Updates Yet
            </h2>
            <p className="font-body text-lg text-grey-700 dark:text-grey-300">
              Check back soon for project notes, announcements, and stewardship progress.
            </p>
          </div>
        )}
      </Container>
    </div>
  )
}
