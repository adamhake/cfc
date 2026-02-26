import { describe, expect, it } from "vitest";
import {
  APPEARANCE_COOKIES,
  DEFAULT_APPEARANCE,
  getAppearanceBootstrapScript,
  getAppearanceFromCookieValues,
} from "./appearance-shared";

describe("getAppearanceFromCookieValues", () => {
  it("falls back to defaults for invalid cookie values", () => {
    const appearance = getAppearanceFromCookieValues({
      theme: "broken",
      resolvedTheme: "invalid",
      palette: "unknown",
    });

    expect(appearance).toEqual(DEFAULT_APPEARANCE);
  });

  it("uses explicit dark theme and palette cookies", () => {
    const appearance = getAppearanceFromCookieValues({
      theme: "dark",
      resolvedTheme: "light",
      palette: "green-terra",
    });

    expect(appearance).toEqual({
      theme: "dark",
      resolvedTheme: "dark",
      palette: "green-terra",
    });
  });

  it("uses resolved-theme cookie only when theme mode is system", () => {
    const appearance = getAppearanceFromCookieValues({
      theme: "system",
      resolvedTheme: "dark",
      palette: "olive",
    });

    expect(appearance).toEqual({
      theme: "system",
      resolvedTheme: "dark",
      palette: "olive",
    });
  });
});

describe("getAppearanceBootstrapScript", () => {
  it("writes appearance cookies and applies dark/palette attributes", () => {
    const script = getAppearanceBootstrapScript({
      theme: "dark",
      resolvedTheme: "dark",
      palette: "green-navy",
    });

    expect(script).toContain(APPEARANCE_COOKIES.THEME);
    expect(script).toContain(APPEARANCE_COOKIES.RESOLVED_THEME);
    expect(script).toContain(APPEARANCE_COOKIES.PALETTE);
    expect(script).toContain('root.classList.add("dark")');
    expect(script).toContain('root.setAttribute("data-palette", palette)');
  });
});
