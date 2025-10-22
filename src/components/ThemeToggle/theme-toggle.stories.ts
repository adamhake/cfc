import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThemeToggle } from "./theme-toggle";

const meta = {
  title: "Components/ThemeToggle",
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
