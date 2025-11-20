import type { Meta, StoryObj } from "@storybook/react-vite";
import SectionHeader from "./section-header";

const meta = {
  title: "Components/Content/SectionHeader",
  component: SectionHeader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Section Title",
  },
};

export const Small: Story = {
  args: {
    title: "Small Section Title",
    size: "small",
  },
};

export const Large: Story = {
  args: {
    title: "Large Section Title",
    size: "large",
  },
};

export const H3: Story = {
  args: {
    title: "H3 Section Title",
    level: "h3",
  },
};

export const H4: Story = {
  args: {
    title: "H4 Section Title",
    level: "h4",
  },
};
