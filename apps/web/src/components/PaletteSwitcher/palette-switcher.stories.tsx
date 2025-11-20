import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { PaletteSwitcher } from "./palette-switcher";

// Mock router with context
const rootRoute = createRootRoute({
    component: () => <div />,
});

const routeTree = rootRoute.addChildren([]);

const router = createRouter({
    routeTree,
    context: {
        palette: "green",
        setPalette: () => { },
    },
});

const meta = {
    title: "Components/PaletteSwitcher",
    component: PaletteSwitcher,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <RouterProvider router={router}>
                <Story />
            </RouterProvider>
        ),
    ],
} satisfies Meta<typeof PaletteSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        variant: "button",
        showLabel: true,
    },
};

export const Compact: Story = {
    args: {
        variant: "compact",
        showLabel: false,
    },
};

export const CompactWithLabel: Story = {
    args: {
        variant: "compact",
        showLabel: true,
    },
};
