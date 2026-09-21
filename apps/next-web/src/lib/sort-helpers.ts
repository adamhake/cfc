import type { SanityEvent } from "./sanity-types"
import { cleanEnum } from "./stega"

/**
 * Sort projects: active first, then most recent `startDate` descending.
 *
 * The constraint is structural rather than `Pick<SanityProject, ...>` so it
 * accepts both clean and stega-branded results -- `StegaString<"active">` does
 * not satisfy the literal union, and narrowing the constraint would silently
 * widen `T` and lose every other field at the call site.
 */
export function sortProjects<T extends { status?: string | null; startDate?: string | null }>(
  projects: readonly T[],
): T[] {
  return [...projects].sort((a, b) => {
    // `status` is compared, not rendered, so it must be stega-free -- otherwise
    // every comparison is false in draft mode and the ordering silently changes.
    const aActive = cleanEnum(a.status) === "active"
    const bActive = cleanEnum(b.status) === "active"
    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1
    return new Date(b.startDate ?? 0).getTime() - new Date(a.startDate ?? 0).getTime()
  })
}

/** Sort events: most recent `date` descending. */
export function sortEventsByDate<T extends Pick<SanityEvent, "date">>(events: readonly T[]): T[] {
  return [...events].sort(
    (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
  )
}
