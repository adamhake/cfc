import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import { PortableText } from "@/components/PortableText/portable-text";
import Project from "@/components/Project/project";
import { queryKeys } from "@/lib/query-keys";
import { sanityClient } from "@/lib/sanity";
import type { SanityProject, SanityProjectsPage } from "@/lib/sanity-types";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { allProjectsQuery, getProjectsPageQuery } from "@chimborazo/sanity-config";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

// Query options for TanStack Query
const projectsQueryOptions = queryOptions({
  queryKey: queryKeys.projects.all(),
  queryFn: async (): Promise<SanityProject[]> => {
    try {
      return await sanityClient.fetch(allProjectsQuery);
    } catch (error) {
      console.warn("Failed to fetch projects from Sanity:", error);
      return [];
    }
  },
  // Projects list changes occasionally - cache for 5 minutes
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 15 * 60 * 1000, // 15 minutes
});

const projectsPageQueryOptions = queryOptions({
  queryKey: queryKeys.projectsPage(),
  queryFn: async (): Promise<SanityProjectsPage | null> => {
    try {
      return await sanityClient.fetch(getProjectsPageQuery);
    } catch (error) {
      console.warn("Failed to fetch projects page from Sanity:", error);
      return null;
    }
  },
  staleTime: 30 * 60 * 1000, // 30 minutes
  gcTime: 60 * 60 * 1000, // 1 hour
});

export const Route = createFileRoute("/projects/")({
  component: Projects,
  loader: async ({ context }) => {
    // Prefetch both projects data and page content on the server
    const [projects, pageData] = await Promise.all([
      context.queryClient.ensureQueryData(projectsQueryOptions),
      context.queryClient.ensureQueryData(projectsPageQueryOptions),
    ]);
    return { projects, pageData };
  },
  head: () => ({
    meta: generateMetaTags({
      title: "Projects",
      description:
        "Explore the Chimborazo Park Conservancy's ongoing and completed initiatives to restore, preserve, and enhance our historic park for the community.",
      type: "website",
      url: `${SITE_CONFIG.url}/projects`,
      image: {
        url: `${SITE_CONFIG.url}/volunteers.webp`,
        width: 2000,
        height: 1333,
        alt: "Projects at Chimborazo Park",
      },
    }),
    links: generateLinkTags({
      canonical: `${SITE_CONFIG.url}/projects`,
    }),
  }),
});

function Projects() {
  const { projects, pageData } = Route.useLoaderData();

  // Prepare hero data from Sanity or use fallbacks
  const heroData = pageData?.pageHero?.image?.image
    ? {
        title: pageData.pageHero.title,
        subtitle: pageData.pageHero.description,
        sanityImage: pageData.pageHero.image.image,
      }
    : {
        title: "Projects",
        subtitle: "Transforming Chimborazo Park through community-driven initiatives",
        imageSrc: "/volunteers.webp",
        imageAlt: "Projects at Chimborazo Park",
        imageWidth: 2000,
        imageHeight: 1333,
      };

  // Sort projects: active first, then by startDate desc
  const sortedProjects = [...projects].sort((a, b) => {
    // Active projects come first
    if (a.status === "active" && b.status !== "active") return -1;
    if (a.status !== "active" && b.status === "active") return 1;

    // Then sort by startDate (most recent first)
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div className="space-y-24 pb-24">
      <PageHero {...heroData} height="large" priority={true} />

      <Container spacing="md" className="px-4 md:px-0">
        {pageData?.introduction && pageData.introduction.length > 0 ? (
          <div className="mx-auto max-w-3xl text-center">
            <PortableText value={pageData.introduction} />
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="font-body text-xl leading-relaxed text-grey-800 md:text-2xl dark:text-grey-200">
              From trail restoration to monument preservation, our projects bring together
              volunteers, partners, and city resources to create lasting improvements for everyone
              who enjoys Chimborazo Park.
            </p>
            <p className="font-body text-base text-grey-700 md:text-lg dark:text-grey-300">
              Each initiative reflects our commitment to restoration, recreation, community
              connection, and historical preservation. Learn more about our current and completed
              projects below.
            </p>
          </div>
        )}

        {sortedProjects.length > 0 ? (
          <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
            {sortedProjects.map((project) => (
              <Project key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center">
            <p className="font-body text-lg text-grey-700 dark:text-grey-300">
              No projects available at this time. Check back soon for updates on our ongoing
              initiatives!
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
