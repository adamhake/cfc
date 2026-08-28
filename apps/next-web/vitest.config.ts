import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  // Vite 8 transforms with oxc, which honours the app tsconfig's
  // `jsx: "preserve"` (required by Next.js). Tests need real JSX output.
  oxc: {
    jsx: { runtime: "automatic" },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
