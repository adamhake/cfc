import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import Header from "./header";

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
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client= { queryClient } >
      <RouterProvider router={ router } >
    <div className="min-h-screen bg-grey-50 dark:bg-primary-900" >
    <Story />
    </div>
    </RouterProvider>
    </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
