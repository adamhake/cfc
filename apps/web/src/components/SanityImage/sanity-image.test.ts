import { describe, expect, it } from "vitest";
import { DEFAULT_BREAKPOINTS, getResponsiveWidths } from "./sanity-image-utils";

describe("getResponsiveWidths", () => {
  it("returns sorted unique widths", () => {
    expect(getResponsiveWidths([1536, 640, 1024, 1024])).toEqual([640, 1024, 1536]);
  });

  it("caps widths to maxWidth when provided", () => {
    expect(getResponsiveWidths([640, 1024, 1536], 1024)).toEqual([640, 1024]);
  });

  it("returns maxWidth when all breakpoints exceed cap", () => {
    expect(getResponsiveWidths([640, 1024, 1536], 480)).toEqual([480]);
  });

  it("falls back to default breakpoints when none are provided", () => {
    expect(getResponsiveWidths([])).toEqual(DEFAULT_BREAKPOINTS);
  });

  it("caps default breakpoints when none are provided and maxWidth is set", () => {
    expect(getResponsiveWidths([], 900)).toEqual([320, 480, 640, 768, 896]);
  });
});
