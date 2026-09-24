"use client";

import { Check, MessageCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Fab } from "@/components/ui/fab";

export default function FabPreview() {
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-6">
      <section className="border-border bg-card rounded-xl border p-5">
        <h2 className="font-semibold">Inline variants and sizes</h2>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Fab
            position="inline"
            size="mini"
            ariaLabel="Add compact item"
            onClick={() => setCount((n) => n + 1)}
          >
            <Plus />
          </Fab>
          <Fab position="inline" variant="secondary" ariaLabel="Open messages">
            <MessageCircle />
          </Fab>
          <Fab
            position="inline"
            variant="outline"
            size="large"
            ariaLabel="Confirm selection"
          >
            <Check />
          </Fab>
          <Fab
            position="inline"
            variant="destructive"
            ariaLabel="Delete item"
            disabled
          >
            <Trash2 />
          </Fab>
          <Fab
            position="inline"
            label="Create item"
            ariaLabel="Create item"
            onClick={() => setCount((n) => n + 1)}
          >
            <Plus />
          </Fab>
        </div>
        <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
          Local create actions: {count}
        </p>
      </section>

      <section className="border-border bg-muted/30 relative min-h-48 overflow-hidden rounded-xl border p-5">
        <h2 className="font-semibold">Contained position</h2>
        <p className="text-muted-foreground mt-1 max-w-md text-sm">
          Absolute positioning keeps this example inside the preview card.
        </p>
        <Fab
          absolute
          position="bottom-right"
          ariaLabel="Add contained item"
          onClick={() => setCount((n) => n + 1)}
        >
          <Plus />
        </Fab>
      </section>
    </div>
  );
}
