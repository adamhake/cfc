import { BarChartIcon } from "@sanity/icons/BarChart"
import { defineType } from "sanity"
import { createIntroductionField, createPageHeroField } from "./shared"

export default defineType({
  name: "surveyResultsPage",
  title: "Survey Results Page",
  type: "document",
  icon: BarChartIcon,
  fields: [createPageHeroField(), createIntroductionField()],
  preview: {
    prepare() {
      return {
        title: "Survey Results Page",
        subtitle: "Community survey results and data",
      }
    },
  },
})
