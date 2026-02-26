import { afterEach, describe, expect, it } from "vitest";
import { applyPalette } from "./palette";

describe("applyPalette", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-palette");
  });

  it("removes the palette attribute for the default olive palette", () => {
    document.documentElement.setAttribute("data-palette", "green-terra");

    applyPalette("olive");

    expect(document.documentElement.getAttribute("data-palette")).toBeNull();
  });

  it("sets the palette attribute for non-default palettes", () => {
    applyPalette("green-navy");

    expect(document.documentElement.getAttribute("data-palette")).toBe("green-navy");
  });
});
