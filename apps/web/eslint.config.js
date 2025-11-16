import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginRouter from "@tanstack/eslint-plugin-router";

export default defineConfig([
  globalIgnores([
    "dist",
    "src/routeTree.gen.ts",
    ".netlify",
    "node_modules",
    ".worktrees",
    "scripts",
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.recommended,
  ...pluginRouter.configs["flat/recommended"],
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-empty-function": "off",
      "react-refresh/only-export-components": "warn",
    },
  },
]);
