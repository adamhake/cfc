import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionHeader } from "@chimborazo/ui/section-header";

const meta = {
  title: "Components/Content/SectionHeader",
  component: SectionHeader,
  argTypes: {
    level: { control: "select", options: ["h2", "h3", "h4"] },
    size: { control: "select", options: ["small", "medium", "large"] },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: "Section Title" },
};

export const Large: Story = {
  args: { title: "Large Section Title", size: "large" },
};

export const Small: Story = {
  args: { title: "Small Section Title", size: "small" },
};

export const AllSizes: Story = {
  args: { title: "Section Title" },
  render: () => (
    <div className="space-y-6">
      <SectionHeader title="Large Heading" size="large" />
      <SectionHeader title="Medium Heading" size="medium" />
      <SectionHeader title="Small Heading" size="small" />
    </div>
  ),
};
