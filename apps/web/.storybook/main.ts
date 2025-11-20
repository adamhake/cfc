import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  // Storybook 10 includes essentials (Controls, Actions, Backgrounds, Viewport, etc.) built-in
  // Only add custom addons here
  addons: ["@storybook/addon-a11y", "@storybook/addon-themes"],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  async viteFinal(config) {
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());

    // Ensure proper environment for development
    if (config.mode === "development") {
      config.define = {
        ...config.define,
        "process.env.NODE_ENV": JSON.stringify("development"),
      };
    }

    return config;
  },
};

export default config;
