import type { Meta, StoryObj } from "@storybook/react";

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function ColorScale({ label, cssVar }: { label: string; cssVar: string }) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(11, 1fr)",
          gap: "4px",
          marginTop: "16px",
        }}
      >
        {STEPS.map((step) => (
          <div key={step} style={{ textAlign: "center" }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "1",
                backgroundColor: `var(--color-${cssVar}-${step})`,
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            />
            <small style={{ fontSize: "10px" }}>{step}</small>
          </div>
        ))}
      </div>
      <p>
        <small>
          <strong>{label}</strong> scale
        </small>
      </p>
    </div>
  );
}

function ColorsDoc() {
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: "800px" }}>
      <h1
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
        }}
      >
        Color System
      </h1>
      <p style={{ color: "var(--color-grey-700)" }}>
        The design system uses OKLCH color space for perceptually uniform color
        scales. Colors are organized into <strong>raw palettes</strong> and{" "}
        <strong>semantic tokens</strong>.
      </p>

      <h2
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
          marginTop: "32px",
        }}
      >
        Semantic Tokens
      </h2>
      <p style={{ color: "var(--color-grey-700)" }}>
        Components use semantic color tokens that automatically adapt to the
        active palette:
      </p>
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
            <th style={{ padding: "8px" }}>Usage</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              token: "primary-{50-950}",
              usage: "Main brand color (greens)",
            },
            {
              token: "accent-{50-950}",
              usage: "CTAs, highlights, interactive elements",
            },
            {
              token: "neutral-{50-950}",
              usage: "Backgrounds, borders, subtle UI",
            },
            {
              token: "grey-{50-950}",
              usage: "Text, dividers, universal neutrals",
            },
          ].map(({ token, usage }) => (
            <tr
              key={token}
              style={{ borderBottom: "1px solid var(--color-grey-100)" }}
            >
              <td style={{ padding: "8px" }}>
                <code>{token}</code>
              </td>
              <td style={{ padding: "8px" }}>{usage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
          marginTop: "32px",
        }}
      >
        Raw Palettes
      </h2>

      <h3 style={{ color: "var(--color-primary-700)", marginTop: "24px" }}>
        Primary Greens
      </h3>
      <ul style={{ color: "var(--color-grey-700)", lineHeight: 1.8 }}>
        <li>
          <strong>Green</strong> — Cool-toned forest green (classic)
        </li>
        <li>
          <strong>Olive</strong> — Warm, approachable olive green (default)
        </li>
        <li>
          <strong>Sage</strong> — Soft, muted sage
        </li>
        <li>
          <strong>Iron</strong> — Deep heritage patina green
        </li>
      </ul>

      <h3 style={{ color: "var(--color-primary-700)", marginTop: "24px" }}>
        Accent Colors
      </h3>
      <ul style={{ color: "var(--color-grey-700)", lineHeight: 1.8 }}>
        <li>
          <strong>Terra</strong> — Warm terracotta/clay brick tones
        </li>
        <li>
          <strong>Navy</strong> — Deep institutional blue
        </li>
        <li>
          <strong>Soft Blue</strong> — Sophisticated cool blue-grey
        </li>
        <li>
          <strong>Heather</strong> — Muted purple-pink
        </li>
      </ul>

      <h3 style={{ color: "var(--color-primary-700)", marginTop: "24px" }}>
        Neutral Greys
      </h3>
      <ul style={{ color: "var(--color-grey-700)", lineHeight: 1.8 }}>
        <li>
          <strong>Grey</strong> — Cool grey (for classic green palette)
        </li>
        <li>
          <strong>Olive Grey</strong> — Warm olive-tinted grey
        </li>
        <li>
          <strong>Clay Grey</strong> — Warm clay-tinted grey
        </li>
        <li>
          <strong>Blue Grey</strong> — Cool blue-tinted grey
        </li>
        <li>
          <strong>Balanced Grey</strong> — Bridges warm and cool
        </li>
      </ul>

      <h2
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
          marginTop: "32px",
        }}
      >
        Dark Mode
      </h2>
      <p style={{ color: "var(--color-grey-700)" }}>
        Accent colors automatically lighten in dark mode for contrast:
      </p>
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
            <th style={{ padding: "8px" }}>Element</th>
            <th style={{ padding: "8px" }}>Light Mode</th>
            <th style={{ padding: "8px" }}>Dark Mode</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              el: "Headings",
              light: "grey-900 / primary-800",
              dark: "grey-100 / primary-400",
            },
            {
              el: "Body text",
              light: "grey-800",
              dark: "grey-200 / grey-300",
            },
            { el: "Secondary", light: "grey-600", dark: "grey-400" },
            {
              el: "Muted",
              light: "grey-500",
              dark: "grey-500 (large text only)",
            },
          ].map(({ el, light, dark }) => (
            <tr
              key={el}
              style={{ borderBottom: "1px solid var(--color-grey-100)" }}
            >
              <td style={{ padding: "8px" }}>{el}</td>
              <td style={{ padding: "8px" }}>
                <code>{light}</code>
              </td>
              <td style={{ padding: "8px" }}>
                <code>{dark}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
          marginTop: "32px",
        }}
      >
        Color Swatches
      </h2>
      <ColorScale label="Primary" cssVar="primary" />
      <ColorScale label="Accent" cssVar="accent" />
      <ColorScale label="Grey" cssVar="grey" />
    </div>
  );
}

const meta = {
  title: "Design Tokens/Colors",
  component: ColorsDoc,
  parameters: {
    layout: "padded",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof ColorsDoc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
