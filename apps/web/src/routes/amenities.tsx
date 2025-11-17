import AmenityCard from "@/components/AmenityCard/amenity-card";
import GetInvolved from "@/components/GetInvolved/get-involved";
import PageHero from "@/components/PageHero/page-hero";
import SectionHeader from "@/components/SectionHeader/section-header";
import SupportOption from "@/components/SupportOption/support-option";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Clock,
  Dog,
  Heart,
  Landmark,
  MapPin,
  Tent,
  TreePine,
  Trees,
} from "lucide-react";

export const Route = createFileRoute("/amenities")({
  component: RouteComponent,
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
  return (
    <div>
      <PageHero
        title="Park Amenities"
        subtitle="Explore the spaces, trails, and landmarks that make Chimborazo special"
        imageSrc="/bike_sunset.webp"
        imageAlt="Chimborazo Park landscape"
        imageWidth={2000}
        imageHeight={1262}
        height="large"
      />

      {/* Main Content */}
      <div className="mx-auto max-w-6xl space-y-24 px-4 py-16 pb-24">
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
          <div className="flex flex-col items-start gap-6 rounded-2xl border-2 border-grey-200 bg-white p-8 md:flex-row md:gap-12 dark:border-primary-600 dark:bg-primary-800">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 shrink-0 stroke-primary-600 dark:stroke-primary-400" />
              <div>
                <div className="mb-0.5 font-display text-sm font-semibold tracking-wide text-grey-600 uppercase dark:text-grey-400">
                  Location
                </div>
                <div className="font-body text-lg text-grey-900 dark:text-grey-100">
                  3215 E. Broad St, Richmond VA
                </div>
              </div>
            </div>
            <div
              className="hidden h-12 w-px bg-grey-300 md:block dark:bg-primary-600"
              aria-hidden="true"
            ></div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 shrink-0 stroke-primary-600 dark:stroke-primary-400" />
              <div>
                <div className="mb-0.5 font-display text-sm font-semibold tracking-wide text-grey-600 uppercase dark:text-grey-400">
                  Hours
                </div>
                <div className="font-body text-lg text-grey-900 dark:text-grey-100">
                  Dawn to Dusk
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

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <AmenityCard
              title="Chimborazo Round House"
              icon={<Building2 className="h-6 w-6 stroke-green-700 dark:stroke-green-400" />}
              description="A historic gem overlooking southeast Richmond, the Round House has welcomed visitors for over a century."
              details={[
                "Originally constructed in 1905",
                "Redesigned as a Park House in 1915",
                "Available to rent for private events",
                "Stunning panoramic views included",
              ]}
              link={{
                text: "Reserve the Round House",
                url: "https://www.rva.gov/parks-recreation/scheduling-events-and-fees",
              }}
              image={{
                src: "/placeholder-roundhouse.webp",
                alt: "Historic Chimborazo Round House",
              }}
            />

            <AmenityCard
              title="Picnic Gazebo"
              icon={<Tent className="h-6 w-6 stroke-green-700 dark:stroke-green-400" />}
              description="Located just behind the bluff's edge, our gazebo provides the perfect setting for gatherings large and small."
              details={[
                "Ideal for family reunions and picnics",
                "Shaded seating area",
                "Spectacular overlook views",
                "Available through Parks and Recreation",
              ]}
              link={{
                text: "Learn about gazebo rental",
                url: "https://www.rva.gov/parks-recreation/scheduling-events-and-fees",
              }}
              image={{
                src: "/placeholder-gazebo.webp",
                alt: "Chimborazo Park gazebo overlooking the city",
              }}
            />

            <AmenityCard
              title="Statue of Liberty Replica"
              icon={<Landmark className="h-6 w-6 stroke-green-700 dark:stroke-green-400" />}
              description="A unique piece of Cold War history stands proudly in the park—one of only 200 replicas placed nationwide."
              details={[
                "Donated by the Robert E. Lee Council Boy Scouts in 1951",
                "Part of the 'Strengthen the Arm of Liberty' campaign",
                "Eight-foot replica of the iconic statue",
                "Commemorates early Cold War era patriotism",
              ]}
              image={{
                src: "/placeholder-liberty.webp",
                alt: "Statue of Liberty replica at Chimborazo Park",
              }}
            />

            <AmenityCard
              title="Restroom Facilities"
              icon={<Building2 className="h-6 w-6 stroke-green-700 dark:stroke-green-400" />}
              description="Conveniently located facilities are available year-round in the upper park area."
              details={[
                "Two port-a-potty units available",
                "Located behind the Gazebo and Statue of Liberty",
                "Accessible to all park visitors",
              ]}
            />
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

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <AmenityCard
              title="Bark Park"
              icon={<Dog className="h-6 w-6 stroke-green-700 dark:stroke-green-400" />}
              description="Two dedicated off-leash areas where dogs of all sizes can run, socialize, and play safely."
              details={[
                "Separate areas for large and small dogs",
                "Water typically available at both sections",
                "Convenient parking nearby",
                "Shaded seating for pet owners",
              ]}
              image={{
                src: "/placeholder-barkpark.webp",
                alt: "Chimborazo Park dog park",
              }}
            />

            <AmenityCard
              title="Woodland Trails"
              icon={<TreePine className="h-6 w-6 stroke-green-700 dark:stroke-green-400" />}
              description="Explore a network of paths winding through natural woodland, connecting historic routes and scenic spots."
              details={[
                "Improved trails and natural social paths",
                "Runs from Government Road stairs to Gilly's Creek",
                "Historic cobbled service roads",
                "Shaded forest canopy for year-round hiking",
              ]}
              image={{
                src: "/placeholder-trails.webp",
                alt: "Woodland trails at Chimborazo Park",
              }}
            />
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
            />

            <SupportOption
              title="Adopt a Bench"
              description="Honor a loved one or celebrate a special occasion with a personalized dedication plaque on one of our park benches."
              icon={<Building2 className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
            />

            <SupportOption
              title="Adopt a Tree"
              description="Support the park's urban canopy with a tree dedication. Each adopted tree receives a sign with the species name and your dedication."
              icon={<Trees className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
            />

            <SupportOption
              title="Plant Spring Color"
              description="Donate tulips and daffodils to naturalize the hillsides along the bluff and brighten our flower beds each spring. We'll handle the planting."
              icon={<TreePine className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
            />
          </div>
        </div>

        {/* Get Involved Section */}
        <GetInvolved
          title="Ready to Get Involved?"
          description="Contact us to learn more about volunteer opportunities, dedications, and donation options. Together, we can ensure Chimborazo Park remains a vibrant community treasure."
        />
      </div>
    </div>
  );
}
