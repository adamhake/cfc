import { Button } from "@/components/Button/button";
import Chip from "@/components/Chip/chip";
import Container from "@/components/Container/container";
import Event from "@/components/Event/event";
import PageHero from "@/components/PageHero/page-hero";
import { PortableText } from "@/components/PortableText/portable-text";
import { SanityImage } from "@/components/SanityImage/sanity-image";
import { CACHE_TAGS, generateCacheHeaders } from "@/lib/cache-headers";
import { getIsPreviewMode } from "@/lib/preview";
import { queryKeys } from "@/lib/query-keys";
import { getSanityClient } from "@/lib/sanity";
import type { SanityProject } from "@/lib/sanity-types";
import { JsonLd } from "@/components/JsonLd/json-ld";
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  generateLinkTags,
  generateMetaTags,
  SITE_CONFIG,
} from "@/utils/seo";
import { formatDateString } from "@/utils/time";
import { projectBySlugQuery } from "@chimborazo/sanity-config";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, CheckCircle2, DollarSign, MapPin, Target } from "lucide-react";

// Query options for fetching project by slug with caching - accept preview flag for Visual Editing
const projectBySlugQueryOptions = (slug: string, preview = false) =>
  queryOptions({
    queryKey: [...queryKeys.projects.detail(slug), { preview }],
    queryFn: async () => {
      const project: SanityProject | null = await getSanityClient(preview).fetch(
        projectBySlugQuery,
        { slug },
      );

      if (!project) {
        throw notFound();
      }

      return project;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectPage,
  loader: async ({ params, context }) => {
    // Check if we're in preview mode for Visual Editing
    const preview = await getIsPreviewMode();

    // Prefetch query data; extract only primitives for head()/headers()
    // to avoid PortableTextBlock type incompatibility with router inference
    const project = await context.queryClient.ensureQueryData(
      projectBySlugQueryOptions(params.slug, preview),
    );
    return {
      preview,
      projectTitle: project.title,
      projectDescription: project.description,
      projectSlug: project.slug.current,
      projectImageUrl: project.heroImage?.asset?.url,
      projectImageWidth: project.heroImage?.asset?.metadata?.dimensions?.width,
      projectImageHeight: project.heroImage?.asset?.metadata?.dimensions?.height,
      projectImageAlt: project.heroImage?.alt,
    };
  },
  headers: ({ loaderData }) => {
    return generateCacheHeaders({
      preset: "PROJECT_CONTENT",
      tags: [CACHE_TAGS.PROJECT_DETAIL, CACHE_TAGS.PROJECTS],
      isPreview: loaderData?.preview ?? false,
    });
  },
  head: ({ loaderData }) => {
    if (!loaderData?.projectTitle) {
      return {
        meta: generateMetaTags({
          title: "Project Not Found",
          description: "The requested project could not be found.",
        }),
      };
    }

    const projectUrl = `${SITE_CONFIG.url}/projects/${loaderData.projectSlug}`;

    return {
      meta: generateMetaTags({
        title: loaderData.projectTitle,
        description: loaderData.projectDescription,
        type: "article",
        url: projectUrl,
        image: loaderData.projectImageUrl
          ? {
              url: loaderData.projectImageUrl,
              width: loaderData.projectImageWidth || 1200,
              height: loaderData.projectImageHeight || 630,
              alt: loaderData.projectImageAlt || loaderData.projectTitle,
            }
          : undefined,
      }),
      links: generateLinkTags({
        canonical: projectUrl,
      }),
    };
  },
});

const categoryLabels = {
  restoration: "Restoration",
  recreation: "Recreation",
  connection: "Connection",
  preservation: "Preservation",
} as const;

function ProjectPage() {
  const { slug } = Route.useParams();
  const { preview } = Route.useLoaderData();
  const { data: project } = useSuspenseQuery(projectBySlugQueryOptions(slug, preview));

  // Use override text if provided, otherwise format the date
  const fmtStartDate = project.startDateOverride || formatDateString(project.startDate);
  const fmtCompletionDate = project.completionDateOverride
    ? project.completionDateOverride
    : project.completionDate
      ? formatDateString(project.completionDate)
      : null;

  const projectUrl = `${SITE_CONFIG.url}/projects/${project.slug.current}`;
  const imageUrl = project.heroImage?.asset?.url;

  const articleData = generateArticleStructuredData({
    headline: project.title,
    description: project.description,
    image: imageUrl || `${SITE_CONFIG.url}/bike_sunset.webp`,
    datePublished: project.startDate,
    dateModified: project.completionDate || project.startDate,
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Projects", url: `${SITE_CONFIG.url}/projects` },
    { name: project.title, url: projectUrl },
  ]);

  return (
    <>
      <JsonLd data={articleData} />
      <JsonLd data={breadcrumbData} />
      <div className="min-h-screen">
        {/* Hero Section */}
        <PageHero
          title={project.title}
          subtitle={project.description}
          sanityImage={project.heroImage}
          height="auto"
          priority={true}
          alignment="bottom-mobile-center-desktop"
          titleSize="large"
        >
          <div className="mb-6 lg:mt-16">
            <Chip variant={project.status} className="px-4 py-2" />
          </div>
        </PageHero>

        {/* Back Button */}
        <Container spacing="md" className="pt-8">
          <Link
            to="/projects"
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
                      <div key={index} className="overflow-hidden rounded-xl">
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
                      <Event key={event._id} {...event} />
                    ))}
                  </div>
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Project Details Card */}
                <div className="overflow-hidden rounded-2xl border border-accent-200 bg-white shadow-sm dark:border-accent-700/30 dark:bg-primary-950">
                  <div className="bg-gradient-to-br from-accent-50 to-accent-100/50 px-6 py-5 dark:from-primary-900/30 dark:to-primary-800/20">
                    <h2 className="font-display text-xl font-semibold text-grey-900 md:text-2xl dark:text-grey-100">
                      Project Details
                    </h2>
                  </div>
                  <div className="space-y-6 p-6">
                    <div className="space-y-4">
                      {/* Start Date */}
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
                        <div>
                          <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                            Started
                          </div>
                          <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                            {fmtStartDate}
                          </div>
                        </div>
                      </div>

                      {/* Completion Date */}
                      {fmtCompletionDate && (
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
                          <div>
                            <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                              Completed
                            </div>
                            <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                              {fmtCompletionDate}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Category */}
                      {project.category && (
                        <div className="flex items-start gap-3">
                          <Target className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
                          <div>
                            <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                              Category
                            </div>
                            <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                              {categoryLabels[project.category]}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Location */}
                      {project.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
                          <div>
                            <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                              Location
                            </div>
                            <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                              {project.location}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Budget */}
                      {project.budget && (
                        <div className="flex items-start gap-3">
                          <DollarSign className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
                          <div>
                            <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                              Budget
                            </div>
                            <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                              {project.budget}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/*{project.status === "active" && (
                      <div className="border-t border-accent-200 pt-6 dark:border-accent-700/30">
                        <Button variant="accent" size="standard" className="w-full">
                          Support This Project
                        </Button>
                      </div>
                    )}*/}
                  </div>
                </div>

                {/* Call to Action */}
                <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 dark:border-primary-700/30 dark:from-primary-900/20 dark:to-primary-800/10">
                  <h3 className="mb-3 font-display text-lg font-semibold text-grey-900 dark:text-grey-100">
                    Get Involved
                  </h3>
                  <p className="mb-4 font-body text-sm text-grey-700 dark:text-grey-300">
                    Want to help make this project a reality? Learn how you can volunteer or
                    contribute.
                  </p>
                  <Link to="/get-involved">
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
  );
}
