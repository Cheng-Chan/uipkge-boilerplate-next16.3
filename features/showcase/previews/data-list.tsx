"use client";

import { useState } from "react";
import { DataList, DataListItem } from "@/components/ui/data-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DataListPreview() {
  const [active, setActive] = useState(true);
  const rows = [
    ["Environment", "Static browser demo"],
    ["Registry", "UIPKGE React"],
    ["Validation", "Local checks"],
  ];

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Project facts</h2>
      <DataList className="mt-4">
        {rows.map(([label, value]) => (
          <DataListItem key={label}>
            <span className="text-muted-foreground text-sm">{label}</span>
            <span className="text-sm font-medium">{value}</span>
          </DataListItem>
        ))}
        <DataListItem>
          <span className="text-muted-foreground text-sm">Status</span>
          <Badge variant={active ? "success" : "warning"}>
            {active ? "Ready" : "Paused"}
          </Badge>
        </DataListItem>
      </DataList>
      <Button
        className="mt-4"
        size="sm"
        variant="outline"
        onClick={() => setActive((value) => !value)}
      >
        Toggle status
      </Button>
    </section>
  );
}
