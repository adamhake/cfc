import { getGetInvolvedPageQuery, getSiteSettingsQuery } from "@chimborazo/sanity-config/queries"
import { CalendarDays, Leaf, Paintbrush, Trees, Users, Wrench } from "lucide-react"
import type { Metadata } from "next"
import { Button } from "@/components/Button/button"
import Chip from "@/components/Chip/chip"
import Container from "@/components/Container/container"
import { FacebookIcon } from "@/components/FacebookIcon/facebook-icon"
import { InstagramIcon } from "@/components/InstagramIcon/instagram-icon"
import { NewsletterForm } from "@/components/NewsletterForm"
import { Image } from "@/components/OptimizedImage/optimized-image"
import PageHeroOptimistic from "@/components/PageHero/page-hero-optimistic"
import { PageIntroduction } from "@/components/PageIntroduction/page-introduction"
import SectionHeader from "@/components/SectionHeader/section-header"
import SupportOption from "@/components/SupportOption/support-option"
import { CACHE_TAGS, cachedSanityFetch, getDynamicFetchOptions } from "@/lib/sanity-fetch"
import type { SanityGetInvolvedPage, SanitySiteSettings } from "@/lib/sanity-types"
import { SITE_CONFIG } from "@/utils/seo"

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Join us in preserving and enhancing Chimborazo Park. Volunteer, donate, or adopt park features to make a lasting impact on this historic Richmond landmark.",
  alternates: { canonical: `${SITE_CONFIG.url}/get-involved` },
  openGraph: {
    title: "Get Involved",
    description:
      "Join us in preserving and enhancing Chimborazo Park. Volunteer, donate, or adopt park features to make a lasting impact on this historic Richmond landmark.",
    type: "website",
    url: `${SITE_CONFIG.url}/get-involved`,
  },
}

