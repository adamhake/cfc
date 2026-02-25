import type { Meta, StoryObj } from "@storybook/react";

const SWATCH_STEPS = [50, 200, 400, 600, 800, 950] as const;

function PaletteRow({
  label,
  cssVar,
}: {
  label: string;
  cssVar: string;
}) {
  return (
    <>
      {SWATCH_STEPS.map((step) => (
        <div key={step} style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              aspectRatio: "1",
              backgroundColor: `var(--color-${cssVar}-${step})`,
              borderRadius: "8px",
            }}
          />
          <small style={{ fontSize: "10px" }}>
            {label}-{step}
          </small>
        </div>
      ))}
    </>
  );
}

function PaletteSection({
  title,
  description,
  primaryVar,
  accentVar,
}: {
  title: string;
  description: string;
  primaryVar: string;
  accentVar: string;
}) {
  return (
    <div style={{ marginTop: "32px" }}>
      <h2
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h2>
      <p style={{ color: "var(--color-grey-600)", margin: "0 0 12px" }}>
        {description}
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <PaletteRow label={primaryVar} cssVar={primaryVar} />
        <div style={{ width: "16px" }} />
        <PaletteRow label={accentVar} cssVar={accentVar} />
      </div>
    </div>
  );
}

function PalettesDoc() {
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: "900px" }}>
      <h1
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
        }}
      >
        Color Palettes
      </h1>
      <p style={{ color: "var(--color-grey-700)" }}>
        The design system supports 4 palette combinations. Switch between them
        using the <strong>paintbrush icon</strong> in the Storybook toolbar.
      </p>

      <h2
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
          marginTop: "32px",
        }}
      >
        Palette Overview
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
            <th style={{ padding: "8px" }}>Palette</th>
            <th style={{ padding: "8px" }}>Primary</th>
            <th style={{ padding: "8px" }}>Accent</th>
            <th style={{ padding: "8px" }}>Neutral</th>
            <th style={{ padding: "8px" }}>Text Warmth</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              name: "Warm Olive + Blue-Grey (Default)",
              primary: "Olive Green",
              accent: "Soft Blue-Grey",
              neutral: "Balanced Grey",
              warmth: "Neutral",
            },
            {
              name: "Classic Green",
              primary: "Cool Forest Green",
              accent: "—",
              neutral: "Cool Grey",
              warmth: "—",
            },
            {
              name: "Green + Terracotta",
              primary: "Forest Green",
              accent: "Terracotta",
              neutral: "Clay Grey",
              warmth: "Warm",
            },
            {
              name: "Green + Navy",
              primary: "Forest Green",
              accent: "Navy Blue",
              neutral: "Blue Grey",
              warmth: "Cool",
            },
          ].map(({ name, primary, accent, neutral, warmth }) => (
            <tr
              key={name}
              style={{ borderBottom: "1px solid var(--color-grey-100)" }}
            >
              <td style={{ padding: "8px", fontWeight: 600 }}>{name}</td>
              <td style={{ padding: "8px" }}>{primary}</td>
              <td style={{ padding: "8px" }}>{accent}</td>
              <td style={{ padding: "8px" }}>{neutral}</td>
              <td style={{ padding: "8px" }}>{warmth}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PaletteSection
        title="Warm Olive + Blue-Grey (Default)"
        description="The default palette. Warm olive greens paired with sophisticated blue-grey accents. Balanced grey neutrals bridge the warm and cool tones."
        primaryVar="olive"
        accentVar="soft-blue"
      />

      <PaletteSection
        title="Green + Terracotta"
        description="Forest green with warm clay accents. Perfect for evoking Richmond's historic brick architecture."
        primaryVar="green"
        accentVar="terra"
      />

      <PaletteSection
        title="Green + Navy"
        description="Forest green with deep navy accents. Institutional and trustworthy."
        primaryVar="green"
        accentVar="navy"
      />

      <h2
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
          marginTop: "48px",
        }}
      >
        How Palette Switching Works
      </h2>
      <ol
        style={{
          color: "var(--color-grey-700)",
          lineHeight: 1.8,
          paddingLeft: "24px",
        }}
      >
        <li>
          The <code>data-palette</code> attribute on <code>&lt;html&gt;</code>{" "}
          controls the active palette
        </li>
        <li>
          CSS custom properties remap <code>primary-*</code>,{" "}
          <code>accent-*</code>, and <code>neutral-*</code> tokens
        </li>
        <li>
          Components use semantic tokens only — they never reference raw palette
          colors directly
        </li>
        <li>Dark mode overrides apply on top of the active palette</li>
      </ol>
    </div>
  );
}

const meta = {
  title: "Design Tokens/Palettes",
  component: PalettesDoc,
  parameters: {
    layout: "padded",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof PalettesDoc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
