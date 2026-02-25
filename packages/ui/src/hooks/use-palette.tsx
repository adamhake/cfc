import { createContext, useContext, useEffect, useState } from "react";
import type { PaletteMode } from "../tokens/palettes";
import { applyPalette, validatePalette } from "../tokens/palettes";

export interface PaletteContextValue {
  palette: PaletteMode;
  setPalette: (palette: PaletteMode) => void;
}

export const PaletteContext = createContext<PaletteContextValue | null>(null);

export interface PaletteProviderProps {
  defaultPalette?: PaletteMode;
  onPaletteChange?: (palette: PaletteMode) => void;
  children: React.ReactNode;
}

/**
 * Context-based palette provider with no router dependency.
 * Any app can wrap this with its own state management.
 */
export function PaletteProvider({
  defaultPalette = "olive",
  onPaletteChange,
  children,
}: PaletteProviderProps) {
  const [palette, setPaletteState] = useState<PaletteMode>(defaultPalette);

  const setPalette = (newPalette: PaletteMode) => {
    const validated = validatePalette(newPalette);
    setPaletteState(validated);
    applyPalette(validated);
    onPaletteChange?.(validated);
  };

  // Apply palette on mount
  useEffect(() => {
    applyPalette(palette);
  }, [palette]);

  return (
    <PaletteContext value={{ palette, setPalette }}>
      {children}
    </PaletteContext>
  );
}

/**
 * Hook to access and control palette state.
 * Must be used within a PaletteProvider.
 */
export function usePalette(): PaletteContextValue {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error("usePalette must be used within a PaletteProvider");
  }
  return context;
}
