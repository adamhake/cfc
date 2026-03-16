import { updateBySlugQuery, updateSlugsQuery } from "@chimborazo/sanity-config/queries"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Container from "@/components/Container/container"
import PageHero from "@/components/PageHero/page-hero"
import { PortableText } from "@/components/PortableText/portable-text"
import { sanityClient } from "@/lib/sanity"
import { CACHE_TAGS, sanityFetch } from "@/lib/sanity-fetch"
import type { SanityUpdate, UpdateSlug } from "@/lib/sanity-types"
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  SITE_CONFIG,
} from "@/utils/seo"
import { formatDateString } from "@/utils/time"

interface UpdatePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<UpdateSlug[]>(updateSlugsQuery)
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: UpdatePageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: update } = (await sanityFetch({
    query: updateBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.UPDATE_DETAIL, CACHE_TAGS.UPDATES],
  })) as { data: SanityUpdate | null }

  if (!update) {
    return {
      title: "Update Not Found",
      description: "The requested update could not be found.",
    }
  }

  const updateUrl = `${SITE_CONFIG.url}/updates/${update.slug.current}`
  return {
    title: update.title,
    description: update.description,
    alternates: { canonical: updateUrl },
    openGraph: {
      title: update.title,
      description: update.description,
      type: "article",
      url: updateUrl,
      images: update.heroImage?.asset?.url
        ? [
            {
              url: update.heroImage.asset.url,
              width: update.heroImage.asset.metadata?.dimensions?.width || 1200,
              height: update.heroImage.asset.metadata?.dimensions?.height || 630,
              alt: update.heroImage.alt || update.title,
            },
          ]
        : undefined,
    },
  }
}

export default async function UpdatePage({ params }: UpdatePageProps) {
  const { slug } = await params
  const { data: update } = (await sanityFetch({
    query: updateBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.UPDATE_DETAIL, CACHE_TAGS.UPDATES],
  })) as { data: SanityUpdate | null }

  if (!update) {
    notFound()
  }

  const updateUrl = `${SITE_CONFIG.url}/updates/${update.slug.current}`
  const articleData = generateArticleStructuredData({
    headline: update.title,
    description: update.description,
    image: update.heroImage?.asset?.url || SITE_CONFIG.defaultImage.url,
    datePublished: update.publishedAt,
  })
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Updates", url: `${SITE_CONFIG.url}/updates` },
    { name: update.title, url: updateUrl },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleData).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />

      <div className="pb-24">
        <PageHero
          title={update.title}
          subtitle={update.description}
          sanityImage={update.heroImage}
          height="medium"
          priority={true}
          titleSize="large"
        />

        <Container spacing="md" className="pt-8">
          <Link
            href="/updates"
            className="group inline-flex items-center gap-2 font-body text-sm font-medium text-primary-700 transition-colors hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Updates</span>
          </Link>
        </Container>

        <Container spacing="md" className="py-12 md:py-16">
          <article className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary-100 px-3 py-1 font-body font-medium text-primary-800 dark:bg-primary-900/60 dark:text-primary-200">
                  {formatDateString(update.publishedAt, "long")}
                </span>
                {update.category?.title && (
                  <span className="rounded-full bg-accent-100 px-3 py-1 font-body font-medium text-accent-800 dark:bg-accent-900/40 dark:text-accent-200">
                    {update.category.title}
                  </span>
                )}
                {update.featured && (
                  <span className="rounded-full bg-heather-100 px-3 py-1 font-body font-medium text-heather-800 dark:bg-heather-900/40 dark:text-heather-200">
                    Featured update
                  </span>
                )}
              </div>

              {update.body && update.body.length > 0 ? (
                <PortableText value={update.body} />
              ) : (
                <div className="rounded-2xl border border-primary-200 bg-primary-50/30 p-8 md:p-12 dark:border-primary-700/30 dark:bg-primary-900/20">
                  <p className="font-body text-lg leading-relaxed text-grey-700 dark:text-grey-300">
                    More details for this update are coming soon.
                  </p>
                </div>
              )}

              {update.relatedEvents && update.relatedEvents.length > 0 && (
                <section className="space-y-5">
                  <h2 className="font-display text-2xl font-semibold text-grey-900 md:text-3xl dark:text-grey-100">
                    Related Events
                  </h2>
                  <div className="grid gap-4">
                    {update.relatedEvents.map((event) => (
                      <Link
                        key={event._id}
                        href={`/events/${event.slug.current}`}
                        className="block rounded-2xl border border-primary-200 bg-grey-50/70 p-5 transition-colors hover:bg-primary-50 dark:border-primary-700/30 dark:bg-primary-900/20 dark:hover:bg-primary-900/35"
                      >
                        <h3 className="font-display text-xl text-grey-900 dark:text-grey-100">
                          {event.title}
                        </h3>
                        <p className="mt-2 font-body text-grey-700 dark:text-grey-300">
                          {event.description}
                        </p>
                        {event.date && (
                          <p className="mt-3 font-body text-sm font-medium uppercase tracking-[0.08em] text-primary-700 dark:text-primary-300">
                            {formatDateString(event.date, "short")}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {update.relatedProjects && update.relatedProjects.length > 0 && (
                <section className="space-y-5">
                  <h2 className="font-display text-2xl font-semibold text-grey-900 md:text-3xl dark:text-grey-100">
                    Related Projects
                  </h2>
                  <div className="grid gap-4">
                    {update.relatedProjects.map((project) => (
                      <Link
                        key={project._id}
                        href={`/projects/${project.slug.current}`}
                        className="block rounded-2xl border border-primary-200 bg-grey-50/70 p-5 transition-colors hover:bg-primary-50 dark:border-primary-700/30 dark:bg-primary-900/20 dark:hover:bg-primary-900/35"
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-display text-xl text-grey-900 dark:text-grey-100">
                            {project.title}
                          </h3>
                          {project.status && (
                            <span className="rounded-full bg-primary-100 px-2.5 py-1 font-body text-xs font-semibold uppercase tracking-[0.08em] text-primary-800 dark:bg-primary-900/60 dark:text-primary-200">
                              {project.status}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 font-body text-grey-700 dark:text-grey-300">
                          {project.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-6 dark:border-primary-700/30 dark:bg-primary-900/20">
                <h2 className="font-display text-xl font-semibold text-grey-900 dark:text-grey-100">
                  At a Glance
                </h2>
                <dl className="mt-5 space-y-4 font-body text-sm text-grey-700 dark:text-grey-300">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-grey-500 dark:text-grey-400">
                      Published
                    </dt>
                    <dd className="mt-1 text-base text-grey-900 dark:text-grey-100">
                      {formatDateString(update.publishedAt, "long")}
                    </dd>
                  </div>
                  {update.category?.title && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-grey-500 dark:text-grey-400">
                        Category
                      </dt>
                      <dd className="mt-1 text-base text-grey-900 dark:text-grey-100">
                        {update.category.title}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-grey-500 dark:text-grey-400">
                      Permalink
                    </dt>
                    <dd className="mt-1 break-all text-base text-grey-900 dark:text-grey-100">
                      {updateUrl}
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </article>
        </Container>
      </div>
    </>
  )
}
