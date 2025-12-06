import AmenitySection from "@/components/AmenitySection/amenity-section";
import Container from "@/components/Container/container";
import GetInvolved from "@/components/GetInvolved/get-involved";
import PageHero from "@/components/PageHero/page-hero";
import SectionHeader from "@/components/SectionHeader/section-header";
import SupportOption from "@/components/SupportOption/support-option";
import { queryKeys } from "@/lib/query-keys";
import { sanityClient } from "@/lib/sanity";
import type { SanityAmenitiesPage } from "@/lib/sanity-types";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { getAmenitiesPageQuery } from "@chimborazo/sanity-config";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Car,
  Clock,
  Dog,
  Droplet,
  Flag,
  Flower2,
  Heart,
  MapPin,
  ShoppingBasket,
  Sofa,
  Toilet,
  TreeDeciduous,
  TreePine,
  Trees,
} from "lucide-react";

// Icon mapping based on schema icon values
const iconMap = {
  building: Building2,
  gazebo: ShoppingBasket,
  monument: Flag,
  restroom: Toilet,
  dog: Dog,
  trail: TreePine,
  trees: Trees,
  bench: Sofa,
  parking: Car,
  playground: TreeDeciduous,
  fountain: Droplet,
  garden: Flower2,
} as const;

// Helper to get icon component from string
const getIconComponent = (iconName: string) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? <IconComponent /> : <Building2 />;
};

// Query options for TanStack Query
const amenitiesPageQueryOptions = queryOptions({
  queryKey: queryKeys.amenitiesPage(),
  queryFn: async (): Promise<SanityAmenitiesPage | null> => {
    try {
      return await sanityClient.fetch(getAmenitiesPageQuery);
    } catch (error) {
      console.warn("Failed to fetch amenities page from Sanity:", error);
      return null;
    }
  },
  // Page content changes infrequently - cache for 30 minutes
  staleTime: 30 * 60 * 1000, // 30 minutes
  gcTime: 60 * 60 * 1000, // 1 hour (must be >= staleTime)
});

export const Route = createFileRoute("/amenities")({
  component: RouteComponent,
  loader: async ({ context }) => {
    // Prefetch amenities page data on the server
    await context.queryClient.ensureQueryData(amenitiesPageQueryOptions);
  },
  head: () => ({
    meta: generateMetaTags({
      title: "Park Amenities",
      description:
        "Discover Chimborazo Park's amenities including the historic Round House, gazebo, dog park, woodland trails, and Statue of Liberty. Open dawn to dusk at 3215 E. Broad Street.",
      type: "website",
      url: `${SITE_CONFIG.url}/amenities`,
    }),
    links: generateLinkTags({
      canonical: `${SITE_CONFIG.url}/amenities`,
    }),
  }),
});

