import { projectBySlugQuery, projectSlugsQuery } from "@chimborazo/sanity-config/queries"
import { ArrowLeft, Target } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/Button/button"
import Container from "@/components/Container/container"
import Event from "@/components/Event/event"
import { PortableText } from "@/components/PortableText/portable-text"
import { SanityImage } from "@/components/SanityImage/sanity-image"
import { sanityClient } from "@/lib/sanity"
import { CACHE_TAGS, sanityFetch } from "@/lib/sanity-fetch"
import type { SanityProject } from "@/lib/sanity-types"
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  SITE_CONFIG,
} from "@/utils/seo"
import ProjectHeroOptimistic from "./project-hero-optimistic"
import ProjectSidebarOptimistic from "./project-sidebar-optimistic"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<Array<{ slug: string }>>(projectSlugsQuery)
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: project } = (await sanityFetch({
    query: projectBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.PROJECT_DETAIL, CACHE_TAGS.PROJECTS],
  })) as { data: SanityProject | null }

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    }
  }

  const projectUrl = `${SITE_CONFIG.url}/projects/${project.slug.current}`
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: projectUrl },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: projectUrl,
      images: project.heroImage?.asset?.url
        ? [
            {
              url: project.heroImage.asset.url,
              width: project.heroImage.asset.metadata?.dimensions?.width || 1200,
              height: project.heroImage.asset.metadata?.dimensions?.height || 630,
              alt: project.heroImage.alt || project.title,
            },
          ]
        : undefined,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const { data: project } = (await sanityFetch({
    query: projectBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.PROJECT_DETAIL, CACHE_TAGS.PROJECTS],
  })) as { data: SanityProject | null }

  if (!project) {
    notFound()
  }

  const projectUrl = `${SITE_CONFIG.url}/projects/${project.slug.current}`
  const imageUrl = project.heroImage?.asset?.url

  const articleData = generateArticleStructuredData({
    headline: project.title,
    description: project.description,
    image: imageUrl || `${SITE_CONFIG.url}/bike_sunset.webp`,
    datePublished: project.startDate,
    dateModified: project.completionDate || project.startDate,
  })

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Projects", url: `${SITE_CONFIG.url}/projects` },
    { name: project.title, url: projectUrl },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleData).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <ProjectHeroOptimistic project={project} />

        {/* Back Button */}
        <Container spacing="md" className="pt-8">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-body text-sm font-medium text-primary-700 transition-colors hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Projects</span>
          </Link>
        </Container>

        {/* Main Content */}
        <Container spacing="md" className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Main Content */}
            <main className="lg:col-span-8">
              {/* Project Goal Card */}
              {project.goal && (
                <div className="mb-8 rounded-2xl border border-accent-200 bg-gradient-to-br from-accent-50 to-accent-100/50 p-6 md:p-8 dark:border-accent-700/30 dark:from-accent-900/20 dark:to-accent-800/10">
                  <div className="mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 stroke-accent-600 dark:stroke-accent-400" />
                    <h2 className="font-display text-xl font-semibold text-grey-900 md:text-2xl dark:text-grey-100">
                      Project Goal
                    </h2>
                  </div>
                  <p className="font-body text-base leading-relaxed text-grey-800 md:text-lg dark:text-grey-200">
                    {project.goal}
                  </p>
                </div>
              )}

              {project.body && project.body.length > 0 ? (
                <PortableText value={project.body} />
              ) : (
                <div className="rounded-2xl border border-primary-200 bg-primary-50/30 p-8 md:p-12 dark:border-primary-700/30 dark:bg-primary-900/20">
                  <p className="font-body text-lg leading-relaxed text-grey-700 dark:text-grey-300">
                    Project details coming soon. Check back later for more information about this
                    initiative.
                  </p>
                </div>
              )}

              {/* Project Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="mt-12 space-y-6">
                  <h2 className="font-display text-2xl font-semibold text-grey-900 md:text-3xl dark:text-grey-100">
                    Project Gallery
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {project.gallery.map((image, index) => (
                      <div
                        key={image.asset?.url ?? `gallery-${index}`}
                        className="overflow-hidden rounded-xl"
                      >
                        <SanityImage
                          image={image}
                          alt={image.alt || `${project.title} gallery image ${index + 1}`}
                          className="h-full w-full object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Events */}
              {project.relatedEvents && project.relatedEvents.length > 0 && (
                <div className="mt-12 space-y-6">
                  <h2 className="font-display text-2xl font-semibold text-primary-800 md:text-3xl dark:text-grey-100">
                    Project Events
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    {project.relatedEvents.map((event) => (
                      <Event
                        key={event._id}
                        {...event}
                        imageSizes="(max-width: 768px) 100vw, 768px"
                        imageMaxWidth={1024}
                        imageBreakpoints={[320, 480, 640, 768, 896, 1024]}
                      />
                    ))}
                  </div>
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <ProjectSidebarOptimistic project={project} />

                {/* Call to Action */}
                <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 dark:border-primary-700/30 dark:from-primary-900/20 dark:to-primary-800/10">
                  <h3 className="mb-3 font-display text-lg font-semibold text-grey-900 dark:text-grey-100">
                    Get Involved
                  </h3>
                  <p className="mb-4 font-body text-sm text-grey-700 dark:text-grey-300">
                    Want to help make this project a reality? Learn how you can volunteer or
                    contribute.
                  </p>
                  <Link href="/get-involved">
                    <Button variant="outline" size="small" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </div>
    </>
  )
}
