import type { Meta, StoryObj } from "@storybook/react";

function SpacingDoc() {
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: "800px" }}>
      <h1
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
        }}
      >
        Spacing
      </h1>
      <p style={{ color: "var(--color-grey-700)" }}>
        Consistent spacing creates visual rhythm and hierarchy.
      </p>

      <h2
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
          marginTop: "32px",
        }}
      >
        Component Padding Tiers
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
            <th style={{ padding: "8px" }}>Tier</th>
            <th style={{ padding: "8px" }}>Classes</th>
            <th style={{ padding: "8px" }}>Value</th>
            <th style={{ padding: "8px" }}>Usage</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              tier: "Tight",
              classes: "p-4",
              value: "16px",
              usage: "Small cards, compact UI",
            },
            {
              tier: "Standard",
              classes: "p-6 md:p-8",
              value: "24px → 32px",
              usage: "Cards, sections",
            },
            {
              tier: "Spacious",
              classes: "p-8 lg:p-12",
              value: "32px → 48px",
              usage: "Hero, featured areas",
            },
          ].map(({ tier, classes, value, usage }) => (
            <tr
              key={tier}
              style={{ borderBottom: "1px solid var(--color-grey-100)" }}
            >
              <td style={{ padding: "8px", fontWeight: 600 }}>{tier}</td>
              <td style={{ padding: "8px" }}>
                <code>{classes}</code>
              </td>
              <td style={{ padding: "8px" }}>{value}</td>
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
        Gap Values
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
            <th style={{ padding: "8px" }}>Size</th>
            <th style={{ padding: "8px" }}>Class</th>
            <th style={{ padding: "8px" }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {[
            { size: "Tight", cls: "gap-4", value: "16px" },
            { size: "Standard", cls: "gap-8", value: "32px" },
            { size: "Spacious", cls: "gap-12", value: "48px" },
          ].map(({ size, cls, value }) => (
            <tr
              key={size}
              style={{ borderBottom: "1px solid var(--color-grey-100)" }}
            >
              <td style={{ padding: "8px", fontWeight: 600 }}>{size}</td>
              <td style={{ padding: "8px" }}>
                <code>{cls}</code>
              </td>
              <td style={{ padding: "8px" }}>{value}</td>
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
        Section Spacing
      </h2>
      <p style={{ color: "var(--color-grey-700)" }}>
        Between major sections: <code>space-y-16 md:space-y-24</code> (64px →
        96px)
      </p>

      <h2
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
          marginTop: "32px",
        }}
      >
        Visual Reference
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        {[
          { label: "Tight (p-4 / 16px)", size: 16 },
          { label: "Standard (p-6 / 24px)", size: 24 },
          { label: "Standard responsive (p-8 / 32px)", size: 32 },
          { label: "Spacious (p-12 / 48px)", size: 48 },
          { label: "Section (space-y-16 / 64px)", size: 64 },
          { label: "Section responsive (space-y-24 / 96px)", size: 96 },
        ].map(({ label, size }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: `${size}px`,
                height: "24px",
                backgroundColor: "var(--color-accent-500)",
                borderRadius: "4px",
                flexShrink: 0,
              }}
            />
            <small
              style={{
                fontFamily: "Montserrat, sans-serif",
                color: "var(--color-grey-600)",
              }}
            >
              {label}
            </small>
          </div>
        ))}
      </div>

      <h2
        style={{
          fontFamily: '"Vollkorn SC", serif',
          color: "var(--color-primary-800)",
          marginTop: "32px",
        }}
      >
        Border Radius Scale
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
            <th style={{ padding: "8px" }}>Value</th>
            <th style={{ padding: "8px" }}>Usage</th>
          </tr>
        </thead>
        <tbody>
          {[
            { token: "rounded-lg", value: "8px", usage: "Tags, badges" },
            {
              token: "rounded-xl",
              value: "12px",
              usage: "Cards, buttons, inputs",
            },
            {
              token: "rounded-2xl",
              value: "16px",
              usage: "Hero sections, modals, images",
            },
            {
              token: "rounded-3xl",
              value: "24px",
              usage: "Large feature sections",
            },
            {
              token: "rounded-full",
              value: "50%",
              usage: "Circular elements (icons, avatars)",
            },
          ].map(({ token, value, usage }) => (
            <tr
              key={token}
              style={{ borderBottom: "1px solid var(--color-grey-100)" }}
            >
              <td style={{ padding: "8px" }}>
                <code>{token}</code>
              </td>
              <td style={{ padding: "8px" }}>{value}</td>
              <td style={{ padding: "8px" }}>{usage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "16px",
          alignItems: "center",
        }}
      >
        {[
          { label: "lg", radius: "8px" },
          { label: "xl", radius: "12px" },
          { label: "2xl", radius: "16px" },
          { label: "3xl", radius: "24px" },
          { label: "full", radius: "50%" },
        ].map(({ label, radius }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "var(--color-primary-200)",
                border: "2px solid var(--color-primary-500)",
                borderRadius: radius,
              }}
            />
            <small
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "11px",
              }}
            >
              {label}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Design Tokens/Spacing",
  component: SpacingDoc,
  parameters: {
    layout: "padded",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta<typeof SpacingDoc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
