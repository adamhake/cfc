"use client"

import Project from "@/components/Project/project"
import { useOptimisticList } from "@/hooks/use-optimistic-sanity"
import type { SanityProject } from "@/lib/sanity-types"
import { sortProjects } from "@/lib/sort-helpers"

export default function ProjectsListClient({ projects }: { projects: SanityProject[] }) {
  const optimisticProjects = useOptimisticList(projects)

  // Re-sort after optimistic adds/removes/edits.
  const sorted = sortProjects(optimisticProjects)

  return sorted.length > 0 ? (
    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      {sorted.map((project) => (
        <Project key={project._id} project={project} />
      ))}
    </div>
  ) : (
    <div className="mt-12 text-center">
      <p className="font-body text-lg text-grey-700 dark:text-grey-300">
        No projects available at this time. Check back soon for updates on our ongoing initiatives!
      </p>
    </div>
  )
}
