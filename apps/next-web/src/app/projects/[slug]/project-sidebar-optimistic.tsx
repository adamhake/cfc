"use client"

import { Calendar, CheckCircle2, DollarSign, MapPin, Target } from "lucide-react"
import { useOptimisticDocument } from "@/hooks/use-optimistic-sanity"
import type { SanityProject } from "@/lib/sanity-types"
import { formatDateString } from "@/utils/time"

const categoryLabels = {
  restoration: "Restoration",
  recreation: "Recreation",
  connection: "Connection",
  preservation: "Preservation",
} as const

export default function ProjectSidebarOptimistic({ project }: { project: SanityProject }) {
  const optimisticProject = useOptimisticDocument(project) ?? project

  const fmtStartDate =
    optimisticProject.startDateOverride || formatDateString(optimisticProject.startDate)
  const fmtCompletionDate = optimisticProject.completionDateOverride
    ? optimisticProject.completionDateOverride
    : optimisticProject.completionDate
      ? formatDateString(optimisticProject.completionDate)
      : null

  return (
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
          {optimisticProject.category && (
            <div className="flex items-start gap-3">
              <Target className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
              <div>
                <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                  Category
                </div>
                <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                  {categoryLabels[optimisticProject.category]}
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          {optimisticProject.location && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
              <div>
                <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                  Location
                </div>
                <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                  {optimisticProject.location}
                </div>
              </div>
            </div>
          )}

          {/* Budget */}
          {optimisticProject.budget && (
            <div className="flex items-start gap-3">
              <DollarSign className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
              <div>
                <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                  Budget
                </div>
                <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                  {optimisticProject.budget}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
