import Container from "@/components/Container/container";
import Event from "@/components/Event/event";
import PageHero from "@/components/PageHero/page-hero";
import { PortableText } from "@/components/PortableText/portable-text";
import { events as staticEvents, type Event as StaticEvent } from "@/data/events";
import { queryKeys } from "@/lib/query-keys";
import { sanityClient } from "@/lib/sanity";
import type { SanityEvent, SanityEventsPage } from "@/lib/sanity-types";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { allEventsQuery, getEventsPageQuery } from "@chimborazo/sanity-config";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

// Query options for TanStack Query
const eventsQueryOptions = queryOptions({
  queryKey: queryKeys.events.all(),
  queryFn: async (): Promise<SanityEvent[]> => {
    try {
      return await sanityClient.fetch(allEventsQuery);
    } catch (error) {
      console.warn("Failed to fetch events from Sanity, using static data:", error);
      // Return empty array if Sanity is not configured
      return [];
    }
  },
  // Events list changes occasionally - cache for 5 minutes
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 15 * 60 * 1000, // 15 minutes
});

const eventsPageQueryOptions = queryOptions({
  queryKey: queryKeys.eventsPage(),
  queryFn: async (): Promise<SanityEventsPage | null> => {
    try {
      return await sanityClient.fetch(getEventsPageQuery);
    } catch (error) {
      console.warn("Failed to fetch events page from Sanity:", error);
      return null;
    }
  },
  staleTime: 30 * 60 * 1000, // 30 minutes
  gcTime: 60 * 60 * 1000, // 1 hour
});

export const Route = createFileRoute("/events/")({
  component: Events,
  loader: async ({ context }) => {
    // Prefetch both events data and page content on the server
    const [events, pageData] = await Promise.all([
      context.queryClient.ensureQueryData(eventsQueryOptions),
      context.queryClient.ensureQueryData(eventsPageQueryOptions),
    ]);
    return { events, pageData };
  },
  head: () => ({
    meta: generateMetaTags({
      title: "Events",
      description:
        "Join us for park clean-ups, tree plantings, educational presentations, and community gatherings. Discover upcoming and past events at Chimborazo Park.",
      type: "website",
      url: `${SITE_CONFIG.url}/events`,
      image: {
        url: `${SITE_CONFIG.url}/volunteers.webp`,
        width: 2000,
        height: 1333,
        alt: "Community volunteers at Chimborazo Park",
      },
    }),
    links: generateLinkTags({
      canonical: `${SITE_CONFIG.url}/events`,
    }),
  }),
});

function Events() {
  const { events: sanityEvents, pageData } = Route.useLoaderData();

  // Use Sanity events if available, otherwise fall back to static events
  const eventsToDisplay = sanityEvents && sanityEvents.length > 0 ? sanityEvents : staticEvents;

  // Prepare hero data from Sanity or use fallbacks
  const heroData = pageData?.pageHero?.image?.image
    ? {
        title: pageData.pageHero.title,
        subtitle: pageData.pageHero.description,
        sanityImage: pageData.pageHero.image.image,
      }
    : {
        title: "Events",
        subtitle: "Join us in preserving and enhancing Chimborazo Park",
        imageSrc: "/volunteers.webp",
        imageAlt: "Community volunteers at Chimborazo Park",
        imageWidth: 2000,
        imageHeight: 1333,
      };

  // Convert Sanity events to the format expected by the Event component
  const formattedEvents = eventsToDisplay.map((event: SanityEvent | StaticEvent) => {
    // Check if it's a Sanity event or static event
    if ("_id" in event) {
      // Sanity event
      return {
        id: event._id,
        title: event.title,
        slug: event.slug.current,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        image: {
          src: event.heroImage.asset.url,
          alt: event.heroImage.alt,
          width: event.heroImage.asset.metadata?.dimensions?.width || 1200,
          height: event.heroImage.asset.metadata?.dimensions?.height || 800,
        },
      };
    }
    // Static event - return as is
    return event;
  });

  // Sort events by date, newest first
  const sortedEvents = [...formattedEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-24 pb-24">
      <PageHero {...heroData} height="large" priority={true} />

      <Container spacing="md" className="px-4 md:px-0">
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
            <Event key={`event-${event.id}`} {...event} />
          ))}
        </div>
      </Container>
    </div>
  );
}
