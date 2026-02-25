import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaletteSwitcher } from "@chimborazo/ui/palette-switcher";

const meta = {
  title: "Components/Interactive/PaletteSwitcher",
  component: PaletteSwitcher,
  argTypes: {
    variant: { control: "select", options: ["button", "compact"] },
    showLabel: { control: "boolean" },
  },
} satisfies Meta<typeof PaletteSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: "button", showLabel: true },
};

export const Compact: Story = {
  args: { variant: "compact", showLabel: true },
};

export const IconOnly: Story = {
  args: { variant: "compact", showLabel: false },
};
