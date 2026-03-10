import { describe, expect, it } from "vitest";
import { validatePalette, PALETTE_METADATA } from "./palette";
import type { PaletteMode } from "./palette";

describe("validatePalette", () => {
  it("accepts all valid palette modes", () => {
    const validPalettes: PaletteMode[] = ["green", "olive", "green-terra", "green-navy"];
    for (const p of validPalettes) {
      expect(validatePalette(p)).toBe(p);
    }
  });

  it("returns olive as default for invalid values", () => {
    expect(validatePalette("invalid")).toBe("olive");
    expect(validatePalette("")).toBe("olive");
    expect(validatePalette("GREEN")).toBe("olive");
  });
});

describe("PALETTE_METADATA", () => {
  it("has metadata for all palette modes", () => {
    const expected: PaletteMode[] = ["green", "olive", "green-terra", "green-navy"];
    for (const p of expected) {
      expect(PALETTE_METADATA[p]).toBeDefined();
      expect(PALETTE_METADATA[p].name).toBeTruthy();
      expect(PALETTE_METADATA[p].description).toBeTruthy();
    }
  });

  it("green has no accent", () => {
    expect(PALETTE_METADATA.green.accent).toBeNull();
  });

  it("other palettes have accents", () => {
    expect(PALETTE_METADATA.olive.accent).toBeTruthy();
    expect(PALETTE_METADATA["green-terra"].accent).toBeTruthy();
    expect(PALETTE_METADATA["green-navy"].accent).toBeTruthy();
  });
});
