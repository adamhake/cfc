import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeDeciduous } from "lucide-react";
import AmenityCard from "./amenity-card";

const meta = {
  title: "Components/Content/AmenityCard",
  component: AmenityCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
    },
  },
} satisfies Meta<typeof AmenityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Park Amenities",
    description: "Enjoy our beautiful park with various amenities for everyone.",
    icon: <TreeDeciduous />,
  },
};

export const WithDetails: Story = {
  args: {
    title: "Picnic Area",
    description: "Designated areas for family picnics and gatherings.",
    icon: <TreeDeciduous />,
    details: ["Tables available", "BBQ pits", "Near restrooms"],
  },
};

export const WithLink: Story = {
  args: {
    title: "Hiking Trails",
    description: "Explore miles of scenic trails.",
    icon: <TreeDeciduous />,
    link: {
      text: "View Map",
      url: "#",
    },
  },
};

export const WithImage: Story = {
  args: {
    title: "Scenic View",
    description: "Breathtaking views of the city skyline.",
    icon: <TreeDeciduous />,
    image: {
      src: "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=1000&q=80",
      alt: "Scenic view",
    },
  },
};
