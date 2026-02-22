import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import { getIsPreviewMode } from "@/lib/preview";
import { queryKeys } from "@/lib/query-keys";
import { getSanityClient } from "@/lib/sanity";
import type { SanityDonatePage } from "@/lib/sanity-types";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { getDonatePageQuery } from "@chimborazo/sanity-config";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

// Query options for donate page content - accept preview flag for Visual Editing
const donatePageQueryOptions = (preview = false) =>
  queryOptions({
    queryKey: [...queryKeys.donatePage(), { preview }],
    queryFn: async (): Promise<SanityDonatePage | null> => {
      try {
        return (await getSanityClient(preview).fetch(getDonatePageQuery)) as SanityDonatePage | null;
      } catch (error) {
        console.warn("Failed to fetch donate page from Sanity:", error);
        return null;
      }
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

export const Route = createFileRoute("/donate")({
  component: Donate,
  loader: async ({ context }) => {
    // Check if we're in preview mode for Visual Editing
    const preview = await getIsPreviewMode();

    // Prefetch donate page content on the server
    await context.queryClient.ensureQueryData(donatePageQueryOptions(preview));

    return { preview };
  },
  head: () => ({
    meta: generateMetaTags({
      title: "Donate",
      description:
        "Support Chimborazo Park through your generous donation. Help us restore and enhance this historic Richmond landmark for generations to come.",
      type: "website",
      url: `${SITE_CONFIG.url}/donate`,
    }),
    links: generateLinkTags({
      canonical: `${SITE_CONFIG.url}/donate`,
    }),
  }),
});

function Donate() {
  const { preview } = Route.useLoaderData();
  const { data: donatePageData } = useQuery(donatePageQueryOptions(preview));
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Prepare hero data from Sanity or use defaults
  const heroData = donatePageData?.pageHero?.image
    ? {
        title: donatePageData.pageHero.title,
        subtitle: donatePageData.pageHero.description,
        sanityImage: donatePageData.pageHero.image,
      }
    : {
        title: "Support Us",
        imageSrc: "/bike_sunset.webp",
        imageAlt: "Chimborazo Park landscape",
        imageWidth: 2000,
        imageHeight: 1262,
      };

  return (
    <div>
      <PageHero {...heroData} height="medium" priority={true} />
      <div>
        <Container spacing="xl" className="py-24">
          <div className="space-y-8">
            {/* Opening statement */}
            <div className="max-w-3xl space-y-4">
              <p className="font-body text-xl leading-relaxed font-medium text-grey-800 md:text-2xl dark:text-grey-100">
                Your generous contributions breathe new life into Chimborazo Park—restoring historic
                landmarks, maintaining green spaces, and creating welcoming places for our community
                to gather.
              </p>
              <p className="font-body text-grey-700 md:text-lg dark:text-grey-300">
                As a grassroots 501(c)(3) nonprofit, we rely entirely on community donations,
                grants, and volunteer support to care for this 33-acre historic treasure. Every
                gift—large or small—directly funds park improvements and ensures Chimborazo remains
                beautiful, safe, and accessible for generations to come.
              </p>
            </div>
          </div>

          {/* Donation form */}
          <div
            className="mt-12"
            style={{ position: "relative", minHeight: "700px", width: "100%" }}
          >
            {/* Loading skeleton */}
            {!isIframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-grey-100 dark:bg-grey-800">
                <div className="flex flex-col items-center gap-4">
                  {/* Animated loading spinner */}
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 dark:border-primary-700 dark:border-t-primary-400" />
                  <p className="font-body text-grey-600 dark:text-grey-400">
                    Loading donation form...
                  </p>
                </div>
              </div>
            )}
            <iframe
              title="Donation form powered by Zeffy"
              style={{
                position: "absolute",
                border: 0,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: "100%",
                height: "100%",
                opacity: isIframeLoaded ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
              src="https://www.zeffy.com/embed/donation-form/general-donation-125"
              allow="payment"
              onLoad={() => setIsIframeLoaded(true)}
            />
          </div>

          {/* Donation info callout */}
          <div className="mt-12 rounded-2xl border border-primary-200/50 bg-gradient-to-br from-primary-100/60 to-primary-50/40 p-6 md:p-8 dark:border-primary-700/30 dark:from-primary-900/30 dark:to-primary-800/20">
            <h3 className="mb-3 font-display text-xl font-semibold text-primary-800 md:text-2xl dark:text-primary-200">
              Powered by Zeffy
            </h3>
            <p className="font-body text-grey-800 md:text-lg dark:text-grey-200">
              We partner with{" "}
              <a
                href="https://www.zeffy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent-700 underline decoration-accent-300 decoration-2 underline-offset-2 transition-colors hover:text-accent-800 hover:decoration-accent-500 dark:text-accent-400 dark:decoration-accent-600 dark:hover:text-accent-300"
              >
                Zeffy
              </a>
              , a secure donation platform built specifically for nonprofits. Zeffy offers 100% free
              payment processing—they'll never charge us fees, so more of your donation goes
              directly to the park. Your payment information is securely processed and never stored
              by us.
            </p>
          </div>

          {/* Tax deductibility info */}
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm md:p-8 dark:border dark:border-accent-600/20 dark:bg-transparent">
            <p className="font-body text-grey-700 md:text-lg dark:text-grey-300">
              <strong className="font-semibold text-grey-900 dark:text-grey-100">
                Tax-deductible:
              </strong>{" "}
              The Chimborazo Park Conservancy is a registered 501(c)(3) nonprofit organization. Your
              contribution is tax-deductible to the fullest extent permitted by law. You'll receive
              a receipt from Zeffy for your records.
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}
