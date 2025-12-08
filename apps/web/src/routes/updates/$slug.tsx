import { Button } from "@/components/Button/button";
import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import { PortableText } from "@/components/PortableText/portable-text";
import type { SanityImageObject } from "@/components/SanityImage/sanity-image";
import { CACHE_PRESETS } from "@/lib/query-config";
import { queryKeys } from "@/lib/query-keys";
import { sanityClient } from "@/lib/sanity";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { formatDateString } from "@/utils/time";
import { updateBySlugQuery, updateNavigationQuery } from "@chimborazo/sanity-config";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, Tag, Folder, CalendarDays } from "lucide-react";

interface RelatedEvent {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  description: string;
  date: string;
  heroImage?: {
    asset: {
      _id: string;
      url: string;
      metadata?: {
        dimensions?: { width: number; height: number };
        lqip?: string;
        blurhash?: string;
      };
    };
    alt?: string;
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
}

interface RelatedProject {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  description: string;
  status: string;
  heroImage?: {
    _id: string;
    title?: string;
    alt?: string;
    image: {
      asset: {
        _id: string;
        url: string;
        metadata?: {
          dimensions?: { width: number; height: number };
          lqip?: string;
          blurhash?: string;
        };
      };
      hotspot?: { x: number; y: number };
      crop?: { top: number; bottom: number; left: number; right: number };
    };
  };
}

interface UpdateDetail {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  description: string;
  heroImage: {
    _id: string;
    title?: string;
    alt?: string;
    image: {
      asset: {
        _id: string;
        url: string;
        metadata?: {
          dimensions?: { width: number; height: number; aspectRatio?: number };
          lqip?: string;
          blurhash?: string;
        };
      };
      hotspot?: { x: number; y: number };
      crop?: { top: number; bottom: number; left: number; right: number };
    };
  };
  category?: {
    _id: string;
    title: string;
    slug: { current: string };
    color?: string;
  };
  featured?: boolean;
  publishedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[];
  relatedEvents?: RelatedEvent[];
  relatedProjects?: RelatedProject[];
}

interface UpdateNavigation {
  previous?: { _id: string; title: string; slug: { current: string } };
  next?: { _id: string; title: string; slug: { current: string } };
}

// Query options for fetching update by slug with caching
const updateBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: queryKeys.updates.detail(slug),
    queryFn: async (): Promise<UpdateDetail> => {
      const update = await sanityClient.fetch<UpdateDetail | null>(updateBySlugQuery, {
        slug,
      });
      if (!update) {
        throw notFound();
      }
      return update;
    },
    ...CACHE_PRESETS.EVENT_DETAIL,
  });

