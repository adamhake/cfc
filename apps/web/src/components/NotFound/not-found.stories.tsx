import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { NotFound } from "./not-found";

const meta = {
  title: "Components/NotFound",
  component: NotFound,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      const rootRoute = createRootRoute({
        component: () => <Story />,
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
      });

      return <RouterProvider router={router} />;
    },
  ],
} satisfies Meta<typeof NotFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
