"use client"

import { useMemo } from "react"
import { PaletteContext, usePaletteState } from "@/hooks/usePalette"
import { ThemeContext, useThemeState } from "@/hooks/useTheme"
import type { PaletteMode } from "@/utils/palette"
import type { ResolvedTheme, ThemeMode } from "@/utils/theme"

interface ProvidersProps {
  children: React.ReactNode
  initialTheme: ThemeMode
  initialResolvedTheme: ResolvedTheme
  initialPalette: PaletteMode
}

export function Providers({
  children,
  initialTheme,
  initialResolvedTheme,
  initialPalette,
}: ProvidersProps) {
  const { theme, setTheme, resolvedTheme } = useThemeState(initialTheme, initialResolvedTheme)
  const { palette, setPalette } = usePaletteState(initialPalette)

  const themeValue = useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme],
  )

  const paletteValue = useMemo(() => ({ palette, setPalette }), [palette, setPalette])

  return (
    <ThemeContext value={themeValue}>
      <PaletteContext value={paletteValue}>{children}</PaletteContext>
    </ThemeContext>
  )
}
