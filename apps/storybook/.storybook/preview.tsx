import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview, ReactRenderer } from "@storybook/react-vite";
import { PaletteProvider, ThemeProvider } from "@chimborazo/ui/hooks";
import type { PaletteMode } from "@chimborazo/ui/tokens";

import "../src/fonts.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

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

    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#fafaf9",
        },
        {
          name: "dark",
          value: "#1c1917",
        },
        {
          name: "white",
          value: "#ffffff",
        },
      ],
    },

    actions: { argTypesRegex: "^on[A-Z].*" },

    options: {
      storySort: {
        order: [
          "Design Tokens",
          ["Colors", "Typography", "Spacing", "Palettes"],
          "Components",
          ["Layout", "Content", "Interactive", "Media", "Icons"],
          "Patterns",
          "*",
        ],
      },
    },
  },

  globalTypes: {
    palette: {
      name: "Color Palette",
      description: "Switch between color palettes",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "olive", title: "Warm Olive + Blue-Grey (Default)" },
          { value: "green", title: "Classic Green" },
          { value: "green-terra", title: "Green + Terracotta" },
          { value: "green-navy", title: "Green + Navy" },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    palette: "olive",
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

    // Palette + Theme provider decorator
    (Story, context) => {
      const palette = (context.globals.palette || "olive") as PaletteMode;
      const backgroundColor = context.globals.backgrounds?.value || "#fafaf9";
      const isDark = backgroundColor === "#1c1917";

      return (
        <ThemeProvider defaultTheme={isDark ? "dark" : "light"}>
          <PaletteProvider defaultPalette={palette}>
            <div
              className={`${isDark ? "dark" : ""} min-h-screen`}
              style={{ backgroundColor }}
              data-palette={palette === "olive" ? undefined : palette}
            >
              <div className="p-4">
                <Story />
              </div>
            </div>
          </PaletteProvider>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
