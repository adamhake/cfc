import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import Footer from "./footer";

// Mock router
const rootRoute = createRootRoute({
    component: () => <div />,
});
const routeTree = rootRoute.addChildren([]);
const router = createRouter({
    routeTree,
});

// Mock QueryClient
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const meta = {
    title: "Components/Footer",
    component: Footer,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}>
                    <Story />
                </RouterProvider>
            </QueryClientProvider>
        ),
    ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
