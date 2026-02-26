import { describe, expect, it } from "vitest";
import { getResponsiveWidths } from "./sanity-image-utils";

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
});
