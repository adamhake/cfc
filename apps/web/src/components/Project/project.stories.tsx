import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import type { SanityProject } from "@/lib/sanity-types";
import Project from "./project";

const meta = {
  title: "Components/Content/Project",
  component: Project,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      const rootRoute = createRootRoute({
        component: () => (
          <div className="w-[400px]">
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
      });

      return <RouterProvider router={router} />;
    },
  ],
} satisfies Meta<typeof Project>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProjectBase: SanityProject = {
  _id: "project-1",
  _type: "project",
  title: "Trail Restoration Initiative",
  slug: { current: "trail-restoration" },
  description:
    "Restoring historic walking trails throughout the park with native plantings and improved drainage systems.",
  heroImage: {
    asset: {
      _id: "image-1",
      url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80",
      metadata: {
        dimensions: {
          width: 800,
          height: 600,
          aspectRatio: 1.33,
        },
      },
    },
    alt: "Trail restoration work in progress",
  },
  status: "active",
  startDate: "2024-06-01",
  category: "restoration",
  location: "Upper Park Trails",
  goal: "Restore 2 miles of historic trails and improve accessibility for all visitors",
};

export const ActiveProject: Story = {
  args: {
    project: mockProjectBase,
  },
};

export const PlannedProject: Story = {
  args: {
    project: {
      ...mockProjectBase,
      _id: "project-2",
      title: "Community Garden Expansion",
      slug: { current: "community-garden" },
      description: "Expanding the community garden space to include raised beds and a tool shed.",
      status: "planned",
      category: "recreation",
      startDate: "2025-03-15",
      location: "Lower Park",
      goal: "Create 20 new raised garden beds for community use",
      heroImage: {
        asset: {
          _id: "image-2",
          url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80",
          metadata: {
            dimensions: {
              width: 800,
              height: 600,
              aspectRatio: 1.33,
            },
          },
        },
        alt: "Community garden beds",
      },
    },
  },
};

export const CompletedProject: Story = {
  args: {
    project: {
      ...mockProjectBase,
      _id: "project-3",
      title: "Monument Preservation",
      slug: { current: "monument-preservation" },
      description: "Complete restoration and preservation of the historic Chimborazo monument.",
      status: "completed",
      category: "preservation",
      startDate: "2023-01-10",
      completionDate: "2023-12-15",
      location: "Monument Plaza",
      goal: "Restore and preserve the historic Chimborazo monument for future generations",
      heroImage: {
        asset: {
          _id: "image-3",
          url: "https://images.unsplash.com/photo-1587486936527-f2d3f741e5bc?auto=format&fit=crop&w=800&q=80",
          metadata: {
            dimensions: {
              width: 800,
              height: 600,
              aspectRatio: 1.33,
            },
          },
        },
        alt: "Restored historic monument",
      },
    },
  },
};

export const ProjectWithoutCategory: Story = {
  args: {
    project: {
      ...mockProjectBase,
      _id: "project-4",
      title: "Parking Lot Repaving",
      slug: { current: "parking-lot-repaving" },
      description: "Repaving the main parking lot to improve accessibility and drainage.",
      status: "active",
      category: undefined,
      startDate: "2024-08-01",
      location: "Main Parking Area",
      heroImage: {
        asset: {
          _id: "image-4",
          url: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?auto=format&fit=crop&w=800&q=80",
          metadata: {
            dimensions: {
              width: 800,
              height: 600,
              aspectRatio: 1.33,
            },
          },
        },
        alt: "Parking lot construction",
      },
    },
  },
};

export const ProjectWithMinimalInfo: Story = {
  args: {
    project: {
      ...mockProjectBase,
      _id: "project-5",
      title: "Simple Project",
      slug: { current: "simple-project" },
      description: "A project with minimal information provided.",
      status: "planned",
      startDate: "2025-01-01",
      location: undefined,
      goal: undefined,
      category: undefined,
      heroImage: {
        asset: {
          _id: "image-5",
          url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
          metadata: {
            dimensions: {
              width: 800,
              height: 600,
              aspectRatio: 1.33,
            },
          },
        },
        alt: "Nature scene",
      },
    },
  },
};
