import type { Meta, StoryObj } from "@storybook/react-vite";
import EventStatusChip from "./event-status-chip";

const meta = {
  title: "Components/Content/EventStatusChip",
  component: EventStatusChip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EventStatusChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Upcoming: Story = {
  args: {
    isPast: false,
  },
};

export const Past: Story = {
  args: {
    isPast: true,
  },
};
