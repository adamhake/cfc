import { Button } from "@/components/Button/button";
import Chip from "@/components/Chip";
import Container from "@/components/Container/container";
import ImageGallery, { type SanityGalleryImage } from "@/components/ImageGallery/image-gallery";
import { Markdown } from "@/components/Markdown/markdown";
import PageHero from "@/components/PageHero/page-hero";
import { PortableText } from "@/components/PortableText/portable-text";
import { UpdateCondensed, type UpdateData } from "@/components/Update/update";
import { events as staticEvents, type Event as StaticEvent } from "@/data/events";
import { CACHE_PRESETS } from "@/lib/query-config";
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
import { eventBySlugQuery, updatesByEventQuery } from "@chimborazo/sanity-config";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, MapPin, Newspaper } from "lucide-react";
import { useState } from "react";

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
      // Try to fetch from Sanity first (primary source)
      try {
        const sanityEvent = await sanityClient.fetch<SanityEvent | null>(eventBySlugQuery, {
          slug,
        });
        if (sanityEvent) {
          return {
            event: sanityEvent,
            isSanityEvent: true,
            markdownContent: null,
          };
        }
        // Sanity query succeeded but returned null - event doesn't exist there
      } catch (error) {
        // Log Sanity fetch errors but continue to fallback
        console.warn("Failed to fetch event from Sanity, falling back to static events:", error);
      }

      // Fall back to static events (legacy data source)
      const staticEvent = staticEvents.find((e) => e.slug === slug);
      if (!staticEvent) {
        // Event not found in either source
        throw notFound();
      }

      // Load optional markdown content for static events
      let markdownContent: string | null = null;
      if (staticEvent.markdownFile) {
        try {
          const markdownPath = `../../data/events/${staticEvent.markdownFile}`;
          const loadMarkdown = markdownFiles[markdownPath];
          if (loadMarkdown) {
            const module = await loadMarkdown();
            markdownContent = typeof module === "string" ? module : module.default;
          }
        } catch (error) {
          // Markdown is optional, log warning and continue
          console.warn(`Failed to load markdown file: ${staticEvent.markdownFile}`, error);
        }
      }

      return {
        event: staticEvent,
        isSanityEvent: false,
        markdownContent,
      };
    },
    ...CACHE_PRESETS.EVENT_DETAIL,
  });

