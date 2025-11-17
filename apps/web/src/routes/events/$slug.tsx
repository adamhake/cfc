import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/Button/button";
import Container from "@/components/Container/container";
import EventStatusChip from "@/components/EventStatusChip/event-status-chip";
import { Markdown } from "@/components/Markdown/markdown";
import { PortableText } from "@/components/PortableText/portable-text";
import { SanityImage } from "@/components/SanityImage";
import { events as staticEvents, type Event as StaticEvent } from "@/data/events";
import { queryKeys } from "@/lib/query-keys";
import { sanityClient } from "@/lib/sanity";
import type { SanityEvent } from "@/lib/sanity-types";
import {
  generateEventStructuredData,
  generateLinkTags,
  generateMetaTags,
  SITE_CONFIG,
} from "@/utils/seo";
import { formatDateString } from "@/utils/time";
import { eventBySlugQuery } from "@chimborazo/sanity-config";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";

// Pre-load all markdown files using glob import
const markdownFiles = import.meta.glob<{ default: string }>("../../data/events/*.md", {
  query: "?raw",
  import: "default",
});

// Query options for fetching event by slug with caching
const eventBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: queryKeys.events.detail(slug),
    queryFn: async () => {
      // Try to fetch from Sanity first
      let sanityEvent: SanityEvent | null = null;
      try {
        sanityEvent = await sanityClient.fetch(eventBySlugQuery, { slug });
      } catch (error) {
        console.warn("Failed to fetch event from Sanity:", error);
      }

      // If we have a Sanity event, use it
      if (sanityEvent) {
        return {
          event: sanityEvent,
          isSanityEvent: true,
          markdownContent: null,
        };
      }

      // Otherwise fall back to static events
      const staticEvent = staticEvents.find((e) => e.slug === slug);
      if (!staticEvent) {
        throw notFound();
      }

      let markdownContent: string | null = null;
      if (staticEvent.markdownFile) {
        try {
          // Load markdown file from pre-loaded glob
          const markdownPath = `../../data/events/${staticEvent.markdownFile}`;
          const loadMarkdown = markdownFiles[markdownPath];
          if (loadMarkdown) {
            const module = await loadMarkdown();
            markdownContent = typeof module === "string" ? module : module.default;
          }
        } catch (error) {
          console.warn(`Failed to load markdown file: ${staticEvent.markdownFile}`, error);
        }
      }

      return {
        event: staticEvent,
        isSanityEvent: false,
        markdownContent,
      };
    },
    // Event content rarely changes after publish - cache for 10 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

export const Route = createFileRoute("/events/$slug")({
  component: EventPage,
  loader: async ({ params, context }) => {
    // Use TanStack Query for caching
    await context.queryClient.ensureQueryData(eventBySlugQueryOptions(params.slug));
  },
  head: ({ params }) => {
    // Generate basic meta tags - detailed ones are in component's structured data
    const eventUrl = `${SITE_CONFIG.url}/events/${params.slug}`;

    return {
      meta: generateMetaTags({
        title: "Event Details",
        description: "Join us for this Chimborazo Park event. Check out the details and RSVP.",
        type: "article",
        url: eventUrl,
      }),
      links: generateLinkTags({
        canonical: eventUrl,
      }),
    };
  },
});

function EventPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(eventBySlugQueryOptions(slug));
  const { event, isSanityEvent, markdownContent } = data;

  const isPast = new Date(event.date) < new Date();

  // Generate structured data for the event
  const imageUrl = isSanityEvent
    ? (event as SanityEvent).heroImage.asset.url
    : `${SITE_CONFIG.url}/${(event as StaticEvent).image.src}`;

  const eventSlug = isSanityEvent
    ? (event as SanityEvent).slug.current
    : (event as StaticEvent).slug;

  const eventUrl = `${SITE_CONFIG.url}/events/${eventSlug}`;

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
  });

  // Get hero image - for Sanity events, we'll use SanityImage component
  const sanityHeroImage =
    isSanityEvent && "heroImage" in event ? (event as SanityEvent).heroImage : null;
  const staticImageData = !isSanityEvent ? (event as StaticEvent).image : null;

  return (
    <>
      {/* Event Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <header
          className="relative min-h-[70vh] w-full overflow-hidden lg:min-h-[55vh]"
          role="banner"
          aria-label="Event header"
        >
          {sanityHeroImage ? (
            <SanityImage
              image={sanityHeroImage}
              alt={sanityHeroImage.alt}
              className="absolute inset-0 h-full w-full object-cover"
              priority={true}
              sizes="100vw"
              maxWidth={1920}
            />
          ) : staticImageData ? (
            <img
              src={staticImageData.src}
              alt={staticImageData.alt}
              width={staticImageData.width}
              height={staticImageData.height}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          ) : null}
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary-900/75 to-primary-800/55 dark:from-primary-950/85 dark:to-primary-900/65"
            aria-hidden="true"
          ></div>
          <div className="absolute inset-0 z-10 flex items-end justify-center px-4 pt-20 pb-16 lg:items-center lg:py-8">
            <div className="mx-auto w-full max-w-6xl">
              <div className="text-center">
                <div className="mb-6">
                  <EventStatusChip isPast={isPast} />
                </div>
                <h1 className="font-display text-4xl text-primary-50 md:text-5xl lg:text-6xl dark:text-grey-50">
                  {event.title}
                </h1>
                <p className="mt-6 font-body text-lg text-primary-100 md:text-xl dark:text-grey-200">
                  {event.description}
                </p>
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
                className="fill-grey-50 dark:fill-primary-900"
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
            <main className="lg:col-span-8">
              {isSanityEvent && "body" in event && (event as SanityEvent).body ? (
                <PortableText value={(event as SanityEvent).body!} />
              ) : markdownContent ? (
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <Markdown content={markdownContent} />
                </div>
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
                          <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
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
                          <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
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
                          <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
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
            </aside>
          </div>
        </Container>
      </div>
    </>
  );
}
