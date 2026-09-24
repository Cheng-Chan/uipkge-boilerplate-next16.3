"use client";

import { useState } from "react";

import {
  TreeTable,
  type TreeTableColumn,
  type TreeTableRow,
} from "@/components/ui/tree-table";

const columns: TreeTableColumn[] = [
  { key: "name", label: "Workspace item" },
  { key: "owner", label: "Owner" },
  { key: "state", label: "State" },
];

const rows: TreeTableRow[] = [
  {
    id: "design-system",
    name: "Design system",
    owner: "Mina",
    state: "Active",
    children: [
      { id: "tokens", name: "Tokens", owner: "Mina", state: "Complete" },
      { id: "controls", name: "Controls", owner: "Arun", state: "Active" },
    ],
  },
  {
    id: "application",
    name: "Application",
    owner: "Noor",
    state: "Planned",
    children: [
      { id: "dashboard", name: "Dashboard", owner: "Noor", state: "Planned" },
      { id: "settings", name: "Settings", owner: "Jules", state: "Planned" },
    ],
  },
];

export default function TreeTablePreview() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section className="border-border bg-card min-w-0 rounded-xl border p-5">
        <h2 className="font-semibold">Expandable hierarchy</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Expand folders, traverse rows with arrow keys, and select records.
        </p>
        <div className="mt-5">
          <TreeTable
            ariaLabel="Workspace hierarchy"
            columns={columns}
            data={rows}
            defaultExpanded
            selectable
            selected={selected}
            onSelectedChange={setSelected}
          />
        </div>
        <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
          Selected rows: {selected.length ? selected.join(", ") : "none"}
        </p>
      </section>

      <section className="border-border bg-card min-w-0 rounded-xl border p-5">
        <h2 className="font-semibold">Loading and empty</h2>
        <div className="mt-5 space-y-6">
          <TreeTable
            ariaLabel="Loading hierarchy"
            columns={columns}
            data={rows}
            loading
          />
          <TreeTable
            ariaLabel="Empty hierarchy"
            columns={columns}
            data={[]}
            emptyText="No workspace items"
          />
        </div>
      </section>
    </div>
  );
}
