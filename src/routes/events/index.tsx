import Container from "@/components/Container/container";
import Event from "@/components/Event/event";
import PageHero from "@/components/PageHero/page-hero";
import { events } from "@/data/events";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/events/")({
  component: Events,
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
        name: "twitter:title",
        content: "Events | Chimborazo Park Conservancy",
      },
      {
        name: "twitter:description",
        content:
          "Join us for park clean-ups, tree plantings, educational presentations, and community gatherings.",
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
  // Sort events by date, newest first
  const sortedEvents = [...events].sort(
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
