import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeToggle } from "@chimborazo/ui/theme-toggle";

const meta = {
  title: "Components/Interactive/ThemeToggle",
  component: ThemeToggle,
  argTypes: {
    variant: { control: "select", options: ["button", "nav-item"] },
    showLabel: { control: "boolean" },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: "button", showLabel: true },
};

export const NavItem: Story = {
  args: { variant: "nav-item", showLabel: true },
};

export const IconOnly: Story = {
  args: { variant: "button", showLabel: false },
};
