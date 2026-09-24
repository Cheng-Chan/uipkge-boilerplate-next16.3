"use client";

import { Copy, Download, Mail, Share2 } from "lucide-react";
import { useState } from "react";

import { SpeedDial, type SpeedDialAction } from "@/components/ui/speed-dial";

export default function SpeedDialPreview() {
  const [lastAction, setLastAction] = useState("No quick action selected");
  const actions: SpeedDialAction[] = [
    {
      icon: Copy,
      label: "Copy draft",
      handler: () => setLastAction("Draft copied locally"),
    },
    {
      icon: Download,
      label: "Download",
      handler: () => setLastAction("Local download selected"),
    },
    { icon: Mail, label: "Email unavailable", disabled: true },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="border-border bg-card min-w-0 rounded-xl border p-5">
        <h2 className="font-semibold">Click actions</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Open the dial to choose a local demo action.
        </p>
        <div className="mt-8 flex min-h-40 items-center justify-center">
          <SpeedDial
            actions={actions}
            icon={Share2}
            label="Share actions"
            position="inline"
            direction="up"
          />
        </div>
        <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
          {lastAction}
        </p>
      </section>

      <section className="border-border bg-card min-w-0 rounded-xl border p-5">
        <h2 className="font-semibold">Alternate states</h2>
        <div className="mt-8 flex min-h-40 flex-wrap items-center justify-center gap-8">
          <SpeedDial
            actions={actions}
            label="Right actions"
            position="inline"
            direction="right"
          />
          <SpeedDial
            actions={actions}
            label="Unavailable actions"
            position="inline"
            disabled
          />
        </div>
      </section>
    </div>
  );
}
