import { allProjectsQuery, getProjectsPageQuery } from "@chimborazo/sanity-config/queries"
import type { Metadata } from "next"
import Container from "@/components/Container/container"
import PageHeroOptimistic from "@/components/PageHero/page-hero-optimistic"
import { PortableText } from "@/components/PortableText/portable-text"
import { CACHE_TAGS, sanityFetch } from "@/lib/sanity-fetch"
import type { SanityProject, SanityProjectsPage } from "@/lib/sanity-types"
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
    sanityFetch({
      query: allProjectsQuery,
      tags: [CACHE_TAGS.PROJECTS_LIST, CACHE_TAGS.PROJECTS],
    }),
    sanityFetch({
      query: getProjectsPageQuery,
      tags: [CACHE_TAGS.PROJECTS_LIST],
    }),
  ])) as [{ data: SanityProject[] }, { data: SanityProjectsPage | null }]

  // Sort projects: active first, then by startDate desc
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.status === "active" && b.status !== "active") return -1
    if (a.status !== "active" && b.status === "active") return 1
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  const itemListData = generateItemListStructuredData(
    sortedProjects.map((project) => ({
      name: project.title,
      url: `${SITE_CONFIG.url}/projects/${project.slug.current}`,
    })),
  )

  return (
    <div className="space-y-24 pb-24">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
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
        height="small"
        priority={true}
      />

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

        <ProjectsListClient projects={sortedProjects} />
      </Container>
    </div>
  )
}
