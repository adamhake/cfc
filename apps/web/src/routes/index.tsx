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
import type { PortableTextComponents } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@/components/OptimizedImage/optimized-image";

// ─── Portable Text renderers for section-specific styling ───

const introBodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-4 max-w-4xl font-body text-grey-800 md:text-lg dark:text-grey-100">
        {children}
      </p>
    ),
  },
};

const parkBodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-grey-800 md:text-lg dark:text-grey-200">{children}</p>
    ),
  },
};

const parkCalloutComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-lg leading-relaxed font-medium text-grey-800 md:text-xl dark:text-grey-100">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-display text-xl font-semibold text-primary-800 md:text-2xl dark:text-primary-200">
        {children}
      </strong>
    ),
  },
};

// ─── Query options ───

const homePageQueryOptions = (preview = false) =>
  queryOptions({
    queryKey: [...queryKeys.homePage(), { preview }],
    queryFn: async (): Promise<SanityHomePage | null> => {
      try {
        return (await getSanityClient(preview).fetch(getHomePageQuery)) as SanityHomePage | null;
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
      context.queryClient.ensureQueryData(siteSettingsQueryOptions(preview)),
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
    }),
  }),
});

// ─── Fallback content ───

const FALLBACKS = {
  intro: {
    heading:
      "The Chimborazo Park Conservancy and Friends of Chimborazo Park preserve and enhance this Church Hill landmark through community stewardship.",
    body: [
      "Established in 2023 as a 501(c)(3) non-profit, the conservancy was formed out of the Friends of Chimborazo Park to address the broader needs of this historic greenspace as it continues to recover and thrive.",
      "Since then, we've been putting down roots\u2014engaging volunteers and partners on environmental projects while planning for the future. Together, we're building a sustainable foundation for a healthier, more beautiful park that serves our community for generations to come.",
    ],
  },
  vision: {
    title: "Our Vision",
    description:
      "Our mission is built on four core pillars. Explore each to see how we're working to make Chimborazo Park a cherished landmark for generations to come.",
    pillars: [
      {
        title: "Restoration",
        pillar: "restoration" as const,
        description: [
          "Revitalizing and preserving the park's environmental character through the recovery and expansion of our natural spaces and habitats.",
          "Restoring and repairing the park's unique cultural heritage elements.",
        ],
      },
      {
        title: "Recreation",
        pillar: "recreation" as const,
        description:
          "Providing vibrant play spaces, natural areas, and a dog park where neighbors of all ages\u2014and their pets\u2014can gather and stay active.",
      },
      {
        title: "Connection",
        pillar: "connection" as const,
        description:
          "Building an inclusive, welcoming park through volunteer stewardship and partnerships that strengthen our Church Hill neighborhood.",
      },
      {
        title: "Preservation",
        pillar: "preservation" as const,
        description:
          "Honoring all chapters of Chimborazo's rich history and ensuring its complete story is shared and understood by future generations.",
      },
    ],
  },
  projects: {
    title: "Projects",
    description:
      "Learn about our current initiatives and how they're transforming Chimborazo Park for the entire community.",
  },
  park: {
    title: "The Park",
    intro: "Chimborazo Hill's story reaches back centuries\u2014from the indigenous Powhatan people to its pivotal role in the Civil War. In 1874, as Richmond rebuilt, the city transformed this storied site into a public park for all residents to enjoy.",
    body: [
      "City engineer Wilfred Cutshaw spent decades in the late 1800s designing winding cobbled carriage roads that embraced the steep terrain, revealing breathtaking vistas at every turn. These paths connected Church Hill with the traditionally African American Fulton neighborhood below, creating vital links between communities.",
      "By the turn of the 20th century, Chimborazo had become Richmond's beloved suburban retreat. Visitors arrived by streetcar to enjoy the bandstand, refreshment pavilion, and sweeping 180-degree views of the James River and downtown\u2014a golden era that lasted through World War II.",
    ],
    today:
      "Today, the park includes scenic trails, a dog park, the historic Round House, a picnic gazebo, and an eight-foot Statue of Liberty replica erected by Boy Scouts in the 1950s.",
  },
  events: {
    title: "Events",
    description:
      "Join us for seasonal clean-ups, tree plantings, educational presentations, and community gatherings that help preserve and enhance our historic park.",
  },
  partners: {
    title: "Partners",
    description:
      "We're grateful to partner with local organizations that share our commitment to preserving and enhancing Chimborazo Park for the entire community.",
  },
};

