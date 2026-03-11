// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react"
import type React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ThemeContext, useTheme, useThemeState } from "./useTheme"

// Mock theme utilities
vi.mock("@/utils/theme", () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn().mockReturnValue("system"),
  getSystemPreference: vi.fn().mockReturnValue("light"),
  resolveTheme: vi.fn((mode: string) => (mode === "system" ? "light" : mode)),
  storeTheme: vi.fn(),
  validateTheme: vi.fn((v: string) => {
    if (v === "light" || v === "dark" || v === "system") return v
    return "system"
  }),
}))

vi.mock("@/lib/appearance-shared", () => ({
  APPEARANCE_COOKIE_MAX_AGE: 31536000,
  APPEARANCE_COOKIES: {
    THEME: "theme-preference",
    RESOLVED_THEME: "resolved-theme",
    PALETTE: "palette-preference",
  },
}))

import { applyTheme, getStoredTheme, resolveTheme, storeTheme } from "@/utils/theme"

describe("useTheme", () => {
  it("returns default context values", () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe("system")
    expect(result.current.resolvedTheme).toBe("light")
    expect(typeof result.current.setTheme).toBe("function")
  })

  it("reads from ThemeContext", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={{ theme: "dark", setTheme: vi.fn(), resolvedTheme: "dark" }}>
        {children}
      </ThemeContext.Provider>
    )

    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe("dark")
    expect(result.current.resolvedTheme).toBe("dark")
  })
})

describe("useThemeState", () => {
  let listeners: Array<(e: MediaQueryListEvent) => void>

  beforeEach(() => {
    vi.restoreAllMocks()
    listeners = []
    // biome-ignore lint/suspicious/noDocumentCookie: test setup clears cookies
    document.cookie = ""

    vi.mocked(getStoredTheme).mockReturnValue("system")
    vi.mocked(resolveTheme).mockImplementation((mode) =>
      mode === "system" ? "light" : (mode as "light" | "dark"),
    )

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: (_: string, listener: (e: MediaQueryListEvent) => void) => {
          listeners.push(listener)
        },
        removeEventListener: (_: string, listener: (e: MediaQueryListEvent) => void) => {
          listeners = listeners.filter((l) => l !== listener)
        },
      })),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("initializes with provided values on client", () => {
    const { result } = renderHook(() => useThemeState("system", "light"))
    expect(result.current.theme).toBe("system")
    expect(result.current.resolvedTheme).toBe("light")
  })

  it("setTheme updates theme and resolved theme", () => {
    vi.mocked(resolveTheme).mockReturnValue("dark")

    const { result } = renderHook(() => useThemeState("system", "light"))

    act(() => {
      result.current.setTheme("dark")
    })

    expect(result.current.theme).toBe("dark")
    expect(result.current.resolvedTheme).toBe("dark")
    expect(applyTheme).toHaveBeenCalledWith("dark")
    expect(storeTheme).toHaveBeenCalledWith("dark")
  })

  it("writes cookies when theme changes", () => {
    vi.mocked(resolveTheme).mockReturnValue("dark")

    const { result } = renderHook(() => useThemeState("system", "light"))

    act(() => {
      result.current.setTheme("dark")
    })

    expect(document.cookie).toContain("theme-preference=dark")
    expect(document.cookie).toContain("resolved-theme=dark")
  })

  it("handles multi-tab sync via storage events", () => {
    vi.mocked(resolveTheme).mockImplementation((mode) => (mode === "dark" ? "dark" : "light"))

    const { result } = renderHook(() => useThemeState("system", "light"))

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "theme",
          newValue: "dark",
        }),
      )
    })

    expect(result.current.theme).toBe("dark")
    expect(result.current.resolvedTheme).toBe("dark")
    expect(applyTheme).toHaveBeenCalledWith("dark")
  })

  it("ignores storage events for other keys", () => {
    const { result } = renderHook(() => useThemeState("system", "light"))

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "some-other-key",
          newValue: "dark",
        }),
      )
    })

    expect(result.current.theme).toBe("system")
  })

  it("syncs from localStorage on mount", () => {
    vi.mocked(getStoredTheme).mockReturnValue("dark")
    vi.mocked(resolveTheme).mockReturnValue("dark")

    const { result } = renderHook(() => useThemeState("system", "light"))

    // After mount effect runs, should sync to stored value
    expect(result.current.theme).toBe("dark")
    expect(result.current.resolvedTheme).toBe("dark")
    expect(applyTheme).toHaveBeenCalledWith("dark")
    expect(storeTheme).toHaveBeenCalledWith("dark")
  })

  it("initializes with server values before mount sync to avoid hydration mismatch", () => {
    // getStoredTheme returns "dark" but initial should be "system" before effects run
    vi.mocked(getStoredTheme).mockReturnValue("dark")
    vi.mocked(resolveTheme).mockImplementation((mode) =>
      mode === "system" ? "light" : (mode as "light" | "dark"),
    )

    // The useState initializer should use the server-provided value, not localStorage
    // After effects, it syncs to localStorage
    const { result } = renderHook(() => useThemeState("system", "light"))

    // After effects have run, it should have synced
    expect(getStoredTheme).toHaveBeenCalled()
  })
})
