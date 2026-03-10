import type { Meta, StoryObj } from "@storybook/react-vite";
import ImageGallery from "./image-gallery";

const meta = {
  title: "Components/Media/ImageGallery",
  component: ImageGallery,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ImageGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImages = [
  {
    src: "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=1000&q=80",
    alt: "Gallery Image 1",
    caption: "Beautiful landscape view",
    width: 1000,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80",
    alt: "Gallery Image 2",
    caption: "Forest trail in autumn",
    width: 1000,
    height: 1500, // Portrait for masonry
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
    alt: "Gallery Image 3",
    caption: "Misty morning sunrise",
    width: 1000,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?auto=format&fit=crop&w=1000&q=80",
    alt: "Gallery Image 4",
    caption: "Mountain peak",
    width: 1000,
    height: 1000, // Square
  },
  {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
    alt: "Gallery Image 5",
    caption: "Sunset over the valley",
    width: 1000,
    height: 600,
  },
];

export const Grid: Story = {
  args: {
    images: sampleImages,
    variant: "grid",
    columns: { default: 1, sm: 2, md: 3 },
  },
};

export const Masonry: Story = {
  args: {
    images: sampleImages,
    variant: "masonry",
    columns: { default: 1, sm: 2, md: 3 },
  },
};

export const Staggered: Story = {
  args: {
    images: sampleImages,
    variant: "staggered",
    columns: { default: 1, sm: 2, md: 3 },
  },
};

export const CaptionBelow: Story = {
  args: {
    images: sampleImages,
    variant: "grid",
    captionPosition: "below",
    columns: { default: 1, sm: 2, md: 3 },
  },
};

/**
 * Empty gallery state - useful for showing when no images are available
 */
export const EmptyGallery: Story = {
  args: {
    images: [],
    variant: "grid",
    columns: { default: 1, sm: 2, md: 3 },
  },
};

/**
 * Single image in gallery
 */
export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]],
    variant: "grid",
    columns: { default: 1, sm: 2, md: 3 },
  },
};

/**
 * Large gallery with many images
 */
export const LargeGallery: Story = {
  args: {
    images: [
      ...sampleImages,
      ...sampleImages.map((img, i) => ({
        ...img,
        alt: `${img.alt} - ${i}`,
        caption: `${img.caption} (${i + 6})`,
      })),
      ...sampleImages.map((img, i) => ({
        ...img,
        alt: `${img.alt} - ${i + 5}`,
        caption: `${img.caption} (${i + 11})`,
      })),
    ],
    variant: "masonry",
    columns: { default: 2, sm: 3, md: 4 },
  },
};
