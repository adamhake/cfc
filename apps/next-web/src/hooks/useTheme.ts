"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  getSystemPreference,
  resolveTheme,
  storeTheme,
  type ResolvedTheme,
  type ThemeMode,
} from "@/utils/theme";
import { APPEARANCE_COOKIES, APPEARANCE_COOKIE_MAX_AGE } from "@/lib/appearance-shared";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: ResolvedTheme;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeState(initialTheme: ThemeMode, initialResolved: ResolvedTheme) {
  const [theme, setThemeRaw] = useState<ThemeMode>(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(initialResolved);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeRaw(newTheme);
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    storeTheme(newTheme);
    // Sync cookies
    document.cookie = `${APPEARANCE_COOKIES.THEME}=${encodeURIComponent(newTheme)}; Path=/; Max-Age=${APPEARANCE_COOKIE_MAX_AGE}; SameSite=Lax`;
    document.cookie = `${APPEARANCE_COOKIES.RESOLVED_THEME}=${encodeURIComponent(resolved)}; Path=/; Max-Age=${APPEARANCE_COOKIE_MAX_AGE}; SameSite=Lax`;
  }, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored !== theme) {
      setTheme(stored);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        const resolved = getSystemPreference();
        setResolvedTheme(resolved);
        applyTheme(resolved);
        document.cookie = `${APPEARANCE_COOKIES.RESOLVED_THEME}=${encodeURIComponent(resolved)}; Path=/; Max-Age=${APPEARANCE_COOKIE_MAX_AGE}; SameSite=Lax`;
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  // Multi-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        const newTheme = e.newValue as ThemeMode;
        setThemeRaw(newTheme);
        const resolved = resolveTheme(newTheme);
        setResolvedTheme(resolved);
        applyTheme(resolved);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return { theme, setTheme, resolvedTheme };
}
