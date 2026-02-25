import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "@chimborazo/ui/chip";

const meta = {
  title: "Components/Content/Chip",
  component: Chip,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "planned", "active", "completed",
        "restoration", "recreation", "connection", "preservation",
        "upcoming", "past",
        "comingSoon",
      ],
    },
    label: { control: "text" },
  },
  args: {
    variant: "active",
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = { args: { variant: "active" } };
export const Planned: Story = { args: { variant: "planned" } };
export const Completed: Story = { args: { variant: "completed" } };
export const Upcoming: Story = { args: { variant: "upcoming" } };
export const Past: Story = { args: { variant: "past" } };
export const ComingSoon: Story = { args: { variant: "comingSoon" } };

export const ProjectCategories: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip variant="restoration" />
      <Chip variant="recreation" />
      <Chip variant="connection" />
      <Chip variant="preservation" />
    </div>
  ),
};

export const ProjectStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip variant="planned" />
      <Chip variant="active" />
      <Chip variant="completed" />
    </div>
  ),
};

export const CustomLabel: Story = {
  args: { variant: "active", label: "Custom Label" },
};
