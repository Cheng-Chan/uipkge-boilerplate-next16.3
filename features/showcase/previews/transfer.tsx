"use client";

import { useState } from "react";
import { Transfer, type TransferItem } from "@/components/ui/transfer";

const options: TransferItem[] = [
  { key: "audit", label: "Audit manifests" },
  { key: "preview", label: "Build previews" },
  { key: "tests", label: "Run tests" },
  { key: "docs", label: "Update evidence" },
  { key: "blocked", label: "Unavailable item", disabled: true },
];

export default function TransferPreview() {
  const [selected, setSelected] = useState(["tests"]);

  return (
    <section className="border-border bg-card min-w-0 rounded-xl border p-5">
      <h2 className="font-semibold">Transfer work items</h2>
      <div className="mt-4 overflow-x-auto pb-2">
        <Transfer
          className="min-w-[640px]"
          dataSource={options}
          targetKeys={selected}
          onTargetKeysChange={setSelected}
          titles={["Available", "Selected"]}
          showSearch
          height={250}
        />
      </div>
      <p className="text-muted-foreground mt-3 text-sm" aria-live="polite">
        Selected keys: {selected.join(", ") || "none"}
      </p>
    </section>
  );
}
