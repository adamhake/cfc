import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { ThemeToggle } from "./theme-toggle";

const meta = {
  title: "Components/Interactive/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["button", "nav-item"],
      description: "Visual variant of the toggle",
    },
    showLabel: {
      control: "boolean",
      description: "Whether to show text label alongside icon",
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Button: Story = {
  args: {
    variant: "button",
    showLabel: true,
  },
};

export const ButtonWithoutLabel: Story = {
  args: {
    variant: "button",
    showLabel: false,
  },
};

export const NavItem: Story = {
  args: {
    variant: "nav-item",
    showLabel: true,
  },
};

export const NavItemWithoutLabel: Story = {
  args: {
    variant: "nav-item",
    showLabel: false,
  },
};

/**
 * Interaction test demonstrating theme toggle behavior
 */
export const WithInteraction: Story = {
  args: {
    variant: "button",
    showLabel: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Find and click the theme toggle", async () => {
      const toggle = canvas.getByRole("button", {
        name: /toggle.*theme|theme.*toggle/i,
      });

      // Verify toggle is in the document
      expect(toggle).toBeInTheDocument();

      // Get initial theme from document
      const initialTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";

      // Click the toggle
      await userEvent.click(toggle);

      // Small delay to allow theme to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify theme changed
      const newTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";

      // Theme should have toggled
      expect(newTheme).not.toBe(initialTheme);
    });

    await step("Verify toggle is keyboard accessible", async () => {
      const toggle = canvas.getByRole("button", {
        name: /toggle.*theme|theme.*toggle/i,
      });

      // Focus the toggle
      toggle.focus();
      expect(toggle).toHaveFocus();

      // Can be activated with Space key
      await userEvent.keyboard(" ");
    });
  },
};
