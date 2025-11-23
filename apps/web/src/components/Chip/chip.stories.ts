import type { Meta, StoryObj } from "@storybook/react";
import Chip from "./chip";

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "planned",
        "active",
        "completed",
        "restoration",
        "recreation",
        "connection",
        "preservation",
        "upcoming",
        "past",
      ],
      description: "The visual variant of the chip",
    },
    label: {
      control: "text",
      description: "Optional custom label (defaults to variant name)",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

// Project Status Variants
export const ProjectStatusPlanned: Story = {
  args: {
    variant: "planned",
  },
};

export const ProjectStatusActive: Story = {
  args: {
    variant: "active",
  },
};

export const ProjectStatusCompleted: Story = {
  args: {
    variant: "completed",
  },
};

// Project Category Variants
export const CategoryRestoration: Story = {
  args: {
    variant: "restoration",
  },
};

export const CategoryRecreation: Story = {
  args: {
    variant: "recreation",
  },
};

export const CategoryConnection: Story = {
  args: {
    variant: "connection",
  },
};

export const CategoryPreservation: Story = {
  args: {
    variant: "preservation",
  },
};

// Event Status Variants
export const EventUpcoming: Story = {
  args: {
    variant: "upcoming",
  },
};

export const EventPast: Story = {
  args: {
    variant: "past",
  },
};

// Custom Label
export const WithCustomLabel: Story = {
  args: {
    variant: "active",
    label: "In Progress",
  },
};

// Custom Label
export const LargerSize: Story = {
  args: {
    variant: "active",
    className: "px-4 py-2 text-base",
  },
};
