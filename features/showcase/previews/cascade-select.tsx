"use client";

import { useState } from "react";

import {
  CascadeSelect,
  type CascadeOption,
} from "@/components/ui/cascade-select";

const locations: CascadeOption[] = [
  {
    value: "asia",
    label: "Asia",
    children: [
      {
        value: "thailand",
        label: "Thailand",
        children: [
          { value: "bangkok", label: "Bangkok" },
          { value: "chiang-mai", label: "Chiang Mai" },
        ],
      },
      {
        value: "japan",
        label: "Japan",
        children: [
          { value: "tokyo", label: "Tokyo" },
          { value: "osaka", label: "Osaka" },
        ],
      },
    ],
  },
  {
    value: "europe",
    label: "Europe",
    children: [
      {
        value: "france",
        label: "France",
        children: [
          { value: "paris", label: "Paris" },
          { value: "lyon", label: "Lyon" },
        ],
      },
    ],
  },
];

export default function CascadeSelectPreview() {
  const [value, setValue] = useState<string[] | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="border-border bg-card rounded-xl border p-5">
        <h2 className="font-semibold">Searchable location</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Browse each level or search directly for a city.
        </p>
        <div className="mt-5">
          <CascadeSelect
            ariaLabel="Office location"
            options={locations}
            value={value}
            onValueChange={setValue}
            placeholder="Choose an office"
            searchPlaceholder="Search cities"
          />
        </div>
        <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
          Selection: {value?.join(" / ") ?? "none"}
        </p>
      </section>

      <section className="border-border bg-card rounded-xl border p-5">
        <h2 className="font-semibold">Unavailable states</h2>
        <div className="mt-5 space-y-4">
          <CascadeSelect
            ariaLabel="Disabled location"
            options={locations}
            disabled
            placeholder="Disabled"
          />
          <CascadeSelect
            ariaLabel="Loading location"
            options={locations}
            loading
            placeholder="Loading"
          />
        </div>
      </section>
    </div>
  );
}
