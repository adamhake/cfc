import type { SanityEvent, SanityProject } from "./sanity-types"

/** Sort projects: active first, then most recent `startDate` descending. */
export function sortProjects<T extends Pick<SanityProject, "status" | "startDate">>(
  projects: readonly T[],
): T[] {
  return [...projects].sort((a, b) => {
    if (a.status === "active" && b.status !== "active") return -1
    if (a.status !== "active" && b.status === "active") return 1
    return new Date(b.startDate ?? 0).getTime() - new Date(a.startDate ?? 0).getTime()
  })
}

/** Sort events: most recent `date` descending. */
export function sortEventsByDate<T extends Pick<SanityEvent, "date">>(events: readonly T[]): T[] {
  return [...events].sort(
    (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
  )
}