const updateNavigationQueryOptions = (publishedAt: string) =>
  queryOptions({
    queryKey: ["update", "navigation", publishedAt] as const,
    queryFn: async (): Promise<UpdateNavigation> => {
      return await sanityClient.fetch(updateNavigationQuery, { publishedAt });
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

export const Route = createFileRoute("/updates/$slug")({
  component: UpdatePage,
  loader: async ({ params, context }) => {
    const update = await context.queryClient.ensureQueryData(updateBySlugQueryOptions(params.slug));
    // Prefetch navigation after we have the update
    await context.queryClient.ensureQueryData(updateNavigationQueryOptions(update.publishedAt));
    return { update };
  },
  head: ({ params }) => {
    const updateUrl = `${SITE_CONFIG.url}/updates/${params.slug}`;

    return {
      meta: generateMetaTags({
        title: "Update",
        description: "Read the latest news and updates from Chimborazo Park Conservancy.",
        type: "article",
        url: updateUrl,
      }),
      links: generateLinkTags({
        canonical: updateUrl,
      }),
    };
  },
});

const categoryColorMap: Record<string, string> = {
  green: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
  blue: "bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200",
  orange: "bg-terra-100 text-terra-800 dark:bg-terra-900 dark:text-terra-200",
  purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  teal: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
};

function UpdatePage() {
  const { slug } = Route.useParams();
  const { data: update } = useSuspenseQuery(updateBySlugQueryOptions(slug));
  const { data: navigation } = useSuspenseQuery(updateNavigationQueryOptions(update.publishedAt));

  const fmtDate = formatDateString(update.publishedAt);

  const categoryColorClass = update.category?.color
    ? categoryColorMap[update.category.color] ||
      "bg-grey-100 text-grey-700 dark:bg-grey-800 dark:text-grey-300"
    : "bg-grey-100 text-grey-700 dark:bg-grey-800 dark:text-grey-300";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PageHero
        title={update.title}
        subtitle={update.description}
        sanityImage={update.heroImage.image as SanityImageObject}
        height="auto"
        priority={true}
        alignment="bottom-mobile-center-desktop"
        titleSize="large"
      >
        <div className="mb-6 flex flex-wrap items-center gap-3 lg:mt-16">
          {update.category && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-body text-sm font-semibold ${categoryColorClass}`}
            >
              <Tag className="h-3.5 w-3.5" />
              {update.category.title}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-grey-100/90 px-3 py-1 font-body text-sm font-medium text-grey-700 dark:bg-grey-800/90 dark:text-grey-300">
            <Calendar className="h-3.5 w-3.5" />
            {fmtDate}
          </span>
        </div>
      </PageHero>

      {/* Back Button */}
      <Container spacing="md" className="pt-8">
        <Link
          to="/updates"
          search={{}}
          className="group inline-flex items-center gap-2 font-body text-sm font-medium text-primary-700 transition-colors hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Updates</span>
        </Link>
      </Container>

      {/* Main Content */}
      <Container spacing="md" className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Main Content */}
          <main className="lg:col-span-8">
            {update.body && update.body.length > 0 ? (
              <PortableText value={update.body} />
            ) : (
              <div className="rounded-2xl border border-primary-200 bg-primary-50/30 p-8 md:p-12 dark:border-primary-700/30 dark:bg-primary-900/20">
                <p className="font-body text-lg leading-relaxed text-grey-700 dark:text-grey-300">
                  Content coming soon. Check back later for more details.
                </p>
              </div>
            )}

            {/* Previous/Next Navigation */}
            {(navigation.previous || navigation.next) && (
              <div className="mt-16 grid grid-cols-1 gap-4 border-t border-grey-200 pt-8 sm:grid-cols-2 dark:border-grey-700">
                {navigation.previous ? (
                  <Link
                    to="/updates/$slug"
                    params={{ slug: navigation.previous.slug.current }}
                    className="group flex flex-col gap-1 rounded-lg border border-grey-200 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50/50 dark:border-grey-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
                  >
                    <span className="flex items-center gap-1 font-body text-xs font-medium text-grey-500 uppercase dark:text-grey-400">
                      <ArrowLeft className="h-3 w-3" />
                      Previous
                    </span>
                    <span className="font-display text-base text-grey-900 group-hover:text-primary-700 dark:text-grey-100 dark:group-hover:text-primary-300">
                      {navigation.previous.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {navigation.next && (
                  <Link
                    to="/updates/$slug"
                    params={{ slug: navigation.next.slug.current }}
                    className="group flex flex-col items-end gap-1 rounded-lg border border-grey-200 p-4 text-right transition-colors hover:border-primary-300 hover:bg-primary-50/50 dark:border-grey-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
                  >
                    <span className="flex items-center gap-1 font-body text-xs font-medium text-grey-500 uppercase dark:text-grey-400">
                      Next
                      <ArrowRight className="h-3 w-3" />
                    </span>
                    <span className="font-display text-base text-grey-900 group-hover:text-primary-700 dark:text-grey-100 dark:group-hover:text-primary-300">
                      {navigation.next.title}
                    </span>
                  </Link>
                )}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Related Events */}
              {update.relatedEvents && update.relatedEvents.length > 0 && (
                <div className="overflow-hidden rounded-2xl border border-accent-200 bg-white shadow-sm dark:border-accent-700/30 dark:bg-primary-950">
                  <div className="bg-gradient-to-br from-accent-50 to-accent-100/50 px-6 py-5 dark:from-primary-900/30 dark:to-primary-800/20">
                    <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-grey-900 dark:text-grey-100">
                      <CalendarDays className="h-5 w-5" />
                      Related Events
                    </h2>
                  </div>
                  <div className="divide-y divide-accent-100 dark:divide-accent-800/30">
                    {update.relatedEvents.map((event) => (
                      <Link
                        key={event._id}
                        to="/events/$slug"
                        params={{ slug: event.slug.current }}
                        className="block px-6 py-4 transition-colors hover:bg-accent-50/50 dark:hover:bg-accent-900/20"
                      >
                        <h3 className="font-display text-base font-medium text-grey-900 dark:text-grey-100">
                          {event.title}
                        </h3>
                        <p className="mt-1 font-body text-sm text-grey-600 dark:text-grey-400">
                          {formatDateString(event.date, "short")}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Projects */}
              {update.relatedProjects && update.relatedProjects.length > 0 && (
                <div className="overflow-hidden rounded-2xl border border-primary-200 bg-white shadow-sm dark:border-primary-700/30 dark:bg-primary-950">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 px-6 py-5 dark:from-primary-900/30 dark:to-primary-800/20">
                    <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-grey-900 dark:text-grey-100">
                      <Folder className="h-5 w-5" />
                      Related Projects
                    </h2>
                  </div>
                  <div className="divide-y divide-primary-100 dark:divide-primary-800/30">
                    {update.relatedProjects.map((project) => (
                      <Link
                        key={project._id}
                        to="/projects/$slug"
                        params={{ slug: project.slug.current }}
                        className="block px-6 py-4 transition-colors hover:bg-primary-50/50 dark:hover:bg-primary-900/20"
                      >
                        <h3 className="font-display text-base font-medium text-grey-900 dark:text-grey-100">
                          {project.title}
                        </h3>
                        <p className="mt-1 font-body text-sm text-grey-600 capitalize dark:text-grey-400">
                          {project.status}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 dark:border-primary-700/30 dark:from-primary-900/20 dark:to-primary-800/10">
                <h3 className="mb-3 font-display text-lg font-semibold text-grey-900 dark:text-grey-100">
                  Stay Connected
                </h3>
                <p className="mb-4 font-body text-sm text-grey-700 dark:text-grey-300">
                  Get updates on park news and volunteer opportunities.
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
  );
}
