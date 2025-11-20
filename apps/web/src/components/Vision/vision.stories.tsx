import type { Meta, StoryObj } from "@storybook/react-vite";
import Vision from "./vision";

const meta = {
  title: "Components/Content/Vision",
  component: Vision,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Vision>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeafyGreen: Story = {
  args: {
    title: "Preservation",
    icon: "leafy-green",
    description:
      "Dedicated to preserving the natural beauty and historical significance of Chimborazo Park for future generations.",
  },
};

export const Trees: Story = {
  args: {
    title: "Sustainability",
    icon: "trees",
    description:
      "Implementing sustainable practices to ensure the park's ecosystem thrives amidst urban development.",
  },
};

export const HeartHandshake: Story = {
  args: {
    title: "Community",
    icon: "heart-handshake",
    description:
      "Fostering a strong sense of community through inclusive events, volunteer opportunities, and shared spaces.",
  },
};

export const BookOpenText: Story = {
  args: {
    title: "Education",
    icon: "book-open-text",
    description:
      "Providing educational resources and programs to learn about the park's rich history and diverse ecology.",
  },
};
