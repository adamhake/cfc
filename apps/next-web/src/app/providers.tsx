"use client";

import { ThemeContext, useThemeState } from "@/hooks/useTheme";
import { PaletteContext, usePaletteState } from "@/hooks/usePalette";
import { PostHogInit } from "@/integrations/posthog/provider";
import type { PaletteMode } from "@/utils/palette";
import type { ResolvedTheme, ThemeMode } from "@/utils/theme";
import { Suspense } from "react";

interface ProvidersProps {
  children: React.ReactNode;
  initialTheme: ThemeMode;
  initialResolvedTheme: ResolvedTheme;
  initialPalette: PaletteMode;
}

export function Providers({
  children,
  initialTheme,
  initialResolvedTheme,
  initialPalette,
}: ProvidersProps) {
  const themeState = useThemeState(initialTheme, initialResolvedTheme);
  const paletteState = usePaletteState(initialPalette);

  return (
    <ThemeContext value={themeState}>
      <PaletteContext value={paletteState}>
        {children}
        <Suspense>
          <PostHogInit />
        </Suspense>
      </PaletteContext>
    </ThemeContext>
  );
}
