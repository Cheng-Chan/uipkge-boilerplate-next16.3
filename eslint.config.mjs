import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    files: [
      "components/ui/charts/**/*.{ts,tsx}",
      "components/ui/map/**/*.{ts,tsx}",
    ],
    rules: {
      // ECharts' open-ended option/event payloads and Mapbox style expressions
      // are intentional registry escape hatches. Keep this exception local to
      // the reviewed upstream interop layer; application code stays strict.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: [
      "components/ui/data-table/**/*.{ts,tsx}",
      "components/ui/tree-table/**/*.{ts,tsx}",
    ],
    rules: {
      // TanStack's table boundary and the registry's open-ended row records
      // intentionally preserve consumer-defined cell/filter value shapes.
      // Keep that escape hatch inside these reviewed registry adapters.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["components/ui/data-table/DataTable.tsx"],
    rules: {
      // TanStack Table returns mutable callback APIs by design. React Compiler
      // correctly skips this boundary; application components remain checked.
      "react-hooks/incompatible-library": "off",
    },
  },
  {
    files: [
      "components/ui/carousel/carousel.tsx",
      "components/ui/code-block/CodeBlock.tsx",
      "components/ui/lazy-image/Img.tsx",
      "components/ui/transfer/transfer.tsx",
      "components/ui/tree-view/tree-view.tsx",
    ],
    rules: {
      // These reviewed registry components intentionally synchronize local
      // presentation state with external component/browser state.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["components/ui/transfer/transfer.tsx"],
    rules: {
      // Transfer keeps a current-state ref for its stable drag/drop callback.
      // The ref never contributes to render output.
      "react-hooks/refs": "off",
    },
  },
  {
    files: ["components/ui/virtual-list/virtual-list.tsx"],
    rules: {
      // TanStack Virtual exposes mutable measurement callbacks by design.
      "react-hooks/incompatible-library": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "coverage/**", "next-env.d.ts"]),
]);
