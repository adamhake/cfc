import Container from "@/components/Container/container";
import Event from "@/components/Event/event";
import GetInvolved from "@/components/GetInvolved/get-involved";
import Hero from "@/components/Hero/hero";
import ImageGallery from "@/components/ImageGallery/image-gallery";
import Partners from "@/components/Partners/partners";
import Project from "@/components/Project/project";
import Quote from "@/components/Quote/quote";
import RotatingImages from "@/components/RotatingImages/rotating-images";
import type { SanityImageObject } from "@/components/SanityImage/sanity-image";
import SectionHeader from "@/components/SectionHeader/section-header";
import Vision from "@/components/Vision/vision";
import { siteSettingsQueryOptions } from "@/hooks/useSiteSettings";
import { CACHE_TAGS, generateCacheHeaders } from "@/lib/cache-headers";
import { getIsPreviewMode } from "@/lib/preview";
import { CACHE_PRESETS } from "@/lib/query-config";
import { queryKeys } from "@/lib/query-keys";
import { getSanityClient } from "@/lib/sanity";
import type { SanityEvent, SanityHomePage, SanityProject } from "@/lib/sanity-types";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import {
  featuredProjectsQuery,
  getHomePageQuery,
  recentEventsQuery,
} from "@chimborazo/sanity-config";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

// Query options for TanStack Query - accept preview flag for Visual Editing
const homePageQueryOptions = (preview = false) =>
  queryOptions({
    queryKey: [...queryKeys.homePage(), { preview }],
    queryFn: async (): Promise<SanityHomePage | null> => {
      try {
        return await getSanityClient(preview).fetch(getHomePageQuery);
      } catch (error) {
        console.warn("Failed to fetch homepage from Sanity:", error);
        return null;
      }
    },
    ...CACHE_PRESETS.CURATED_CONTENT,
  });

const featuredProjectsQueryOptions = (preview = false) =>
  queryOptions({
    queryKey: [...queryKeys.projects.featured(), { preview }],
    queryFn: async (): Promise<SanityProject[]> => {
      try {
        return await getSanityClient(preview).fetch(featuredProjectsQuery);
      } catch (error) {
        console.warn("Failed to fetch featured projects from Sanity:", error);
        return [];
      }
    },
    ...CACHE_PRESETS.CURATED_CONTENT,
  });

const recentEventsQueryOptions = (preview = false) =>
  queryOptions({
    queryKey: [...queryKeys.events.recent(), { preview }],
    queryFn: async (): Promise<SanityEvent[]> => {
      try {
        return await getSanityClient(preview).fetch(recentEventsQuery);
      } catch (error) {
        console.warn("Failed to fetch recent events from Sanity:", error);
        return [];
      }
    },
    ...CACHE_PRESETS.CURATED_CONTENT,
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context }) => {
    // Check if we're in preview mode for Visual Editing
    const preview = await getIsPreviewMode();

    // Block on critical above-the-fold data
    await Promise.all([
      context.queryClient.ensureQueryData(homePageQueryOptions(preview)),
      context.queryClient.ensureQueryData(siteSettingsQueryOptions),
    ]);

    // Stream below-the-fold data (fire-and-forget, no await)
    context.queryClient.fetchQuery(featuredProjectsQueryOptions(preview));
    context.queryClient.fetchQuery(recentEventsQueryOptions(preview));

    return { preview };
  },
  headers: ({ loaderData }) => {
    return generateCacheHeaders({
      preset: "CURATED_CONTENT",
      tags: [CACHE_TAGS.HOMEPAGE],
      isPreview: loaderData?.preview ?? false,
    });
  },
  head: () => ({
    meta: generateMetaTags({
      title: "Home",
      description:
        "The Chimborazo Park Conservancy preserves and enhances this Church Hill landmark through community stewardship. Join us in restoring Richmond's historic park.",
      type: "website",
      url: SITE_CONFIG.url,
      image: SITE_CONFIG.defaultImage,
    }),
    links: generateLinkTags({
      canonical: SITE_CONFIG.url,
      // Note: Hero image is now loaded from Sanity CMS, no static preload needed
    }),
  }),
});

