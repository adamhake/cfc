import type { Meta, StoryObj } from "@storybook/react-vite";
import { PortableText } from "./portable-text";

const meta = {
  title: "Components/Content/PortableText",
  component: PortableText,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PortableText>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleContent = [
  {
    _type: "block",
    style: "normal",
    children: [
      {
        _type: "span",
        text: "This is a sample paragraph with ",
      },
      {
        _type: "span",
        marks: ["strong"],
        text: "bold text",
      },
      {
        _type: "span",
        text: " and ",
      },
      {
        _type: "span",
        marks: ["em"],
        text: "italic text",
      },
      {
        _type: "span",
        text: ".",
      },
    ],
  },
  {
    _type: "block",
    style: "h2",
    children: [
      {
        _type: "span",
        text: "This is a heading",
      },
    ],
  },
  {
    _type: "block",
    style: "normal",
    children: [
      {
        _type: "span",
        text: "Another paragraph with a ",
      },
      {
        _type: "span",
        marks: ["link"],
        text: "link to somewhere",
        markDefs: [
          {
            _type: "link",
            href: "https://example.com",
          },
        ],
      },
      {
        _type: "span",
        text: ".",
      },
    ],
  },
];

export const Default: Story = {
  args: {
    value: sampleContent,
  },
};

export const WithList: Story = {
  args: {
    value: [
      ...sampleContent,
      {
        _type: "block",
        listItem: "bullet",
        children: [{ _type: "span", text: "First item" }],
      },
      {
        _type: "block",
        listItem: "bullet",
        children: [{ _type: "span", text: "Second item" }],
      },
      {
        _type: "block",
        listItem: "bullet",
        children: [{ _type: "span", text: "Third item" }],
      },
    ],
  },
};

export const WithBlockquote: Story = {
  args: {
    value: [
      {
        _type: "block",
        style: "blockquote",
        children: [
          {
            _type: "span",
            text: "This is an inspiring quote about Chimborazo Park.",
          },
        ],
      },
    ],
  },
};
