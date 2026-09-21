"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { UpdateCard } from "@/components/UpdateCard/update-card"
import type { SanityUpdate, SanityUpdateCategory } from "@/lib/sanity-types"

export default function UpdatesListClient({
  updates,
  categories,
}: {
  updates: SanityUpdate[]
  categories: SanityUpdateCategory[]
}) {
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || ""
  const filtered = category
    ? updates.filter((update) => update.category?.slug?.current === category)
    : updates

  return (
    <div className="mt-12 space-y-8">
      <nav aria-label="Filter updates by category" className="flex flex-wrap gap-3">
        {[
          { slug: "", title: "All updates" },
          ...categories.flatMap((item) =>
            item.slug?.current ? [{ slug: item.slug.current, title: item.title }] : [],
          ),
        ].map((item) => (
          <Link
            key={item.slug}
            href={item.slug ? `/updates?category=${encodeURIComponent(item.slug)}` : "/updates"}
            scroll={false}
            aria-current={category === item.slug ? "true" : undefined}
            className={`rounded-full border px-4 py-2 font-body text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 ${category === item.slug ? "border-primary-800 bg-primary-800 text-white dark:border-primary-300 dark:bg-primary-300 dark:text-primary-950" : "border-primary-200 text-primary-800 hover:bg-primary-100 dark:border-primary-700 dark:text-primary-200 dark:hover:bg-primary-800"}`}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <p role="status" className="font-body text-sm text-grey-700 dark:text-grey-300">
        {filtered.length} {filtered.length === 1 ? "update" : "updates"}
        {category ? " in this category" : ""}
      </p>
      {filtered.length ? (
        filtered.map((update) => <UpdateCard key={update._id} update={update} />)
      ) : (
        <div className="rounded-2xl border border-neutral-200 p-8 text-center dark:border-primary-700">
          <h2 className="font-display text-2xl text-grey-900 dark:text-grey-100">
            {category ? "No updates in this category" : "No updates yet"}
          </h2>
          <p className="mt-3 font-body text-grey-700 dark:text-grey-300">
            {category
              ? "Choose another category or view all updates."
              : "Check back soon for seasonal news, construction progress, and park access notices."}
          </p>
        </div>
      )}
    </div>
  )
}
