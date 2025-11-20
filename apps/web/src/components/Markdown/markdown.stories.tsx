import type { Meta, StoryObj } from "@storybook/react-vite";
import { Markdown } from "./markdown";

const meta = {
  title: "Components/Content/Markdown",
  component: Markdown,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMarkdown = `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

This is a paragraph with **bold text**, *italic text*, and a [link](https://example.com).

- Unordered list item 1
- Unordered list item 2
  - Nested item

1. Ordered list item 1
2. Ordered list item 2

> This is a blockquote.

\`\`\`javascript
console.log('Hello, world!');
\`\`\`

| Header 1 | Header 2 |
| :------- | :------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

---

Horizontal rule above.
`;

export const Default: Story = {
  args: {
    content: sampleMarkdown,
  },
};
