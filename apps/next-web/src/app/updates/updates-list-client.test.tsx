// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { SanityUpdate } from "@/lib/sanity-types"
import UpdatesListClient from "./updates-list-client"

let query = ""
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(query) }))
vi.mock("@/components/SanityImage/sanity-image", () => ({ SanityImage: () => null }))

afterEach(() => {
  cleanup()
  query = ""
})

const categories = [
  {
    _id: "access",
    title: "Park Access",
    slug: { _type: "slug" as const, current: "park-access" },
    color: null,
  },
  {
    _id: "seasonal",
    title: "Seasonal",
    slug: { _type: "slug" as const, current: "seasonal" },
    color: null,
  },
]
const updates: SanityUpdate[] = categories.map((category, index) => ({
  _id: `update-${index}`,
  _type: "update",
  title: index === 0 ? "Road closure" : "Fall planting",
  slug: { _type: "slug", current: `update-${index}` },
  description: "The latest park news.",
  heroImage: null,
  category,
  featured: false,
  publishedAt: "2026-09-20T12:00:00Z",
  endDate: null,
}))

describe("updates listing", () => {
  it("renders notices without images or an end date, with working article links", () => {
    render(<UpdatesListClient updates={updates} categories={categories} />)
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2)
    expect(screen.getByRole("link", { name: /Road closure/ })).toHaveAttribute(
      "href",
      "/updates/update-0",
    )
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
    expect(screen.queryByText(/End date:/)).not.toBeInTheDocument()
  })

  it("filters bookmarked category URLs and reflects browser navigation", () => {
    query = "category=park-access"
    const { rerender } = render(<UpdatesListClient updates={updates} categories={categories} />)
    expect(screen.getByRole("heading", { name: "Road closure" })).toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "Fall planting" })).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Park Access" })).toHaveAttribute(
      "aria-current",
      "true",
    )
    query = ""
    rerender(<UpdatesListClient updates={updates} categories={categories} />)
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2)
  })

  it("shows a useful empty state for unknown categories and empty archives", () => {
    query = "category=missing"
    const { rerender } = render(<UpdatesListClient updates={updates} categories={categories} />)
    expect(screen.getByRole("heading", { name: "No updates in this category" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "All updates" })).toHaveAttribute("href", "/updates")
    query = ""
    rerender(<UpdatesListClient updates={[]} categories={categories} />)
    expect(screen.getByRole("heading", { name: "No updates yet" })).toBeInTheDocument()
  })
})
