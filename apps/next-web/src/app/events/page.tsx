import { allEventsQuery, getEventsPageQuery } from "@chimborazo/sanity-config/queries"
import type { Metadata } from "next"
import Container from "@/components/Container/container"
import PageHeroOptimistic from "@/components/PageHero/page-hero-optimistic"
import { PageIntroduction } from "@/components/PageIntroduction/page-introduction"
import { CACHE_TAGS, cachedSanityFetch, getDynamicFetchOptions } from "@/lib/sanity-fetch"
import type { SanityEvent, SanityEventsPage } from "@/lib/sanity-types"
import { sortEventsByDate } from "@/lib/sort-helpers"
import { generateItemListStructuredData, SITE_CONFIG } from "@/utils/seo"
import EventsListClient from "./events-list-client"

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
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: allEventsQuery,
      tags: [CACHE_TAGS.EVENTS_LIST, CACHE_TAGS.EVENTS],
    }),
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: getEventsPageQuery,
      tags: [CACHE_TAGS.EVENTS_LIST],
    }),
  ])) as [{ data: SanityEvent[] }, { data: SanityEventsPage | null }]

  // Sort events by date, newest first. Client re-sorts after optimistic updates.
  const sortedEvents = sortEventsByDate(events)

  const itemListData = generateItemListStructuredData(
    sortedEvents.map((event) => ({
      name: event.title ?? "",
      url: `${SITE_CONFIG.url}/events/${event.slug?.current ?? ""}`,
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
          title: "Events",
          subtitle: "Join us in preserving and enhancing Chimborazo Park",
          imageSrc: "/volunteers.webp",
          imageAlt: "Community volunteers at Chimborazo Park",
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
            "From seasonal clean-ups to tree plantings and educational presentations, our events bring together neighbors who care about this historic park.",
            "Whether you're picking up litter, planting native species, or learning about urban forestry, every contribution helps preserve Chimborazo for future generations.",
          ]}
        />

        <EventsListClient events={sortedEvents} />
      </Container>
    </div>
  )
}
