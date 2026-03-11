import { describe, expect, it } from "vitest"
import {
  APPEARANCE_COOKIE_MAX_AGE,
  APPEARANCE_COOKIES,
  buildAppearanceCookie,
  DEFAULT_APPEARANCE,
  getAppearanceBootstrapScript,
  getAppearanceFromCookieValues,
} from "./appearance-shared"

describe("buildAppearanceCookie", () => {
  it("builds a cookie string with correct format", () => {
    const cookie = buildAppearanceCookie(APPEARANCE_COOKIES.THEME, "dark")
    expect(cookie).toBe(
      `theme-preference=dark; Path=/; Max-Age=${APPEARANCE_COOKIE_MAX_AGE}; SameSite=Lax`,
    )
  })

  it("encodes special characters in value", () => {
    const cookie = buildAppearanceCookie(APPEARANCE_COOKIES.PALETTE, "green-terra")
    expect(cookie).toContain("green-terra")
    expect(cookie).toContain("Path=/")
  })

  it("uses correct max age (1 year)", () => {
    expect(APPEARANCE_COOKIE_MAX_AGE).toBe(60 * 60 * 24 * 365)
  })
})

describe("getAppearanceFromCookieValues", () => {
  it("returns defaults when no cookies provided", () => {
    const result = getAppearanceFromCookieValues({})
    expect(result).toEqual(DEFAULT_APPEARANCE)
  })

  it("returns defaults for empty/null values", () => {
    const result = getAppearanceFromCookieValues({
      theme: null,
      resolvedTheme: null,
      palette: null,
    })
    expect(result.theme).toBe("system")
    expect(result.resolvedTheme).toBe("light")
    expect(result.palette).toBe("olive")
  })

  it("parses valid theme from cookies", () => {
    const result = getAppearanceFromCookieValues({ theme: "dark" })
    expect(result.theme).toBe("dark")
    expect(result.resolvedTheme).toBe("dark")
  })

  it("parses valid light theme", () => {
    const result = getAppearanceFromCookieValues({ theme: "light" })
    expect(result.theme).toBe("light")
    expect(result.resolvedTheme).toBe("light")
  })

  it("falls back to system for invalid theme", () => {
    const result = getAppearanceFromCookieValues({ theme: "invalid" })
    expect(result.theme).toBe("system")
  })

  it("parses valid palette from cookies", () => {
    const result = getAppearanceFromCookieValues({ palette: "green-terra" })
    expect(result.palette).toBe("green-terra")
  })

  it("falls back to default palette for invalid value", () => {
    const result = getAppearanceFromCookieValues({ palette: "neon-pink" })
    expect(result.palette).toBe("olive")
  })

  it("uses resolvedTheme cookie when theme is system", () => {
    const result = getAppearanceFromCookieValues({
      theme: "system",
      resolvedTheme: "dark",
    })
    expect(result.theme).toBe("system")
    expect(result.resolvedTheme).toBe("dark")
  })

  it("ignores resolvedTheme cookie when theme is explicit", () => {
    const result = getAppearanceFromCookieValues({
      theme: "light",
      resolvedTheme: "dark",
    })
    expect(result.resolvedTheme).toBe("light")
  })

  it("falls back to default resolvedTheme when system and no cookie", () => {
    const result = getAppearanceFromCookieValues({
      theme: "system",
      resolvedTheme: "invalid",
    })
    expect(result.resolvedTheme).toBe("light")
  })
})

describe("getAppearanceBootstrapScript", () => {
  it("returns a string containing an IIFE", () => {
    const script = getAppearanceBootstrapScript(DEFAULT_APPEARANCE)
    expect(script).toContain("(function()")
  })

  it("embeds initial appearance as JSON", () => {
    const script = getAppearanceBootstrapScript({
      theme: "dark",
      resolvedTheme: "dark",
      palette: "green",
    })
    expect(script).toContain('"theme":"dark"')
    expect(script).toContain('"resolvedTheme":"dark"')
    expect(script).toContain('"palette":"green"')
  })

  it("includes cookie key constants", () => {
    const script = getAppearanceBootstrapScript(DEFAULT_APPEARANCE)
    expect(script).toContain(APPEARANCE_COOKIES.THEME)
    expect(script).toContain(APPEARANCE_COOKIES.RESOLVED_THEME)
    expect(script).toContain(APPEARANCE_COOKIES.PALETTE)
  })

  it("includes theme validation logic", () => {
    const script = getAppearanceBootstrapScript(DEFAULT_APPEARANCE)
    expect(script).toContain("isTheme")
    expect(script).toContain("isPalette")
  })

  it("includes system dark mode detection", () => {
    const script = getAppearanceBootstrapScript(DEFAULT_APPEARANCE)
    expect(script).toContain("prefers-color-scheme: dark")
  })

  it("includes localStorage read/write helpers", () => {
    const script = getAppearanceBootstrapScript(DEFAULT_APPEARANCE)
    expect(script).toContain("readStorage")
    expect(script).toContain("writeStorage")
  })

  it("includes cookie write helper", () => {
    const script = getAppearanceBootstrapScript(DEFAULT_APPEARANCE)
    expect(script).toContain("writeCookie")
    expect(script).toContain(`Max-Age=" + COOKIE_MAX_AGE`)
  })

  it("includes theme application logic", () => {
    const script = getAppearanceBootstrapScript(DEFAULT_APPEARANCE)
    expect(script).toContain("applyResolvedTheme")
    expect(script).toContain('classList.add("dark")')
    expect(script).toContain('classList.remove("dark")')
  })

  it("includes palette application with data-palette attribute", () => {
    const script = getAppearanceBootstrapScript(DEFAULT_APPEARANCE)
    expect(script).toContain("data-palette")
    expect(script).toContain("removeAttribute")
    expect(script).toContain("setAttribute")
  })

  it("includes media query listener for system theme changes", () => {
    const script = getAppearanceBootstrapScript(DEFAULT_APPEARANCE)
    expect(script).toContain("handleSystemThemeChange")
    expect(script).toContain("addEventListener")
  })
})
