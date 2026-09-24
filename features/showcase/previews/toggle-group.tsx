"use client";

import { useState } from "react";
import { Bold, Grid2X2, Italic, List, Underline } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ToggleGroupPreview() {
  const [view, setView] = useState("grid");
  const [formatting, setFormatting] = useState<string[]>(["bold"]);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border-border bg-card rounded-xl border p-4">
          <p className="text-muted-foreground mb-3 text-sm">Single selection</p>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => value && setView(value)}
            variant="outline"
            aria-label="View mode"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid2X2 aria-hidden="true" />
              Grid
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List aria-hidden="true" />
              List
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="mt-4 text-sm font-medium capitalize" aria-live="polite">
            {view} view selected
          </p>
        </div>

        <div className="border-border bg-card rounded-xl border p-4">
          <p className="text-muted-foreground mb-3 text-sm">
            Multiple selection
          </p>
          <ToggleGroup
            type="multiple"
            value={formatting}
            onValueChange={setFormatting}
            spacing={2}
            aria-label="Text formatting"
          >
            <ToggleGroupItem value="bold" aria-label="Bold formatting">
              <Bold aria-hidden="true" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic formatting">
              <Italic aria-hidden="true" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="underline"
              aria-label="Underline formatting"
            >
              <Underline aria-hidden="true" />
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="mt-4 text-sm font-medium" aria-live="polite">
            {formatting.length
              ? `${formatting.join(", ")} enabled`
              : "No formatting enabled"}
          </p>
        </div>
      </div>
    </div>
  );
}
