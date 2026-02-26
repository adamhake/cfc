import { PALETTE_KEY, type PaletteMode, validatePalette } from "@/utils/palette";
import { type ResolvedTheme, type ThemeMode, validateTheme } from "@/utils/theme";

export const APPEARANCE_COOKIES = {
  THEME: "theme-preference",
  RESOLVED_THEME: "resolved-theme",
  PALETTE: PALETTE_KEY,
} as const;

export const APPEARANCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export interface AppearanceState {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  palette: PaletteMode;
}

export const DEFAULT_APPEARANCE: AppearanceState = {
  theme: "system",
  resolvedTheme: "light",
  palette: "olive",
};

export function buildAppearanceCookie(
  name: (typeof APPEARANCE_COOKIES)[keyof typeof APPEARANCE_COOKIES],
  value: string,
): string {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${APPEARANCE_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function validateResolvedTheme(value: string | null | undefined): ResolvedTheme | null {
  if (value === "light" || value === "dark") {
    return value;
  }

  return null;
}

export function getAppearanceFromCookieValues(cookieValues: {
  theme?: string | null;
  resolvedTheme?: string | null;
  palette?: string | null;
}): AppearanceState {
  const theme = validateTheme(cookieValues.theme ?? null);

  const palette = cookieValues.palette ? validatePalette(cookieValues.palette) : DEFAULT_APPEARANCE.palette;

  const resolvedThemeCookie = validateResolvedTheme(cookieValues.resolvedTheme);
  const resolvedTheme =
    theme === "system" ? resolvedThemeCookie ?? DEFAULT_APPEARANCE.resolvedTheme : theme;

  return {
    theme,
    resolvedTheme,
    palette,
  };
}

/**
 * Bootstrap script that runs before hydration to avoid theme/palette flashes.
 * It syncs localStorage + cookies and applies classes/attributes before paint.
 */
export function getAppearanceBootstrapScript(initialAppearance: AppearanceState): string {
  const initial = JSON.stringify(initialAppearance);

  return `
    (function() {
      var initial = ${initial};
      var root = document.documentElement;
      var THEME_STORAGE_KEY = "theme";
      var PALETTE_STORAGE_KEY = "${PALETTE_KEY}";
      var THEME_COOKIE_KEY = "${APPEARANCE_COOKIES.THEME}";
      var RESOLVED_THEME_COOKIE_KEY = "${APPEARANCE_COOKIES.RESOLVED_THEME}";
      var PALETTE_COOKIE_KEY = "${APPEARANCE_COOKIES.PALETTE}";
      var COOKIE_MAX_AGE = ${APPEARANCE_COOKIE_MAX_AGE};

      function isTheme(value) {
        return value === "light" || value === "dark" || value === "system";
      }

      function isPalette(value) {
        return value === "green" || value === "olive" || value === "green-terra" || value === "green-navy";
      }

      function readStorage(key) {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          return null;
        }
      }

      function writeStorage(key, value) {
        try {
          localStorage.setItem(key, value);
        } catch (e) {}
      }

      function writeCookie(name, value) {
        document.cookie = name + "=" + encodeURIComponent(value) + "; Path=/; Max-Age=" + COOKIE_MAX_AGE + "; SameSite=Lax";
      }

      function applyResolvedTheme(resolvedTheme) {
        if (resolvedTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        root.style.colorScheme = resolvedTheme;
      }

      var storedTheme = readStorage(THEME_STORAGE_KEY);
      var theme = isTheme(storedTheme) ? storedTheme : initial.theme;
      var storedPalette = readStorage(PALETTE_STORAGE_KEY);
      var palette = isPalette(storedPalette) ? storedPalette : initial.palette;

      if (!isTheme(theme)) {
        theme = "system";
      }

      if (!isPalette(palette)) {
        palette = "olive";
      }

      var systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      var resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

      applyResolvedTheme(resolvedTheme);

      if (palette === "olive") {
        root.removeAttribute("data-palette");
      } else {
        root.setAttribute("data-palette", palette);
      }

      writeStorage(THEME_STORAGE_KEY, theme);
      writeStorage(PALETTE_STORAGE_KEY, palette);

      writeCookie(THEME_COOKIE_KEY, theme);
      writeCookie(RESOLVED_THEME_COOKIE_KEY, resolvedTheme);
      writeCookie(PALETTE_COOKIE_KEY, palette);

      if (window.matchMedia) {
        var media = window.matchMedia("(prefers-color-scheme: dark)");
        var handleSystemThemeChange = function(event) {
          var latestTheme = readStorage(THEME_STORAGE_KEY);
          if ((isTheme(latestTheme) ? latestTheme : theme) !== "system") {
            return;
          }

          var nextResolved = event.matches ? "dark" : "light";
          applyResolvedTheme(nextResolved);
          writeCookie(RESOLVED_THEME_COOKIE_KEY, nextResolved);
        };

        if (media.addEventListener) {
          media.addEventListener("change", handleSystemThemeChange);
        }
      }
    })();
  `;
}
