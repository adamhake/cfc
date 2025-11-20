import type { Meta, StoryObj } from "@storybook/react-vite";
import Partners from "./partners";

const meta = {
  title: "Components/Content/Partners",
  component: Partners,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Partners>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePartners = [
  {
    name: "City of Richmond",
    url: "https://www.rva.gov/",
    description: "Department of Parks, Recreation and Community Facilities",
    logo: {
      src: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
      alt: "City of Richmond Logo",
      width: 200,
      height: 200,
    },
  },
  {
    name: "Virginia Department of Historic Resources",
    url: "https://www.dhr.virginia.gov/",
    description: "Fostering the stewardship of Virginia's significant historic resources",
    logo: {
      src: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
      alt: "DHR Logo",
      width: 200,
      height: 200,
    },
  },
];

export const Default: Story = {
  args: {
    partners: samplePartners,
  },
};

export const Empty: Story = {
  args: {
    partners: [],
  },
};
