import type { Meta, StoryObj } from "@storybook/react-vite";
import ImageCarousel from "./image-carousel";

const meta = {
  title: "Components/Media/ImageCarousel",
  component: ImageCarousel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ImageCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImages = [
  {
    src: "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=1000&q=80",
    alt: "Scenic view 1",
    title: "Mountain View",
    caption: "A beautiful view of the mountains.",
    width: 1000,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80",
    alt: "Scenic view 2",
    title: "Forest Path",
    caption: "A serene path through the forest.",
    width: 1000,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
    alt: "Scenic view 3",
    title: "Misty Morning",
    caption: "Fog rolling in over the hills.",
    width: 1000,
    height: 600,
  },
];

export const Default: Story = {
  args: {
    images: sampleImages,
  },
};

export const CaptionBelow: Story = {
  args: {
    images: sampleImages,
    captionPosition: "below",
  },
};

export const AutoPlay: Story = {
  args: {
    images: sampleImages,
    autoPlay: true,
    autoPlayInterval: 3000,
  },
};

export const NoNavigation: Story = {
  args: {
    images: sampleImages,
    showNavigation: false,
    showDots: false,
  },
};

export const SquareAspectRatio: Story = {
  args: {
    images: sampleImages,
    aspectRatio: "1/1",
  },
};
