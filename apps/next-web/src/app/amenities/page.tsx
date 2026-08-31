import { getAmenitiesPageQuery } from "@chimborazo/sanity-config/queries"
import { Clock, MapPin } from "lucide-react"
import type { Metadata } from "next"
import AmenitySection from "@/components/AmenitySection/amenity-section"
import Container from "@/components/Container/container"
import GetInvolved from "@/components/GetInvolved/get-involved"
import PageHeroOptimistic from "@/components/PageHero/page-hero-optimistic"
import SectionHeader from "@/components/SectionHeader/section-header"
import SupportOption from "@/components/SupportOption/support-option"
import { extractGetInvolvedGalleryImages } from "@/lib/gallery-extractors"
import { CACHE_TAGS, cachedSanityFetch, getDynamicFetchOptions } from "@/lib/sanity-fetch"
import type { SanityAmenitiesPage } from "@/lib/sanity-types"
import { getSiteSettings } from "@/lib/site-settings"
import { SITE_CONFIG } from "@/utils/seo"

export const metadata: Metadata = {
  title: "Park Amenities",
  description:
    "Explore Chimborazo Park's Round House, gazebo, dog park, trails, and Statue of Liberty at 3215 E. Broad Street in Richmond, VA. Open dawn to dusk.",
  alternates: { canonical: `${SITE_CONFIG.url}/amenities` },
  openGraph: {
    title: "Park Amenities",
    description:
      "Explore Chimborazo Park's Round House, gazebo, dog park, trails, and Statue of Liberty at 3215 E. Broad Street in Richmond, VA. Open dawn to dusk.",
    type: "website",
    url: `${SITE_CONFIG.url}/amenities`,
  },
}

