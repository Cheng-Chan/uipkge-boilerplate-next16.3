"use client";

import { ArrowRight, Download, Plus } from "lucide-react";
import { useState } from "react";

import { Button, ButtonGroup } from "@/components/ui/button";

export default function ButtonPreview() {
  const [lastAction, setLastAction] = useState("No action selected");

  return (
    <div className="space-y-8">
      <PreviewSection title="Variants">
        {[
          ["Default", "default"],
          ["Secondary", "secondary"],
          ["Outline", "outline"],
          ["Ghost", "ghost"],
          ["Destructive", "destructive"],
          ["Link", "link"],
        ].map(([label, variant]) => (
          <Button
            key={variant}
            variant={variant as React.ComponentProps<typeof Button>["variant"]}
            onClick={() => setLastAction(`${label} button activated`)}
          >
            {label}
          </Button>
        ))}
      </PreviewSection>

      <PreviewSection title="Sizes and icon controls">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Add item">
          <Plus />
        </Button>
        <Button disabled>Unavailable</Button>
      </PreviewSection>

      <PreviewSection title="Attached group">
        <ButtonGroup aria-label="Export actions">
          <Button
            variant="outline"
            onClick={() => setLastAction("Download started locally")}
          >
            <Download /> Download
          </Button>
          <Button variant="outline" aria-label="Open export options">
            <ArrowRight />
          </Button>
        </ButtonGroup>
      </PreviewSection>

      <p className="text-muted-foreground text-sm" aria-live="polite">
        {lastAction}
      </p>
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
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}
