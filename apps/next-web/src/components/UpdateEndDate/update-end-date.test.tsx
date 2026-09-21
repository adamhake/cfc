// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { UpdateEndDate } from "./update-end-date"

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe("UpdateEndDate", () => {
  it("keeps cached server HTML independent of the current time", () => {
    vi.setSystemTime(new Date("2026-09-22T12:00:00Z"))
    expect(renderToString(<UpdateEndDate endDate="2026-09-20" />)).toContain("End date:")
  })

  it("includes the entire end date in Richmond time and updates across midnight", () => {
    vi.setSystemTime(new Date("2026-09-21T03:59:30Z"))
    render(<UpdateEndDate endDate="2026-09-20" />)
    expect(screen.getByText(/Through:/)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(60_000))
    expect(screen.getByText(/Ended:/)).toBeInTheDocument()
    expect(screen.getByText("Sep 20, 2026")).toHaveAttribute("dateTime", "2026-09-20")
  })

  it("uses standard time in winter and responds when editors change the end date", () => {
    vi.setSystemTime(new Date("2026-12-21T04:30:00Z"))
    const { rerender } = render(<UpdateEndDate endDate="2026-12-20" />)
    expect(screen.getByText(/Through:/)).toBeInTheDocument()
    rerender(<UpdateEndDate endDate="2026-12-19" />)
    expect(screen.getByText(/Ended:/)).toBeInTheDocument()
  })
})