function Home() {
  // Get preview mode from loader data
  const { preview } = Route.useLoaderData();

  // All data accessed via useSuspenseQuery for consistency and cache subscription
  const { data: homePageData } = useSuspenseQuery(homePageQueryOptions(preview));
  const { data: featuredProjects } = useSuspenseQuery(featuredProjectsQueryOptions(preview));
  const { data: recentEvents } = useSuspenseQuery(recentEventsQueryOptions(preview));

  // Prepare hero data from Sanity or use defaults
  const heroData = homePageData?.hero?.heroImage?.asset?.url
    ? {
        heading: homePageData.hero.heading,
        subheading: homePageData.hero.subheading,
        heroImage: homePageData.hero.heroImage,
        ctaText: homePageData.hero.ctaButton?.text,
        ctaLink: homePageData.hero.ctaButton?.link,
      }
    : undefined;

  // Prepare gallery data from Sanity or use defaults
  const galleryData =
    homePageData?.gallery?.images
      ?.filter((img) => img?.image?.asset?.url) // Filter out any images without assets
      .map((img) => ({
        ...img.image,
        alt: img.image.alt || "",
        showOnMobile: img.showOnMobile ?? true,
      })) || [];

  // Prepare park gallery data for rotating images
  const parkGalleryData =
    homePageData?.parkGallery?.images
      ?.filter((img) => img?.image?.asset?.url) // Filter out any images without assets
      .map((img) => img.image) || [];

  // CMS section data with fallbacks
  const intro = homePageData?.introSection;
  const vision = homePageData?.visionSection;
  const projectsHeader = homePageData?.projectsSectionHeader;
  const park = homePageData?.parkSection;
  const eventsHeader = homePageData?.eventsSectionHeader;
  const getInvolved = homePageData?.getInvolvedSection;
  const partnersHeader = homePageData?.partnersSectionHeader;

  return (
    <div className="space-y-24 pb-24 text-grey-900 dark:text-grey-100">
      <Hero {...heroData} />

      {/* Intro + Gallery */}
      <div className="text-grey-900">
        <Container spacing="md">
          <p className="max-w-4xl font-body text-2xl leading-snug font-medium md:text-3xl dark:text-grey-100">
            {intro?.heading || FALLBACKS.intro.heading}
          </p>

          {intro?.body ? (
            <PortableText value={intro.body} components={introBodyComponents} />
          ) : (
            FALLBACKS.intro.body.map((text, i) => (
              <p
                key={i}
                className="mt-4 max-w-4xl font-body text-grey-800 md:text-lg dark:text-grey-100"
              >
                {text}
              </p>
            ))
          )}

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
          <SectionHeader title={vision?.title || FALLBACKS.vision.title} size="large" />
          <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
            {vision?.description || FALLBACKS.vision.description}
          </p>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
            {vision?.pillars && vision.pillars.length > 0
              ? vision.pillars.map((pillar) => (
                  <Vision
                    key={pillar._key}
                    title={pillar.title}
                    pillar={pillar.pillar}
                    content={pillar.description}
                  />
                ))
              : FALLBACKS.vision.pillars.map((pillar) => (
                  <Vision
                    key={pillar.pillar}
                    title={pillar.title}
                    pillar={pillar.pillar}
                    description={pillar.description}
                  />
                ))}
          </div>
        </Container>
      </div>

      {/* Featured Projects */}
      {featuredProjects && featuredProjects.length > 0 && (
        <div>
          <Container>
            <SectionHeader
              title={projectsHeader?.title || FALLBACKS.projects.title}
              size="large"
            />
            <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
              {projectsHeader?.description || FALLBACKS.projects.description}
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
          <SectionHeader title={park?.title || FALLBACKS.park.title} size="large" />

          {/* Enhanced opening with larger text */}
          <p className="font-body text-xl leading-relaxed font-medium text-grey-800 md:text-2xl dark:text-grey-200">
            {park?.intro || FALLBACKS.park.intro}
          </p>

          {/* Content with subtle background and integrated image */}
          <div className="mt-10 rounded-3xl bg-primary-50/30 md:px-4 md:py-8 lg:px-8 lg:py-10 dark:bg-primary-900/10">
            <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
              {/* Text content */}
              <div className="space-y-6">
                {park?.body ? (
                  <PortableText value={park.body} components={parkBodyComponents} />
                ) : (
                  FALLBACKS.park.body.map((text, i) => (
                    <p
                      key={i}
                      className="font-body text-grey-800 md:text-lg dark:text-grey-200"
                    >
                      {text}
                    </p>
                  ))
                )}
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
                    src="/chimbo_arial.webp"
                    alt="Aerial view of Chimborazo Park"
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
                {park?.today || FALLBACKS.park.today}
              </p>

              {/* Call-out final paragraph */}
              <div className="space-y-6 rounded-2xl border border-primary-200/50 bg-gradient-to-br from-primary-100/60 to-primary-50/40 p-6 md:p-8 dark:border-primary-700/30 dark:from-primary-900/30 dark:to-primary-800/20">
                {park?.callout ? (
                  <PortableText value={park.callout} components={parkCalloutComponents} />
                ) : (
                  <>
                    <p className="font-body text-lg leading-relaxed font-medium text-grey-800 md:text-xl dark:text-grey-100">
                      Time and reduced funding have taken their toll&mdash;many of the park&apos;s
                      original features have fallen into disrepair. Invasive species and climate
                      change have further diminished its native plantings and natural areas.
                    </p>
                    <p className="font-body text-lg leading-relaxed font-medium text-grey-800 md:text-xl dark:text-grey-100">
                      <strong className="font-display text-xl font-semibold text-primary-800 md:text-2xl dark:text-primary-200">
                        We&apos;re changing that.
                      </strong>{" "}
                      The Chimborazo Park Conservancy is restoring, repairing, and enhancing this
                      treasured greenspace to ensure it remains beautiful, safe, and inclusive for
                      generations to come.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Events */}
      <div>
        <Container>
          <SectionHeader title={eventsHeader?.title || FALLBACKS.events.title} size="large" />
          <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
            {eventsHeader?.description || FALLBACKS.events.description}
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
        <GetInvolved
          preview={preview}
          title={getInvolved?.title}
          description={getInvolved?.description}
        />
      </div>

      {/* Partners */}
      <div>
        <Container>
          <SectionHeader
            title={partnersHeader?.title || FALLBACKS.partners.title}
            size="large"
          />
          <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
            {partnersHeader?.description || FALLBACKS.partners.description}
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
        backgroundImage={homePageData?.quote?.backgroundImage as SanityImageObject | undefined}
      />
    </div>
  );
}
