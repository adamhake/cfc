import type { Meta, StoryObj } from "@storybook/react-vite";
import Container from "./container";

const meta = {
    title: "Components/Container",
    component: Container,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    argTypes: {
        children: { control: false },
        as: { control: "select", options: ["div", "section", "article", "main"] },
    },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const PlaceholderContent = () => (
    <div className="bg-primary-100 p-4 text-center text-primary-900 dark:bg-primary-800 dark:text-primary-100">
        <h3 className="mb-2 font-bold">Content Block</h3>
        <p>This is a placeholder for content inside the container.</p>
    </div>
);

export const Default: Story = {
    args: {
        children: <PlaceholderContent />,
        maxWidth: "6xl",
        spacing: "md",
    },
};

export const SmallWidth: Story = {
    args: {
        children: <PlaceholderContent />,
        maxWidth: "sm",
    },
};

export const MediumWidth: Story = {
    args: {
        children: <PlaceholderContent />,
        maxWidth: "md",
    },
};

export const LargeWidth: Story = {
    args: {
        children: <PlaceholderContent />,
        maxWidth: "lg",
    },
};

export const ExtraLargeWidth: Story = {
    args: {
        children: <PlaceholderContent />,
        maxWidth: "xl",
    },
};

export const WithSpacing: Story = {
    args: {
        children: (
            <>
                <PlaceholderContent />
                <PlaceholderContent />
                <PlaceholderContent />
            </>
        ),
        spacing: "xl",
    },
};

export const AsSection: Story = {
    args: {
        children: <PlaceholderContent />,
        as: "section",
    },
};
