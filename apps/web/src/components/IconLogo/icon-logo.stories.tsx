import type { Meta, StoryObj } from "@storybook/react-vite";
import IconLogo from "./icon-logo";

const meta = {
  title: "Components/Icons/IconLogo",
  component: IconLogo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IconLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "h-24 w-24 text-primary-900 dark:text-primary-100",
  },
};

export const Small: Story = {
  args: {
    className: "h-12 w-12 text-primary-900 dark:text-primary-100",
  },
};

export const Large: Story = {
  args: {
    className: "h-48 w-48 text-primary-900 dark:text-primary-100",
  },
};
