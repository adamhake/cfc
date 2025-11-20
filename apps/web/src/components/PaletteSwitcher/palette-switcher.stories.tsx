import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { PaletteSwitcher } from "./palette-switcher";

const meta = {
  title: "Components/Interactive/PaletteSwitcher",
  component: PaletteSwitcher,
  parameters: {
    layout: "centered",
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
        context: {
          palette: "green",
          setPalette: () => {},
        },
      });

      return <RouterProvider router={router} />;
    },
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
