import type { Meta, StoryObj } from "@storybook/react-vite";
import { EventStatusChip } from "@chimborazo/ui/event-status-chip";

const meta = {
  title: "Components/Content/EventStatusChip",
  component: EventStatusChip,
  argTypes: {
    isPast: { control: "boolean" },
  },
} satisfies Meta<typeof EventStatusChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Upcoming: Story = {
  args: { isPast: false },
};

export const Past: Story = {
  args: { isPast: true },
};

export const Both: Story = {
  args: { isPast: false },
  render: () => (
    <div className="flex gap-4">
      <EventStatusChip isPast={false} />
      <EventStatusChip isPast={true} />
    </div>
  ),
};
