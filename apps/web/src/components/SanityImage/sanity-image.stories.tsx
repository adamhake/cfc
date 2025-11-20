import type { Meta, StoryObj } from "@storybook/react-vite";
import { SanityImage } from "./sanity-image";

const meta = {
  title: "Components/Media/SanityImage",
  component: SanityImage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SanityImage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock Sanity image object based on typical query response
const mockSanityImage = {
  asset: {
    _id: "image-abc123",
    url: "https://cdn.sanity.io/images/projectid/production/abc123-1920x1080.jpg",
    metadata: {
      dimensions: {
        width: 1920,
        height: 1080,
        aspectRatio: 1.7778,
      },
      lqip: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAALABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFBv/EACQQAAIBAwMDBQAAAAAAAAAAAAECAwAEEQUhMQYSQRMiUWGR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAwAB/8QAGREAAwEBAQAAAAAAAAAAAAAAAAECESEx/9oADAMBAAIRAxEAPwDR6RpGmWMaSLpkKsrY+I/FeU/VGm2em65LBZWscMS8KqDH3XoMOnR7a/t7W3iWKNAPtA+K5X1rpEeoa5I8M6MrKPbu3GB/a7vS0s2H0f/Z",
    },
  },
  alt: "Chimborazo Park historic view",
  hotspot: {
    x: 0.5,
    y: 0.4,
    height: 0.8,
    width: 0.8,
  },
};

const mockEventImage = {
  asset: {
    _id: "image-def456",
    url: "https://cdn.sanity.io/images/projectid/production/def456-800x1200.jpg",
    metadata: {
      dimensions: {
        width: 800,
        height: 1200,
        aspectRatio: 0.6667,
      },
      lqip: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAYABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAQFAgP/xAAjEAACAQMEAgMBAAAAAAAAAAABAgMABBEFEiExQVETImFx/8QAFgEBAQEAAAAAAAAAAAAAAAAAAwEC/8QAGhEBAQACAwAAAAAAAAAAAAAAAAECESExQf/aADAMBQACEQMRAD8A4WemXdzOiQQszE4wK9G0X0+1tbhLi8ZpmjOQiDAzXG10O6gkV7i2lVl3bScA/teyxtbpHRmRj7WOeRSy72mZYf/Z",
    },
  },
  alt: "Community event poster",
};

/**
 * Default SanityImage with landscape orientation
 */
export const Default: Story = {
  args: {
    image: mockSanityImage,
    className: "rounded-lg shadow-lg",
    sizes: "(max-width: 768px) 100vw, 50vw",
  },
};

/**
 * Portrait orientation image (typical for event posters)
 */
export const Portrait: Story = {
  args: {
    image: mockEventImage,
    className: "rounded-lg shadow-lg",
    sizes: "(max-width: 768px) 100vw, 400px",
    maxWidth: 400,
  },
};

/**
 * Priority image (above-the-fold, like hero images)
 */
export const Priority: Story = {
  args: {
    image: mockSanityImage,
    priority: true,
    className: "rounded-lg",
    sizes: "100vw",
  },
};

/**
 * Custom breakpoints for larger hero images
 */
export const CustomBreakpoints: Story = {
  args: {
    image: mockSanityImage,
    breakpoints: [320, 640, 1024, 1536, 1920, 2560],
    className: "w-full",
    sizes: "100vw",
  },
};

/**
 * Image without blur placeholder
 */
export const NoPlaceholder: Story = {
  args: {
    image: mockSanityImage,
    showPlaceholder: false,
    className: "rounded-lg",
  },
};

/**
 * Cropped image (useful for thumbnails)
 */
export const Cropped: Story = {
  args: {
    image: mockSanityImage,
    maxWidth: 400,
    maxHeight: 300,
    fit: "crop",
    className: "rounded-lg",
  },
};

/**
 * High quality image
 */
export const HighQuality: Story = {
  args: {
    image: mockSanityImage,
    quality: 95,
    className: "rounded-lg",
  },
};

/**
 * Low quality for thumbnails
 */
export const LowQuality: Story = {
  args: {
    image: mockSanityImage,
    quality: 60,
    maxWidth: 200,
    className: "rounded-lg",
  },
};
