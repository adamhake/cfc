"use client"

import { useMemo } from "react"
import { ThemeContext, useThemeState } from "@/hooks/useTheme"
import type { ResolvedTheme, ThemeMode } from "@/utils/theme"

interface ProvidersProps {
  children: React.ReactNode
  initialTheme: ThemeMode
  initialResolvedTheme: ResolvedTheme
}

export function Providers({ children, initialTheme, initialResolvedTheme }: ProvidersProps) {
  const { theme, setTheme, resolvedTheme } = useThemeState(initialTheme, initialResolvedTheme)

  const themeValue = useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme],
  )

  return <ThemeContext value={themeValue}>{children}</ThemeContext>
}
