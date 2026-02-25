import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconLogo } from "@chimborazo/ui/icon-logo";

const meta = {
  title: "Components/Icons/IconLogo",
  component: IconLogo,
} satisfies Meta<typeof IconLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "h-24 w-auto text-primary-700 dark:text-primary-400",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <IconLogo className="h-8 w-auto text-primary-700 dark:text-primary-400" />
      <IconLogo className="h-16 w-auto text-primary-700 dark:text-primary-400" />
      <IconLogo className="h-24 w-auto text-primary-700 dark:text-primary-400" />
      <IconLogo className="h-32 w-auto text-primary-700 dark:text-primary-400" />
    </div>
  ),
};
