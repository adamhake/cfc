// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react"
import type React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { PaletteContext, usePalette, usePaletteState } from "./usePalette"

vi.mock("@/utils/palette", () => ({
  applyPalette: vi.fn(),
  getStoredPalette: vi.fn().mockReturnValue(null),
  storePalette: vi.fn(),
  PALETTE_KEY: "palette-preference",
}))

vi.mock("@/lib/appearance-shared", () => ({
  APPEARANCE_COOKIE_MAX_AGE: 31536000,
  APPEARANCE_COOKIES: {
    THEME: "theme-preference",
    RESOLVED_THEME: "resolved-theme",
    PALETTE: "palette-preference",
  },
}))

import { applyPalette, getStoredPalette, storePalette } from "@/utils/palette"

describe("usePalette", () => {
  it("returns default context values", () => {
    const { result } = renderHook(() => usePalette())
    expect(result.current.palette).toBe("olive")
    expect(typeof result.current.setPalette).toBe("function")
  })

  it("reads from PaletteContext", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PaletteContext.Provider value={{ palette: "green-terra", setPalette: vi.fn() }}>
        {children}
      </PaletteContext.Provider>
    )

    const { result } = renderHook(() => usePalette(), { wrapper })
    expect(result.current.palette).toBe("green-terra")
  })
})

describe("usePaletteState", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // biome-ignore lint/suspicious/noDocumentCookie: test setup clears cookies
    document.cookie = ""
    vi.mocked(getStoredPalette).mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("initializes with provided palette", () => {
    const { result } = renderHook(() => usePaletteState("olive"))
    expect(result.current.palette).toBe("olive")
  })

  it("uses stored palette if available", () => {
    vi.mocked(getStoredPalette).mockReturnValue("green-navy")

    const { result } = renderHook(() => usePaletteState("olive"))
    expect(result.current.palette).toBe("green-navy")
  })

  it("setPalette updates palette state", () => {
    const { result } = renderHook(() => usePaletteState("olive"))

    act(() => {
      result.current.setPalette("green-terra")
    })

    expect(result.current.palette).toBe("green-terra")
    expect(applyPalette).toHaveBeenCalledWith("green-terra")
    expect(storePalette).toHaveBeenCalledWith("green-terra")
  })

  it("writes cookie when palette changes", () => {
    const { result } = renderHook(() => usePaletteState("olive"))

    act(() => {
      result.current.setPalette("green")
    })

    expect(document.cookie).toContain("palette-preference=green")
  })

  it("applies palette on mount", () => {
    renderHook(() => usePaletteState("green-navy"))

    expect(applyPalette).toHaveBeenCalledWith("green-navy")
    expect(storePalette).toHaveBeenCalledWith("green-navy")
  })

  it("handles multi-tab sync via storage events", () => {
    const { result } = renderHook(() => usePaletteState("olive"))

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "palette-preference",
          newValue: "green-terra",
        }),
      )
    })

    expect(result.current.palette).toBe("green-terra")
    expect(applyPalette).toHaveBeenCalledWith("green-terra")
  })

  it("ignores storage events for other keys", () => {
    const { result } = renderHook(() => usePaletteState("olive"))

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "other-key",
          newValue: "green",
        }),
      )
    })

    expect(result.current.palette).toBe("olive")
  })
})
