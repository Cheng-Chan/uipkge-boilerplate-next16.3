"use client";

import { useState } from "react";

import { TreeSelect, type TreeSelectNode } from "@/components/ui/tree-select";

const teams: TreeSelectNode[] = [
  {
    value: "product",
    label: "Product",
    children: [
      { value: "design", label: "Design" },
      { value: "research", label: "Research" },
    ],
  },
  {
    value: "engineering",
    label: "Engineering",
    children: [
      { value: "frontend", label: "Frontend" },
      { value: "platform", label: "Platform" },
      { value: "legacy", label: "Legacy systems", disabled: true },
    ],
  },
];

export default function TreeSelectPreview() {
  const [team, setTeam] = useState<string | string[] | null>(null);
  const [groups, setGroups] = useState<string | string[] | null>([]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <PreviewSection title="Searchable single select">
        <TreeSelect
          ariaLabel="Primary team"
          data={teams}
          value={team}
          onValueChange={setTeam}
          placeholder="Choose a team"
          defaultExpandAll
        />
        <p className="text-muted-foreground text-sm" aria-live="polite">
          Team: {typeof team === "string" ? team : "none"}
        </p>
      </PreviewSection>

      <PreviewSection title="Multiple selection">
        <TreeSelect
          ariaLabel="Working groups"
          data={teams}
          value={groups}
          onValueChange={setGroups}
          multiple
          defaultExpandAll
          placeholder="Choose working groups"
        />
        <p className="text-muted-foreground text-sm" aria-live="polite">
          Groups:{" "}
          {Array.isArray(groups) && groups.length ? groups.join(", ") : "none"}
        </p>
      </PreviewSection>

      <PreviewSection title="Loading and disabled">
        <TreeSelect
          ariaLabel="Loading team"
          data={teams}
          loading
          placeholder="Loading teams"
        />
        <TreeSelect
          ariaLabel="Disabled team"
          data={teams}
          disabled
          placeholder="Disabled"
        />
      </PreviewSection>
    </div>
  );
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border bg-card min-w-0 space-y-4 rounded-xl border p-5">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </section>
  );
}
