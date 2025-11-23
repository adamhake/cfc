import { lazy } from "react";

// Lazy load devtools only in development to reduce production bundle size
const ReactQueryDevtoolsPanel = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({
        default: m.ReactQueryDevtoolsPanel,
      })),
    )
  : () => null;

export default {
  name: "Tanstack Query",
  render: import.meta.env.DEV ? <ReactQueryDevtoolsPanel /> : null,
};