export default async function AmenitiesPage() {
  const [{ data: amenitiesPageData }, siteSettings] = await Promise.all([
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: getAmenitiesPageQuery,
      tags: [CACHE_TAGS.AMENITIES],
    }) as Promise<{ data: SanityAmenitiesPage | null }>,
    getSiteSettings(),
  ])

  const getInvolvedGalleryImages = extractGetInvolvedGalleryImages(siteSettings)

  // Filter amenities by section
  const upperParkAmenities =
    amenitiesPageData?.amenities?.filter(
      (amenity) => amenity.section === "upper-park" || amenity.section === "both",
    ) || []

  const lowerParkAmenities =
    amenitiesPageData?.amenities?.filter(
      (amenity) => amenity.section === "lower-park" || amenity.section === "both",
    ) || []

  return (
    <div>
      <PageHeroOptimistic
        document={amenitiesPageData}
        fallback={{
          title: "Park Amenities",
          subtitle: "Explore the spaces, trails, and landmarks that make Chimborazo special",
          imageSrc: "/bike_sunset.webp",
          imageAlt: "Chimborazo Park landscape",
          imageWidth: 2000,
          imageHeight: 1262,
        }}
        variant="section"
        priority={true}
      />

      {/* Main Content */}
      <Container spacing="none" className="space-y-20 py-16 pb-20 md:space-y-28 md:py-24 md:pb-32">
        <div className="space-y-10 md:space-y-12">
          {/* Introduction */}
          <div className="max-w-4xl space-y-4">
            <p className="font-body text-xl leading-relaxed font-medium text-grey-800 md:text-2xl dark:text-grey-100">
              Chimborazo Park is a 33-acre treasure in the heart of Richmond's Church Hill
              neighborhood, offering a unique blend of natural beauty, historic landmarks, and
              modern amenities for all to enjoy.
            </p>
            <p className="font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
              From the sweeping bluff-top views to the wooded trails below, our park provides spaces
              for recreation, reflection, and community gathering. Whether you're planning a special
              event, walking your dog, or simply seeking a peaceful retreat, Chimborazo welcomes
              you.
            </p>
          </div>

          {/* Location and Hours */}
          <div className="max-w-3xl">
            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 dark:border-primary-700 dark:bg-primary-700">
              <div className="flex min-h-32 items-center gap-4 bg-grey-50 p-6 md:p-8 dark:bg-primary-950">
                <div
                  className="inline-flex shrink-0 rounded-full bg-accent-600/10 p-3 dark:bg-accent-500/15"
                  role="img"
                  aria-label="Location icon"
                >
                  <MapPin className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />
                </div>
                <div>
                  <dt className="mb-1 font-body text-xs font-semibold tracking-[0.12em] text-grey-500 uppercase dark:text-grey-400">
                    Location
                  </dt>
                  <dd className="font-body text-lg font-medium text-grey-900 dark:text-grey-100">
                    3215 E. Broad St, Richmond VA
                  </dd>
                </div>
              </div>
              <div className="flex min-h-32 items-center gap-4 bg-grey-50 p-6 md:p-8 dark:bg-primary-950">
                <div
                  className="inline-flex shrink-0 rounded-full bg-accent-600/10 p-3 dark:bg-accent-500/15"
                  role="img"
                  aria-label="Hours icon"
                >
                  <Clock className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />
                </div>
                <div>
                  <dt className="mb-1 font-body text-xs font-semibold tracking-[0.12em] text-grey-500 uppercase dark:text-grey-400">
                    Hours
                  </dt>
                  <dd className="font-body text-lg font-medium text-grey-900 dark:text-grey-100">
                    Dawn to Dusk
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        {/* Upper Park Amenities */}
        <div>
          <div className="mb-4">
            <SectionHeader title="Upper Chimborazo" size="large" />
          </div>
          <p className="mt-4 mb-12 max-w-3xl font-body leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
            The upper park offers sweeping views of downtown Richmond and the James River, along
            with historic structures and gathering spaces perfect for events and relaxation.
          </p>

          <div className="space-y-20 md:space-y-28">
            {upperParkAmenities.map((amenity, index) => (
              <AmenitySection
                key={amenity.slug?.current ?? index}
                title={amenity.title ?? ""}
                description={amenity.description ?? ""}
                details={amenity.details ?? undefined}
                link={
                  amenity.externalLink
                    ? {
                        text: amenity.linkText || "Learn more",
                        url: amenity.externalLink,
                      }
                    : undefined
                }
                images={amenity.images ?? []}
                imagePosition={index % 2 === 0 ? "left" : "right"}
                priority={index === 0}
              />
            ))}
          </div>
        </div>

        {/* Lower Park Amenities */}
        <div>
          <div className="mb-4">
            <SectionHeader title="Lower Chimborazo" size="large" />
          </div>
          <p className="mt-4 mb-12 max-w-3xl font-body leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
            Below the bluff, discover natural trails and open spaces where neighbors and their pets
            can explore, play, and connect with nature.
          </p>

          <div className="space-y-20 md:space-y-28">
            {lowerParkAmenities.map((amenity, index) => (
              <AmenitySection
                key={amenity.slug?.current ?? index}
                title={amenity.title ?? ""}
                description={amenity.description ?? ""}
                details={amenity.details ?? undefined}
                link={
                  amenity.externalLink
                    ? {
                        text: amenity.linkText || "Learn more",
                        url: amenity.externalLink,
                      }
                    : undefined
                }
                images={amenity.images ?? []}
                imagePosition={index % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </div>

        {/* Support the Park Section */}
        <div>
          <div className="mb-4">
            <SectionHeader title="Support the Park" size="large" />
          </div>
          <p className="mt-4 mb-12 max-w-3xl font-body leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
            Help us preserve and enhance Chimborazo Park for generations to come. There are many
            meaningful ways to contribute to the park's ongoing restoration and care.
          </p>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 md:grid-cols-2 dark:border-primary-700 dark:bg-primary-700">
            <SupportOption
              title="Volunteer with Us"
              description="Join Friends of Chimborazo Park and the Chimborazo Park Conservancy for clean-up days, plantings, and restoration projects. Every helping hand makes a difference."
              ctaText="Volunteer With Us"
              ctaLink="/get-involved"
              variant="wall"
            />

            <SupportOption
              title="Adopt a Bench"
              description="Honor a loved one or celebrate a special occasion with a personalized dedication plaque on one of our park benches."
              comingSoon
              variant="wall"
            />

            <SupportOption
              title="Adopt a Tree"
              description="Support the park's urban canopy with a tree dedication. Each adopted tree receives a sign with the species name and your dedication."
              comingSoon
              variant="wall"
            />

            <SupportOption
              title="Plant Spring Color"
              description="Donate tulips and daffodils to naturalize the hillsides along the bluff and brighten our flower beds each spring. We'll handle the planting."
              comingSoon
              variant="wall"
            />
          </div>
        </div>

        {/* Get Involved Section */}
        <GetInvolved
          title="Ready to Get Involved?"
          description="Contact us to learn more about volunteer opportunities, dedications, and donation options. Together, we can ensure Chimborazo Park remains a vibrant community treasure."
          galleryImages={getInvolvedGalleryImages}
          facebookUrl={siteSettings?.socialMedia?.facebook}
          instagramUrl={siteSettings?.socialMedia?.instagram}
          gutter="none"
        />
      </Container>
    </div>
  )
}
