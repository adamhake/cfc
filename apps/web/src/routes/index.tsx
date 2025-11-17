import Container from "@/components/Container/container";
import Event from "@/components/Event/event";
import GetInvolved from "@/components/GetInvolved/get-involved";
import Hero from "@/components/Hero/hero";
import ImageGallery from "@/components/ImageGallery/image-gallery";
import Partners from "@/components/Partners/partners";
import Quote from "@/components/Quote/quote";
import SectionHeader from "@/components/SectionHeader/section-header";
import Vision from "@/components/Vision/vision";
import { events } from "@/data/events";
import { sanityClient } from "@/lib/sanity";
import type { SanityHomePage } from "@/lib/sanity-types";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { getHomePageQuery } from "@chimborazo/sanity-config";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

// Query options for TanStack Query
const homePageQueryOptions = queryOptions({
  queryKey: ["homePage"],
  queryFn: async (): Promise<SanityHomePage | null> => {
    try {
      return await sanityClient.fetch(getHomePageQuery);
    } catch (error) {
      console.warn("Failed to fetch homepage from Sanity:", error);
      return null;
    }
  },
  staleTime: 60 * 60 * 1000, // 60 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
});

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context }) => {
    // Prefetch homepage data on the server
    return context.queryClient.ensureQueryData(homePageQueryOptions);
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
      preloadImage: "/bike_sunset.webp",
      preloadImagePriority: "high",
    }),
  }),
});

// Donation buttons
// Partner Callout
//  - Church Hill Rotary Club
//  - Church Hill Association
//  - The Park homepage section

// const tickerImgs = [
// 	"/volunteers.webp",
// 	"/roundhouse_evening.webp",
// 	"/chimbo_sign.webp",
// 	"/grove_cleanup.webp",
// 	"/sign_cleanup.webp",
// ];

