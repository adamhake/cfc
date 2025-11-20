import type { Meta, StoryObj } from "@storybook/react-vite";
import ImageCard from "./image-card";

const meta = {
    title: "Components/ImageCard",
    component: ImageCard,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        onCtaClick: { action: "clicked" },
    },
} satisfies Meta<typeof ImageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImage = {
    src: "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=1000&q=80",
    alt: "Scenic view",
    width: 1000,
    height: 600,
};

export const Overlay: Story = {
    args: {
        image: sampleImage,
        title: "Card Title",
        description: "This is a description of the card content.",
        variant: "overlay",
        ctaText: "Learn More",
    },
};

export const CaptionBelow: Story = {
    args: {
        image: sampleImage,
        title: "Card Title",
        description: "This is a description of the card content.",
        variant: "caption-below",
        ctaText: "Learn More",
    },
};

export const SideBySide: Story = {
    args: {
        image: sampleImage,
        title: "Card Title",
        description: "This is a description of the card content.",
        variant: "side-by-side",
        ctaText: "Learn More",
    },
};

export const SideBySideRight: Story = {
    args: {
        image: sampleImage,
        title: "Card Title",
        description: "This is a description of the card content.",
        variant: "side-by-side",
        imagePosition: "right",
        ctaText: "Learn More",
    },
};

export const AspectRatioSquare: Story = {
    args: {
        image: sampleImage,
        title: "Square Image",
        variant: "caption-below",
        aspectRatio: "1/1",
    },
};
