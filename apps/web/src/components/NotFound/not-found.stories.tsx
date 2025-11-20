import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { NotFound } from "./not-found";

// Mock router
const rootRoute = createRootRoute({
    component: () => <div />,
});

const routeTree = rootRoute.addChildren([]);

const router = createRouter({
    routeTree,
});

const meta = {
    title: "Components/NotFound",
    component: NotFound,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <RouterProvider router={router}>
                <Story />
            </RouterProvider>
        ),
    ],
} satisfies Meta<typeof NotFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
