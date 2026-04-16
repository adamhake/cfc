"use client"

import Project from "@/components/Project/project"
import { useOptimisticList } from "@/hooks/use-optimistic-sanity"
import { sortProjects } from "@/lib/sort-helpers"
import type { SanityProject } from "@/lib/sanity-types"

export default function ProjectsListClient({ projects }: { projects: SanityProject[] }) {
  const optimisticProjects = useOptimisticList(projects)

  // Re-sort after optimistic adds/removes/edits.
  const sorted = sortProjects(optimisticProjects)

  return sorted.length > 0 ? (
    <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
      {sorted.map((project) => (
        <Project key={project._id} project={project} />
      ))}
    </div>
  ) : (
    <div className="mt-20 text-center">
      <p className="font-body text-lg text-grey-700 dark:text-grey-300">
        No projects available at this time. Check back soon for updates on our ongoing initiatives!
      </p>
    </div>
  )
}
