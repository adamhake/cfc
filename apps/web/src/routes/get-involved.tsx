import Chip from "@/components/Chip/chip";
import Container from "@/components/Container/container";
import { FacebookIcon } from "@/components/FacebookIcon/facebook-icon";
import { InstagramIcon } from "@/components/InstagramIcon/instagram-icon";
import { NewsletterForm } from "@/components/NewsletterForm";
import PageHero from "@/components/PageHero/page-hero";
import SectionHeader from "@/components/SectionHeader/section-header";
import SupportOption from "@/components/SupportOption/support-option";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getIsPreviewMode } from "@/lib/preview";
import { queryKeys } from "@/lib/query-keys";
import { getSanityClient } from "@/lib/sanity";
import { SanityGetInvolvedPage } from "@/lib/sanity-types";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { getGetInvolvedPageQuery } from "@chimborazo/sanity-config";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import {
  CalendarDays,
  HandHeart,
  Heart,
  Leaf,
  Mail,
  Paintbrush,
  Trees,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "../components/Button/button";

// Query options for get-involved page content - accept preview flag for Visual Editing
const getInvolvedPageQueryOptions = (preview = false) =>
  queryOptions({
    queryKey: [...queryKeys.getInvolvedPage(), { preview }],
    queryFn: async (): Promise<SanityGetInvolvedPage | null> => {
      try {
        return await getSanityClient(preview).fetch(getGetInvolvedPageQuery);
      } catch (error) {
        console.warn("Failed to fetch get-involved page from Sanity:", error);
        return null;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

export const Route = createFileRoute("/get-involved")({
  component: GetInvolvedPage,
  loader: async ({ context }) => {
    // Check if we're in preview mode for Visual Editing
    const preview = await getIsPreviewMode();

    // Prefetch get-involved page content on the server
    const pageData = await context.queryClient.ensureQueryData(
      getInvolvedPageQueryOptions(preview),
    );
    return { pageData, preview };
  },
  head: () => ({
    meta: generateMetaTags({
      title: "Get Involved",
      description:
        "Join us in preserving and enhancing Chimborazo Park. Volunteer, donate, or adopt park features to make a lasting impact on this historic Richmond landmark.",
      type: "website",
      url: `${SITE_CONFIG.url}/get-involved`,
    }),
    links: generateLinkTags({
      canonical: `${SITE_CONFIG.url}/get-involved`,
    }),
  }),
});

function GetInvolvedPage() {
  const { data: siteSettings } = useSiteSettings();
  const { pageData } = Route.useLoaderData();

  // Extract social media handles from URLs
  const facebookHandle =
    siteSettings?.socialMedia?.facebook?.split("facebook.com/")[1]?.replace(/\/$/, "") ||
    "friendsofchimborazopark";
  const instagramHandle =
    siteSettings?.socialMedia?.instagram?.split("instagram.com/")[1]?.replace(/\/$/, "") ||
    "friendsofchimborazopark";

  const heroData = pageData?.pageHero?.image?.image
    ? {
        title: pageData.pageHero.title,
        subtitle: pageData.pageHero.description,
        sanityImage: pageData.pageHero.image.image,
      }
    : {
        title: "Get Involved",
        subtitle: "Join our community in preserving and enhancing Chimborazo Park",
        imageSrc: "/get_involved.webp",
        imageAlt: "Volunteers working at Chimborazo Park",
        imageWidth: 800,
        imageHeight: 600,
      };

  return (
    <div>
      <PageHero {...heroData} height="medium" priority={true} />

      <div>
        <Container spacing="xl" className="space-y-24 py-16 pb-24">
          {/* Opening Statement */}
          <div className="max-w-4xl space-y-4">
            <p className="font-body text-xl leading-relaxed font-medium text-grey-800 md:text-2xl dark:text-grey-100">
              Chimborazo Park's future depends on the dedication and support of our community.
              Whether you can contribute your time, resources, or expertise, there's a meaningful
              way for you to make a lasting impact.
            </p>
            <p className="font-body text-grey-700 md:text-lg dark:text-grey-300">
              Since our founding in 2023, volunteers and supporters have donated thousands of hours
              and generous resources to restore this historic 33-acre treasure. Together, we're
              ensuring Chimborazo remains a beautiful, safe, and welcoming space for all.
            </p>
          </div>

          {/* Park Needs Section */}
          <div>
            <SectionHeader title="How the Park Needs Your Help" size="large" />
            <p className="mt-4 mb-12 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
              After years of reduced funding and deferred maintenance, many of Chimborazo's historic
              features and natural spaces need care and restoration. Here's where your support makes
              the biggest difference:
            </p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <SupportOption
                title="Trail Maintenance"
                description="Help maintain and improve the park's extensive trail network, including historic cobbled paths and woodland trails that connect communities."
                icon={<Leaf className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
              />
              <SupportOption
                title="Historic Restoration"
                description="Assist in preserving the Round House, gazebo, and other heritage structures that tell Chimborazo's rich story."
                icon={<Wrench className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
              />
              <SupportOption
                title="Landscape Care"
                description="Join seasonal plantings, bulb installations, and ongoing maintenance of the park's gardens and natural areas."
                icon={<Trees className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
              />
              <SupportOption
                title="Event Support"
                description="Help organize and run community events, educational programs, and seasonal celebrations that bring neighbors together."
                icon={<CalendarDays className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
              />
              <SupportOption
                title="Park Beautification"
                description="Support cleanup days, graffiti removal, signage restoration, and other projects that keep the park welcoming."
                icon={<Paintbrush className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
              />
              <SupportOption
                title="Community Outreach"
                description="Help spread the word about the park, engage neighbors, and build partnerships that strengthen our mission."
                icon={<Users className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
              />
            </div>
          </div>

          {/* Ways to Get Involved */}
          <div>
            <SectionHeader title="Ways to Get Involved" size="large" />
            <p className="mt-4 mb-12 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
              From hands-on volunteering to making a financial contribution, there are many ways to
              support Chimborazo Park's restoration and future.
            </p>

            <div className="space-y-6">
              {/* Volunteer */}
              <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-sm dark:border-primary-700 dark:bg-primary-950">
                <div className="grid grid-cols-1 md:grid-cols-5">
                  <div className="relative h-48 md:col-span-2 md:h-auto">
                    <Image
                      src="/get_involved.webp"
                      alt="Volunteers working together at Chimborazo Park"
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      layout="constrained"
                    />
                  </div>
                  <div className="p-6 md:col-span-3 md:p-8">
                    <div className="mb-4 flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-600 dark:bg-accent-900">
                        <Heart className="h-5 w-5 stroke-white" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-grey-900 md:text-2xl dark:text-grey-100">
                          Volunteer
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="font-body text-grey-800 md:text-lg dark:text-grey-200">
                        Join Friends of Chimborazo Park and the Chimborazo Park Conservancy for
                        seasonal clean-ups, tree plantings, trail maintenance, and restoration
                        projects. No experience necessary—just bring your enthusiasm and willingness
                        to help.
                      </p>
                      <ul className="list-disc space-y-1.5 pl-6 font-body text-grey-700 dark:text-grey-300">
                        <li>Seasonal clean-up days (spring and fall)</li>
                        <li>Monthly trail maintenance sessions</li>
                        <li>Special restoration projects throughout the year</li>
                        <li>Event setup and support</li>
                      </ul>
                      <p className="font-body text-sm text-grey-700 dark:text-grey-300">
                        Sign up for park update below to receive volunteer opportunities and event
                        announcements.
                      </p>
                      <div className="flex flex-col gap-4 pt-2 md:flex-row md:gap-6">
                        <Button as="a" variant="accent" size="small" href="/events">
                          View Upcoming Events
                        </Button>
                        <Button as="a" variant="outline" size="small" hash="stay-connected">
                          Sign Up for Updates
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donate */}
              <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-sm dark:border-primary-700 dark:bg-primary-950">
                <div className="grid grid-cols-1 md:grid-cols-5">
                  <div className="relative h-48 md:col-span-2 md:h-auto">
                    <Image
                      src="/cleanup_2024.webp"
                      alt="Community park cleanup and restoration"
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      layout="constrained"
                    />
                  </div>
                  <div className="p-6 md:col-span-3 md:p-8">
                    <div className="mb-4 flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-600 dark:bg-accent-900">
                        <HandHeart className="h-5 w-5 stroke-accent-100 dark:stroke-accent-200" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-grey-900 md:text-2xl dark:text-grey-100">
                          Donate
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="font-body text-grey-800 md:text-lg dark:text-grey-200">
                        As a grassroots 501(c)(3) nonprofit, we rely entirely on community donations
                        to fund park improvements. Every gift—large or small—directly supports
                        restoration work, maintenance, and programming.
                      </p>
                      <p className="font-body text-grey-700 dark:text-grey-300">
                        Your tax-deductible contribution helps us repair historic structures,
                        maintain trails, plant trees and flowers, and organize community events that
                        bring our neighborhood together.
                      </p>
                      <div className="pt-2">
                        <Button as="a" variant="accent" size="small" href="/donate">
                          Make a Donation
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adopt a Feature */}
              <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-sm dark:border-primary-700 dark:bg-primary-950">
                <div className="grid grid-cols-1 md:grid-cols-5">
                  <div className="relative h-48 md:col-span-2 md:h-auto">
                    <Image
                      src="/grove_cleanup.webp"
                      alt="Tree grove restoration and planting"
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      layout="constrained"
                    />
                  </div>
                  <div className="p-6 md:col-span-3 md:p-8">
                    <div className="mb-4 flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-600 dark:bg-accent-900">
                        <Trees className="h-5 w-5 stroke-accent-100 dark:stroke-accent-200" />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-xl font-semibold text-grey-900 md:text-2xl dark:text-grey-100">
                          Adopt a Feature
                        </h3>
                        <Chip variant="comingSoon" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="font-body text-grey-800 md:text-lg dark:text-grey-200">
                        Honor a loved one or celebrate a special occasion with a lasting tribute in
                        the park. Adoption programs include personalized recognition and direct
                        support for ongoing care.
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-grey-200 bg-grey-50 p-4 dark:border-primary-800 dark:bg-primary-900">
                          <h4 className="mb-1.5 font-display text-base font-semibold text-grey-900 dark:text-grey-100">
                            Adopt a Bench
                          </h4>
                          <p className="font-body text-sm text-grey-700 dark:text-grey-300">
                            Dedication plaque with your personalized message
                          </p>
                        </div>
                        <div className="rounded-lg border border-grey-200 bg-grey-50 p-4 dark:border-primary-800 dark:bg-primary-900">
                          <h4 className="mb-1.5 font-display text-base font-semibold text-grey-900 dark:text-grey-100">
                            Adopt a Tree
                          </h4>
                          <p className="font-body text-sm text-grey-700 dark:text-grey-300">
                            Species identification sign with your dedication
                          </p>
                        </div>
                        <div className="rounded-lg border border-grey-200 bg-grey-50 p-4 dark:border-primary-800 dark:bg-primary-900">
                          <h4 className="mb-1.5 font-display text-base font-semibold text-grey-900 dark:text-grey-100">
                            Plant Spring Color
                          </h4>
                          <p className="font-body text-sm text-grey-700 dark:text-grey-300">
                            Donate bulbs to brighten the hillsides each spring
                          </p>
                        </div>
                        <div className="rounded-lg border border-grey-200 bg-grey-50 p-4 dark:border-primary-800 dark:bg-primary-900">
                          <h4 className="mb-1.5 font-display text-base font-semibold text-grey-900 dark:text-grey-100">
                            Sponsor a Project
                          </h4>
                          <p className="font-body text-sm text-grey-700 dark:text-grey-300">
                            Fund specific restoration or improvement initiatives
                          </p>
                        </div>
                      </div>
                      <p className="font-body text-sm text-grey-700 dark:text-grey-300">
                        Contact us at{" "}
                        <a
                          href="mailto:info@chimborazopark.org"
                          className="font-semibold text-accent-700 underline decoration-accent-300 decoration-2 underline-offset-2 transition-colors hover:text-accent-800 hover:decoration-accent-500 dark:text-accent-400 dark:decoration-accent-600 dark:hover:text-accent-300"
                        >
                          info@chimborazopark.org
                        </a>{" "}
                        to learn more about adoption opportunities and pricing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stay Connected */}
          <div id="stay-connected">
            <SectionHeader title="Stay Connected" size="large" />
            <p className="mt-4 mb-12 max-w-3xl font-body text-grey-700 md:text-lg dark:text-grey-300">
              Sign up to receive updates on park projects, volunteer opportunities, and upcoming
              events. Follow us on social media to see what's happening at the park and connect with
              our community.
            </p>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Email Signup */}
              <div className="rounded-2xl border border-accent-200/50 bg-gradient-to-br from-accent-50/40 to-white p-8 shadow-sm dark:border-accent-700/30 dark:from-primary-950/90 dark:to-transparent">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-600 dark:bg-accent-900">
                    <Mail className="h-5 w-5 stroke-accent-100 dark:stroke-accent-200" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-grey-900 dark:text-grey-100">
                    Sign up for Park Updates
                  </h3>
                </div>
                <p className="mb-6 font-body text-grey-700 dark:text-grey-300">
                  Get regular updates on park improvements, volunteer days, and community events.
                </p>
                <NewsletterForm source="get-involved-page" label="Email address" />
              </div>

              {/* Social Media */}
              <div className="rounded-2xl border border-accent-200/50 bg-gradient-to-br from-accent-50/40 to-white p-8 shadow-sm dark:border-accent-700/30 dark:from-primary-950/90 dark:to-transparent">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-600 dark:bg-accent-900">
                    <Users className="h-5 w-5 stroke-accent-100 dark:stroke-accent-200" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-grey-900 dark:text-grey-100">
                    Follow Us
                  </h3>
                </div>
                <p className="mb-6 font-body text-grey-700 dark:text-grey-300">
                  Stay up to date with daily park happenings, event photos, and community stories on
                  social media.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <a
                    href={
                      siteSettings?.socialMedia?.facebook ||
                      "https://www.facebook.com/friendsofchimborazopark"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Facebook (opens in new window)"
                    className="group flex flex-1 items-center gap-3 rounded-xl border border-accent-200/50 bg-white p-4 shadow-sm transition-all hover:border-accent-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 dark:border-accent-700/30 dark:bg-transparent dark:hover:border-accent-500"
                  >
                    <FacebookIcon className="h-8 w-8 shrink-0 fill-accent-700 transition group-hover:fill-accent-800 dark:fill-accent-400 dark:group-hover:fill-accent-300" />
                    <div className="flex flex-col">
                      <span className="font-display text-sm font-semibold text-grey-900 dark:text-grey-100">
                        Facebook
                      </span>
                      <span className="font-body text-xs text-grey-600 dark:text-grey-400">
                        @{facebookHandle}
                      </span>
                    </div>
                  </a>
                  <a
                    href={
                      siteSettings?.socialMedia?.instagram ||
                      "https://www.instagram.com/friendsofchimborazopark/"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram (opens in new window)"
                    className="group flex flex-1 items-center gap-3 rounded-xl border border-accent-200/50 bg-white p-4 shadow-sm transition-all hover:border-accent-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 dark:border-accent-700/30 dark:bg-transparent dark:hover:border-accent-500"
                  >
                    <InstagramIcon className="h-8 w-8 shrink-0 fill-accent-700 transition group-hover:fill-accent-800 dark:fill-accent-400 dark:group-hover:fill-accent-300" />
                    <div className="flex flex-col">
                      <span className="font-display text-sm font-semibold text-grey-900 dark:text-grey-100">
                        Instagram
                      </span>
                      <span className="font-body text-xs text-grey-600 dark:text-grey-400">
                        @{instagramHandle}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Closing CTA */}
          <div className="rounded-2xl border border-primary-200/50 bg-gradient-to-br from-primary-100/60 to-primary-50/40 p-8 md:p-12 dark:border-primary-700/30 dark:from-primary-900/30 dark:to-primary-800/20">
            <h3 className="mb-4 font-display text-2xl font-semibold text-primary-800 md:text-3xl dark:text-primary-200">
              Questions?
            </h3>
            <p className="mb-6 font-body text-lg text-grey-800 dark:text-grey-200">
              Want to learn more about volunteer opportunities, donations, or park adoptions? We'd
              love to hear from you.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="font-body text-grey-800 dark:text-grey-200">
                Email us at{" "}
                <a
                  href="mailto:info@chimborazopark.org"
                  className="font-semibold text-accent-700 underline decoration-accent-300 decoration-2 underline-offset-2 transition-colors hover:text-accent-800 hover:decoration-accent-500 dark:text-accent-400 dark:decoration-accent-600 dark:hover:text-accent-300"
                >
                  info@chimborazopark.org
                </a>
              </p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
