import { updatesByEventQuery, updatesByProjectQuery } from "@chimborazo/sanity-config/queries"
import { UpdateCard } from "@/components/UpdateCard/update-card"
import { CACHE_TAGS, cachedSanityFetch, getDynamicFetchOptions } from "@/lib/sanity-fetch"

export async function RelatedUpdates({
  documentId,
  type,
}: {
  documentId: string
  type: "event" | "project"
}) {
  const id = documentId.replace(/^drafts\./, "")
  const { data: updates } = await cachedSanityFetch({
    ...(await getDynamicFetchOptions()),
    query: type === "event" ? updatesByEventQuery : updatesByProjectQuery,
    params: type === "event" ? { eventId: id } : { projectId: id },
    tags: [CACHE_TAGS.UPDATES],
  })
  if (!updates.length) return null

  return (
    <section className="mt-12 space-y-6" aria-label="Related updates">
      <h2 className="font-display text-3xl text-grey-900 dark:text-grey-100">Related Updates</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {updates.map((update) => (
          <UpdateCard key={update._id} update={update} compact />
        ))}
      </div>
    </section>
  )
}
