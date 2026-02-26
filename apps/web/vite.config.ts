import netlify from "@netlify/vite-plugin-tanstack-start";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

// Netlify's serverless adapter patches globalThis.fetch when the server bundle
// loads during prerendering. The patched fetch can't reach the local preview
// server, causing ECONNREFUSED. Lock native fetch during builds so the
// prerender step can reach the local preview server on localhost.
const nativeFetch = globalThis.fetch;

function preserveFetchForPrerender(): Plugin {
  return {
    name: "preserve-fetch-for-prerender",
    apply: "build",
    enforce: "pre",
    configResolved() {
      Object.defineProperty(globalThis, "fetch", {
        get: () => nativeFetch,
        set() {},
        configurable: true,
      });
    },
  };
}

// After prerendering, Netlify's OpenTelemetry/tracing setup keeps the event
// loop alive, preventing the process from exiting. This timer fires only if
// the event loop is still active (unref'd so it won't delay a normal exit).
let prerenderExitTimer: ReturnType<typeof setTimeout> | undefined;

const config = defineConfig({
  plugins: [
    preserveFetchForPrerender(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    netlify(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: false,
        retryCount: 3,
        retryDelay: 750,
        filter: ({ path }) => path !== "/components",
        onSuccess: () => {
          clearTimeout(prerenderExitTimer);
          prerenderExitTimer = setTimeout(() => process.exit(0), 5000);
          prerenderExitTimer.unref();
        },
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
  preview: {
    // Force IPv4 loopback in prerender preview to avoid ::1 resolution issues in CI.
    host: "127.0.0.1",
  },
});

export default config;
