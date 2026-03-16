import { describe, expect, it } from "vitest"
import { formatDateString, isPastDate } from "./time"

describe("formatDateString", () => {
  it("formats date in long format by default", () => {
    // Use a full ISO string with time to avoid timezone-shift edge cases
    const result = formatDateString("2025-06-15T12:00:00")
    expect(result).toContain("June")
    expect(result).toContain("15")
    expect(result).toContain("2025")
  })

  it("formats date in short format", () => {
    const result = formatDateString("2025-06-15T12:00:00", "short")
    expect(result).toContain("Jun")
    expect(result).toContain("15")
    expect(result).toContain("2025")
  })

  it("handles ISO date strings", () => {
    const result = formatDateString("2025-12-25T10:00:00Z")
    expect(result).toContain("December")
    expect(result).toContain("25")
    expect(result).toContain("2025")
  })

  it("keeps the correct calendar day for date-only strings", () => {
    const result = formatDateString("2025-12-25")
    expect(result).toContain("December")
    expect(result).toContain("25")
    expect(result).toContain("2025")
  })
})

describe("isPastDate", () => {
  it("treats events on the same eastern calendar day as upcoming", () => {
    expect(isPastDate("2025-06-15", new Date("2025-06-15T23:59:59-04:00"))).toBe(false)
  })

  it("treats prior eastern calendar days as past", () => {
    expect(isPastDate("2025-06-15", new Date("2025-06-16T00:00:00-04:00"))).toBe(true)
  })
})
