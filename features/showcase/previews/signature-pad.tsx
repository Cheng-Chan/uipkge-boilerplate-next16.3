"use client";

import { useState } from "react";

import { SignaturePad } from "@/components/ui/signature-pad";

export default function SignaturePadPreview() {
  const [signature, setSignature] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="border-border bg-card min-w-0 rounded-xl border p-5">
        <h2 className="font-semibold">Interactive canvas</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Draw with a pointer or touch. The exported image remains local to this
          tab.
        </p>
        <div className="mt-5 max-w-full">
          <SignaturePad modelValue={signature} onModelChange={setSignature} />
        </div>
        <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
          Signature: {signature ? "captured locally" : "empty"}
        </p>
      </section>

      <section className="border-border bg-card min-w-0 space-y-5 rounded-xl border p-5">
        <h2 className="font-semibold">Non-editable states</h2>
        <SignaturePad
          width={280}
          height={120}
          readonly
          showClearButton={false}
        />
        <SignaturePad
          width={280}
          height={120}
          disabled
          showClearButton={false}
        />
      </section>
    </div>
  );
}
