"use client";

import { useState } from "react";
import { TreeView, type TreeViewItem } from "@/components/ui/tree-view";

const items: TreeViewItem[] = [
  {
    id: "components",
    label: "components",
    children: [
      {
        id: "ui",
        label: "ui",
        children: [
          { id: "button", label: "button.tsx" },
          { id: "table", label: "table.tsx" },
        ],
      },
    ],
  },
  {
    id: "features",
    label: "features",
    children: [
      {
        id: "showcase",
        label: "showcase",
        children: [{ id: "previews", label: "previews" }],
      },
    ],
  },
  { id: "readme", label: "README.md" },
];

export default function TreeViewPreview() {
  const [selected, setSelected] = useState<string | null>("button");

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Keyboard file tree</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Use arrows to navigate and Space or Enter to select.
      </p>
      <TreeView
        className="mt-4 max-w-md"
        items={items}
        defaultExpanded
        selectedId={selected}
        onSelectedIdChange={setSelected}
        showCheckboxes
      />
      <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
        Selected: {selected ?? "none"}
      </p>
    </section>
  );
}
