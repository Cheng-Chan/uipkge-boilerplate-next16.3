"use client";

import { useState } from "react";

import { FloatLabel } from "@/components/ui/float-label";

const controlClass =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-11 w-full rounded-md border px-3 pt-2 text-sm outline-none focus-visible:ring-3 disabled:cursor-not-allowed";

export default function FloatLabelPreview() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("Prefilled local note");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="border-border bg-card space-y-5 rounded-xl border p-5">
        <h2 className="font-semibold">Interactive fields</h2>
        <FloatLabel label="Project name" required>
          <input
            className={controlClass}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FloatLabel>
        <FloatLabel label="Local note">
          <input
            className={controlClass}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </FloatLabel>
        <p className="text-muted-foreground text-sm" aria-live="polite">
          Project: {name || "empty"}
        </p>
      </section>

      <section className="border-border bg-card space-y-5 rounded-xl border p-5">
        <h2 className="font-semibold">Disabled state</h2>
        <FloatLabel label="Archived value" disabled>
          <input className={controlClass} defaultValue="Read only" disabled />
        </FloatLabel>
      </section>
    </div>
  );
}
