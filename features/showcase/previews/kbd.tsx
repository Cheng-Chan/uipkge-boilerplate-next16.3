"use client";

import { useState } from "react";
import { Kbd } from "@/components/ui/kbd";

export default function KbdPreview() {
  const [pressed, setPressed] = useState("None");

  return (
    <section
      className="border-border bg-card rounded-xl border p-5"
      onKeyDown={(event) => setPressed(event.key)}
      tabIndex={0}
    >
      <h2 className="font-semibold">Keyboard shortcuts</h2>
      <div className="mt-5 flex flex-wrap items-center gap-5 text-sm">
        <span>
          <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> Search
        </span>
        <span>
          <Kbd>⇧</Kbd> + <Kbd>Enter</Kbd> Run
        </span>
        <span>
          <Kbd>Esc</Kbd> Close
        </span>
      </div>
      <p className="text-muted-foreground mt-5 text-sm" aria-live="polite">
        Last key pressed in this panel: {pressed}
      </p>
    </section>
  );
}
