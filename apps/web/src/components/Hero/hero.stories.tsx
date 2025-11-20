import type { Meta, StoryObj } from "@storybook/react-vite";
import Hero from "./hero";

const meta = {
    title: "Components/Hero",
    component: Hero,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        imageSrc: "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=2000&q=80",
    },
};

export const CustomContent: Story = {
    args: {
        heading: "Welcome to the Park",
        subheading: "A place for everyone to enjoy nature and community.",
        imageSrc: "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=2000&q=80",
        ctaText: "Visit Us",
    },
};
