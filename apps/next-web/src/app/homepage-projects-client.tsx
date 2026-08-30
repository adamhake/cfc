"use client"

import Project from "@/components/Project/project"
import { useOptimisticList } from "@/hooks/use-optimistic-sanity"
import type { SanityProject } from "@/lib/sanity-types"

export default function HomepageProjectsClient({ projects }: { projects: SanityProject[] }) {
  const optimisticProjects = useOptimisticList(projects)

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      {optimisticProjects.map((project) => (
        <Project key={project._id} project={project} />
      ))}
    </div>
  )
}
