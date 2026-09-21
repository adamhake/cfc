import {
  featuredProjectsQuery,
  featuredUpdatesQuery,
  getHomePageQuery,
  recentEventsQuery,
} from "@chimborazo/sanity-config/queries"
import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react"
import { PortableText } from "@portabletext/react"
import type { Metadata } from "next"
import { Button } from "@/components/Button/button"
import Container from "@/components/Container/container"
import GetInvolved from "@/components/GetInvolved/get-involved"
import ImageGallery from "@/components/ImageGallery/image-gallery"
import { Image } from "@/components/OptimizedImage/optimized-image"
import Partners from "@/components/Partners/partners"
import Quote from "@/components/Quote/quote"
import RotatingImages from "@/components/RotatingImages/rotating-images"
import SectionHeader from "@/components/SectionHeader/section-header"
import { SiteAlert } from "@/components/SiteAlert/site-alert"
import { UpdateCard } from "@/components/UpdateCard/update-card"
import Vision from "@/components/Vision/vision"
import { extractGetInvolvedGalleryImages } from "@/lib/gallery-extractors"
import { sanityAttr } from "@/lib/sanity-data-attribute"
import { CACHE_TAGS, cachedSanityFetch, getDynamicFetchOptions } from "@/lib/sanity-fetch"
import type {
  SanityEvent,
  SanityHomePage,
  SanityImage as SanityImageType,
  SanityProject,
  SanityUpdate,
} from "@/lib/sanity-types"
import { CURRENT_SITE_ALERT } from "@/lib/site-alert"
import { getSiteSettings } from "@/lib/site-settings"
import { SITE_CONFIG } from "@/utils/seo"
import HomepageEventsClient from "./homepage-events-client"
import HomepageHeroClient from "./homepage-hero-client"
import HomepageProjectsClient from "./homepage-projects-client"

// ─── Portable Text renderers for section-specific styling ───

/**
 * Link mark shared by the homepage prose renderers. The homepage block config
 * (`createSimpleBlocks`) allows links, so every renderer that consumes it needs
 * a handler -- without one, @portabletext/react drops the anchor silently.
 */
const proseLinkMark: NonNullable<PortableTextComponents["marks"]> = {
  link: ({ children, value }) => {
    const href = typeof value?.href === "string" ? value.href : undefined
    if (!href) return <>{children}</>
    const isExternal = href.startsWith("http")
    return (
      <a
        href={href}
        className="underline decoration-primary-600/50 underline-offset-2 hover:decoration-primary-600"
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    )
  },
}

const introBodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-4 max-w-4xl font-body text-grey-800 md:text-lg dark:text-grey-100">
        {children}
      </p>
    ),
  },
  marks: proseLinkMark,
}

const parkBodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-grey-800 md:text-lg dark:text-grey-200">{children}</p>
    ),
  },
  marks: proseLinkMark,
}

/**
 * Renders inside the closing panel, where the wrapper's last-child rule
 * promotes the final paragraph to the display face. Everything here is the
 * supporting voice that leads up to it.
 */
const parkCalloutComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-lg leading-relaxed text-grey-700 md:text-xl dark:text-grey-300">
        {children}
      </p>
    ),
  },
  marks: {
    ...proseLinkMark,
    strong: ({ children }) => (
      <strong className="font-semibold text-primary-800 dark:text-primary-200">{children}</strong>
    ),
  },
}

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
    intro:
      "Chimborazo Hill's story reaches back centuries\u2014from the indigenous Powhatan people to its pivotal role in the Civil War. In 1874, as Richmond rebuilt, the city transformed this storied site into a public park for all residents to enjoy.",
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
}

export const metadata: Metadata = {
  title: {
    absolute: "Chimborazo Park Conservancy | Preserving Richmond's Historic Park",
  },
  description:
    "Preserving and enhancing Chimborazo Park in Richmond, VA's Church Hill neighborhood through community stewardship. Join us in restoring this historic landmark.",
  alternates: { canonical: SITE_CONFIG.url },
  openGraph: {
    title: "Chimborazo Park Conservancy | Preserving Richmond's Historic Park",
    description:
      "Preserving and enhancing Chimborazo Park in Richmond, VA's Church Hill neighborhood through community stewardship. Join us in restoring this historic landmark.",
    type: "website",
    url: SITE_CONFIG.url,
    images: [SITE_CONFIG.defaultImage],
  },
}

