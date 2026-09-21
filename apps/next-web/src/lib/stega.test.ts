import { stegaEncodeSourceMap } from "@sanity/client/stega"
import { describe, expect, it } from "vitest"
import { sortProjects } from "./sort-helpers"
import { cleanEnum } from "./stega"

/**
 * Encodes a value the way the Content Lake does when Visual Editing is on.
 *
 * Note this uses the real encoder rather than hand-rolled invisible characters:
 * `stegaClean` only strips a well-formed payload, so a synthetic fixture would
 * pass through uncleaned and the test would prove nothing.
 */
function withStega(value: string): string {
  const encoded = stegaEncodeSourceMap(
    { value },
    {
      documents: [{ _id: "doc-1", _type: "project" }],
      paths: ["$['value']"],
      mappings: {
        "$['value']": {
          type: "value",
          source: { type: "documentValue", document: 0, path: 0 },
        },
      },
    },
    { enabled: true, studioUrl: "https://example.sanity.studio" },
  ) as { value: string }

  return encoded.value
}

describe("withStega fixture", () => {
  it("actually encodes, otherwise the tests below are vacuous", () => {
    const encoded = withStega("restoration")
    expect(encoded).not.toBe("restoration")
    expect(encoded.length).toBeGreaterThan("restoration".length)
  })
})

describe("cleanEnum", () => {
  it("strips stega characters so the value can be used as a key", () => {
    expect(cleanEnum(withStega("restoration"))).toBe("restoration")
  })

  it("leaves a plain value untouched", () => {
    expect(cleanEnum("active")).toBe("active")
  })

  it("returns undefined for empty values so callers can fall back", () => {
    expect(cleanEnum(null)).toBeUndefined()
    expect(cleanEnum(undefined)).toBeUndefined()
    expect(cleanEnum("")).toBeUndefined()
  })

  it("makes an object lookup succeed where the raw value misses", () => {
    const styles = { restoration: "leaf", recreation: "trees" } as const
    const encoded = withStega("restoration")

    // This is the crash that prompted the fix: Vision read `.Icon` off this.
    expect(styles[encoded as keyof typeof styles]).toBeUndefined()
    expect(styles[cleanEnum(encoded) as keyof typeof styles]).toBe("leaf")
  })

  it("makes an equality check succeed where the raw value fails", () => {
    const encoded = withStega("upper-park")
    expect(encoded === "upper-park").toBe(false)
    expect(cleanEnum(encoded) === "upper-park").toBe(true)
  })
})

describe("sortProjects", () => {
  it("sorts active first with plain values", () => {
    const sorted = sortProjects([
      { status: "completed", startDate: "2024-01-01" },
      { status: "active", startDate: "2023-01-01" },
    ] as never)
    expect((sorted[0] as { status: string }).status).toBe("active")
  })

  it("still sorts active first when values are stega-encoded (draft mode)", () => {
    const sorted = sortProjects([
      { status: withStega("completed"), startDate: "2024-01-01" },
      { status: withStega("active"), startDate: "2023-01-01" },
    ] as never)
    expect(cleanEnum((sorted[0] as { status: string }).status)).toBe("active")
  })
})
