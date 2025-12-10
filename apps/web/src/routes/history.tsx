import { Button } from "@/components/Button/button";
import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import SectionHeader from "@/components/SectionHeader/section-header";
import { queryKeys } from "@/lib/query-keys";
import { sanityClient } from "@/lib/sanity";
import { SanityHistoryPage } from "@/lib/sanity-types";
import { generateLinkTags, generateMetaTags, SITE_CONFIG } from "@/utils/seo";
import { getHistoryPageQuery } from "@chimborazo/sanity-config";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const historyPageQueryOptions = queryOptions({
  queryKey: queryKeys.historyPage(),
  queryFn: async (): Promise<SanityHistoryPage | null> => {
    try {
      return await sanityClient.fetch(getHistoryPageQuery);
    } catch (error) {
      console.warn("Failed to fetch donate page from Sanity:", error);
      return null;
    }
  },
  staleTime: 30 * 60 * 1000, // 30 minutes
  gcTime: 60 * 60 * 1000, // 1 hour
});

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  loader: async ({ context }) => {
    // Prefetch both events data and page content on the server
    const pageData = await context.queryClient.ensureQueryData(historyPageQueryOptions);
    return { pageData };
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
  const { pageData } = Route.useLoaderData();

  const heroData = pageData?.pageHero?.image?.image
    ? {
        title: pageData.pageHero.title,
        subtitle: pageData.pageHero.description,
        sanityImage: pageData.pageHero.image.image,
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
          {/* Introduction */}
          <section className="space-y-6">
            <p className="font-body text-lg leading-relaxed text-grey-800 md:text-xl dark:text-grey-200">
              The recently installed "Emancipated Community at Chimborazo Hill" state historical
              marker at Chimborazo Park commemorates the history of African American residents who
              lived on the site from 1865 until 1877. The Chimborazo Hill site was initially
              established by the Union Army in 1865 then run by the Freedmen's Bureau for several
              years, who used the former Confederate hospital buildings. The community lived on site
              from 1865, after being freed from slavery, until 1877, when the city of Richmond
              displaced the residents to create a park. The marker proposal was submitted to the
              Virginia Department of Historic Resources (DHR) by the 1708 Gallery and based on
              Professor Sandy Williams IV's research and 2022 solo exhibition "Promising the Sky,"
              in collaboration with Emily Smith, Ryan Doherty, and Park Myers. Professor Williams
              applied for a marker to the Virginia Department of Historic Resources as a final
              component of the exhibition, which was approved and unveiled on April 20th, 2024 at
              Chimborazo Park.
            </p>

            <p className="font-body text-grey-700 md:text-lg dark:text-grey-300">
              Chimborazo Hill is often remembered as the former site of a Confederate Hospital, but
              the new marker reminds us that the period after the Civil War, the Reconstruction era,
              was also an important chapter in its history. Most importantly, the marker is one of
              the first physical reminders that sheds light on previously obscured African American
              histories at Chimborazo Hill. But this marker is only the beginning; many more stories
              can be researched and told to more deeply understand Chimborazo Hill's complex pasts.
              This article provides some of those stories while also expanding on facts included on
              the marker's main text.
            </p>
          </section>

          {/* The End of the Civil War */}
          <section className="mt-16 space-y-6">
            <SectionHeader title="The End of the Civil War" size="large" />

            <p className="font-body text-grey-700 md:text-lg dark:text-grey-300">
              The city of Richmond was decimated at the end of the Civil War. Nearing defeat,
              Confederate President Jefferson Davis and his cabinet evacuated the city, and ordered
              leaders to set fire to supply warehouses and bridges before evacuating, burning key
              districts including downtown. On April 3rd of 1865, Union troops took possession of
              Richmond, including the abandoned Confederate hospital buildings at Chimborazo Hill
              which were saved from the fires. Many civilians lost loved ones, homes, and work,
              especially African Americans who were newly emancipated citizens. During this time,
              the federal government created the Freedmen's Bureau of Refugees, Freedmen, and
              Abandoned Lands and established stations throughout the South to help all war refugees
              and provide relief in terms of clothing, shelter, transportation, work, and food. The
              Freedmen's Bureau established several offices in Richmond. One was established at
              Chimborazo Hill, to issue rations and train tickets as well as provide provisions,
              shelter, and meet basic needs of many displaced white and African American refugees.
              By July 1865, the abandoned hospital buildings at Chimborazo Hill were home to more
              than 2,500 people, mostly newly emancipated African Americans.
            </p>
          </section>

          {/* Education */}
          <section className="mt-16 space-y-6">
            <SectionHeader title="Education at Chimborazo Hill" size="large" />

            <p className="font-body text-grey-700 md:text-lg dark:text-grey-300">
              The Freedmen's Bureau prioritized helping freed people receive an education, and they
              created a school at Chimborazo Hill with teachers from the American Missionary
              Association (AMA). By 1866, this school was one of ninety Freedmen's Bureau schools in
              Virginia and one of three in Richmond. The number and ages of students at Chimborazo
              School fluctuated over time, but one teacher's register in 1868 reveals 59 students
              attended class regularly, their ages ranging from 4 to 26 years old. The right to
              literacy was previously illegal for enslaved people, as Virginia and other Southern
              states passed laws prohibiting enslaved literacy after a slave revolt led by Nat
              Turner in 1831. At Chimborazo Hill, freed people sought to exercise their new right to
              read and write and began to build their new lives as freed people.
            </p>
          </section>

          {/* Community Life & Challenges */}
          <section className="mt-16 space-y-6">
            <SectionHeader title="Community Life & Challenges" size="large" />

            <p className="font-body text-grey-700 md:text-lg dark:text-grey-300">
              Chimborazo Hill's African American community also faced violent harassment from white
              Richmonders during this time. Unfortunately, these racial conflicts occurred regularly
              throughout the South during the postwar era. In Richmond, local white citizens strived
              to maintain social and political power even as African Americans organized politically
              across the city and state. One particularly violent episode that resulted in a
              gunfight and multiple arrests at Chimborazo Hill on March 3rd, 1866 caused the
              Freedmen's Bureau to order all "able-bodied" residents to evacuate the area by April
              1st. The few hundred people who remained on site were still prone to white violence,
              as another attack occurred on July 1st, 1866.
            </p>

            <p className="font-body text-grey-700 md:text-lg dark:text-grey-300">
              Despite these threats, African Americans still gathered at Chimborazo Hill for school,
              religious worship, and political meetings until 1877. African American members of
              Fourth Baptist Church, today located in Church Hill at 28th and P Street, worshiped
              together at Chimborazo Hill and conducted baptisms, likely in a spring located near
              the Richmond and York River railroad. At one "religious revival" in 1878, over 1,500
              people celebrated for two days at Chimborazo Hill. Fourth Baptist served as a vital
              institution to the larger African American community and periodically hosted political
              meetings on site. However, the presence of this vibrant Black community led white
              Richmonders to complain vocally and regularly to local authorities about Chimborazo's
              freed community and sign petitions for the creation of a public park at Chimborazo
              Hill. They argued that a park would improve the area and increase surrounding property
              values. The city council approved this plan in 1874, and by 1877, despite protests
              from the freed community, the remaining Chimborazo residents were forced to move out.
            </p>
          </section>

          {/* The Public Park */}
          <section className="mt-16 space-y-6">
            <SectionHeader title="The Public Park" size="large" />

            <p className="font-body text-grey-700 md:text-lg dark:text-grey-300">
              The city opened Chimborazo Park by the 1880s and it was mostly used by white
              residents, as an 1859 law that barred African Americans from using public squares
              applied to Richmond's public spaces until the Civil Rights Act of 1964. But several
              sources like the <em>Richmond Planet</em> provide evidence that African Americans
              enjoyed the park at times despite legal segregation. Given Chimborazo Hill's high
              elevation, in 1906, the federal government purchased five acres of the park to
              construct a U.S. Weather Bureau station for collecting and reporting meteorological
              data. In 1959, during a period of national resurgence of white Confederate memory, a
              local constituency argued to convert the building as a visitor center for the National
              Park Service's Richmond National Battlefield Park (RNBP), which was later renamed the
              Chimborazo Confederate Medical Museum. This can be understood as part of a larger
              backlash to the Supreme Court's <em>Brown V. Board of Education</em> (1954) decision
              to desegregate schools, coined as "massive resistance" by vocal and local
              segregationists such as Senator Harry F. Byrd., former Virginia governor.
            </p>
          </section>

          {/* Looking Forward */}
          <section className="mt-16 space-y-6">
            <SectionHeader title="Looking Forward" size="large" />

            <p className="font-body text-grey-700 md:text-lg dark:text-grey-300">
              The DHR marker is an important first step, issuing a call for more research to recover
              more stories about the complex histories of Chimborazo Hill. Many questions remain,
              especially how many buildings the freed community lived in and what everyday life was
              like at Chimborazo Hill during Reconstruction. To help answer these questions, The
              Chimborazo Park Conservancy is exploring an archaeological study which could help
              locate former buildings and reveal how people lived on site differently over time. The
              Conservancy is also hoping to plan a community dedication ceremony for the marker in
              the future. Local members of the Church Hill community, especially longtime residents,
              can help by sharing memories or family photographs about Chimborazo Park, supporting
              the Conservancy, and representing their local church or school's history. We all have
              the power to help tell the "untold" histories of Chimborazo Hill, and this work is
              just the beginning.
            </p>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button as="a" variant="accent" href="/get-involved">
                Get Involved
              </Button>
              <Button as="a" variant="outline" href="mailto:info@chimborazopark.org">
                Share Your Story
              </Button>
            </div>
          </section>

          {/* Attribution */}
          <section className="mt-16 border-t border-grey-200 pt-8 dark:border-grey-700">
            <p className="font-body text-sm text-grey-600 italic dark:text-grey-400">
              This post was authored by Laura Brannan Fretwell, a PhD candidate in the History
              Department at George Mason University, and resident historian of the Chimborazo Park
              Conservancy. Her dissertation research is about the "buried" histories and memory of
              Chimborazo Park over time. If you are interested in speaking with her about this
              history, or know anyone else who is interested, please reach out to her at{" "}
              <a
                href="mailto:lfretwell@fau.edu"
                className="text-primary-700 underline decoration-primary-300 underline-offset-2 hover:text-primary-600 hover:decoration-primary-500 dark:text-primary-400 dark:decoration-primary-600"
              >
                lfretwell@fau.edu
              </a>
              .
            </p>
            <p className="mt-4 font-body text-sm text-grey-600 italic dark:text-grey-400">
              All sources cited are at the discretion of Fretwell and Chimborazo Park Conservancy.
              Please contact them for any questions about citations and/or facts.
            </p>
          </section>
        </article>
      </Container>
    </div>
  );
}
