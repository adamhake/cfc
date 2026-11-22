import {
  featuredProjectsQuery,
  featuredUpdatesQuery,
  getHomePageQuery,
  recentEventsQuery,
} from "@chimborazo/sanity-config/queries"
import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react"
import { PortableText } from "@portabletext/react"
import type { Metadata } from "next"
import Container from "@/components/Container/container"
import { EventList } from "@/components/EventList/event-list"
import GetInvolved from "@/components/GetInvolved/get-involved"
import ImageGallery from "@/components/ImageGallery/image-gallery"
import { Image } from "@/components/OptimizedImage/optimized-image"
import Partners from "@/components/Partners/partners"
import Quote from "@/components/Quote/quote"
import RotatingImages from "@/components/RotatingImages/rotating-images"
import SectionHeader from "@/components/SectionHeader/section-header"
import { SectionLink } from "@/components/SectionHeader/section-link"
import { SiteAlert } from "@/components/SiteAlert/site-alert"
import { UpdateCard } from "@/components/UpdateCard/update-card"
import Vision from "@/components/Vision/vision"
import { WaveDivider } from "@/components/WaveDivider/wave-divider"
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
      <p className="font-body text-grey-800 md:text-lg dark:text-primary-100">{children}</p>
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
      <p className="font-body text-grey-800 md:text-lg dark:text-primary-100">{children}</p>
    ),
  },
  marks: {
    ...proseLinkMark,
    strong: ({ children }) => (
      <strong className="font-semibold text-primary-900 dark:text-grey-50">{children}</strong>
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
        <section aria-labelledby="vision-heading">
          <Container spacing="md">
            <SectionHeader
              id="vision-heading"
              title={vision?.title || FALLBACKS.vision.title}
              size="large"
            />
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
        </section>

        {/* Park Updates sits above Projects: it's the section that changes
            week to week (access notices, plantings, repairs), so returning
            neighbors see what's new before the slower-moving project list. */}
        {featuredUpdates.length > 0 && (
          <section aria-labelledby="updates-heading">
            <Container spacing="md">
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                <SectionHeader id="updates-heading" title="Park Updates" size="large" />
                <SectionLink href="/updates" trackingLocation="homepage-updates">
                  All updates
                </SectionLink>
              </div>
              <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
                Seasonal news, construction progress, and notices to help you plan your visit.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredUpdates.map((update) => (
                  <UpdateCard key={update._id} update={update} compact />
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Featured Projects */}
        {featuredProjects && featuredProjects.length > 0 && (
          <section aria-labelledby="projects-heading">
            <Container>
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                <SectionHeader
                  id="projects-heading"
                  title={projectsHeader?.title || FALLBACKS.projects.title}
                  size="large"
                />
                <SectionLink href="/projects" trackingLocation="homepage-projects">
                  All projects
                </SectionLink>
              </div>
              <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
                {projectsHeader?.description || FALLBACKS.projects.description}
              </p>

              <HomepageProjectsClient projects={featuredProjects} />
            </Container>
          </section>
        )}

        {/* The Park -- the homepage's one full-bleed moment. Every other
            section shares the same quiet rhythm, so the park's own history
            (the thing no other site can say) gets the weight: a band on the footer's surface,
            framed by the James River wave, the intro set in the display
            face, and the archival images at a size they can be read. */}
        <section aria-labelledby="park-heading">
          {/* -mb-px / -mt-px overlap the SVG and the band so subpixel rounding
              can't open a hairline seam between them. */}
          <WaveDivider
            fill="fill-neutral-100 dark:fill-primary-800"
            stroke={false}
            className="-mb-px"
          />
          <div className="bg-neutral-100 pt-6 pb-16 text-grey-900 md:pb-20 dark:bg-primary-800 dark:text-primary-50">
            <Container spacing="none">
              <SectionHeader
                id="park-heading"
                title={park?.title || FALLBACKS.park.title}
                size="large"
                className="dark:text-primary-300"
              />

              {/* Lining figures: in Vollkorn's default old-style figures "1874" reads as "I874". */}
              <p className="mt-6 max-w-5xl text-pretty font-display text-2xl leading-snug text-primary-900 lining-nums md:text-3xl lg:text-4xl dark:text-grey-50">
                {park?.intro || FALLBACKS.park.intro}
              </p>

              <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.15fr] md:gap-12 lg:gap-16">
                <div className="space-y-6">
                  {park?.body ? (
                    <PortableText value={park.body} components={parkBodyComponents} />
                  ) : (
                    FALLBACKS.park.body.map((text) => (
                      <p
                        key={text}
                        className="font-body text-grey-800 md:text-lg dark:text-primary-100"
                      >
                        {text}
                      </p>
                    ))
                  )}
                  <p className="font-body text-grey-800 md:text-lg dark:text-primary-100">
                    {park?.today || FALLBACKS.park.today}
                  </p>
                </div>

                {/* Historic images - rotating gallery */}
                {parkGalleryData.length > 0 ? (
                  <RotatingImages
                    images={parkGalleryData}
                    className="h-full min-h-80 overflow-hidden rounded-2xl"
                    imageClassName="h-full w-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 640px"
                    maxWidth={1280}
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

              {/* The closing turn: the park's decline, and the answer to it.
                  No rule, box or indent -- it is the end of the story the
                  band tells, not a quote. The supporting copy keeps the body
                  measure of the history above, and only the final paragraph
                  (the answer) steps up to the display face, matching the
                  intro so the band opens and closes in the same voice. A
                  last-child rule keeps that true for editor-authored callouts
                  of any length, not just the fallback below. */}
              <div className="mt-14 space-y-6 md:mt-20 [&>p]:max-w-prose [&>p:last-child]:max-w-5xl [&>p:last-child]:text-pretty [&>p:last-child]:font-display [&>p:last-child]:text-2xl [&>p:last-child]:leading-snug [&>p:last-child]:text-primary-900 [&>p:last-child]:lining-nums [&>p:last-child]:dark:text-grey-50 [&>p:last-child]:md:text-3xl [&>p:last-child]:lg:text-4xl">
                {park?.callout ? (
                  <PortableText value={park.callout} components={parkCalloutComponents} />
                ) : (
                  <>
                    <p className="font-body text-grey-800 md:text-lg dark:text-primary-100">
                      Time and reduced funding have taken their toll&mdash;many of the park&apos;s
                      original features have fallen into disrepair. Invasive species and climate
                      change have further diminished its native plantings and natural areas.
                    </p>
                    <p>
                      We&apos;re changing that. The Chimborazo Park Conservancy is restoring,
                      repairing, and enhancing this treasured greenspace to ensure it remains
                      beautiful, safe, and inclusive for generations to come.
                    </p>
                  </>
                )}
              </div>
            </Container>
          </div>
          <div className="-mt-px bg-neutral-100 dark:bg-primary-800">
            <WaveDivider flip stroke={false} fill="fill-grey-50 dark:fill-primary-900" />
          </div>
        </section>

        {/* Events */}
        <section aria-labelledby="events-heading">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <SectionHeader
                id="events-heading"
                title={eventsHeader?.title || FALLBACKS.events.title}
                size="large"
              />
              <SectionLink href="/events" trackingLocation="homepage-events">
                All events
              </SectionLink>
            </div>
            <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
              {eventsHeader?.description || FALLBACKS.events.description}
            </p>

            <EventList events={recentEvents} />
          </Container>
        </section>

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
        <section aria-labelledby="partners-heading">
          <Container>
            <SectionHeader
              id="partners-heading"
              title={partnersHeader?.title || FALLBACKS.partners.title}
              size="large"
            />
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
        </section>

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
