import { describe, expect, it } from "vitest";
import { getResponsiveWidths, DEFAULT_BREAKPOINTS } from "./sanity-image-utils";

describe("getResponsiveWidths", () => {
  it("returns default breakpoints for empty input", () => {
    expect(getResponsiveWidths([])).toEqual(DEFAULT_BREAKPOINTS);
  });

  it("returns sorted and deduplicated widths", () => {
    expect(getResponsiveWidths([640, 320, 640, 480])).toEqual([320, 480, 640]);
  });

  it("filters out non-finite and zero values", () => {
    expect(getResponsiveWidths([0, -10, NaN, Infinity, 320])).toEqual([320]);
  });

  it("rounds fractional widths", () => {
    expect(getResponsiveWidths([320.7, 640.3])).toEqual([321, 640]);
  });

  it("caps widths to maxWidth", () => {
    const widths = getResponsiveWidths([320, 640, 1024, 1920], 800);
    expect(widths).toEqual([320, 640]);
  });

  it("returns [maxWidth] when all breakpoints exceed cap", () => {
    expect(getResponsiveWidths([2000, 3000], 500)).toEqual([500]);
  });

  it("caps default breakpoints when input is empty and maxWidth is set", () => {
    const widths = getResponsiveWidths([], 640);
    expect(widths.every((w) => w <= 640)).toBe(true);
    expect(widths.length).toBeGreaterThan(0);
  });

  it("returns [maxWidth] when defaults all exceed cap", () => {
    const widths = getResponsiveWidths([], 100);
    expect(widths).toEqual([100]);
  });
});
