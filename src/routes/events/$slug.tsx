import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/Button/button";
import { events } from "@/data/events";
import EventStatusChip from "@/components/EventStatusChip/event-status-chip";
import { Markdown } from "@/components/Markdown/markdown";
import { formatDateString } from "@/utils/time";
import Container from "@/components/Container/container";
import { motion } from "framer-motion";

// Pre-load all markdown files using glob import
const markdownFiles = import.meta.glob<{ default: string }>("../../data/events/*.md", {
  query: "?raw",
  import: "default",
});

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
        // Load markdown file from pre-loaded glob
        const markdownPath = `../../data/events/${event.markdownFile}`;
        const loadMarkdown = markdownFiles[markdownPath];
        if (loadMarkdown) {
          const module = await loadMarkdown();
          markdownContent = typeof module === "string" ? module : module.default;
        }
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <header
        className="relative min-h-[70vh] w-full overflow-hidden lg:min-h-[55vh]"
        role="banner"
        aria-label="Event header"
      >
        <img
          src={event.image.src}
          alt={event.image.alt}
          width={event.image.width}
          height={event.image.height}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary-900/75 to-primary-800/55 dark:from-primary-950/85 dark:to-primary-900/65"
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 z-10 flex items-end justify-center px-4 pb-12 pt-20 lg:items-center lg:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <EventStatusChip isPast={isPast} />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-4xl text-primary-50 md:text-5xl lg:text-6xl dark:text-grey-50"
              >
                {event.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 font-body text-lg text-primary-100 md:text-xl dark:text-grey-200"
              >
                {event.description}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Organic wave divider */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block h-16 w-full lg:h-24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
          >
            <path
              d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60 L1200,120 L0,120 Z"
              className="fill-grey-50 dark:fill-green-900"
            />
            <path
              d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60"
              className="fill-none stroke-accent-600 dark:stroke-accent-500"
              strokeWidth="7"
            />
          </svg>
        </div>
      </header>

      {/* Back Button */}
      <Container spacing="md" className="px-4 pt-8 md:px-0">
        <Link
          to="/events"
          className="group inline-flex items-center gap-2 font-body text-sm font-medium text-primary-700 transition-colors hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Events</span>
        </Link>
      </Container>

      {/* Main Content */}
      <Container spacing="md" className="px-4 py-12 md:px-0 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-8"
          >
            {markdownContent ? (
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <Markdown content={markdownContent} />
              </div>
            ) : (
              <div className="rounded-2xl border border-primary-200 bg-primary-50/30 p-8 md:p-12 dark:border-primary-700/30 dark:bg-primary-900/20">
                <p className="font-body text-lg leading-relaxed text-grey-700 dark:text-grey-300">
                  Event details coming soon. Check back later for more information about this event.
                </p>
              </div>
            )}
          </motion.main>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-4"
          >
            <div className="sticky top-24 space-y-6">
              {/* Event Details Card */}
              <div className="overflow-hidden rounded-2xl border border-accent-200 bg-white shadow-sm dark:border-accent-700/30 dark:bg-grey-800">
                <div className="bg-gradient-to-br from-accent-50 to-accent-100/50 px-6 py-5 dark:from-accent-900/30 dark:to-accent-800/20">
                  <h2 className="font-display text-xl font-semibold text-grey-900 md:text-2xl dark:text-grey-100">
                    Event Details
                  </h2>
                </div>
                <div className="space-y-6 p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
                      <div>
                        <div className="font-body text-xs font-semibold uppercase text-grey-600 dark:text-grey-400">
                          Date
                        </div>
                        <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                          {formatDateString(event.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
                      <div>
                        <div className="font-body text-xs font-semibold uppercase text-grey-600 dark:text-grey-400">
                          Time
                        </div>
                        <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                          {event.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
                      <div>
                        <div className="font-body text-xs font-semibold uppercase text-grey-600 dark:text-grey-400">
                          Location
                        </div>
                        <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isPast && (
                    <div className="border-t border-accent-200 pt-6 dark:border-accent-700/30">
                      <Button variant="accent" size="standard" className="w-full">
                        Register for Event
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Call to Action */}
              <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 dark:border-primary-700/30 dark:from-primary-900/20 dark:to-primary-800/10">
                <h3 className="mb-3 font-display text-lg font-semibold text-grey-900 dark:text-grey-100">
                  Stay Connected
                </h3>
                <p className="mb-4 font-body text-sm text-grey-700 dark:text-grey-300">
                  Get updates on upcoming events and volunteer opportunities.
                </p>
                <Link to="/" hash="get-involved">
                  <Button variant="outline" size="small" className="w-full">
                    Subscribe to Updates
                  </Button>
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>
      </Container>
    </div>
  );
}
