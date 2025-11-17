import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicy,
  head: () => ({
    meta: generateMetaTags({
      title: "Privacy Policy",
      description:
        "Our commitment to protecting your privacy and personal information. Learn how we collect, use, and safeguard your data.",
      type: "website",
      url: `${SITE_CONFIG.url}/privacy-policy`,
      noIndex: true, // Don't index legal pages
    }),
    links: generateLinkTags({
      canonical: `${SITE_CONFIG.url}/privacy-policy`,
    }),
  }),
});

function PrivacyPolicy() {
  return (
    <div>
      <PageHero
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information"
        imageSrc="/bike_sunset.webp"
        imageAlt="Chimborazo Park landscape"
        imageWidth={2000}
        imageHeight={1262}
      />
      <Container className="px-4 py-16 md:py-24">
        <div className="prose-grey prose max-w-4xl dark:prose-invert">
          <p className="font-body text-grey-700 dark:text-grey-300">
            <strong>Effective Date:</strong>{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="font-display text-2xl text-primary-800 md:text-3xl dark:text-primary-400">
                Introduction
              </h2>
              <p className="mt-4 font-body text-grey-700 dark:text-grey-300">
                Friends of Chimborazo Park ("we," "us," or "our") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website or interact with our organization.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary-800 md:text-3xl dark:text-primary-400">
                Information We Collect
              </h2>
              <h3 className="mt-4 font-display text-xl text-primary-700 dark:text-primary-400">
                Personal Information
              </h3>
              <p className="mt-2 font-body text-grey-700 dark:text-grey-300">
                We may collect personally identifiable information that you voluntarily provide to
                us when you:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 font-body text-grey-700 dark:text-grey-300">
                <li>Make a donation</li>
                <li>Sign up for our newsletter or email updates</li>
                <li>Register for events or volunteer opportunities</li>
                <li>Contact us through our website</li>
                <li>Participate in surveys or feedback forms</li>
              </ul>
              <p className="mt-2 font-body text-grey-700 dark:text-grey-300">
                This information may include your name, email address, mailing address, phone
                number, and payment information.
              </p>

              <h3 className="mt-4 font-display text-xl text-primary-700 dark:text-primary-400">
                Automatically Collected Information
              </h3>
              <p className="mt-2 font-body text-grey-700 dark:text-grey-300">
                When you visit our website, we may automatically collect certain information about
                your device and browsing activity, including:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 font-body text-grey-700 dark:text-grey-300">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Date and time of visits</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary-800 md:text-3xl dark:text-primary-400">
                How We Use Your Information
              </h2>
              <p className="mt-4 font-body text-grey-700 dark:text-grey-300">
                We use the information we collect to:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 font-body text-grey-700 dark:text-grey-300">
                <li>Process donations and maintain donor records</li>
                <li>Send newsletters, event announcements, and updates about park activities</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Manage volunteer registrations and event participation</li>
                <li>Improve our website and online services</li>
                <li>Comply with legal obligations and protect our rights</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary-800 md:text-3xl dark:text-primary-400">
                Sharing Your Information
              </h2>
              <p className="mt-4 font-body text-grey-700 dark:text-grey-300">
                We do not sell, trade, or rent your personal information to third parties. We may
                share your information only in the following circumstances:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 font-body text-grey-700 dark:text-grey-300">
                <li>
                  <strong>Service Providers:</strong> We may share information with trusted
                  third-party service providers who assist us in operating our website, processing
                  donations (such as payment processors), or conducting our activities, provided
                  they agree to keep this information confidential.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your information if required
                  by law or in response to valid requests by public authorities.
                </li>
                <li>
                  <strong>Protection of Rights:</strong> We may disclose information to protect and
                  defend the rights or property of Friends of Chimborazo Park or to protect the
                  safety of our users or the public.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary-800 md:text-3xl dark:text-primary-400">
                Cookies and Tracking Technologies
              </h2>
              <p className="mt-4 font-body text-grey-700 dark:text-grey-300">
                Our website may use cookies and similar tracking technologies to enhance your
                browsing experience. Cookies are small data files stored on your device that help us
                understand how you use our site. You can control cookie settings through your
                browser preferences, though disabling cookies may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary-800 md:text-3xl dark:text-primary-400">
                Third-Party Links
              </h2>
              <p className="mt-4 font-body text-grey-700 dark:text-grey-300">
                Our website may contain links to third-party websites, including social media
                platforms and payment processors. We are not responsible for the privacy practices
                of these external sites. We encourage you to review their privacy policies before
                providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary-800 md:text-3xl dark:text-primary-400">
                Data Security
              </h2>
              <p className="mt-4 font-body text-grey-700 dark:text-grey-300">
                We implement reasonable security measures to protect your personal information from
                unauthorized access, alteration, disclosure, or destruction. However, no method of
                transmission over the internet or electronic storage is completely secure, and we
                cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary-800 md:text-3xl dark:text-primary-400">
                Your Rights and Choices
              </h2>
              <p className="mt-4 font-body text-grey-700 dark:text-grey-300">
                You have the right to:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 font-body text-grey-700 dark:text-grey-300">
                <li>
                  <strong>Access and Update:</strong> Request access to or correction of your
                  personal information
                </li>
                <li>
                  <strong>Opt-Out:</strong> Unsubscribe from our email communications at any time by
                  clicking the "unsubscribe" link in our emails
                </li>
                <li>
                  <strong>Delete:</strong> Request deletion of your personal information, subject to
                  legal and operational requirements
                </li>
              </ul>
              <p className="mt-4 font-body text-grey-700 dark:text-grey-300">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary-800 md:text-3xl dark:text-primary-400">
                Children's Privacy
              </h2>
              <p className="mt-4 font-body text-grey-700 dark:text-grey-300">
                Our website is not intended for children under 13 years of age. We do not knowingly
                collect personal information from children under 13. If you believe we have
                collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary-800 md:text-3xl dark:text-primary-400">
                Changes to This Privacy Policy
              </h2>
              <p className="mt-4 font-body text-grey-700 dark:text-grey-300">
                We may update this Privacy Policy from time to time to reflect changes in our
                practices or legal requirements. We will post any changes on this page and update
                the "Effective Date" at the top. We encourage you to review this policy periodically
                to stay informed about how we protect your information.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary-800 md:text-3xl dark:text-primary-400">
                Contact Us
              </h2>
              <p className="mt-4 font-body text-grey-700 dark:text-grey-300">
                If you have any questions, concerns, or requests regarding this Privacy Policy or
                our data practices, please contact us at:
              </p>
              <div className="mt-4 rounded-lg bg-grey-100 p-6 font-body dark:bg-primary-800">
                <p className="font-semibold text-primary-800 dark:text-primary-300">
                  Friends of Chimborazo Park
                </p>
                <p className="mt-2 text-grey-700 dark:text-grey-300">
                  Email:{" "}
                  <a
                    href="mailto:info@chimboparkconservancy.org"
                    className="text-accent-700 transition hover:text-accent-800 dark:text-accent-400 dark:hover:text-accent-300"
                  >
                    info@chimboparkconservancy.org
                  </a>
                </p>
                <p className="mt-1 text-grey-700 dark:text-grey-300">
                  Address: Chimborazo Park, 3215 E. Broad Street, Richmond, VA 23223
                </p>
              </div>
            </section>

            <section className="rounded-lg border-2 border-primary-200 bg-primary-50 p-6 dark:border-primary-700 dark:bg-primary-900">
              <h2 className="font-display text-2xl text-primary-800 md:text-3xl dark:text-primary-400">
                Donations and Payment Processing
              </h2>
              <p className="mt-4 font-body text-grey-700 dark:text-grey-300">
                Donations are processed through Zeffy, a secure third-party payment processor. When
                you make a donation, your payment information is transmitted directly to Zeffy and
                is not stored on our servers. Please review Zeffy's privacy policy for information
                on how they handle your payment data.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
