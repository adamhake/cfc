import netlify from "@netlify/vite-plugin-tanstack-start";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "vite";
import webfontDownload from "vite-plugin-webfont-dl";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    netlify({
      edgeSSR: true,
    }),
    tanstackStart({
      prerender: {
        enabled: true,
      },
      sitemap: {
        enabled: true,
        host: process.env.SERVER_URL || "https://chimborazoparkconservancy.org",
      },
    }),
    tailwindcss(),
    viteReact(),
    webfontDownload([
      "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Vollkorn+SC:wght@400;600;700;900&display=swap",
    ]),
    {
      name: "force-exit-after-complete-build",
      apply: "build",
      enforce: "post",

      buildEnd() {
        // This runs after all environments are built
        // Now we need to wait for postServerBuild (prerender + sitemap) to complete
        if (process.env.NODE_ENV !== "development") {
          const checkInterval = setInterval(() => {
            // Check if the sitemap has been generated
            const sitemapPath = join(process.cwd(), "dist/client/pages.json");

            if (existsSync(sitemapPath)) {
              clearInterval(checkInterval);
              console.log("\n✓ Sitemap generated, exiting process in 2 seconds...");

              setTimeout(() => {
                console.log("✓ Build complete, forcing exit.");
                process.exit(0);
              }, 2000);
            }
          }, 500); // Check every 500ms

          // Safety timeout - exit after 3 minutes even if sitemap not found
          setTimeout(() => {
            clearInterval(checkInterval);
            console.log("\n⚠ Timeout reached, forcing exit...");
            process.exit(0);
          }, 180000);
        }
      },
    },
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
