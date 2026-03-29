import { getSurveyResultsPageQuery } from "@chimborazo/sanity-config/queries"
import type { Metadata } from "next"
import Container from "@/components/Container/container"
import PageHeroOptimistic from "@/components/PageHero/page-hero-optimistic"
import { PortableText } from "@/components/PortableText/portable-text"
import { DonutChart, HorizontalBarChart, SplitBar, SurveySection } from "@/components/SurveyCharts"
import { CACHE_TAGS, sanityFetch } from "@/lib/sanity-fetch"
import type { SanitySurveyResultsPage } from "@/lib/sanity-types"
import { SITE_CONFIG } from "@/utils/seo"
import {
  Q1_FREQUENCY,
  Q2_USAGE,
  Q3_INVEST,
  Q4_EVENT_LEVEL,
  Q5_EVENT_TYPES,
  Q6_SAFETY,
  Q7_AMENITIES,
  Q8_HISTORIC,
  Q9_WALKWAY,
  SURVEY_META,
} from "./survey-data"

export const metadata: Metadata = {
  title: "Community Survey Results",
  description:
    "Results from the Friends of Chimborazo Park community survey. See how park users and neighbors envision the future of Chimborazo Park.",
  alternates: { canonical: `${SITE_CONFIG.url}/2022-park-survey` },
  openGraph: {
    title: "Community Survey Results",
    description:
      "Results from the Friends of Chimborazo Park community survey. See how park users and neighbors envision the future of Chimborazo Park.",
    type: "website",
    url: `${SITE_CONFIG.url}/2022-park-survey`,
  },
}

// OKLCH palette for donut chart segments, ordered from most to least prominent
const DONUT_PALETTE = [
  "oklch(0.47 0.08 149)", // primary-600
  "oklch(0.62 0.07 145)", // primary-400
  "oklch(0.52 0.04 250)", // accent-600
  "oklch(0.68 0.04 250)", // accent-400
  "oklch(0.55 0.01 250)", // grey-500
  "oklch(0.65 0.01 250)", // grey-400
  "oklch(0.75 0.01 250)", // grey-300
]

function assignDonutColors(options: { label: string; percent: number; count: number }[]) {
  return options
    .filter((o) => o.percent > 0)
    .map((opt, i) => ({ ...opt, color: DONUT_PALETTE[i % DONUT_PALETTE.length] }))
}

const dailyWeeklyPercent = Math.round(
  Q1_FREQUENCY.options[0].percent + Q1_FREQUENCY.options[1].percent,
)

