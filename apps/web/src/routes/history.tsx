import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import { PortableText } from "@/components/PortableText/portable-text";
import { CACHE_TAGS, generateCacheHeaders } from "@/lib/cache-headers";
import { getIsPreviewMode } from "@/lib/preview";
import { CACHE_PRESETS } from "@/lib/query-config";
import { queryKeys } from "@/lib/query-keys";
import { getSanityClient } from "@/lib/sanity";
import type { SanityHistoryPage } from "@/lib/sanity-types";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { getHistoryPageQuery } from "@chimborazo/sanity-config";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

// Query options for history page content - accept preview flag for Visual Editing
const historyPageQueryOptions = (preview = false) =>
  queryOptions({
    queryKey: [...queryKeys.historyPage(), { preview }],
    queryFn: async (): Promise<SanityHistoryPage | null> => {
      try {
        return (await getSanityClient(preview).fetch(
          getHistoryPageQuery,
        )) as SanityHistoryPage | null;
      } catch (error) {
        console.warn("Failed to fetch history page from Sanity:", error);
        return null;
      }
    },
    ...CACHE_PRESETS.CURATED_CONTENT,
  });

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  loader: async ({ context }) => {
    // Check if we're in preview mode for Visual Editing
    const preview = await getIsPreviewMode();

    // Prefetch history page content on the server
    await context.queryClient.ensureQueryData(historyPageQueryOptions(preview));
    return { preview };
  },
  headers: ({ loaderData }) => {
    return generateCacheHeaders({
      preset: "CURATED_CONTENT",
      tags: [CACHE_TAGS.HISTORY],
      isPreview: loaderData?.preview ?? false,
    });
  },
  head: () => ({
    meta: generateMetaTags({
      title: "History of Chimborazo Park",
      description:
        "Explore the rich and complex history of Chimborazo Park, from its role as a Civil War hospital to the emancipated community that called it home during Reconstruction.",
      type: "website",
      url: `${SITE_CONFIG.url}/history`,
    }),
    links: generateLinkTags({
      canonical: `${SITE_CONFIG.url}/history`,
    }),
  }),
});

function HistoryPage() {
  const { preview } = Route.useLoaderData();
  const { data: pageData } = useSuspenseQuery(historyPageQueryOptions(preview));

  const heroData = pageData?.pageHero?.image
    ? {
        title: pageData.pageHero.title,
        subtitle: pageData.pageHero.description,
        sanityImage: pageData.pageHero.image,
      }
    : {
        title: "History of Chimborazo Park",
        description:
          "Explore the rich and complex history of Chimborazo Park, from its role as a Civil War hospital to the emancipated community that called it home during Reconstruction.",
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
