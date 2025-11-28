import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heart, Leaf, Users } from "lucide-react";
import SupportOption from "./support-option";

const meta = {
  title: "Components/Content/SupportOption",
  component: SupportOption,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
    },
  },
} satisfies Meta<typeof SupportOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Volunteer",
    description: "Join our community of volunteers to help maintain the park and organize events.",
    icon: <Users className="h-6 w-6 text-accent-600 dark:text-accent-400" />,
  },
};

export const Donate: Story = {
  args: {
    title: "Donate",
    description: "Support the conservancy financially to fund new projects and improvements.",
    icon: <Heart className="h-6 w-6 text-accent-600 dark:text-accent-400" />,
  },
};

export const Advocate: Story = {
  args: {
    title: "Advocate",
    description: "Spread the word about our mission and help us protect this historic green space.",
    icon: <Leaf className="h-6 w-6 text-accent-600 dark:text-accent-400" />,
  },
};

export const ComingSoon: Story = {
  args: {
    title: "Adopt a Bench",
    description:
      "Honor a loved one with a personalized dedication plaque on one of our park benches.",
    icon: <Heart className="h-6 w-6 text-accent-600 dark:text-accent-400" />,
    comingSoon: true,
  },
};
