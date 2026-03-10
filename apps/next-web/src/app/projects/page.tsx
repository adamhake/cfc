import type { Metadata } from "next";
import { sanityFetch, CACHE_TAGS } from "@/lib/sanity-fetch";
import type { SanityProject, SanityProjectsPage } from "@/lib/sanity-types";
import { SITE_CONFIG } from "@/utils/seo";
import { allProjectsQuery, getProjectsPageQuery } from "@chimborazo/sanity-config/queries";
import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import { PortableText } from "@/components/PortableText/portable-text";
import Project from "@/components/Project/project";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore the Chimborazo Park Conservancy's ongoing and completed initiatives to restore, preserve, and enhance our historic park for the community.",
  alternates: { canonical: `${SITE_CONFIG.url}/projects` },
  openGraph: {
    title: "Projects",
    description:
      "Explore the Chimborazo Park Conservancy's ongoing and completed initiatives to restore, preserve, and enhance our historic park for the community.",
    type: "website",
    url: `${SITE_CONFIG.url}/projects`,
    images: [
      {
        url: `${SITE_CONFIG.url}/volunteers.webp`,
        width: 2000,
        height: 1333,
        alt: "Projects at Chimborazo Park",
      },
    ],
  },
};

export default async function ProjectsPage() {
  const [projects, pageData] = await Promise.all([
    sanityFetch<SanityProject[]>({
      query: allProjectsQuery,
      tags: [CACHE_TAGS.PROJECTS_LIST, CACHE_TAGS.PROJECTS],
    }),
    sanityFetch<SanityProjectsPage | null>({
      query: getProjectsPageQuery,
      tags: [CACHE_TAGS.PROJECTS_LIST],
    }),
  ]);

  // Prepare hero data from Sanity or use fallbacks
  const heroData = pageData?.pageHero?.image
    ? {
        title: pageData.pageHero.title,
        subtitle: pageData.pageHero.description,
        sanityImage: pageData.pageHero.image,
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
    if (a.status === "active" && b.status !== "active") return -1;
    if (a.status !== "active" && b.status === "active") return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div className="space-y-24 pb-24">
      <PageHero {...heroData} height="small" priority={true} />

      <Container spacing="md">
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