export default async function HomePage() {
  const [
    { data: homePageData },
    { data: featuredProjects },
    { data: recentEvents },
    { data: featuredUpdates },
    siteSettings,
  ] = (await Promise.all([
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: getHomePageQuery,
      tags: [CACHE_TAGS.HOMEPAGE],
    }),
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: featuredProjectsQuery,
      tags: [CACHE_TAGS.PROJECTS],
    }),
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: recentEventsQuery,
      tags: [CACHE_TAGS.EVENTS],
    }),
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: featuredUpdatesQuery,
      tags: [CACHE_TAGS.UPDATES],
    }),
    getSiteSettings(),
  ])) as [
    { data: SanityHomePage | null },
    { data: SanityProject[] },
    { data: SanityEvent[] },
    { data: SanityUpdate[] },
    Awaited<ReturnType<typeof getSiteSettings>>,
  ]

  // Prepare gallery data from Sanity or use defaults
  const galleryData =
    homePageData?.gallery?.images?.flatMap((img) => {
      const image = img?.image
      if (!image?.asset?.url) return []
      return [
        {
          ...image,
          asset: image.asset,
          alt: image.alt || "",
          showOnMobile: img.showOnMobile ?? true,
        },
      ]
    }) ?? []

  // Prepare park gallery data for rotating images
  const parkGalleryData =
    homePageData?.parkGallery?.images?.flatMap((img) =>
      img?.image?.asset?.url ? [img.image] : [],
    ) ?? []

  // Prepare get-involved gallery images (shared with About page)
  const getInvolvedGalleryImages = extractGetInvolvedGalleryImages(siteSettings)
  const siteAlert = siteSettings?.siteAlert ?? CURRENT_SITE_ALERT

  // CMS section data with fallbacks
  const intro = homePageData?.introSection
  const vision = homePageData?.visionSection
  const projectsHeader = homePageData?.projectsSectionHeader
  const park = homePageData?.parkSection
  const eventsHeader = homePageData?.eventsSectionHeader
  const getInvolved = homePageData?.getInvolvedSection
  const partnersHeader = homePageData?.partnersSectionHeader

  return (
    <>
      <HomepageHeroClient homePageData={homePageData} />

      {/* The hero's wave leaves roughly half its height as empty space in the
          curve's troughs, so the first section needs a smaller gap than the
          space-y rhythm used between the sections below it. */}
      <div className="mt-10 space-y-20 pb-20 text-grey-900 md:mt-12 md:space-y-24 md:pb-24 dark:text-grey-100">
        {/* Intro + Gallery */}
        <div className="text-grey-900">
          <Container spacing="md">
            <div className="mb-8 md:mb-10">
              <SiteAlert settings={siteAlert} />
            </div>

            <p className="max-w-4xl font-body text-xl leading-snug font-medium md:text-2xl dark:text-grey-100">
              {intro?.heading || FALLBACKS.intro.heading}
            </p>

            {intro?.body ? (
              <PortableText value={intro.body} components={introBodyComponents} />
            ) : (
              FALLBACKS.intro.body.map((text) => (
                <p
                  key={text}
                  className="mt-4 max-w-4xl font-body text-grey-800 md:text-lg dark:text-grey-100"
                >
                  {text}
                </p>
              ))
            )}

            <div className="mt-10">
              <ImageGallery
                images={galleryData.slice(0, 4)}
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
            <div className="mt-12 grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
              {vision?.pillars && vision.pillars.length > 0
                ? vision.pillars
                    .filter(
                      (
                        pillar,
                      ): pillar is typeof pillar & { pillar: NonNullable<typeof pillar.pillar> } =>
                        pillar.pillar != null,
                    )
                    .map((pillar) => (
                      <Vision
                        key={pillar._key}
                        dataSanity={sanityAttr(
                          homePageData,
                          `visionSection.pillars[_key=="${pillar._key}"]`,
                        )}
                        title={pillar.title ?? ""}
                        pillar={pillar.pillar}
                        content={
                          (pillar.description ?? undefined) as PortableTextBlock[] | undefined
                        }
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
          <div className="bg-neutral-100/70 py-12 md:py-16 dark:bg-primary-950">
            <Container>
              <SectionHeader
                title={projectsHeader?.title || FALLBACKS.projects.title}
                size="large"
              />
              <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
                {projectsHeader?.description || FALLBACKS.projects.description}
              </p>

              <HomepageProjectsClient projects={featuredProjects} />

              {/* View All Projects CTA */}
              <div className="mt-10 flex justify-center">
                <Button
                  as="a"
                  href="/projects"
                  variant="outline"
                  trackingLocation="homepage-projects"
                  className="group border-accent-700 text-accent-800 hover:border-accent-800 hover:bg-accent-50 dark:border-accent-500 dark:text-accent-300 dark:hover:bg-primary-800"
                >
                  View All Projects
                </Button>
              </div>
            </Container>
          </div>
        )}

        {featuredUpdates.length > 0 && (
          <section aria-label="Park updates">
            <Container spacing="md">
              <SectionHeader title="Park Updates" size="large" />
              <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
                Seasonal news, construction progress, and notices to help you plan your visit.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredUpdates.map((update) => (
                  <UpdateCard key={update._id} update={update} compact />
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <Button
                  as="a"
                  href="/updates"
                  variant="outline"
                  trackingLocation="homepage-updates"
                >
                  View All Updates
                </Button>
              </div>
            </Container>
          </section>
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
            <div className="mt-10">
              <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
                {/* Text content */}
                <div className="space-y-6">
                  {park?.body ? (
                    <PortableText value={park.body} components={parkBodyComponents} />
                  ) : (
                    FALLBACKS.park.body.map((text) => (
                      <p
                        key={text}
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 576px"
                    maxWidth={1024}
                    quality={70}
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
                    />
                  </div>
                )}
              </div>

              {/* Continued text */}
              <div className="mt-8 space-y-8 md:space-y-10">
                <p className="font-body text-grey-800 md:text-lg dark:text-grey-200">
                  {park?.today || FALLBACKS.park.today}
                </p>

                {/* The closing turn of the section: the park's decline, and the
                    answer to it. A surface step sets it apart while keeping it
                    attached to the copy it follows.

                    Only the final paragraph carries the answer, so it alone is
                    promoted to the display face at size; anything before it
                    stays supporting body copy. Expressing that as a last-child
                    rule keeps it true for editor-authored callouts of any
                    length, not just the fallback below. */}
                <div className="rounded-3xl bg-neutral-100 p-8 md:p-12 dark:bg-primary-950">
                  <div className="max-w-4xl space-y-6 [&>p:last-child]:font-display [&>p:last-child]:text-2xl [&>p:last-child]:leading-snug [&>p:last-child]:text-primary-800 [&>p:last-child]:md:text-3xl [&>p:last-child]:dark:text-primary-200">
                    {park?.callout ? (
                      <PortableText value={park.callout} components={parkCalloutComponents} />
                    ) : (
                      <>
                        <p className="font-body text-lg leading-relaxed text-grey-700 md:text-xl dark:text-grey-300">
                          Time and reduced funding have taken their toll&mdash;many of the
                          park&apos;s original features have fallen into disrepair. Invasive species
                          and climate change have further diminished its native plantings and
                          natural areas.
                        </p>
                        <p>
                          We&apos;re changing that. The Chimborazo Park Conservancy is restoring,
                          repairing, and enhancing this treasured greenspace to ensure it remains
                          beautiful, safe, and inclusive for generations to come.
                        </p>
                      </>
                    )}
                  </div>
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

            <HomepageEventsClient events={recentEvents} />

            {/* View All Events CTA */}
            <div className="mt-10 flex justify-center">
              <Button
                as="a"
                href="/events"
                variant="outline"
                trackingLocation="homepage-events"
                className="group border-accent-700 text-accent-800 hover:border-accent-800 hover:bg-accent-50 dark:border-accent-500 dark:text-accent-300 dark:hover:bg-primary-800"
              >
                View All Events
              </Button>
            </div>
          </Container>
        </div>

        {/* Get Involved */}
        <div>
          <GetInvolved
            title={getInvolved?.title ?? undefined}
            description={getInvolved?.description ?? undefined}
            galleryImages={getInvolvedGalleryImages}
            facebookUrl={siteSettings?.socialMedia?.facebook ?? undefined}
            instagramUrl={siteSettings?.socialMedia?.instagram ?? undefined}
          />
        </div>

        {/* Partners */}
        <div>
          <Container>
            <SectionHeader title={partnersHeader?.title || FALLBACKS.partners.title} size="large" />
            <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
              {partnersHeader?.description || FALLBACKS.partners.description}
            </p>
            <div className="mt-10">
              <Partners
                variant="compact"
                partners={
                  homePageData?.partners?.flatMap((partner) => {
                    const logo = partner?.logo
                    if (!logo?.asset?.url) return []
                    return [
                      {
                        name: partner.name ?? "",
                        url: partner.websiteUrl ?? undefined,
                        logo: {
                          ...logo,
                          asset: logo.asset,
                          alt: logo.alt || partner.name || "",
                        },
                        description: partner.description ?? undefined,
                      },
                    ]
                  }) ?? []
                }
              />
            </div>
          </Container>
        </div>

        {/* Quote */}
        <Quote
          quoteText={homePageData?.quote?.quoteText ?? undefined}
          attribution={homePageData?.quote?.attribution ?? undefined}
          backgroundImage={homePageData?.quote?.backgroundImage as SanityImageType | undefined}
        />
      </div>
    </>
  )
}