export default async function SurveyResultsPage() {
  const { data: pageData } = (await sanityFetch({
    query: getSurveyResultsPageQuery,
    tags: [CACHE_TAGS.SURVEY_RESULTS],
  })) as { data: SanitySurveyResultsPage | null }

  return (
    <div>
      <PageHeroOptimistic
        document={pageData}
        fallback={{
          title: "Community Survey Results",
          subtitle: "What park users and neighbors told us about the future of Chimborazo Park.",
        }}
        height="small"
        priority={true}
      />

      <Container spacing="xl" className="space-y-16 py-16 pb-24 md:space-y-24">
        {/* CMS Introduction */}
        {pageData?.introduction && (
          <article className="mx-auto max-w-3xl">
            <PortableText value={pageData.introduction} />
          </article>
        )}

        {/* Survey overview stats */}
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6" aria-label="Survey overview">
          <StatCard value={`${SURVEY_META.totalRespondents}+`} label="Respondents" />
          <StatCard value={`${SURVEY_META.questionCount}`} label="Questions" />
          <StatCard value={`${dailyWeeklyPercent}%`} label="Visit daily or weekly" />
        </dl>

        <p className="text-center font-body text-sm text-grey-500 dark:text-grey-400">
          Survey conducted in <time dateTime="2022">2022</time> via SurveyMonkey.{" "}
          {SURVEY_META.totalRespondents} respondents.
        </p>

        {/* Section 1: Who Uses the Park */}
        <SurveySection
          id="who-uses-the-park"
          title="Who Uses the Park"
          description="Nearly 9 in 10 respondents visit Chimborazo Park daily or weekly, with walking, dog walks, and sunset watching as the most popular activities."
        >
          <div className="grid gap-12 lg:grid-cols-2">
            <DonutChart
              title={Q1_FREQUENCY.question}
              subtitle={`${Q1_FREQUENCY.respondents} responded`}
              centerLabel={`${Q1_FREQUENCY.respondents}`}
              data={assignDonutColors(Q1_FREQUENCY.options)}
            />
            <HorizontalBarChart
              title={Q2_USAGE.question}
              subtitle={`${Q2_USAGE.respondents} responded \u00b7 Select all that apply`}
              data={Q2_USAGE.options}
            />
          </div>
        </SurveySection>

        {/* Section 2: Events & Community */}
        <SurveySection
          id="events-and-community"
          title="Events & Community"
          description="The community prefers moderate, neighborhood-scale events. Farmer's markets, movies in the park, and music festivals top the wish list."
        >
          <div className="grid gap-12 lg:grid-cols-2">
            <DonutChart
              title={Q4_EVENT_LEVEL.question}
              subtitle={`${Q4_EVENT_LEVEL.respondents} responded`}
              centerLabel={`${Q4_EVENT_LEVEL.respondents}`}
              data={assignDonutColors(Q4_EVENT_LEVEL.options)}
            />
            <HorizontalBarChart
              title={Q5_EVENT_TYPES.question}
              subtitle={`${Q5_EVENT_TYPES.respondents} responded \u00b7 Select all that apply`}
              data={Q5_EVENT_TYPES.options}
            />
          </div>
        </SurveySection>

        {/* Section 3: Investing in the Park */}
        <SurveySection
          id="investing-in-the-park"
          title="Investing in the Park"
          description="Trail quality, sidewalks, and gardens are the top priorities for existing infrastructure. Trail markers, restrooms, and shaded walkways lead the wish list for new amenities."
        >
          <HorizontalBarChart
            title={Q3_INVEST.question}
            subtitle={`${Q3_INVEST.respondents} responded \u00b7 Rank your top 3`}
            data={Q3_INVEST.options}
          />
          <HorizontalBarChart
            title={Q7_AMENITIES.question}
            subtitle={`${Q7_AMENITIES.respondents} responded \u00b7 Select all that apply`}
            data={Q7_AMENITIES.options}
          />
        </SurveySection>

        {/* Section 4: Safety & Accessibility */}
        <SurveySection
          id="safety-and-accessibility"
          title="Safety & Accessibility"
          description="Sidewalk maintenance and crosswalks on East Broad Street are the top safety priorities. An overwhelming majority support ADA-compliant walkway materials."
        >
          <HorizontalBarChart
            title={Q6_SAFETY.question}
            subtitle={`${Q6_SAFETY.respondents} responded \u00b7 Select all that apply`}
            data={Q6_SAFETY.options}
          />
          <SplitBar
            title="Scenic Overlook Walkway Replacement"
            subtitle={`${Q9_WALKWAY.respondents} responded \u00b7 ${Q9_WALKWAY.question}`}
            options={[Q9_WALKWAY.options[0], Q9_WALKWAY.options[1]]}
          />
        </SurveySection>

        {/* Section 5: Historic Restoration */}
        <SurveySection
          id="historic-restoration"
          title="Historic Restoration"
          description="Restoring the cobblestone roads and the central fountain are tied as the community's top long-term restoration priorities."
        >
          <HorizontalBarChart
            title={Q8_HISTORIC.question}
            subtitle={`${Q8_HISTORIC.respondents} responded \u00b7 Select all that apply`}
            data={Q8_HISTORIC.options}
          />
        </SurveySection>
      </Container>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-primary-200 bg-primary-100 px-4 py-5 text-center md:px-6 md:py-7 dark:border-primary-800/70 dark:bg-primary-900/50">
      <dt className="font-display text-3xl text-primary-800 md:text-4xl dark:text-primary-300">
        {value}
      </dt>
      <dd className="mt-1 font-body text-sm font-medium text-primary-800 md:text-base dark:text-primary-300">
        {label}
      </dd>
    </div>
  )
}
