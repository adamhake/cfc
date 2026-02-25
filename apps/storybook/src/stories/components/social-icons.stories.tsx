import type { Meta, StoryObj } from "@storybook/react-vite";
import { FacebookIcon } from "@chimborazo/ui/facebook-icon";
import { InstagramIcon } from "@chimborazo/ui/instagram-icon";

const meta = {
  title: "Components/Icons/SocialIcons",
  component: FacebookIcon,
} satisfies Meta<typeof FacebookIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Facebook: Story = {
  render: () => (
    <FacebookIcon className="h-8 w-8 fill-primary-700 dark:fill-primary-400" />
  ),
};

export const Instagram: Story = {
  render: () => (
    <InstagramIcon className="h-8 w-8 fill-primary-700 dark:fill-primary-400" />
  ),
};

export const AllSocial: Story = {
  render: () => (
    <div className="flex gap-4">
      <FacebookIcon className="h-8 w-8 fill-primary-700 dark:fill-primary-400" />
      <InstagramIcon className="h-8 w-8 fill-primary-700 dark:fill-primary-400" />
    </div>
  ),
};
