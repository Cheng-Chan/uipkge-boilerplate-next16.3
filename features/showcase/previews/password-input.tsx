"use client";

import { useState } from "react";

import { PasswordInput } from "@/components/ui/password-input";

export default function PasswordInputPreview() {
  const [demoValue, setDemoValue] = useState("Demo-phrase-24!");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <PreviewSection title="Strength and visibility">
        <label className="grid gap-2 text-sm font-medium">
          Demonstration passphrase
          <PasswordInput
            aria-label="Demonstration passphrase"
            autoComplete="off"
            value={demoValue}
            onChange={(event) => setDemoValue(event.target.value)}
            minLength={12}
            showStrength
          />
        </label>
        <p className="text-muted-foreground text-sm" aria-live="polite">
          Demo value length: {demoValue.length} characters. This value stays in
          this browser tab.
        </p>
      </PreviewSection>

      <PreviewSection title="Sizes and states">
        <PasswordInput
          aria-label="Small password input"
          size="sm"
          placeholder="Small"
        />
        <PasswordInput
          aria-label="Filled password input"
          variant="filled"
          placeholder="Filled"
        />
        <PasswordInput
          aria-label="Large password input"
          size="lg"
          placeholder="Large"
        />
        <PasswordInput
          aria-label="Read-only password input"
          readOnly
          defaultValue="demo-only"
        />
        <PasswordInput
          aria-label="Disabled password input"
          disabled
          placeholder="Disabled"
        />
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
