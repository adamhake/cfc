import { createFileRoute, notFound } from "@tanstack/react-router";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/Button/button";
import { events } from "@/data/events";
import EventStatusChip from "@/components/EventStatusChip/event-status-chip";
import { Markdown } from "@/components/Markdown/markdown";

export const Route = createFileRoute("/events/$slug")({
  component: EventPage,
  loader: async ({ params }) => {
    const event = events.find((e) => e.slug === params.slug);
    if (!event) {
      throw notFound();
    }

    let markdownContent: string | null = null;
    if (event.markdownFile) {
      try {
        // Use dynamic import with ?raw to load markdown as string at build time
        const markdown = await import(`../../data/events/${event.markdownFile}?raw`);
        markdownContent = markdown.default;
      } catch (error) {
        console.warn(`Failed to load markdown file: ${event.markdownFile}`, error);
      }
    }

    return { event, markdownContent };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.event) return { meta: [] };

    const { event } = loaderData;
    const imageUrl = `https://chimboparkconservancy.org/${event.image.src}`;
    const eventUrl = `https://chimboparkconservancy.org/events/${event.slug}`;

    // Format date for display
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return {
      meta: [
        {
          title: `${event.title} | Chimborazo Park Conservancy`,
        },
        {
          name: "description",
          content: `${event.description} Join us on ${formattedDate} at ${event.time} at ${event.location}.`,
        },
        {
          property: "og:title",
          content: event.title,
        },
        {
          property: "og:description",
          content: `${event.description} Join us on ${formattedDate} at ${event.time}.`,
        },
        {
          property: "og:type",
          content: "article",
        },
        {
          property: "og:url",
          content: eventUrl,
        },
        {
          property: "og:image",
          content: imageUrl,
        },
        {
          property: "og:image:width",
          content: event.image.width.toString(),
        },
        {
          property: "og:image:height",
          content: event.image.height.toString(),
        },
        {
          property: "og:image:alt",
          content: event.image.alt,
        },
        {
          property: "article:published_time",
          content: event.date,
        },
        {
          name: "twitter:title",
          content: event.title,
        },
        {
          name: "twitter:description",
          content: `${event.description} ${formattedDate} at ${event.time}.`,
        },
        {
          name: "twitter:image",
          content: imageUrl,
        },
        {
          name: "twitter:image:alt",
          content: event.image.alt,
        },
      ],
      links: [
        {
          rel: "canonical",
          href: eventUrl,
        },
      ],
    };
  },
});
function EventPage() {
  const { event, markdownContent } = Route.useLoaderData();

  const isPast = new Date(event.date) < new Date();

  return (
    <div>
      <div className="relative h-auto w-full overflow-hidden bg-green-400 bg-cover py-20 pt-48 md:h-[50vh]">
        {/* Hero Image */}
        <img
          src={`/${event.image.src}`}
          alt={event.image.alt}
          width={event.image.width}
          height={event.image.height}
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          loading="eager"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/55 to-green-800/35"></div>

        <div className="absolute inset-0 z-10 flex items-end justify-start">
          <div className="mx-auto mb-16 w-full max-w-4xl space-y-3 px-4 text-center md:space-y-6">
            <div>
              <EventStatusChip isPast={isPast} />
            </div>
            <h1 className="font-display text-2xl text-white md:text-5xl">{event.title}</h1>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-900/70 to-green-800/50"></div>
      </div>
      <div
        className={`mx-auto flex w-full max-w-6xl ${isPast ? "flex-col" : "flex-col-reverse"} gap-14 px-4 py-16 md:grid md:grid-cols-6 md:gap-14 md:py-24 lg:px-0`}
      >
        <main className="col-span-4">
          {markdownContent ? (
            <Markdown content={markdownContent} />
          ) : (
            <p className="text-lg leading-normal text-grey-800">
              Event details coming soon. Check back later for more information about this event.
            </p>
          )}
        </main>
        <aside className={`w-full md:col-span-2`}>
          <div className="space-y-8 rounded-2xl border border-grey-100 bg-grey-50 p-6 md:p-8">
            <h2 className="font-display text-xl md:text-2xl">Event Details</h2>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Calendar className="h-5 w-5 stroke-green-700" />
                <span className="font-body font-medium text-grey-800">{event.date}</span>
              </div>
              <div className="flex gap-2">
                <Clock className="h-5 w-5 stroke-green-700" />
                <span className="font-body font-medium text-grey-800">{event.time}</span>
              </div>
              <div className="flex gap-2">
                <MapPin className="h-5 w-5 stroke-green-700" />
                <span className="font-body font-medium text-grey-800">{event.location}</span>
              </div>
            </div>
            <Button>Register</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
