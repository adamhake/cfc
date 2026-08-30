import { allProjectsQuery, getProjectsPageQuery } from "@chimborazo/sanity-config/queries"
import type { Metadata } from "next"
import Container from "@/components/Container/container"
import PageHeroOptimistic from "@/components/PageHero/page-hero-optimistic"
import { PageIntroduction } from "@/components/PageIntroduction/page-introduction"
import { CACHE_TAGS, cachedSanityFetch, getDynamicFetchOptions } from "@/lib/sanity-fetch"
import type { SanityProject, SanityProjectsPage } from "@/lib/sanity-types"
import { sortProjects } from "@/lib/sort-helpers"
import { generateItemListStructuredData, SITE_CONFIG } from "@/utils/seo"
import ProjectsListClient from "./projects-list-client"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore ongoing and completed initiatives to restore, preserve, and enhance Chimborazo Park in Richmond, VA for the Church Hill community.",
  alternates: { canonical: `${SITE_CONFIG.url}/projects` },
  openGraph: {
    title: "Projects",
    description:
      "Explore ongoing and completed initiatives to restore, preserve, and enhance Chimborazo Park in Richmond, VA for the Church Hill community.",
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
}

export default async function ProjectsPage() {
  const [{ data: projects }, { data: pageData }] = (await Promise.all([
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: allProjectsQuery,
      tags: [CACHE_TAGS.PROJECTS_LIST, CACHE_TAGS.PROJECTS],
    }),
    cachedSanityFetch({
      ...(await getDynamicFetchOptions()),
      query: getProjectsPageQuery,
      tags: [CACHE_TAGS.PROJECTS_LIST],
    }),
  ])) as [{ data: SanityProject[] }, { data: SanityProjectsPage | null }]

  // Active first, then by startDate desc. Client re-sorts after optimistic updates.
  const sortedProjects = sortProjects(projects)

  const itemListData = generateItemListStructuredData(
    sortedProjects.map((project) => ({
      name: project.title ?? "",
      url: `${SITE_CONFIG.url}/projects/${project.slug?.current ?? ""}`,
    })),
  )

  return (
    <div className="space-y-14 pb-16 md:space-y-20 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListData).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <PageHeroOptimistic
        document={pageData}
        fallback={{
          title: "Projects",
          subtitle: "Transforming Chimborazo Park through community-driven initiatives",
          imageSrc: "/volunteers.webp",
          imageAlt: "Projects at Chimborazo Park",
          imageWidth: 2000,
          imageHeight: 1333,
        }}
        variant="section"
        priority={true}
      />

      <Container spacing="md">
        <PageIntroduction
          content={pageData?.introduction}
          fallback={[
            "From trail restoration to monument preservation, our projects bring together volunteers, partners, and city resources to create lasting improvements for everyone who enjoys Chimborazo Park.",
            "Each initiative reflects our commitment to restoration, recreation, community connection, and historical preservation. Learn more about our current and completed projects below.",
          ]}
        />

        <ProjectsListClient projects={sortedProjects} />
      </Container>
    </div>
  )
}