// Query options for fetching updates related to an event
const updatesByEventQueryOptions = (eventId: string) =>
  queryOptions({
    queryKey: queryKeys.updates.byEvent(eventId),
    queryFn: async (): Promise<UpdateData[]> => {
      try {
        return await sanityClient.fetch(updatesByEventQuery, { eventId });
      } catch (error) {
        console.warn("Failed to fetch related updates:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

export const Route = createFileRoute("/events/$slug")({
  component: EventPage,
  loader: async ({ params, context }) => {
    // Use TanStack Query for caching
    const eventData = await context.queryClient.ensureQueryData(
      eventBySlugQueryOptions(params.slug),
    );
    // Prefetch related updates
    const eventId = eventData.isSanityEvent ? (eventData.event as SanityEvent)._id : "skip";
    await context.queryClient.ensureQueryData(updatesByEventQueryOptions(eventId));
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

  // Fetch related updates if this is a Sanity event
  const sanityEventId = isSanityEvent ? (event as SanityEvent)._id : null;
  const { data: relatedUpdates = [] } = useSuspenseQuery(
    updatesByEventQueryOptions(sanityEventId || "skip"),
  );

  const isPast = new Date(event.date) < new Date();

  // Check if event has recap content (for past events)
  const sanityEvent = isSanityEvent ? (event as SanityEvent) : null;
  const hasRecap =
    isPast && sanityEvent?.recap && Array.isArray(sanityEvent.recap) && sanityEvent.recap.length > 0;

  // Transform recap gallery images for ImageGallery component
  const recapGalleryImages: SanityGalleryImage[] =
    sanityEvent?.recapGallery?.images
      ?.filter((item) => item?.image?.image?.asset?.url)
      .map((item) => ({
        ...item.image.image,
        alt: item.image.image.alt || item.image.title || "Event photo",
        showOnMobile: item.showOnMobile,
      })) ?? [];

  // State to toggle between recap and original details
  const [showOriginalDetails, setShowOriginalDetails] = useState(false);

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
        <PageHero
          title={event.title}
          subtitle={event.description}
          sanityImage={sanityHeroImage ?? undefined}
          imageSrc={staticImageData?.src}
          imageAlt={staticImageData?.alt || sanityHeroImage?.alt}
          imageWidth={staticImageData?.width}
          imageHeight={staticImageData?.height}
          height="auto"
          priority={true}
          alignment="bottom-mobile-center-desktop"
          titleSize="large"
        >
          <div className="mb-6 lg:mt-16">
            <Chip label={isPast ? "Past" : "Upcoming"} variant={isPast ? "past" : "upcoming"} />
          </div>
        </PageHero>

        {/* Back Button */}
        <Container spacing="md" className="pt-8">
          <Link
            to="/events"
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
              {/* Show recap for past events (if available and not toggled to original) */}
              {hasRecap && !showOriginalDetails ? (
                <>
                  <PortableText value={sanityEvent!.recap!} />
                  {recapGalleryImages.length > 0 && (
                    <div className="mt-12">
                      <h2 className="mb-6 font-display text-2xl font-semibold text-grey-900 dark:text-grey-100">
                        Event Photos
                      </h2>
                      <ImageGallery
                        images={recapGalleryImages}
                        variant="masonry"
                        columns={{ default: 1, sm: 2, md: 2, lg: 3 }}
                        gap="md"
                        showCaptions={true}
                        captionPosition="hover"
                      />
                    </div>
                  )}
                  <div className="mt-8">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => setShowOriginalDetails(true)}
                    >
                      View original event details
                    </Button>
                  </div>
                </>
              ) : /* Show original body content when toggled or when no recap */
              hasRecap && showOriginalDetails ? (
                <>
                  {sanityEvent?.body ? (
                    <PortableText value={sanityEvent.body} />
                  ) : (
                    <div className="rounded-2xl border border-primary-200 bg-primary-50/30 p-8 md:p-12 dark:border-primary-700/30 dark:bg-primary-900/20">
                      <p className="font-body text-lg leading-relaxed text-grey-700 dark:text-grey-300">
                        No original event details available.
                      </p>
                    </div>
                  )}
                  <div className="mt-8">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => setShowOriginalDetails(false)}
                    >
                      View event recap
                    </Button>
                  </div>
                </>
              ) : /* Default: show body content (no recap available) */
              isSanityEvent && sanityEvent?.body ? (
                <PortableText value={sanityEvent.body} />
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
                <div className="overflow-hidden rounded-2xl border border-accent-200 bg-white shadow-sm dark:border-accent-700/30 dark:bg-primary-950">
                  <div className="bg-gradient-to-br from-accent-50 to-accent-100/50 px-6 py-5 dark:from-primary-900/30 dark:to-primary-800/20">
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

                {/* Related Updates */}
                {relatedUpdates.length > 0 && (
                  <div className="overflow-hidden rounded-2xl border border-terra-200 bg-white shadow-sm dark:border-terra-700/30 dark:bg-primary-950">
                    <div className="bg-gradient-to-br from-terra-50 to-terra-100/50 px-6 py-5 dark:from-primary-900/30 dark:to-primary-800/20">
                      <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-grey-900 dark:text-grey-100">
                        <Newspaper className="h-5 w-5" />
                        Related Updates
                      </h2>
                    </div>
                    <div className="divide-y divide-terra-100 dark:divide-terra-800/30">
                      {relatedUpdates.slice(0, 3).map((update: UpdateData) => (
                        <div key={update._id} className="px-4 py-3">
                          <UpdateCondensed {...update} />
                        </div>
                      ))}
                    </div>
                    {relatedUpdates.length > 3 && (
                      <div className="border-t border-terra-100 px-6 py-4 dark:border-terra-800/30">
                        <Link
                          to="/updates"
                          search={{}}
                          className="font-body text-sm font-medium text-terra-700 hover:text-terra-900 dark:text-terra-400 dark:hover:text-terra-300"
                        >
                          View all related updates
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Call to Action */}
                <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 dark:border-primary-700/30 dark:from-primary-900/20 dark:to-primary-800/10">
                  <h3 className="mb-3 font-display text-lg font-semibold text-grey-900 dark:text-grey-100">
                    Stay Connected
                  </h3>
                  <p className="mb-4 font-body text-sm text-grey-700 dark:text-grey-300">
                    Get updates on upcoming events and volunteer opportunities.
                  </p>
                  <Link to="/get-involved">
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
