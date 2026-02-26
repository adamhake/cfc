import netlify from "@netlify/vite-plugin-tanstack-start";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    netlify(),
    tanstackStart({
      prerender: {
        enabled: false,
      },
    }),
    tailwindcss(),
    viteReact(),
  ],
  build: {
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Enable source maps for production debugging (hidden = generated but not shipped to users)
    sourcemap: process.env.NODE_ENV === "production" ? "hidden" : true,
    // Minify with terser for better compression
    minify: "terser",
    terserOptions: {
      compress: {
        // Keep console.error and console.warn for debugging
        pure_funcs: ["console.log", "console.info", "console.debug", "console.trace"],
        drop_debugger: true,
        passes: 2, // Better compression with 2 passes
      },
      mangle: {
        safari10: true, // Better Safari compatibility
      },
    },
    // Enable modulepreload polyfill for better resource loading
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // TanStack Start externalizes react, react-dom, and TanStack packages for SSR
          // Only manually chunk non-externalized vendor libraries
          if (id.includes("node_modules")) {
            if (
              id.includes("framer-motion") ||
              id.includes("lucide-react") ||
              id.includes("embla-carousel")
            ) {
              return "ui";
            }
            if (
              id.includes("@sanity/client") ||
              id.includes("@sanity/image-url") ||
              id.includes("@portabletext/react")
            ) {
              return "sanity";
            }
          }
        },
      },
    },
  },
});

export default config;
