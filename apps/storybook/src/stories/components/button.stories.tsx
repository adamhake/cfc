import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@chimborazo/ui/button";

const meta = {
  title: "Components/Interactive/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "accent"],
    },
    size: {
      control: "select",
      options: ["small", "standard", "large"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "standard",
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "Primary Button" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary Button" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Outline Button" },
};

export const Accent: Story = {
  args: { variant: "accent", children: "Accent Button" },
};

export const Small: Story = {
  args: { size: "small", children: "Small Button" },
};

export const Large: Story = {
  args: { size: "large", children: "Large Button" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Disabled Button" },
};

export const AsAnchor: Story = {
  args: {
    as: "a",
    href: "#",
    children: "Link Button",
    variant: "accent",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="accent">Accent</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="small">Small</Button>
      <Button size="standard">Standard</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};