function Home() {
  // Get preview mode from loader data
  const { preview } = Route.useLoaderData();

  // All data accessed via useSuspenseQuery for consistency and cache subscription
  const { data: homePageData } = useSuspenseQuery(homePageQueryOptions(preview));
  const { data: featuredProjects } = useSuspenseQuery(featuredProjectsQueryOptions(preview));
  const { data: recentEvents } = useSuspenseQuery(recentEventsQueryOptions(preview));

  // Prepare hero data from Sanity or use defaults
  const heroData = homePageData?.hero?.heroImage?.image?.asset?.url
    ? {
        heading: homePageData.hero.heading,
        subheading: homePageData.hero.subheading,
        heroImage: homePageData.hero.heroImage.image,
        ctaText: homePageData.hero.ctaButton?.text,
        ctaLink: homePageData.hero.ctaButton?.link,
      }
    : undefined;

  // Prepare gallery data from Sanity or use defaults
  const galleryData =
    homePageData?.gallery?.images
      ?.filter((img) => img?.image?.image?.asset?.url) // Filter out any images without assets
      .map((img) => ({
        ...img.image.image,
        alt: img.image.image.alt || "",
        showOnMobile: img.showOnMobile ?? true,
      })) || [];

  // Prepare park gallery data for rotating images
  const parkGalleryData =
    homePageData?.parkGallery?.images
      ?.filter((img) => img?.image?.image?.asset?.url) // Filter out any images without assets
      .map((img) => img.image.image) || [];

  return (
    <div className="space-y-24 pb-24 text-grey-900 dark:text-grey-100">
      <Hero {...heroData} />

      {/* Intro + Gallery */}
      <div className="text-grey-900">
        <Container spacing="md">
          <p className="max-w-4xl font-body text-2xl leading-snug font-medium md:text-3xl dark:text-grey-100">
            The Chimborazo Park Conservancy and Friends of Chimborazo Park preserve and enhance this
            Church Hill landmark through community stewardship.
          </p>
          <p className="mt-4 max-w-4xl font-body text-grey-800 md:text-lg dark:text-grey-100">
            Established in 2023 as a 501(c)(3) non-profit, the conservancy was formed out of the
            Friends of Chimborazo Park to address the broader needs of this historic greenspace as
            it continues to recover and thrive.
          </p>

          <p className="mt-4 max-w-4xl font-body text-grey-800 md:text-lg dark:text-grey-100">
            Since then, we've been putting down roots—engaging volunteers and partners on
            environmental projects while planning for the future. Together, we're building a
            sustainable foundation for a healthier, more beautiful park that serves our community
            for generations to come.
          </p>

          <div className="mt-12">
            <ImageGallery
              images={galleryData}
              variant="masonry"
              showCaptions={true}
              captionPosition="hover"
              gap="md"
            />
          </div>
        </Container>
      </div>

      {/* Our Vision */}
      <div>
        <Container spacing="md">
          <SectionHeader title="Our Vision" size="large" />
          <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
            Our mission is built on <strong>four core pillars</strong>. Explore each to see how
            we're working to make Chimborazo Park a cherished landmark for generations to come.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
            <Vision
              title="Restoration"
              pillar="restoration"
              description={[
                "Revitalizing and preserving the park's environmental character through the recovery and expansion of our natural spaces and habitats.",
                "Restoring and repairing the park's unique cultural heritage elements.",
              ]}
            />
            <Vision
              title="Recreation"
              pillar="recreation"
              description="Providing vibrant play spaces, natural areas, and a dog park where neighbors of all ages—and their pets—can gather and stay active."
            />
            <Vision
              title="Connection"
              pillar="connection"
              description="Building an inclusive, welcoming park through volunteer stewardship and partnerships that strengthen our Church Hill neighborhood."
            />
            <Vision
              title="Preservation"
              pillar="preservation"
              description="Honoring all chapters of Chimborazo's rich history and ensuring its complete story is shared and understood by future generations."
            />
          </div>
        </Container>
      </div>

      {/* Featured Projects */}
      {featuredProjects && featuredProjects.length > 0 && (
        <div>
          <Container>
            <SectionHeader title="Projects" size="large" />
            <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
              Learn about our current initiatives and how they're transforming Chimborazo Park for
              the entire community.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
              {featuredProjects.map((project) => (
                <Project key={project._id} project={project} />
              ))}
            </div>

            {/* View All Projects CTA */}
            <div className="mt-12 flex justify-center">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-xl border-2 border-accent-600 bg-transparent px-6 py-3 font-body text-base font-semibold text-accent-700 uppercase transition-all hover:bg-accent-600 hover:text-white focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 dark:border-accent-500 dark:text-accent-400 dark:hover:bg-accent-500 dark:hover:text-primary-900"
              >
                <span>View All Projects</span>
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </Container>
        </div>
      )}

      {/* The Park */}
      <div className="text-grey-900 dark:text-grey-100">
        <Container spacing="md">
          <SectionHeader title="The Park" size="large" />

          {/* Enhanced opening with larger text */}
          <p className="font-body text-xl leading-relaxed font-medium text-grey-800 md:text-2xl dark:text-grey-200">
            Chimborazo Hill's story reaches back centuries—from the indigenous Powhatan people to
            its pivotal role in the Civil War. In 1874, as Richmond rebuilt, the city transformed
            this storied site into a public park for all residents to enjoy.
          </p>

          {/* Content with subtle background and integrated image */}
          <div className="mt-10 rounded-3xl bg-primary-50/30 md:px-4 md:py-8 lg:px-8 lg:py-10 dark:bg-primary-900/10">
            <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
              {/* Text content */}
              <div className="space-y-6">
                <p className="font-body text-grey-800 md:text-lg dark:text-grey-200">
                  City engineer Wilfred Cutshaw spent decades in the late 1800s designing winding
                  cobbled carriage roads that embraced the steep terrain, revealing breathtaking
                  vistas at every turn. These paths connected Church Hill with the traditionally
                  African American Fulton neighborhood below, creating vital links between
                  communities.
                </p>
                <p className="font-body text-grey-800 md:text-lg dark:text-grey-200">
                  By the turn of the 20th century, Chimborazo had become Richmond's beloved suburban
                  retreat. Visitors arrived by streetcar to enjoy the bandstand, refreshment
                  pavilion, and sweeping 180-degree views of the James River and downtown—a golden
                  era that lasted through World War II.
                </p>
              </div>

              {/* Historic images - rotating gallery */}
              {parkGalleryData.length > 0 ? (
                <RotatingImages
                  images={parkGalleryData}
                  className="h-full overflow-hidden rounded-2xl"
                  imageClassName="h-full w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  maxWidth={1920}
                  interval={5000}
                  showCaptions={true}
                  captionStyle="hotspot"
                  scrollableCaptions={true}
                  maxCaptionHeight={150}
                />
              ) : (
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/chimbo_prom.webp"
                    alt="Historic view of Chimborazo Park promenade"
                    width={1600}
                    height={1200}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    layout="constrained"
                  />
                </div>
              )}
            </div>

            {/* Continued text */}
            <div className="mt-8 space-y-6">
              <p className="font-body text-grey-800 md:text-lg dark:text-grey-200">
                Today, the park includes scenic trails, a dog park, the historic Round House, a
                picnic gazebo, and an eight-foot Statue of Liberty replica erected by Boy Scouts in
                the 1950s.
              </p>

              {/* Call-out final paragraph */}
              <div className="space-y-6 rounded-2xl border border-primary-200/50 bg-gradient-to-br from-primary-100/60 to-primary-50/40 p-6 md:p-8 dark:border-primary-700/30 dark:from-primary-900/30 dark:to-primary-800/20">
                <p className="font-body text-lg leading-relaxed font-medium text-grey-800 md:text-xl dark:text-grey-100">
                  Time and reduced funding have taken their toll&mdash;many of the park's original
                  features have fallen into disrepair. Invasive species and climate change have
                  further diminished its native plantings and natural areas.
                </p>
                <p className="font-body text-lg leading-relaxed font-medium text-grey-800 md:text-xl dark:text-grey-100">
                  <strong className="font-display text-xl font-semibold text-primary-800 md:text-2xl dark:text-primary-200">
                    We're changing that.
                  </strong>{" "}
                  The Chimborazo Park Conservancy is restoring, repairing, and enhancing this
                  treasured greenspace to ensure it remains beautiful, safe, and inclusive for
                  generations to come.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Events */}
      <div>
        <Container>
          <SectionHeader title="Events" size="large" />
          <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
            Join us for seasonal clean-ups, tree plantings, educational presentations, and community
            gatherings that help preserve and enhance our historic park.
          </p>

          <div className="mt-10 space-y-10">
            {/* Featured Event - Full Width */}
            {recentEvents.slice(0, 1).map((event) => (
              <Event key={`event-featured-${event._id}`} {...event} />
            ))}

            {/* Recent Events Grid */}
            {recentEvents.length > 1 && (
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
                {recentEvents.slice(1, 3).map((event) => (
                  <Event key={`event-${event._id}`} {...event} />
                ))}
              </div>
            )}
          </div>

          {/* View All Events CTA */}
          <div className="mt-12 flex justify-center">
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 rounded-xl border-2 border-accent-600 bg-transparent px-6 py-3 font-body text-base font-semibold text-accent-700 uppercase transition-all hover:bg-accent-600 hover:text-white focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 dark:border-accent-500 dark:text-accent-400 dark:hover:bg-accent-500 dark:hover:text-primary-900"
            >
              <span>View All Events</span>
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </Container>
      </div>

      {/* Get Involved */}
      <div>
        <GetInvolved />
      </div>

      {/* Partners */}
      <div>
        <Container>
          <SectionHeader title="Partners" size="large" />
          <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
            We're grateful to partner with local organizations that share our commitment to
            preserving and enhancing Chimborazo Park for the entire community.
          </p>
          <div className="mt-12">
            <Partners
              partners={homePageData?.partners
                ?.filter((partner) => partner?.logo?.asset?.url) // Filter out partners without logos
                ?.map((partner) => ({
                  name: partner.name,
                  url: partner.websiteUrl,
                  logo: {
                    ...partner.logo,
                    alt: partner.logo.alt || partner.name,
                  },
                  description: partner.description,
                }))}
            />
          </div>
        </Container>
      </div>

      {/* Quote */}
      <Quote
        quoteText={homePageData?.quote?.quoteText}
        attribution={homePageData?.quote?.attribution}
        backgroundImage={
          (
            homePageData?.quote?.backgroundImage as {
              image?: SanityImageObject;
            }
          )?.image
        }
      />
    </div>
  );
}
