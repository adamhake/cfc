import { Button } from "@/components/Button/button";
import Container from "@/components/Container/container";
import SectionHeader from "@/components/SectionHeader/section-header";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  const quickLinks = [
    {
      title: "Events",
      description: "Join us for park clean-ups, tree plantings, and community gatherings",
      href: "/events",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Get Involved",
      description: "Volunteer, donate, or become a member to support the park",
      href: "/#get-involved",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: "Media Gallery",
      description: "Explore photos and videos of the park and our activities",
      href: "/media",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "About the Park",
      description: "Learn about Chimborazo's rich history and our mission",
      href: "/#the-park",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="px-4 pt-24 pb-16 lg:px-0">
      <Container maxWidth="4xl" spacing="lg">
        {/* Hero Section */}
        <div className="space-y-6 text-center">
          <div className="font-display text-8xl font-bold text-primary-700/20 md:text-9xl dark:text-primary-400/20">
            404
          </div>
          <SectionHeader title="Page Not Found" size="large" />
          <p className="mx-auto max-w-2xl text-lg text-grey-700 md:text-xl dark:text-grey-300">
            Sorry, we couldn't find the page you're looking for. The page may have been moved,
            deleted, or doesn't exist.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mt-16">
          <h3 className="mb-6 text-center font-body text-xl font-semibold text-grey-900 dark:text-grey-100">
            Here are some helpful links to get you back on track:
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="group relative overflow-hidden rounded-2xl border-2 border-primary-200 bg-primary-50/50 p-6 transition-all hover:border-primary-400 hover:bg-primary-100/50 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-98 dark:border-primary-800 dark:bg-primary-900/20 dark:hover:border-primary-600 dark:hover:bg-primary-900/40"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-lg bg-primary-200 p-3 text-primary-700 transition-colors group-hover:bg-primary-300 dark:bg-primary-800 dark:text-primary-300 dark:group-hover:bg-primary-700">
                    {link.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 font-display text-lg font-semibold text-primary-800 dark:text-primary-300">
                      {link.title}
                    </h4>
                    <p className="text-sm text-grey-700 dark:text-grey-400">{link.description}</p>
                  </div>
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-primary-600 transition-transform group-hover:translate-x-1 dark:text-primary-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="accent" as="a" href="/">
            <svg
              className="mr-2 inline-block h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Return Home
          </Button>
          <Button
            variant="outline"
            as="a"
            onClick={() => {
              window.history.back();
            }}
          >
            <svg
              className="mr-2 inline-block h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </Button>
        </div>
      </Container>
    </div>
  );
}
