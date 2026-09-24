"use client";

import { useState } from "react";

import {
  NativeSelect,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectPreview() {
  const [framework, setFramework] = useState("react");
  const [density, setDensity] = useState("comfortable");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <PreviewSection title="Custom select">
        <Select value={framework} onValueChange={setFramework}>
          <SelectTrigger aria-label="Framework">
            <SelectValue placeholder="Choose a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Frameworks</SelectLabel>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="svelte">Svelte</SelectItem>
              <SelectItem value="solid" disabled>
                Solid (unavailable)
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select defaultValue="ready">
          <SelectTrigger aria-label="Loading select" loading>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ready">Ready</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm" aria-live="polite">
          Framework: {framework}
        </p>
      </PreviewSection>

      <PreviewSection title="Native sizes and states">
        <NativeSelect
          aria-label="Interface density"
          value={density}
          onChange={(event) => setDensity(event.target.value)}
          options={[
            { label: "Compact", value: "compact" },
            { label: "Comfortable", value: "comfortable" },
            { label: "Spacious", value: "spacious" },
          ]}
        />
        <NativeSelect
          aria-label="Small native select"
          sizeVariant="sm"
          options={["One", "Two"]}
        />
        <NativeSelect
          aria-label="Large native select"
          sizeVariant="lg"
          options={["One", "Two"]}
        />
        <NativeSelect
          aria-label="Disabled native select"
          disabled
          options={["Unavailable"]}
        />
        <p className="text-muted-foreground text-sm" aria-live="polite">
          Density: {density}
        </p>
      </PreviewSection>
    </div>
  );
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border bg-card min-w-0 space-y-4 rounded-xl border p-5">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </section>
  );
}
