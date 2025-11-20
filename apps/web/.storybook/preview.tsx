import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview, ReactRenderer } from "@storybook/react-vite";

import "../src/styles.css";

const preview: Preview = {
  parameters: {
    // Configure control matchers for automatic detection
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    // Configure viewport options to match design breakpoints
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop",
          styles: {
            width: "1280px",
            height: "800px",
          },
        },
        wide: {
          name: "Wide Desktop",
          styles: {
            width: "1920px",
            height: "1080px",
          },
        },
      },
    },

    // Configure background options
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#fafaf9", // stone-50
        },
        {
          name: "dark",
          value: "#1c1917", // stone-900
        },
        {
          name: "white",
          value: "#ffffff",
        },
      ],
    },

    // Configure actions logging
    actions: { argTypesRegex: "^on[A-Z].*" },

    // Sort stories alphabetically by default
    options: {
      storySort: {
        order: [
          "Introduction",
          "Components",
          ["Layout", "Content", "Interactive", "Media", "Icons"],
          "*",
        ],
      },
    },
  },

  decorators: [
    // Theme switching decorator
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),

    // Background color decorator - properly manages body classes
    (Story, context) => {
      // Use the selected background from Storybook UI
      const backgroundColor = context.globals.backgrounds?.value || "#fafaf9";
      const isDark = backgroundColor === "#1c1917";

      return (
        <div className={`${isDark ? "dark" : ""} min-h-screen`} style={{ backgroundColor }}>
          <div className="dark:bg-stone-900 bg-stone-50">
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default preview;
