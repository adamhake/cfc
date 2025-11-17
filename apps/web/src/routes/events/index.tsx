import Container from "@/components/Container/container";
import Event from "@/components/Event/event";
import PageHero from "@/components/PageHero/page-hero";
import { events as staticEvents, type Event as StaticEvent } from "@/data/events";
import { sanityClient } from "@/lib/sanity";
import type { SanityEvent } from "@/lib/sanity-types";
import { allEventsQuery } from "@chimborazo/sanity-config";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";

// Query options for TanStack Query
const eventsQueryOptions = queryOptions({
  queryKey: ["events", "all"],
  queryFn: async (): Promise<SanityEvent[]> => {
    try {
      return await sanityClient.fetch(allEventsQuery);
    } catch (error) {
      console.warn("Failed to fetch events from Sanity, using static data:", error);
      // Return empty array if Sanity is not configured
      return [];
    }
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
});

export const Route = createFileRoute("/events/")({
  component: Events,
  loader: async ({ context }) => {
    // Prefetch events data on the server
    return context.queryClient.ensureQueryData(eventsQueryOptions);
  },
  head: () => ({
    meta: [
      {
        title: "Events | Chimborazo Park Conservancy",
      },
      {
        name: "description",
        content:
          "Join us for park clean-ups, tree plantings, educational presentations, and community gatherings. Discover upcoming and past events at Chimborazo Park.",
      },
      {
        property: "og:title",
        content: "Events | Chimborazo Park Conservancy",
      },
      {
        property: "og:description",
        content:
          "Join us for park clean-ups, tree plantings, educational presentations, and community gatherings. Discover upcoming and past events at Chimborazo Park.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://chimboparkconservancy.org/events",
      },
      {
        property: "og:image",
        content: "https://chimboparkconservancy.org/volunteers.webp",
      },
      {
        property: "og:image:width",
        content: "2000",
      },
      {
        property: "og:image:height",
        content: "1333",
      },
      {
        name: "twitter:title",
        content: "Events | Chimborazo Park Conservancy",
      },
      {
        name: "twitter:description",
        content:
          "Join us for park clean-ups, tree plantings, educational presentations, and community gatherings.",
      },
      {
        name: "twitter:image",
        content: "https://chimboparkconservancy.org/volunteers.webp",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://chimboparkconservancy.org/events",
      },
    ],
  }),
});

function Events() {
  const sanityEvents = Route.useLoaderData();

  // Use Sanity events if available, otherwise fall back to static events
  const eventsToDisplay = sanityEvents && sanityEvents.length > 0 ? sanityEvents : staticEvents;

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
      <PageHero
        title="Events"
        subtitle="Join us in preserving and enhancing Chimborazo Park"
        imageSrc="/volunteers.webp"
        imageAlt="Community volunteers at Chimborazo Park"
        imageWidth={2000}
        imageHeight={1333}
      />

      <Container spacing="md" className="px-4 md:px-0">
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

        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
          {sortedEvents.map((event) => (
            <Event key={`event-${event.id}`} {...event} />
          ))}
        </div>
      </Container>
    </div>
  );
}
