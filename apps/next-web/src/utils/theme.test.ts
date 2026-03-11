import { describe, expect, it } from "vitest"
import { resolveTheme, validateTheme } from "./theme"

describe("validateTheme", () => {
  it("returns valid theme modes as-is", () => {
    expect(validateTheme("light")).toBe("light")
    expect(validateTheme("dark")).toBe("dark")
    expect(validateTheme("system")).toBe("system")
  })

  it("returns system for null", () => {
    expect(validateTheme(null)).toBe("system")
  })

  it("returns system for invalid values", () => {
    expect(validateTheme("invalid")).toBe("system")
    expect(validateTheme("")).toBe("system")
    expect(validateTheme("DARK")).toBe("system")
  })
})

describe("resolveTheme", () => {
  it("returns light for light mode", () => {
    expect(resolveTheme("light")).toBe("light")
  })

  it("returns dark for dark mode", () => {
    expect(resolveTheme("dark")).toBe("dark")
  })

  it("returns light for system mode in node (no window)", () => {
    // In Node.js test environment, window is undefined, so getSystemPreference returns "light"
    expect(resolveTheme("system")).toBe("light")
  })
})
