"use client";

import { useState } from "react";
import { Bold, Italic, Underline } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

export default function TogglePreview() {
  const [bold, setBold] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-muted-foreground text-sm font-medium">
          Interactive state
        </p>
        <p className="mt-1 text-lg font-semibold" aria-live="polite">
          Bold is {bold ? "on" : "off"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Toggle pressed={bold} onPressedChange={setBold} aria-label="Bold">
          <Bold aria-hidden="true" />
          Bold
        </Toggle>
        <Toggle variant="outline" aria-label="Italic">
          <Italic aria-hidden="true" />
          Italic
        </Toggle>
        <Toggle variant="outline" disabled aria-label="Underline unavailable">
          <Underline aria-hidden="true" />
          Disabled
        </Toggle>
      </div>

      <div className="border-border bg-card rounded-xl border p-4">
        <p className="text-muted-foreground mb-4 text-sm">
          Small, default, and large icon controls
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Toggle size="sm" aria-label="Bold small">
            <Bold aria-hidden="true" />
          </Toggle>
          <Toggle aria-label="Bold default">
            <Bold aria-hidden="true" />
          </Toggle>
          <Toggle size="lg" variant="outline" aria-label="Bold large">
            <Bold aria-hidden="true" />
          </Toggle>
        </div>
      </div>
    </div>
  );
}
