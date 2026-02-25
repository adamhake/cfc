import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import { PortableText } from "@/components/PortableText/portable-text";
import { getIsPreviewMode } from "@/lib/preview";
import { queryKeys } from "@/lib/query-keys";
import { getSanityClient } from "@/lib/sanity";
import type { SanityAboutPage } from "@/lib/sanity-types";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { getAboutPageQuery } from "@chimborazo/sanity-config";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

// Query options for about page content - accept preview flag for Visual Editing
const aboutPageQueryOptions = (preview = false) =>
  queryOptions({
    queryKey: [...queryKeys.aboutPage(), { preview }],
    queryFn: async (): Promise<SanityAboutPage | null> => {
      try {
        return (await getSanityClient(preview).fetch(getAboutPageQuery)) as SanityAboutPage | null;
      } catch (error) {
        console.warn("Failed to fetch about page from Sanity:", error);
        return null;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

export const Route = createFileRoute("/about")({
  component: AboutPage,
  loader: async ({ context }) => {
    // Check if we're in preview mode for Visual Editing
    const preview = await getIsPreviewMode();

    // Prefetch about page content on the server
    await context.queryClient.ensureQueryData(aboutPageQueryOptions(preview));
    return { preview };
  },
  head: () => ({
    meta: generateMetaTags({
      title: "About the Chimborazo Park Conservancy",
      description:
        "Explore the rich and complex history of Chimborazo Park, from its role as a Civil War hospital to the emancipated community that called it home during Reconstruction.",
      type: "website",
      url: `${SITE_CONFIG.url}/about`,
    }),
    links: generateLinkTags({
      canonical: `${SITE_CONFIG.url}/about`,
    }),
  }),
});

function AboutPage() {
  const { preview } = Route.useLoaderData();
  const { data: pageData } = useSuspenseQuery(aboutPageQueryOptions(preview));

  const heroData = pageData?.pageHero?.image
    ? {
        title: pageData.pageHero.title,
        subtitle: pageData.pageHero.description,
        sanityImage: pageData.pageHero.image,
      }
    : {
        title: "About the Chimborazo Park Conservancy",
        subtitle:
          "Learn about the mission, history, and vision of the Chimborazo Park Conservancy, dedicated to preserving and celebrating the rich history of Chimborazo Park.",
      };
  return (
    <div>
      <PageHero {...heroData} height="small" />

      <Container spacing="xl" className="py-16 pb-24">
        <article className="mx-auto max-w-3xl">
          <PortableText value={pageData?.content || []} />
        </article>
      </Container>
    </div>
  );
}
