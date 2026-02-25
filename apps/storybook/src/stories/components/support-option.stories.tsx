import type { Meta, StoryObj } from "@storybook/react-vite";
import { SupportOption } from "@chimborazo/ui/support-option";
import { Heart, HandCoins, Users } from "lucide-react";

const meta = {
  title: "Components/Content/SupportOption",
  component: SupportOption,
} satisfies Meta<typeof SupportOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Donate",
    description: "Support the conservancy with a one-time or recurring donation.",
    icon: <Heart className="h-6 w-6 text-accent-600 dark:text-accent-400" />,
    ctaText: "Donate Now",
    ctaLink: "#donate",
  },
};

export const ComingSoon: Story = {
  args: {
    title: "Membership",
    description: "Become a member and enjoy exclusive benefits.",
    icon: <Users className="h-6 w-6 text-accent-600 dark:text-accent-400" />,
    comingSoon: true,
  },
};

export const AllOptions: Story = {
  args: { title: "Donate", description: "Support the conservancy.", icon: null },
  render: () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <SupportOption
        title="Donate"
        description="Support with a one-time or recurring donation."
        icon={<Heart className="h-6 w-6 text-accent-600 dark:text-accent-400" />}
        ctaText="Donate Now"
        ctaLink="#donate"
      />
      <SupportOption
        title="Sponsor"
        description="Sponsor a specific park improvement project."
        icon={<HandCoins className="h-6 w-6 text-accent-600 dark:text-accent-400" />}
        ctaText="Learn More"
        ctaLink="#sponsor"
      />
      <SupportOption
        title="Membership"
        description="Become a member for exclusive benefits."
        icon={<Users className="h-6 w-6 text-accent-600 dark:text-accent-400" />}
        comingSoon
      />
    </div>
  ),
};
