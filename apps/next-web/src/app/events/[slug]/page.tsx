import { eventBySlugQuery, eventSlugsQuery } from "@chimborazo/sanity-config/queries"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/Button/button"
import Container from "@/components/Container/container"
import type { SanityGalleryImage } from "@/components/ImageGallery/image-gallery"
import { PortableText } from "@/components/PortableText/portable-text"
import { sanityClient } from "@/lib/sanity"
import { CACHE_TAGS, sanityFetch } from "@/lib/sanity-fetch"
import type { SanityEvent } from "@/lib/sanity-types"
import {
  generateBreadcrumbStructuredData,
  generateEventStructuredData,
  SITE_CONFIG,
} from "@/utils/seo"
import EventDetailClient from "./event-detail-client"
import EventHeroOptimistic from "./event-hero-optimistic"
import EventSidebarOptimistic from "./event-sidebar-optimistic"

interface EventPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<Array<{ slug: string }>>(eventSlugsQuery)
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: event } = (await sanityFetch({
    query: eventBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.EVENT_DETAIL, CACHE_TAGS.EVENTS],
  })) as { data: SanityEvent | null }

  if (!event) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    }
  }

  const eventUrl = `${SITE_CONFIG.url}/events/${event.slug.current}`
  return {
    title: event.title,
    description: event.description,
    alternates: { canonical: eventUrl },
    openGraph: {
      title: event.title,
      description: event.description,
      type: "article",
      url: eventUrl,
      images: event.heroImage?.asset?.url
        ? [
            {
              url: event.heroImage.asset.url,
              width: event.heroImage.asset.metadata?.dimensions?.width,
              height: event.heroImage.asset.metadata?.dimensions?.height,
              alt: event.heroImage.alt || event.title,
            },
          ]
        : undefined,
    },
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const { data: event } = (await sanityFetch({
    query: eventBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.EVENT_DETAIL, CACHE_TAGS.EVENTS],
  })) as { data: SanityEvent | null }

  if (!event) {
    notFound()
  }

  // If a recap exists in Sanity, the event is past by definition
  const hasRecap = event.recap && Array.isArray(event.recap) && event.recap.length > 0

  // Transform recap gallery images for ImageGallery component
  const recapGalleryImages: SanityGalleryImage[] =
    event.recapGallery?.images
      ?.filter((item) => item?.image?.asset?.url)
      .map((item) => ({
        ...item.image,
        alt: item.image.alt || "Event photo",
        showOnMobile: item.showOnMobile,
      })) ?? []

  // Generate structured data
  const imageUrl = event.heroImage?.asset?.url || `${SITE_CONFIG.url}/volunteers.webp`
  const eventUrl = `${SITE_CONFIG.url}/events/${event.slug.current}`

  const structuredData = generateEventStructuredData({
    name: event.title,
    description: event.description,
    image: imageUrl,
    startDate: event.date,
    location: {
      name: event.location,
      address: {
        addressLocality: "Richmond",
        addressRegion: "VA",
        addressCountry: "US",
      },
    },
    organizer: {
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    url: eventUrl,
  })

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Events", url: `${SITE_CONFIG.url}/events` },
    { name: event.title, url: eventUrl },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <EventHeroOptimistic event={event} />

        {/* Back Button */}
        <Container spacing="md" className="pt-8">
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 font-body text-sm font-medium text-primary-700 transition-colors hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Events</span>
          </Link>
        </Container>

        {/* Main Content */}
        <Container spacing="md" className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Main Content */}
            <main className="lg:col-span-8">
              {hasRecap ? (
                <EventDetailClient
                  recap={event.recap ?? []}
                  body={event.body}
                  recapGalleryImages={recapGalleryImages}
                />
              ) : event.body ? (
                <PortableText value={event.body} />
              ) : (
                <div className="rounded-2xl border border-primary-200 bg-primary-50/30 p-8 md:p-12 dark:border-primary-700/30 dark:bg-primary-900/20">
                  <p className="font-body text-lg leading-relaxed text-grey-700 dark:text-grey-300">
                    Event details coming soon. Check back later for more information about this
                    event.
                  </p>
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <EventSidebarOptimistic event={event} />

                {/* Call to Action */}
                <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 dark:border-primary-700/30 dark:from-primary-900/20 dark:to-primary-800/10">
                  <h3 className="mb-3 font-display text-lg font-semibold text-grey-900 dark:text-grey-100">
                    Stay Connected
                  </h3>
                  <p className="mb-4 font-body text-sm text-grey-700 dark:text-grey-300">
                    Get updates on upcoming events and volunteer opportunities.
                  </p>
                  <Link href="/get-involved">
                    <Button variant="outline" size="small" className="w-full">
                      Subscribe to Updates
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </div>
    </>
  )
}
