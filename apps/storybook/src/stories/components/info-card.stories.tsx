import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoCard } from "@chimborazo/ui/info-card";
import { MapPin, Clock, Phone } from "lucide-react";

const meta = {
  title: "Components/Content/InfoCard",
  component: InfoCard,
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <MapPin className="h-6 w-6 text-primary-700 dark:text-primary-300" />,
    title: "Location",
    content: "3215 E Broad St, Richmond, VA 23223",
  },
};

export const MultipleCards: Story = {
  args: { icon: null, title: "Location", content: "Example" },
  render: () => (
    <div className="space-y-4">
      <InfoCard
        icon={<MapPin className="h-6 w-6 text-primary-700 dark:text-primary-300" />}
        title="Location"
        content="3215 E Broad St, Richmond, VA 23223"
      />
      <InfoCard
        icon={<Clock className="h-6 w-6 text-primary-700 dark:text-primary-300" />}
        title="Hours"
        content="Dawn to dusk, 7 days a week"
      />
      <InfoCard
        icon={<Phone className="h-6 w-6 text-primary-700 dark:text-primary-300" />}
        title="Contact"
        content="info@chimbopark.org"
      />
    </div>
  ),
};
