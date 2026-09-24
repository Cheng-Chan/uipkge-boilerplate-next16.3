"use client";

import { useRef, useState } from "react";
import {
  VirtualList,
  type VirtualListHandle,
} from "@/components/ui/virtual-list";
import { Button } from "@/components/ui/button";

const items = Array.from({ length: 1000 }, (_, index) => ({
  id: `row-${index + 1}`,
  label: `Catalogue row ${index + 1}`,
}));

export default function VirtualListPreview() {
  const listRef = useRef<VirtualListHandle>(null);
  const [range, setRange] = useState<[number, number]>([0, 0]);

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">1,000 virtualized rows</h2>
          <p className="text-muted-foreground mt-1 text-sm" aria-live="polite">
            Rendered range: {range[0] + 1}–{range[1]}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => listRef.current?.scrollToIndex(0)}
          >
            First
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              listRef.current?.scrollToIndex(999, { align: "end" })
            }
          >
            Last
          </Button>
        </div>
      </div>
      <div
        className="border-border mt-4 overflow-hidden rounded-lg border"
        role="region"
        aria-label="Virtual catalogue rows"
      >
        <VirtualList
          ref={listRef}
          items={items}
          itemSize={44}
          height={264}
          onRangeChange={setRange}
        >
          {(item, index) => (
            <div className="border-border flex h-full items-center justify-between border-b px-4 text-sm">
              <span>{item.label}</span>
              <span className="text-muted-foreground tabular-nums">
                {index + 1}
              </span>
            </div>
          )}
        </VirtualList>
      </div>
    </section>
  );
}