function Home() {
  const homePageData = Route.useLoaderData();

  const galleryImages = [
    {
      src: "/chimbo_arial.webp",
      alt: "Aerial view of Chimborazo Park",
      caption: "42 acres of natural beauty",
      width: 1600,
      height: 1200,
      showOnMobile: true,
    },
    {
      src: "/chimbo_sign.webp",
      alt: "Historic Chimborazo Park sign",
      caption: "Welcome to Chimborazo Park",
      width: 1200,
      height: 1600,
      showOnMobile: false,
    },
    {
      src: "/oaks.webp",
      alt: "Historic oak trees",
      caption: "Majestic century-old oaks",
      width: 1600,
      height: 1200,
      showOnMobile: false,
    },
    {
      src: "/rock_sunset.webp",
      alt: "Sunset view from the park",
      caption: "Stunning Richmond skyline views",
      width: 2000,
      height: 1262,
      showOnMobile: false,
    },
    {
      src: "/roundhouse_evening.webp",
      alt: "Historic Round House at evening",
      caption: "The park's iconic Round House",
      width: 2000,
      height: 1333,
      showOnMobile: false,
    },
    {
      src: "/bike_sunset.webp",
      alt: "Cycling at sunset",
      caption: "Scenic trails and recreation",
      width: 2000,
      height: 1262,
      showOnMobile: false,
    },
    {
      src: "/chimob_gaz.webp",
      alt: "Park gazebo",
      caption: "Historic gathering spaces",
      width: 1600,
      height: 1200,
      showOnMobile: false,
    },
    {
      src: "/grove_cleanup.webp",
      alt: "Grove cleanup",
      caption: "Active community spaces",
      width: 1600,
      height: 1200,
      showOnMobile: false,
    },
  ];

  // Prepare hero data from Sanity or use defaults
  const heroData = homePageData?.hero?.heroImage?.image?.asset?.url
    ? {
        heading: homePageData.hero.heading,
        subheading: homePageData.hero.subheading,
        imageSrc: homePageData.hero.heroImage.image.asset.url,
        imageAlt: homePageData.hero.heroImage.image.alt,
        imageWidth: homePageData.hero.heroImage.image.asset.metadata?.dimensions?.width,
        imageHeight: homePageData.hero.heroImage.image.asset.metadata?.dimensions?.height,
        ctaText: homePageData.hero.ctaButton?.text,
        ctaLink: homePageData.hero.ctaButton?.link,
      }
    : undefined;

  // Prepare gallery data from Sanity or use defaults
  const galleryData =
    homePageData?.gallery?.images
      ?.filter((img) => img?.image?.asset?.url) // Filter out any images without assets
      .map((img) => ({
        src: img.image.asset.url,
        alt: img.image.alt || "",
        caption: img.image.caption || "",
        width: img.image.asset.metadata?.dimensions?.width || 1600,
        height: img.image.asset.metadata?.dimensions?.height || 1200,
        showOnMobile: img.showOnMobile ?? true,
      })) || galleryImages;

  return (
    <div className="space-y-24 pb-24 text-grey-900 lg:px-0 dark:text-grey-100">
      <Hero {...heroData} />

      {/* Intro + Gallery */}
      <div className="px-4 text-grey-900 lg:px-0">
        <Container spacing="md">
          <p className="max-w-4xl font-body text-2xl leading-tight font-medium md:text-3xl dark:text-grey-100">
            The Chimborazo Park Conservancy and Friends of Chimborazo Park preserve and enhance this
            Church Hill landmark through community stewardship.
          </p>
          <p className="mt-4 max-w-4xl font-body text-grey-800 md:text-lg dark:text-grey-100">
            Established in 2023 as a 501(c)(3) non-profit, we formed to continue essential park
            support after the dissolution of Enrichmond. Since then, our volunteers and partners
            have contributed generous donations, grants, and countless hours to build a sustainable
            foundation for the park's future.
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
      <div className="px-4 lg:px-0">
        <Container spacing="md">
          <SectionHeader title="Our Vision" size="large" />
          <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
            Our mission is rooted in four core pillars that guide everything we do to make
            Chimborazo Park a cherished landmark for generations to come.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
            <Vision
              title="Restoration"
              icon="leafy-green"
              description="Preserving Chimborazo's historic character through careful reconstruction and repair of the park's unique heritage elements."
            />
            <Vision
              title="Recreation"
              icon="trees"
              description="Providing vibrant play spaces, natural areas, and a dog park where neighbors of all ages—and their pets—can gather and stay active."
            />
            <Vision
              title="Connection"
              icon="heart-handshake"
              description="Building an inclusive, welcoming park through volunteer stewardship and partnerships that strengthen our Church Hill neighborhood."
            />
            <Vision
              title="Preservation"
              icon="book-open-text"
              description="Honoring all chapters of Chimborazo's rich history and ensuring its complete story is shared and understood by future generations."
            />
          </div>
        </Container>
      </div>

      {/* The Park */}
      <div className="text-grey-900 lg:px-0 dark:text-grey-100">
        <Container spacing="md" className="px-4 md:px-0">
          <SectionHeader title="The Park" size="large" />

          {/* Enhanced opening with larger text */}
          <p className="text-gray-800 font-body text-xl leading-relaxed font-medium md:text-2xl dark:text-grey-200">
            Chimborazo Hill's story reaches back centuries—from the indigenous Powhatan people to
            its pivotal role in the Civil War. In 1874, as Richmond rebuilt, the city transformed
            this storied site into a public park for all residents to enjoy.
          </p>

          {/* Content with subtle background and integrated image */}
          <div className="mt-10 rounded-3xl bg-primary-50/30 md:p-10 lg:p-12 dark:bg-primary-900/10">
            <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
              {/* Text content */}
              <div className="space-y-6">
                <p className="text-gray-800 font-body md:text-lg dark:text-grey-200">
                  City engineer Wilfred Cutshaw spent decades in the late 1800s designing winding
                  cobbled carriage roads that embraced the steep terrain, revealing breathtaking
                  vistas at every turn. These paths connected Church Hill with the traditionally
                  African American Fulton neighborhood below, creating vital links between
                  communities.
                </p>
                <p className="text-gray-800 font-body md:text-lg dark:text-grey-200">
                  By the turn of the 20th century, Chimborazo had become Richmond's beloved suburban
                  retreat. Visitors arrived by streetcar to enjoy the bandstand, refreshment
                  pavilion, and sweeping 180-degree views of the James River and downtown—a golden
                  era that lasted through World War II.
                </p>
              </div>

              {/* Historic image */}
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
            </div>

            {/* Continued text */}
            <div className="mt-8 space-y-6">
              <p className="text-gray-800 font-body md:text-lg dark:text-grey-200">
                Today, the park includes scenic trails, a dog park, the historic Round House, a
                picnic gazebo, and an eight-foot Statue of Liberty replica erected by Boy Scouts in
                the 1950s. But time and reduced funding have taken their toll—many of the park's
                original and historic features have fallen into disrepair.
              </p>

              {/* Call-out final paragraph */}
              <div className="rounded-2xl border border-primary-200/50 bg-gradient-to-br from-primary-100/60 to-primary-50/40 p-6 md:p-8 dark:border-primary-700/30 dark:from-primary-900/30 dark:to-primary-800/20">
                <p className="text-gray-800 font-body text-lg leading-relaxed font-medium md:text-xl dark:text-grey-100">
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
      <div className="px-4 md:px-0">
        <Container>
          <SectionHeader title="Events" size="large" />
          <p className="mt-4 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
            Join us for seasonal clean-ups, tree plantings, educational presentations, and community
            gatherings that help preserve and enhance our historic park.
          </p>

          <div className="mt-10 space-y-10">
            {/* Featured Event - Full Width */}
            {events
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 1)
              .map((event) => (
                <Event key={`event-featured-${event.id}`} {...event} />
              ))}

            {/* Recent Events Grid */}
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
              {events
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(1, 3)
                .map((event) => (
                  <Event key={`event-${event.id}`} {...event} />
                ))}
            </div>
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
      <div className="px-4 md:px-0">
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
                    src: partner.logo.asset.url,
                    alt: partner.logo.alt || partner.name,
                    width: partner.logo.asset.metadata?.dimensions?.width || 275,
                    height: partner.logo.asset.metadata?.dimensions?.height || 84,
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
          homePageData?.quote?.backgroundImage?.asset?.url
            ? {
                src: homePageData.quote.backgroundImage.asset.url,
                alt: homePageData.quote.backgroundImage.alt || "Quote background",
                width: homePageData.quote.backgroundImage.asset.metadata?.dimensions?.width || 1600,
                height:
                  homePageData.quote.backgroundImage.asset.metadata?.dimensions?.height || 1200,
              }
            : undefined
        }
      />
    </div>
  );
}
