import type { Meta, StoryObj } from "@storybook/react-vite";
import RotatingImages from "./rotating-images";

const meta = {
  title: "Components/Media/RotatingImages",
  component: RotatingImages,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RotatingImages>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockImages = [
  {
    asset: {
      _id: "image-1",
      url: "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=1000&q=80",
      metadata: { dimensions: { width: 1000, height: 600, aspectRatio: 1.66 } },
    },
    alt: "Scenic view of the park",
    caption: "A beautiful sunset over the city skyline from the park.",
  },
  {
    asset: {
      _id: "image-2",
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80",
      metadata: { dimensions: { width: 1000, height: 600, aspectRatio: 1.66 } },
    },
    alt: "Forest trail",
    caption: "Winding trails through the dense forest area.",
  },
  {
    asset: {
      _id: "image-3",
      url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1000&q=80",
      metadata: { dimensions: { width: 1000, height: 600, aspectRatio: 1.66 } },
    },
    alt: "Open green space",
    caption: "Wide open green spaces perfect for picnics and gatherings.",
  },
];

export const Default: Story = {
  args: {
    images: mockImages,
    className: "w-[600px] h-[400px] rounded-xl overflow-hidden",
    imageClassName: "object-cover w-full h-full",
  },
};

export const WithOverlayCaptions: Story = {
  args: {
    images: mockImages,
    className: "w-[600px] h-[400px] rounded-xl overflow-hidden",
    imageClassName: "object-cover w-full h-full",
    showCaptions: true,
    captionStyle: "overlay",
  },
};

export const WithCaptionsBelow: Story = {
  args: {
    images: mockImages,
    className: "w-[600px] h-[400px] rounded-xl overflow-hidden",
    imageClassName: "object-cover w-full h-full",
    showCaptions: true,
    captionStyle: "below",
  },
};

export const WithHotspotCaptions: Story = {
  args: {
    images: mockImages,
    className: "w-[600px] h-[400px] rounded-xl overflow-hidden",
    imageClassName: "object-cover w-full h-full",
    showCaptions: true,
    captionStyle: "hotspot",
  },
};
