import type { Metadata } from "next";
import { sanityFetch, CACHE_TAGS } from "@/lib/sanity-fetch";
import type { SanityHistoryPage } from "@/lib/sanity-types";
import { SITE_CONFIG } from "@/utils/seo";
import { getHistoryPageQuery } from "@chimborazo/sanity-config/queries";
import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import { PortableText } from "@/components/PortableText/portable-text";

export const metadata: Metadata = {
  title: "History of Chimborazo Park",
  description:
    "Explore the rich and complex history of Chimborazo Park, from its role as a Civil War hospital to the emancipated community that called it home during Reconstruction.",
  alternates: { canonical: `${SITE_CONFIG.url}/history` },
  openGraph: {
    title: "History of Chimborazo Park",
    description:
      "Explore the rich and complex history of Chimborazo Park, from its role as a Civil War hospital to the emancipated community that called it home during Reconstruction.",
    type: "website",
    url: `${SITE_CONFIG.url}/history`,
  },
};

export default async function HistoryPage() {
  const pageData = await sanityFetch<SanityHistoryPage | null>({
    query: getHistoryPageQuery,
    tags: [CACHE_TAGS.HISTORY],
  });

  const heroData = pageData?.pageHero?.image
    ? {
        title: pageData.pageHero.title,
        subtitle: pageData.pageHero.description,
        sanityImage: pageData.pageHero.image,
      }
    : {
        title: "History of Chimborazo Park",
        subtitle:
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
