import { allEventsQuery, getEventsPageQuery } from "@chimborazo/sanity-config/queries"
import type { Metadata } from "next"
import Container from "@/components/Container/container"
import Event from "@/components/Event/event"
import PageHero from "@/components/PageHero/page-hero"
import { PortableText } from "@/components/PortableText/portable-text"
import { CACHE_TAGS, sanityFetch } from "@/lib/sanity-fetch"
import type { SanityEvent, SanityEventsPage } from "@/lib/sanity-types"
import { generateItemListStructuredData, SITE_CONFIG } from "@/utils/seo"

export const metadata: Metadata = {
  title: "Events",
  description:
    "Join us for park clean-ups, tree plantings, and community gatherings in Richmond, VA. Discover upcoming and past events at Chimborazo Park.",
  alternates: { canonical: `${SITE_CONFIG.url}/events` },
  openGraph: {
    title: "Events",
    description:
      "Join us for park clean-ups, tree plantings, and community gatherings in Richmond, VA. Discover upcoming and past events at Chimborazo Park.",
    type: "website",
    url: `${SITE_CONFIG.url}/events`,
    images: [
      {
        url: `${SITE_CONFIG.url}/volunteers.webp`,
        width: 2000,
        height: 1333,
        alt: "Community volunteers at Chimborazo Park",
      },
    ],
  },
}

export default async function EventsPage() {
  const [{ data: events }, { data: pageData }] = (await Promise.all([
    sanityFetch({
      query: allEventsQuery,
      tags: [CACHE_TAGS.EVENTS_LIST, CACHE_TAGS.EVENTS],
    }),
    sanityFetch({
      query: getEventsPageQuery,
      tags: [CACHE_TAGS.EVENTS_LIST],
    }),
  ])) as [{ data: SanityEvent[] }, { data: SanityEventsPage | null }]

  // Prepare hero data from Sanity or use fallbacks
  const heroData = pageData?.pageHero?.image
    ? {
        title: pageData.pageHero.title,
        subtitle: pageData.pageHero.description,
        sanityImage: pageData.pageHero.image,
      }
    : {
        title: "Events",
        subtitle: "Join us in preserving and enhancing Chimborazo Park",
        imageSrc: "/volunteers.webp",
        imageAlt: "Community volunteers at Chimborazo Park",
        imageWidth: 2000,
        imageHeight: 1333,
      }

  // Sort events by date, newest first
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const itemListData = generateItemListStructuredData(
    sortedEvents.map((event) => ({
      name: event.title,
      url: `${SITE_CONFIG.url}/events/${event.slug.current}`,
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
      <PageHero {...heroData} height="medium" priority={true} />

      <Container spacing="md">
        {pageData?.introduction && pageData.introduction.length > 0 ? (
          <div className="mx-auto max-w-3xl text-center">
            <PortableText value={pageData.introduction} />
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="font-body text-xl leading-relaxed text-grey-800 md:text-2xl dark:text-grey-200">
              From seasonal clean-ups to tree plantings and educational presentations, our events
              bring together neighbors who care about this historic park.
            </p>
            <p className="font-body text-base text-grey-700 md:text-lg dark:text-grey-300">
              Whether you're picking up litter, planting native species, or learning about urban
              forestry, every contribution helps preserve Chimborazo for future generations.
            </p>
          </div>
        )}

        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
          {sortedEvents.map((event) => (
            <Event key={`event-${event._id}`} {...event} />
          ))}
        </div>
      </Container>
    </div>
  )
}
