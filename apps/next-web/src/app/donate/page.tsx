import type { Metadata } from "next";
import { sanityFetch, CACHE_TAGS } from "@/lib/sanity-fetch";
import type { SanityDonatePage } from "@/lib/sanity-types";
import { generateFAQStructuredData, SITE_CONFIG } from "@/utils/seo";
import { getDonatePageQuery } from "@chimborazo/sanity-config/queries";
import Container from "@/components/Container/container";
import { FAQSection } from "@/components/FAQSection/faq-section";
import PageHero from "@/components/PageHero/page-hero";
import DonateFormClient from "./donate-form-client";

const DONATE_FAQS = [
  {
    question: "Is my donation tax-deductible?",
    answer:
      "Yes. The Chimborazo Park Conservancy is a registered 501(c)(3) non-profit organization. Your contribution is tax-deductible to the fullest extent permitted by law. You will receive a receipt from Zeffy for your tax records.",
  },
  {
    question: "Are there any processing fees on my donation?",
    answer:
      "No. We use Zeffy, a donation platform that offers 100% free payment processing for nonprofits. Zeffy never charges us fees, so the full amount of your donation goes directly to park improvements. Zeffy may ask you for an optional tip to support their platform, but it is not required.",
  },
  {
    question: "How will my donation be used?",
    answer:
      "Donations directly fund park restoration and improvements, including repairing historic structures like the Round House and gazebo, maintaining trails, planting trees and flowers, organizing community events, and general park maintenance. As a grassroots nonprofit, we rely entirely on community donations and volunteer support.",
  },
  {
    question: "Can I make a recurring donation?",
    answer:
      "Yes. Through our Zeffy donation form, you can set up a one-time or recurring monthly donation. Recurring donations help us plan ahead and provide consistent support for ongoing park maintenance and projects.",
  },
  {
    question: "Are there other ways to support the park besides a financial donation?",
    answer:
      "Absolutely. You can volunteer at seasonal clean-up days and trail maintenance sessions, adopt a park feature like a bench or tree, donate spring bulbs, or help spread the word on social media. Visit our Get Involved page for all the ways to contribute.",
  },
];

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Chimborazo Park through your generous donation. Help us restore and enhance this historic Richmond landmark for generations to come.",
  alternates: { canonical: `${SITE_CONFIG.url}/donate` },
  openGraph: {
    title: "Donate",
    description:
      "Support Chimborazo Park through your generous donation. Help us restore and enhance this historic Richmond landmark for generations to come.",
    type: "website",
    url: `${SITE_CONFIG.url}/donate`,
  },
};

export default async function DonatePage() {
  const donatePageData = await sanityFetch<SanityDonatePage | null>({
    query: getDonatePageQuery,
    tags: [CACHE_TAGS.DONATE],
  });

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

  const faqStructuredData = generateFAQStructuredData(DONATE_FAQS);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
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

          {/* Donation form (client component for iframe loading state) */}
          <DonateFormClient />

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

          {/* FAQ Section */}
          <FAQSection faqs={DONATE_FAQS} title="Donation FAQs" className="mt-16" />
        </Container>
      </div>
    </div>
  );
}