function RouteComponent() {
  const { data: amenitiesPageData } = useQuery(amenitiesPageQueryOptions);

  // Prepare hero data from Sanity or use defaults
  const heroData = amenitiesPageData?.pageHero?.image?.image
    ? {
        title: amenitiesPageData.pageHero.title,
        subtitle: amenitiesPageData.pageHero.description,
        sanityImage: amenitiesPageData.pageHero.image.image,
      }
    : {
        title: "Park Amenities",
        subtitle: "Explore the spaces, trails, and landmarks that make Chimborazo special",
        imageSrc: "/bike_sunset.webp",
        imageAlt: "Chimborazo Park landscape",
        imageWidth: 2000,
        imageHeight: 1262,
      };

  // Filter amenities by section
  const upperParkAmenities =
    amenitiesPageData?.amenities?.filter(
      (amenity) => amenity.section === "upper-park" || amenity.section === "both",
    ) || [];

  const lowerParkAmenities =
    amenitiesPageData?.amenities?.filter(
      (amenity) => amenity.section === "lower-park" || amenity.section === "both",
    ) || [];

  return (
    <div>
      <PageHero {...heroData} height="small" priority={true} />

      {/* Main Content */}
      <Container spacing="none" className="space-y-24 py-16 pb-24">
        {/* Introduction */}
        <div className="max-w-4xl space-y-4">
          <p className="font-body text-lg text-grey-800 md:text-xl dark:text-grey-200">
            Chimborazo Park is a 33-acre treasure in the heart of Richmond's Church Hill
            neighborhood, offering a unique blend of natural beauty, historic landmarks, and modern
            amenities for all to enjoy.
          </p>
          <p className="font-body text-base text-grey-700 md:text-lg dark:text-grey-300">
            From the sweeping bluff-top views to the wooded trails below, our park provides spaces
            for recreation, reflection, and community gathering. Whether you're planning a special
            event, walking your dog, or simply seeking a peaceful retreat, Chimborazo welcomes you.
          </p>
        </div>

        {/* Location and Hours */}
        <div className="max-w-3xl">
          <div className="group overflow-hidden rounded-2xl border border-accent-600/20 bg-gradient-to-br from-grey-100/10 to-grey-100/50 p-8 shadow-sm transition-all duration-300 hover:shadow-md dark:border-accent-500/20 dark:from-primary-900 dark:to-primary-900/80">
            <div className="flex flex-col items-start gap-6 md:flex-row md:gap-12">
              <div className="flex items-start gap-4">
                <div
                  className="inline-flex shrink-0 rounded-full bg-accent-600/10 p-3 dark:bg-accent-500/15"
                  role="img"
                  aria-label="Location icon"
                >
                  <MapPin className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />
                </div>
                <div>
                  <div className="mb-1 font-display text-sm font-semibold tracking-wide text-grey-600 uppercase dark:text-grey-400">
                    Location
                  </div>
                  <div className="font-body text-lg font-medium text-grey-900 dark:text-grey-100">
                    3215 E. Broad St, Richmond VA
                  </div>
                </div>
              </div>
              <div
                className="hidden h-14 w-px bg-accent-200 md:block dark:bg-accent-700/30"
                aria-hidden="true"
              ></div>
              <div className="flex items-start gap-4">
                <div
                  className="inline-flex shrink-0 rounded-full bg-accent-600/10 p-3 dark:bg-accent-500/15"
                  role="img"
                  aria-label="Hours icon"
                >
                  <Clock className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />
                </div>
                <div>
                  <div className="mb-1 font-display text-sm font-semibold tracking-wide text-grey-600 uppercase dark:text-grey-400">
                    Hours
                  </div>
                  <div className="font-body text-lg font-medium text-grey-900 dark:text-grey-100">
                    Dawn to Dusk
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upper Park Amenities */}
        <div>
          <div className="mb-4">
            <SectionHeader title="Upper Chimborazo" size="large" />
          </div>
          <p className="mb-12 max-w-3xl font-body text-grey-800 md:text-lg dark:text-grey-200">
            The upper park offers sweeping views of downtown Richmond and the James River, along
            with historic structures and gathering spaces perfect for events and relaxation.
          </p>

          <div className="space-y-20 md:space-y-28">
            {upperParkAmenities.map((amenity, index) => (
              <AmenitySection
                key={amenity.slug.current}
                title={amenity.title}
                icon={getIconComponent(amenity.icon)}
                description={amenity.description}
                details={amenity.details}
                link={
                  amenity.externalLink
                    ? {
                        text: amenity.linkText || "Learn more",
                        url: amenity.externalLink,
                      }
                    : undefined
                }
                images={
                  amenity.images?.map((img) => ({
                    image: img.image,
                    alt: img.image.alt,
                    caption: img.image.caption,
                  })) ?? []
                }
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
          <p className="mb-12 max-w-3xl font-body text-grey-800 md:text-lg dark:text-grey-200">
            Below the bluff, discover natural trails and open spaces where neighbors and their pets
            can explore, play, and connect with nature.
          </p>

          <div className="space-y-20 md:space-y-28">
            {lowerParkAmenities.map((amenity, index) => (
              <AmenitySection
                key={amenity.slug.current}
                title={amenity.title}
                icon={getIconComponent(amenity.icon)}
                description={amenity.description}
                details={amenity.details}
                link={
                  amenity.externalLink
                    ? {
                        text: amenity.linkText || "Learn more",
                        url: amenity.externalLink,
                      }
                    : undefined
                }
                images={
                  amenity.images?.map((img) => ({
                    image: img.image,
                    alt: img.image.alt,
                    caption: img.image.caption,
                  })) ?? []
                }
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
          <p className="mb-12 max-w-3xl font-body text-grey-800 md:text-lg dark:text-grey-200">
            Help us preserve and enhance Chimborazo Park for generations to come. There are many
            meaningful ways to contribute to the park's ongoing restoration and care.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SupportOption
              title="Volunteer with Us"
              description="Join Friends of Chimborazo Park and the Chimborazo Park Conservancy for clean-up days, plantings, and restoration projects. Every helping hand makes a difference."
              icon={<Heart className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
              comingSoon
            />

            <SupportOption
              title="Adopt a Bench"
              description="Honor a loved one or celebrate a special occasion with a personalized dedication plaque on one of our park benches."
              icon={<Building2 className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
              comingSoon
            />

            <SupportOption
              title="Adopt a Tree"
              description="Support the park's urban canopy with a tree dedication. Each adopted tree receives a sign with the species name and your dedication."
              icon={<Trees className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
              comingSoon
            />

            <SupportOption
              title="Plant Spring Color"
              description="Donate tulips and daffodils to naturalize the hillsides along the bluff and brighten our flower beds each spring. We'll handle the planting."
              icon={<TreePine className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
              comingSoon
            />
          </div>
        </div>

        {/* Get Involved Section */}
        <GetInvolved
          title="Ready to Get Involved?"
          description="Contact us to learn more about volunteer opportunities, dedications, and donation options. Together, we can ensure Chimborazo Park remains a vibrant community treasure."
          gutter="none"
        />
      </Container>
    </div>
  );
}
