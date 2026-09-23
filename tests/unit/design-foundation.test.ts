import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

const stylesheet = readFileSync(
  resolve(process.cwd(), "app/globals.css"),
  "utf8",
);

const semanticColorTokens = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
  "success",
  "warning",
  "info",
] as const;

function declarationBlock(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = stylesheet.match(
    new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`),
  );

  if (!match?.[1]) throw new Error(`Missing ${selector} declaration block`);
  return match[1];
}

describe("UIPKGE design foundation", () => {
  it("defines every semantic color token in light and dark modes", () => {
    const light = declarationBlock(":root");
    const dark = declarationBlock(".dark");

    for (const token of semanticColorTokens) {
      expect(light).toContain(`--${token}:`);
      expect(dark).toContain(`--${token}:`);
    }
  });

  it("keeps fonts local and the generated variable mapping valid", () => {
    expect(stylesheet).not.toMatch(/https?:\/\//);
    expect(stylesheet).not.toContain("var(----");
    expect(stylesheet).toContain("@theme inline");
    expect(stylesheet).toContain("@custom-variant dark");
  });

  it("merges conditional and conflicting utility classes", () => {
    expect(cn("px-2", false && "hidden", "px-4", { block: true })).toBe(
      "px-4 block",
    );
  });
});
