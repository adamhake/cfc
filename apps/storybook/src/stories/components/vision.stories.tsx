import type { Meta, StoryObj } from "@storybook/react-vite";
import { Vision } from "@chimborazo/ui/vision";

const meta = {
  title: "Components/Content/Vision",
  component: Vision,
  argTypes: {
    pillar: {
      control: "select",
      options: ["restoration", "preservation", "connection", "recreation"],
    },
  },
} satisfies Meta<typeof Vision>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Restoration: Story = {
  args: {
    title: "Restoration",
    description: "Revitalizing park infrastructure and natural habitats to their full potential.",
    pillar: "restoration",
  },
};

export const Preservation: Story = {
  args: {
    title: "Preservation",
    description: "Protecting the historical significance and natural beauty of Chimborazo Park.",
    pillar: "preservation",
  },
};

export const Connection: Story = {
  args: {
    title: "Connection",
    description: "Building bridges between the park and its diverse community of neighbors.",
    pillar: "connection",
  },
};

export const Recreation: Story = {
  args: {
    title: "Recreation",
    description: "Creating opportunities for outdoor activities and community gatherings.",
    pillar: "recreation",
  },
};

export const WithBulletPoints: Story = {
  args: {
    title: "Restoration Goals",
    description: [
      "Restore native plant habitats",
      "Repair walking trails and pathways",
      "Upgrade playground equipment",
    ],
    pillar: "restoration",
  },
};

export const AllPillars: Story = {
  args: { title: "Restoration", pillar: "restoration" },
  render: () => (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Vision
        title="Restoration"
        description="Revitalizing park infrastructure and natural habitats."
        pillar="restoration"
      />
      <Vision
        title="Preservation"
        description="Protecting historical significance and natural beauty."
        pillar="preservation"
      />
      <Vision
        title="Connection"
        description="Building bridges between the park and community."
        pillar="connection"
      />
      <Vision
        title="Recreation"
        description="Creating opportunities for outdoor activities."
        pillar="recreation"
      />
    </div>
  ),
};
