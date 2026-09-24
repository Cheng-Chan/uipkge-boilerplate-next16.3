"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";

type Project = {
  name: string;
  status: "Planned" | "Active" | "Complete";
  owner: string;
  updated: string;
};

const projects: Project[] = [
  { name: "Atlas", status: "Active", owner: "Mina", updated: "2026-09-18" },
  { name: "Beacon", status: "Planned", owner: "Arun", updated: "2026-09-20" },
  { name: "Cedar", status: "Complete", owner: "Noor", updated: "2026-09-12" },
  { name: "Delta", status: "Active", owner: "Mina", updated: "2026-09-22" },
  { name: "Echo", status: "Planned", owner: "Jules", updated: "2026-09-16" },
  { name: "Fjord", status: "Complete", owner: "Noor", updated: "2026-09-09" },
  { name: "Grove", status: "Active", owner: "Arun", updated: "2026-09-23" },
  { name: "Harbor", status: "Planned", owner: "Jules", updated: "2026-09-13" },
  { name: "Iris", status: "Complete", owner: "Mina", updated: "2026-09-08" },
  { name: "Juniper", status: "Active", owner: "Noor", updated: "2026-09-24" },
  { name: "Kite", status: "Planned", owner: "Arun", updated: "2026-09-11" },
  { name: "Lumen", status: "Complete", owner: "Jules", updated: "2026-09-10" },
];

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Project" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
  },
  {
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Owner" />
    ),
  },
  {
    accessorKey: "updated",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Updated" />
    ),
  },
];

export default function DataTablePreview() {
  const [selectedProject, setSelectedProject] = useState("none");

  return (
    <section className="min-w-0 space-y-4">
      <div>
        <h2 className="font-semibold">Interactive project data</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Search, sort, filter, change density, paginate, or inspect column
          visibility locally.
        </p>
      </div>
      <DataTable
        ariaLabel="Projects"
        columns={columns}
        data={projects}
        filterColumn="name"
        filterPlaceholder="Search projects"
        filters={[
          {
            column: "status",
            label: "Status",
            type: "multiselect",
            options: ["Planned", "Active", "Complete"],
          },
        ]}
        enableColumnVisibility
        enableDensityToggle
        enableExport
        onRowClick={(project) => setSelectedProject(project.name)}
      />
      <p className="text-muted-foreground text-sm" aria-live="polite">
        Selected project: {selectedProject}
      </p>
    </section>
  );
}
