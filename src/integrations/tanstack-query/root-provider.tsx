import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  type ThemeMode,
  type ResolvedTheme,
  getStoredTheme,
  resolveTheme,
  storeTheme,
  applyTheme,
} from "@/utils/theme";

export function getContext() {
  const queryClient = new QueryClient();

  // Theme state management
  let currentTheme: ThemeMode = getStoredTheme();
  let currentResolved: ResolvedTheme = resolveTheme(currentTheme);

  const setTheme = (newTheme: ThemeMode) => {
    currentTheme = newTheme;
    currentResolved = resolveTheme(newTheme);
    storeTheme(newTheme);
    applyTheme(currentResolved);
  };

  return {
    queryClient,
    theme: currentTheme,
    setTheme,
    resolvedTheme: currentResolved,
  };
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
