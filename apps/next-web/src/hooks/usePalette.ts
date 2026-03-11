"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { APPEARANCE_COOKIE_MAX_AGE, APPEARANCE_COOKIES } from "@/lib/appearance-shared"
import { applyPalette, getStoredPalette, type PaletteMode, storePalette } from "@/utils/palette"

interface PaletteContextValue {
  palette: PaletteMode
  setPalette: (palette: PaletteMode) => void
}

export const PaletteContext = createContext<PaletteContextValue>({
  palette: "olive",
  setPalette: () => {},
})

export function usePalette() {
  return useContext(PaletteContext)
}

export function usePaletteState(initialPalette: PaletteMode) {
  // Initialize with server-provided value to avoid hydration mismatch.
  // Client-side localStorage is synced in the mount effect below.
  const [palette, setPaletteRaw] = useState<PaletteMode>(initialPalette)

  const setPalette = useCallback((newPalette: PaletteMode) => {
    setPaletteRaw(newPalette)
    applyPalette(newPalette)
    storePalette(newPalette)
    // biome-ignore lint/suspicious/noDocumentCookie: client-side cookie for palette persistence
    document.cookie = `${APPEARANCE_COOKIES.PALETTE}=${encodeURIComponent(newPalette)}; Path=/; Max-Age=${APPEARANCE_COOKIE_MAX_AGE}; SameSite=Lax`
  }, [])

  // Sync with localStorage on mount
  useEffect(() => {
    const stored = getStoredPalette()
    if (stored) {
      setPaletteRaw(stored)
      applyPalette(stored)
      storePalette(stored)
    } else {
      applyPalette(initialPalette)
      storePalette(initialPalette)
    }
  }, [initialPalette])

  // Multi-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "palette-preference" && e.newValue) {
        setPaletteRaw(e.newValue as PaletteMode)
        applyPalette(e.newValue as PaletteMode)
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  return { palette, setPalette }
}