export default async function GetInvolvedPage() {
  const [{ data: pageData }, { data: siteSettings }] = (await Promise.all([
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: getGetInvolvedPageQuery,
      tags: [CACHE_TAGS.GET_INVOLVED],
    }),
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: getSiteSettingsQuery,
      tags: [CACHE_TAGS.SITE_SETTINGS],
    }),
  ])) as [{ data: SanityGetInvolvedPage | null }, { data: SanitySiteSettings | null }]

  // Extract social media handles from URLs
  const facebookHandle =
    siteSettings?.socialMedia?.facebook?.split("facebook.com/")[1]?.replace(/\/$/, "") ||
    "friendsofchimborazopark"
  const instagramHandle =
    siteSettings?.socialMedia?.instagram?.split("instagram.com/")[1]?.replace(/\/$/, "") ||
    "friendsofchimborazopark"
  const contactEmail = siteSettings?.contactEmail || "info@chimborazoparkconservancy.org"

  return (
    <div className="space-y-14 pb-16 md:space-y-20 md:pb-24">
      <PageHeroOptimistic
        document={pageData}
        fallback={{
          title: "Get Involved",
          subtitle: "Join our community in preserving and enhancing Chimborazo Park",
          imageSrc: "/get_involved.webp",
          imageAlt: "Volunteers working at Chimborazo Park",
          imageWidth: 800,
          imageHeight: 600,
        }}
        variant="section"
        priority={true}
      />

      <div>
        <Container spacing="none" className="space-y-16 md:space-y-20">
          {/* Opening Statement */}
          <PageIntroduction
            fallback={[
              "Chimborazo Park's future depends on the dedication and support of our community. Whether you can contribute your time, resources, or expertise, there's a meaningful way for you to make a lasting impact.",
              "Since our founding in 2023, volunteers and supporters have donated thousands of hours and generous resources to restore this historic 33-acre treasure. Together, we're ensuring Chimborazo remains a beautiful, safe, and welcoming space for all.",
            ]}
          />

          {/* Park Needs Section */}
          <div>
            <SectionHeader title="How the Park Needs Your Help" size="large" />
            <p className="mt-4 mb-12 max-w-3xl font-body leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
              After years of reduced funding and deferred maintenance, many of Chimborazo's historic
              features and natural spaces need care and restoration. Here's where your support makes
              the biggest difference:
            </p>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 md:grid-cols-2 lg:grid-cols-3 dark:border-primary-700 dark:bg-primary-700">
              <SupportOption
                title="Trail Maintenance"
                description="Help maintain and improve the park's extensive trail network, including historic cobbled paths and woodland trails that connect communities."
                icon={<Leaf className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
                variant="wall"
              />
              <SupportOption
                title="Historic Restoration"
                description="Assist in preserving the Round House, gazebo, and other heritage structures that tell Chimborazo's rich story."
                icon={<Wrench className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
                variant="wall"
              />
              <SupportOption
                title="Landscape Care"
                description="Join seasonal plantings, bulb installations, and ongoing maintenance of the park's gardens and natural areas."
                icon={<Trees className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
                variant="wall"
              />
              <SupportOption
                title="Event Support"
                description="Help organize and run community events, educational programs, and seasonal celebrations that bring neighbors together."
                icon={<CalendarDays className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
                variant="wall"
              />
              <SupportOption
                title="Park Beautification"
                description="Support cleanup days, graffiti removal, signage restoration, and other projects that keep the park welcoming."
                icon={<Paintbrush className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
                variant="wall"
              />
              <SupportOption
                title="Community Outreach"
                description="Help spread the word about the park, engage neighbors, and build partnerships that strengthen our mission."
                icon={<Users className="h-6 w-6 stroke-accent-600 dark:stroke-accent-400" />}
                variant="wall"
              />
            </div>
          </div>

          {/* Ways to Get Involved */}
          <div>
            <SectionHeader title="Ways to Get Involved" size="large" />
            <p className="mt-4 mb-12 max-w-3xl font-body leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
              From hands-on volunteering to making a financial contribution, there are many ways to
              support Chimborazo Park's restoration and future.
            </p>

            <div className="space-y-6">
              {/* Volunteer */}
              <div className="overflow-hidden rounded-2xl border border-primary-200 bg-grey-50 dark:border-primary-700 dark:bg-primary-950">
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
                    <h3 className="mb-4 font-display text-xl font-semibold text-grey-900 md:text-2xl dark:text-grey-100">
                      Volunteer
                    </h3>
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
                        Sign up for park updates below to receive volunteer opportunities and event
                        announcements.
                      </p>
                      <div className="flex flex-col gap-4 pt-2 md:flex-row md:gap-6">
                        <Button
                          as="a"
                          variant="accent"
                          size="small"
                          href="/events"
                          trackingLocation="get-involved-volunteer"
                        >
                          View Upcoming Events
                        </Button>
                        <Button
                          as="a"
                          variant="outline"
                          size="small"
                          href="#stay-connected"
                          trackingLocation="get-involved-volunteer"
                        >
                          Sign Up for Updates
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donate */}
              <div className="overflow-hidden rounded-2xl border border-primary-200 bg-grey-50 dark:border-primary-700 dark:bg-primary-950">
                <div className="grid grid-cols-1 md:grid-cols-5">
                  <div className="relative h-48 md:order-2 md:col-span-2 md:h-auto">
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
                  <div className="p-6 md:order-1 md:col-span-3 md:p-8">
                    <h3 className="mb-4 font-display text-xl font-semibold text-grey-900 md:text-2xl dark:text-grey-100">
                      Donate
                    </h3>
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
                        <Button
                          as="a"
                          variant="accent"
                          size="small"
                          href="/donate"
                          trackingLocation="get-involved-donate"
                        >
                          Make a Donation
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adopt a Feature */}
              <div className="overflow-hidden rounded-2xl border border-primary-200 bg-grey-50 dark:border-primary-700 dark:bg-primary-950">
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
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-xl font-semibold text-grey-900 md:text-2xl dark:text-grey-100">
                        Adopt a Feature
                      </h3>
                      <Chip variant="comingSoon" />
                    </div>
                    <div className="space-y-4">
                      <p className="font-body text-grey-800 md:text-lg dark:text-grey-200">
                        Honor a loved one or celebrate a special occasion with a lasting tribute in
                        the park. Adoption programs include personalized recognition and direct
                        support for ongoing care.
                      </p>
                      <div className="grid gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 dark:border-primary-700 dark:bg-primary-700">
                        <div className="bg-white p-4 dark:bg-primary-900">
                          <h4 className="mb-1.5 font-display text-base font-semibold text-grey-900 dark:text-grey-100">
                            Adopt a Bench
                          </h4>
                          <p className="font-body text-sm text-grey-700 dark:text-grey-300">
                            Dedication plaque with your personalized message
                          </p>
                        </div>
                        <div className="bg-white p-4 dark:bg-primary-900">
                          <h4 className="mb-1.5 font-display text-base font-semibold text-grey-900 dark:text-grey-100">
                            Adopt a Tree
                          </h4>
                          <p className="font-body text-sm text-grey-700 dark:text-grey-300">
                            Species identification sign with your dedication
                          </p>
                        </div>
                        <div className="bg-white p-4 dark:bg-primary-900">
                          <h4 className="mb-1.5 font-display text-base font-semibold text-grey-900 dark:text-grey-100">
                            Plant Spring Color
                          </h4>
                          <p className="font-body text-sm text-grey-700 dark:text-grey-300">
                            Donate bulbs to brighten the hillsides each spring
                          </p>
                        </div>
                        <div className="bg-white p-4 dark:bg-primary-900">
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
                          href={`mailto:${contactEmail}`}
                          className="font-semibold text-accent-700 underline decoration-accent-300 decoration-2 underline-offset-2 transition-colors hover:text-accent-800 hover:decoration-accent-500 dark:text-accent-400 dark:decoration-accent-600 dark:hover:text-accent-300"
                        >
                          {contactEmail}
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
          <div id="stay-connected" className="scroll-mt-28">
            <SectionHeader title="Stay Connected" size="large" />
            <p className="mt-4 mb-12 max-w-3xl font-body leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
              Sign up to receive updates on park projects, volunteer opportunities, and upcoming
              events. Follow us on social media to see what's happening at the park and connect with
              our community.
            </p>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 lg:grid-cols-2 dark:border-primary-700 dark:bg-primary-700">
              {/* Email Signup */}
              <div className="bg-grey-50 p-6 md:p-8 dark:bg-primary-950">
                <h3 className="mb-6 font-display text-2xl font-semibold text-grey-900 dark:text-grey-100">
                  Sign up for Park Updates
                </h3>
                <p className="mb-6 font-body text-grey-700 dark:text-grey-300">
                  Get regular updates on park improvements, volunteer days, and community events.
                </p>
                <NewsletterForm source="get-involved-page" label="Email address" />
              </div>

              {/* Social Media */}
              <div className="bg-grey-50 p-6 md:p-8 dark:bg-primary-950">
                <h3 className="mb-6 font-display text-2xl font-semibold text-grey-900 dark:text-grey-100">
                  Follow Us
                </h3>
                <p className="mb-6 font-body text-grey-700 dark:text-grey-300">
                  Stay up to date with daily park happenings, event photos, and community stories on
                  social media.
                </p>
                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 dark:border-primary-700 dark:bg-primary-700">
                  <a
                    href={
                      siteSettings?.socialMedia?.facebook ||
                      "https://www.facebook.com/friendsofchimborazopark"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Facebook (opens in new window)"
                    className="group flex min-w-0 items-center gap-2 bg-white p-3 transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-inset focus-visible:outline-none dark:bg-primary-900 dark:hover:bg-primary-800"
                  >
                    <FacebookIcon className="h-6 w-6 shrink-0 fill-accent-700 transition group-hover:fill-accent-800 dark:fill-accent-400 dark:group-hover:fill-accent-300" />
                    <div className="flex min-w-0 flex-col">
                      <span className="font-display text-sm font-semibold text-grey-900 dark:text-grey-100">
                        Facebook
                      </span>
                      <span className="break-words font-body text-xs text-grey-600 dark:text-grey-400">
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
                    className="group flex min-w-0 items-center gap-2 bg-white p-3 transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-inset focus-visible:outline-none dark:bg-primary-900 dark:hover:bg-primary-800"
                  >
                    <InstagramIcon className="h-6 w-6 shrink-0 fill-accent-700 transition group-hover:fill-accent-800 dark:fill-accent-400 dark:group-hover:fill-accent-300" />
                    <div className="flex min-w-0 flex-col">
                      <span className="font-display text-sm font-semibold text-grey-900 dark:text-grey-100">
                        Instagram
                      </span>
                      <span className="break-words font-body text-xs text-grey-600 dark:text-grey-400">
                        @{instagramHandle}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Closing CTA */}
          <div className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-neutral-100 p-8 md:p-10 lg:flex-row lg:items-center lg:justify-between dark:border-primary-700 dark:bg-primary-950">
            <div>
              <h2 className="font-display text-2xl font-semibold text-primary-800 md:text-3xl dark:text-primary-200">
                Questions?
              </h2>
              <p className="mt-2 max-w-3xl font-body text-grey-800 md:text-lg dark:text-grey-200">
                Want to learn more about volunteer opportunities, donations, or park adoptions? We'd
                love to hear from you.
              </p>
            </div>
            <Button
              as="a"
              variant="accent"
              size="small"
              href={`mailto:${contactEmail}`}
              trackingLocation="get-involved-questions"
              className="w-full sm:w-auto lg:shrink-0"
            >
              Email the Conservancy
            </Button>
          </div>
        </Container>
      </div>
    </div>
  )
}
