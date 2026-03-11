import { describe, expect, it } from "vitest"
import {
  COMMON_COMBINATIONS,
  checkContrast,
  formatRatio,
  getContrastRatio,
  getWCAGLevel,
} from "./contrast"

describe("getContrastRatio", () => {
  it("returns 21:1 for black on white", () => {
    const ratio = getContrastRatio([0, 0, 0], [255, 255, 255])
    expect(ratio).toBeCloseTo(21, 0)
  })

  it("returns 1:1 for same color", () => {
    const ratio = getContrastRatio([128, 128, 128], [128, 128, 128])
    expect(ratio).toBe(1)
  })

  it("is symmetric (order independent)", () => {
    const ratio1 = getContrastRatio([0, 0, 0], [255, 255, 255])
    const ratio2 = getContrastRatio([255, 255, 255], [0, 0, 0])
    expect(ratio1).toBe(ratio2)
  })
})

describe("checkContrast", () => {
  it("identifies AAA for high contrast", () => {
    const check = checkContrast(8)
    expect(check.passesAAA).toBe(true)
    expect(check.passesAA).toBe(true)
    expect(check.passesAALarge).toBe(true)
  })

  it("identifies fail for low contrast", () => {
    const check = checkContrast(2)
    expect(check.passesAA).toBe(false)
    expect(check.passesAALarge).toBe(false)
    expect(check.rating).toBe("fail")
  })

  it("identifies AA large for moderate contrast", () => {
    const check = checkContrast(3.5)
    expect(check.passesAALarge).toBe(true)
    expect(check.passesAA).toBe(false)
  })
})

describe("formatRatio", () => {
  it("formats ratio with 2 decimal places", () => {
    expect(formatRatio(4.5)).toBe("4.50:1")
    expect(formatRatio(21)).toBe("21.00:1")
  })
})

describe("getWCAGLevel", () => {
  it("returns AAA for highest contrast", () => {
    expect(getWCAGLevel(checkContrast(8))).toBe("AAA (Enhanced)")
  })

  it("returns Fail for lowest contrast", () => {
    expect(getWCAGLevel(checkContrast(1.5))).toBe("Fail")
  })
})

describe("COMMON_COMBINATIONS", () => {
  it("all light mode combinations pass AA large", () => {
    for (const [, combo] of Object.entries(COMMON_COMBINATIONS).filter(([k]) =>
      k.startsWith("light"),
    )) {
      const ratio = getContrastRatio(combo.background, combo.foreground)
      const check = checkContrast(ratio)
      expect(check.passesAALarge).toBe(true)
    }
  })
})
