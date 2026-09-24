"use client";

import { useState } from "react";
import { Chip, ChipGroup } from "@/components/ui/chip";

const filters = ["Accessible", "Responsive", "Local only"];

export default function ChipPreview() {
  const [selected, setSelected] = useState([filters[0]]);
  const [visible, setVisible] = useState(true);

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Selectable chips</h2>
      <ChipGroup
        className="mt-4"
        selected={selected}
        multiple
        filter
        onSelectedChange={setSelected}
      >
        {({ isSelected, toggle }) =>
          filters.map((filter) => (
            <Chip
              key={filter}
              role="checkbox"
              tabIndex={0}
              aria-checked={isSelected(filter)}
              variant={isSelected(filter) ? "filled" : "outlined"}
              onClick={() => toggle(filter)}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  toggle(filter);
                }
              }}
            >
              {filter}
            </Chip>
          ))
        }
      </ChipGroup>
      <div className="mt-5 min-h-8">
        {visible ? (
          <Chip closable variant="success" onClose={() => setVisible(false)}>
            Closable chip
          </Chip>
        ) : (
          <button
            type="button"
            className="text-primary text-sm underline"
            onClick={() => setVisible(true)}
          >
            Restore chip
          </button>
        )}
      </div>
      <p className="text-muted-foreground mt-3 text-sm" aria-live="polite">
        Selected: {selected.join(", ") || "none"}
      </p>
    </section>
  );
}
