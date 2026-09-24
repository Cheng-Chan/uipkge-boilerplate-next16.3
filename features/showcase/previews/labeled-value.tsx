"use client";

import { useState } from "react";
import { LabeledValue } from "@/components/ui/labeled-value";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LabeledValuePreview() {
  const [ready, setReady] = useState(true);

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Build details</h2>
      <div className="mt-4 space-y-3">
        <LabeledValue label="Framework" value="Next.js 16.3" />
        <LabeledValue label="Rendering" value="Static export" />
        <LabeledValue label="Status">
          <Badge variant={ready ? "success" : "warning"}>
            {ready ? "Ready" : "Review"}
          </Badge>
        </LabeledValue>
      </div>
      <Button
        className="mt-5"
        size="sm"
        variant="outline"
        onClick={() => setReady((value) => !value)}
      >
        Toggle status
      </Button>
    </section>
  );
}
