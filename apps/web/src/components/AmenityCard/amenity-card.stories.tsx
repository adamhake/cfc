import type { SanityImageObject } from "@/components/SanityImage/sanity-image";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeDeciduous } from "lucide-react";
import AmenityCard from "./amenity-card";

const mockImage: SanityImageObject = {
  asset: {
    _id: "image-landscape-123",
    url: "https://cdn.sanity.io/images/projectid/production/landscape-1920x1080.jpg",
    metadata: {
      dimensions: {
        width: 1920,
        height: 1080,
        aspectRatio: 1.7778,
      },
      lqip: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAALABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFBv/EACQQAAIBAwMDBQAAAAAAAAAAAAECAwAEEQUhMQZBUhMiUWGR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAwAB/8QAGREAAwEBAQAAAAAAAAAAAAAAAAECESEx/9oADAMBAAIRAxEAPwDR6RpGmWMaSLpkKsrY+I/FeU/VGm2em65LBZWscMS8KqDH3XoMOnR7a/t7W3iWKNAPtA+K5X1rpEeoa5I8M6MrKPbu3GB/a7vS0s2H0f/Z",
    },
  },
  alt: "Chimborazo Park scenic view",
};

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
    images: [mockImage],
  },
};
