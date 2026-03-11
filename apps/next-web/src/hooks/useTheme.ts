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
  // Initialize with server-provided values to avoid hydration mismatch.
  // Client-side localStorage is synced in the mount effect below.
  const [theme, setThemeRaw] = useState<ThemeMode>(initialTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(initialResolved)

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeRaw(newTheme)
    const resolved = resolveTheme(newTheme)
    setResolvedTheme(resolved)
    applyTheme(resolved)
    storeTheme(newTheme)
    // biome-ignore lint/suspicious/noDocumentCookie: client-side cookie for theme persistence
    document.cookie = `${APPEARANCE_COOKIES.THEME}=${encodeURIComponent(newTheme)}; Path=/; Max-Age=${APPEARANCE_COOKIE_MAX_AGE}; SameSite=Lax`
    // biome-ignore lint/suspicious/noDocumentCookie: client-side cookie for theme persistence
    document.cookie = `${APPEARANCE_COOKIES.RESOLVED_THEME}=${encodeURIComponent(resolved)}; Path=/; Max-Age=${APPEARANCE_COOKIE_MAX_AGE}; SameSite=Lax`
  }, [])

  // Sync with localStorage on mount
  useEffect(() => {
    const stored = getStoredTheme()
    setThemeRaw(stored)
    const resolved = resolveTheme(stored)
    setResolvedTheme(resolved)
    applyTheme(resolved)
    storeTheme(stored)
  }, [])

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
