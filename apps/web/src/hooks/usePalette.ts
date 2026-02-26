import type { PaletteMode } from "@/utils/palette";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export interface UsePaletteReturn {
  palette: PaletteMode;
  setPalette: (palette: PaletteMode) => void;
}

/**
 * Hook to access and control palette state
 * Integrates with TanStack Router context
 */
export function usePalette(): UsePaletteReturn {
  const router = useRouter();
  const context = router.options.context;

  // Subscribe to palette changes for reactive updates
  const [palette, setPaletteState] = useState<PaletteMode>(context.palette || "olive");

  // Subscribe to palette manager updates
  useEffect(() => {
    const paletteManager = context._paletteManager as
      | {
          subscribe: (callback: (palette: PaletteMode) => void) => () => void;
        }
      | undefined;
    if (!paletteManager) return;

    const unsubscribe = paletteManager.subscribe((newPalette: PaletteMode) => {
      setPaletteState(newPalette);
    });

    return unsubscribe;
  }, [context]);

  // Listen to storage events for multi-tab sync
  useEffect(() => {
    if (typeof window === "undefined") return;

    const setPalette = context.setPalette;
    if (!setPalette) return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "palette-preference" && e.newValue) {
        setPalette(e.newValue as PaletteMode);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [context.setPalette]);

  return {
    palette,
    setPalette: context.setPalette || (() => {}),
  };
}
