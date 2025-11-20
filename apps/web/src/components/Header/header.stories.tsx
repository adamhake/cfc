import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import Header from "./header";

// Mock QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta = {
  title: "Components/Layout/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      // Create a fresh router for each story
      const rootRoute = createRootRoute({
        component: () => (
          <div className="min-h-screen bg-grey-50 dark:bg-primary-900">
            <Story />
          </div>
        ),
      });

      const indexRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/",
        component: () => null,
      });

      const routeTree = rootRoute.addChildren([indexRoute]);

      const router = createRouter({
        routeTree,
        history: createMemoryHistory({
          initialEntries: ["/"],
        }),
        context: {
          // Theme context
          theme: "light" as const,
          setTheme: () => {},
          resolvedTheme: "light" as const,
          // Palette context
          palette: "green",
          setPalette: () => {},
        },
      });

      return (
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default header on desktop viewport
 */
export const Default: Story = {};

/**
 * Header on mobile viewport (375px) - shows hamburger menu
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile",
    },
  },
};

/**
 * Header on tablet viewport (768px)
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

/**
 * Header on wide desktop viewport (1920px)
 */
export const WideDesktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: "wide",
    },
  },
};
