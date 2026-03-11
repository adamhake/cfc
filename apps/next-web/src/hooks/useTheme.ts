"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { APPEARANCE_COOKIE_MAX_AGE, APPEARANCE_COOKIES } from "@/lib/appearance-shared"
import {
  applyTheme,
  getStoredTheme,
  getSystemPreference,
  type ResolvedTheme,
  resolveTheme,
  storeTheme,
  type ThemeMode,
} from "@/utils/theme"

interface ThemeContextValue {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  resolvedTheme: ResolvedTheme
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function useThemeState(initialTheme: ThemeMode, initialResolved: ResolvedTheme) {
  const [theme, setThemeRaw] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return initialTheme
    return getStoredTheme()
  })
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === "undefined") return initialResolved
    return resolveTheme(getStoredTheme())
  })

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeRaw(newTheme)
    const resolved = resolveTheme(newTheme)
    setResolvedTheme(resolved)
    applyTheme(resolved)
    storeTheme(newTheme)
    // Sync cookies
    // biome-ignore lint/suspicious/noDocumentCookie: client-side cookie for theme persistence
    document.cookie = `${APPEARANCE_COOKIES.THEME}=${encodeURIComponent(newTheme)}; Path=/; Max-Age=${APPEARANCE_COOKIE_MAX_AGE}; SameSite=Lax`
    // biome-ignore lint/suspicious/noDocumentCookie: client-side cookie for theme persistence
    document.cookie = `${APPEARANCE_COOKIES.RESOLVED_THEME}=${encodeURIComponent(resolved)}; Path=/; Max-Age=${APPEARANCE_COOKIE_MAX_AGE}; SameSite=Lax`
  }, [])

  // Apply stored theme on mount (side effect only, no setState)
  useEffect(() => {
    applyTheme(resolveTheme(theme))
    storeTheme(theme)
  }, [theme]) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      if (theme === "system") {
        const resolved = getSystemPreference()
        setResolvedTheme(resolved)
        applyTheme(resolved)
        // biome-ignore lint/suspicious/noDocumentCookie: client-side cookie for theme persistence
        document.cookie = `${APPEARANCE_COOKIES.RESOLVED_THEME}=${encodeURIComponent(resolved)}; Path=/; Max-Age=${APPEARANCE_COOKIE_MAX_AGE}; SameSite=Lax`
      }
    }
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [theme])

  // Multi-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        const newTheme = e.newValue as ThemeMode
        setThemeRaw(newTheme)
        const resolved = resolveTheme(newTheme)
        setResolvedTheme(resolved)
        applyTheme(resolved)
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  return { theme, setTheme, resolvedTheme }
}
