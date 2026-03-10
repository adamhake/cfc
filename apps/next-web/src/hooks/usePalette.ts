"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { applyPalette, getStoredPalette, storePalette, type PaletteMode } from "@/utils/palette";
import { APPEARANCE_COOKIES, APPEARANCE_COOKIE_MAX_AGE } from "@/lib/appearance-shared";

interface PaletteContextValue {
  palette: PaletteMode;
  setPalette: (palette: PaletteMode) => void;
}

export const PaletteContext = createContext<PaletteContextValue>({
  palette: "olive",
  setPalette: () => {},
});

export function usePalette() {
  return useContext(PaletteContext);
}

export function usePaletteState(initialPalette: PaletteMode) {
  const [palette, setPaletteRaw] = useState<PaletteMode>(initialPalette);

  const setPalette = useCallback((newPalette: PaletteMode) => {
    setPaletteRaw(newPalette);
    applyPalette(newPalette);
    storePalette(newPalette);
    document.cookie = `${APPEARANCE_COOKIES.PALETTE}=${encodeURIComponent(newPalette)}; Path=/; Max-Age=${APPEARANCE_COOKIE_MAX_AGE}; SameSite=Lax`;
  }, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = getStoredPalette();
    if (stored && stored !== palette) {
      setPalette(stored);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Multi-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "palette-preference" && e.newValue) {
        setPaletteRaw(e.newValue as PaletteMode);
        applyPalette(e.newValue as PaletteMode);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return { palette, setPalette };
}
