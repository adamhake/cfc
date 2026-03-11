// @vitest-environment jsdom
import { renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useReducedMotion } from "./useReducedMotion"

describe("useReducedMotion", () => {
  let listeners: Array<(event: { matches: boolean }) => void>
  let currentMatches: boolean

  beforeEach(() => {
    listeners = []
    currentMatches = false

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: currentMatches,
        media: query,
        addEventListener: (_event: string, listener: (e: { matches: boolean }) => void) => {
          listeners.push(listener)
        },
        removeEventListener: (_event: string, listener: (e: { matches: boolean }) => void) => {
          listeners = listeners.filter((l) => l !== listener)
        },
      })),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns false when user has no motion preference", () => {
    currentMatches = false
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it("returns true when user prefers reduced motion", () => {
    currentMatches = true
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it("queries the correct media query", () => {
    renderHook(() => useReducedMotion())
    expect(window.matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)")
  })
})
