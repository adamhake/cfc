import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/donate")({
  component: Donate,
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
  return (
    <div>
      <PageHero
        title="Support Us"
        imageSrc="/bike_sunset.webp"
        imageAlt="Chimborazo Park landscape"
        imageWidth={2000}
        imageHeight={1262}
      />
      <div className="px-4 lg:px-0">
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
                grants, and volunteer support to care for this 42-acre historic treasure. Every
                gift—large or small—directly funds park improvements and ensures Chimborazo remains
                beautiful, safe, and accessible for generations to come.
              </p>
            </div>
          </div>

          {/* Donation form */}
          <div
            className="mt-12"
            style={{ position: "relative", minHeight: "600px", width: "100%" }}
          >
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
              }}
              src="https://www.zeffy.com/embed/donation-form/general-donation-125"
              allow="payment"
            ></iframe>
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
