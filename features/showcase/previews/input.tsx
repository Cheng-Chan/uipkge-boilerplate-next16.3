"use client";

import { ArrowRight, AtSign, Search } from "lucide-react";
import { useState } from "react";

import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input";

export default function InputPreview() {
  const [query, setQuery] = useState("Quarterly plan");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <PreviewSection title="Variants and validation">
        <Input aria-label="Outlined input" placeholder="Outlined" />
        <Input
          aria-label="Filled input"
          variant="filled"
          placeholder="Filled"
        />
        <Input
          aria-label="Borderless input"
          variant="borderless"
          placeholder="Borderless"
        />
        <Input
          aria-label="Invalid input"
          status="error"
          defaultValue="Needs attention"
        />
        <Input
          aria-label="Warning input"
          status="warning"
          defaultValue="Review this value"
        />
        <Input
          aria-label="Disabled input"
          disabled
          defaultValue="Unavailable"
        />
      </PreviewSection>

      <PreviewSection title="Interactive controls">
        <Input
          aria-label="Search query"
          prefixIcon={<Search />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          allowClear
          showCount
          maxLength={32}
        />
        <Input
          aria-label="Demo password"
          type="password"
          defaultValue="not-a-secret"
          showPasswordToggle
        />
        <Input
          aria-label="Workspace domain"
          prefixIcon={<AtSign />}
          addonAfter=".example.invalid"
        />
        <p className="text-muted-foreground text-sm" aria-live="polite">
          Query: {query || "empty"}
        </p>
      </PreviewSection>

      <section className="border-border bg-card min-w-0 rounded-xl border p-5 lg:col-span-2">
        <h2 className="font-semibold">Composite input group</h2>
        <div className="mt-4 max-w-xl">
          <InputGroup>
            <InputGroupAddon>https://</InputGroupAddon>
            <input
              aria-label="Project address"
              defaultValue="demo.example.invalid"
            />
            <InputGroupButton aria-label="Open project address">
              Open <ArrowRight />
            </InputGroupButton>
          </InputGroup>
        </div>
      </section>
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
