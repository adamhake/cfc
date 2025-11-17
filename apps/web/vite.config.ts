import netlify from "@netlify/vite-plugin-tanstack-start";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import webfontDownload from "vite-plugin-webfont-dl";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      sitemap: {
        enabled: true,
        host: process.env.SERVER_URL || "https://chimborazoparkconservancy.org",
      },
    }),
    netlify({
      edgeSSR: true,
    }),
    webfontDownload([
      "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Vollkorn+SC:wght@400;600;700;900&display=swap",
    ]),
    tailwindcss(),
    viteReact(),
  ],
  build: {
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Enable source maps for production debugging
    sourcemap: true,
    // Minify with terser for better compression
    minify: "terser",
    terserOptions: {
      compress: {
        // Keep console.error and console.warn for debugging
        pure_funcs: ["console.log", "console.info", "console.debug", "console.trace"],
        drop_debugger: true,
      },
    },
    rollupOptions: {},
  },
});

export default config;
