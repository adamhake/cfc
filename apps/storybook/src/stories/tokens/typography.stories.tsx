import type { Meta, StoryObj } from "@storybook/react";

function TypographyDoc() {
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: "800px" }}>
      <h1
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
        }}
      >
        Typography
      </h1>
      <p style={{ color: "var(--color-grey-700)" }}>
        The design system uses two font families with a responsive type scale.
      </p>

      <h2
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
          marginTop: "32px",
        }}
      >
        Font Families
      </h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "2px solid var(--color-grey-200)",
              textAlign: "left",
            }}
          >
            <th style={{ padding: "8px" }}>Token</th>
            <th style={{ padding: "8px" }}>Font</th>
            <th style={{ padding: "8px" }}>Usage</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--color-grey-100)" }}>
            <td style={{ padding: "8px" }}>
              <code>font-display</code>
            </td>
            <td style={{ padding: "8px" }}>Vollkorn SC (serif)</td>
            <td style={{ padding: "8px" }}>
              Headings, emphasis, brand elements
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-grey-100)" }}>
            <td style={{ padding: "8px" }}>
              <code>font-body</code>
            </td>
            <td style={{ padding: "8px" }}>Montserrat (sans-serif)</td>
            <td style={{ padding: "8px" }}>Body text, UI elements, buttons</td>
          </tr>
        </tbody>
      </table>

      <h2
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
          marginTop: "32px",
        }}
      >
        Responsive Type Scale
      </h2>
      <p style={{ color: "var(--color-grey-700)" }}>
        All headings use responsive sizing across breakpoints:
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          marginTop: "24px",
        }}
      >
        {[
          {
            label:
              "Hero H1 — text-4xl md:text-5xl lg:text-6xl (36→48→60px)",
            tag: "h1",
            size: "48px",
            font: '"Vollkorn SC", serif',
            color: "var(--color-primary-800)",
            text: "Hero Heading",
          },
          {
            label:
              "Page H1 — text-3xl md:text-4xl lg:text-5xl (30→36→48px)",
            tag: "h1",
            size: "36px",
            font: '"Vollkorn SC", serif',
            color: "var(--color-primary-800)",
            text: "Page Heading",
          },
          {
            label:
              "Section H2 — text-2xl md:text-3xl lg:text-4xl (24→30→36px)",
            tag: "h2",
            size: "30px",
            font: '"Vollkorn SC", serif',
            color: "var(--color-primary-800)",
            text: "Section Heading",
          },
          {
            label:
              "Subsection H3 — text-xl md:text-2xl lg:text-3xl (20→24→30px)",
            tag: "h3",
            size: "24px",
            font: '"Vollkorn SC", serif',
            color: "var(--color-primary-800)",
            text: "Subsection Heading",
          },
          {
            label: "Body Large — text-lg md:text-xl (18→20px)",
            tag: "p",
            size: "20px",
            font: "Montserrat, sans-serif",
            color: "var(--color-grey-800)",
            text: "Body large text for introductions and lead paragraphs.",
          },
          {
            label: "Body — text-base md:text-lg (16→18px)",
            tag: "p",
            size: "18px",
            font: "Montserrat, sans-serif",
            color: "var(--color-grey-800)",
            text: "Standard body text for paragraphs and general content.",
          },
          {
            label: "Small — text-sm (14px)",
            tag: "p",
            size: "14px",
            font: "Montserrat, sans-serif",
            color: "var(--color-grey-800)",
            text: "Small text for captions, meta, and labels.",
          },
        ].map(({ label, size, font, color, text }) => (
          <div key={label}>
            <small
              style={{
                color: "var(--color-grey-500)",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {label}
            </small>
            <div
              style={{
                fontFamily: font,
                fontSize: size,
                margin: 0,
                color,
              }}
            >
              {text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Design Tokens/Typography",
  component: TypographyDoc,
  parameters: {
    layout: "padded",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof TypographyDoc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
