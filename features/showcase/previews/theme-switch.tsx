"use client";

import { useState } from "react";

import { ThemeSwitch } from "@/components/ui/theme-switch";

type Theme = "light" | "dark" | "system";

export default function ThemeSwitchPreview() {
  const [theme, setTheme] = useState<Theme>("system");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-muted-foreground text-sm font-medium">
          Selected theme
        </p>
        <p className="mt-1 text-lg font-semibold capitalize" aria-live="polite">
          {theme}
        </p>
      </div>

      <ThemeSwitch
        value={theme}
        onValueChange={setTheme}
        title="Theme cards"
        description="Choose one of the project's supported light, dark, or system modes."
        viewTransition={false}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <PreviewRow label="Icon segments">
          <ThemeSwitch
            value={theme}
            onValueChange={setTheme}
            variant="icons"
            title="Icon theme"
            viewTransition={false}
          />
        </PreviewRow>
        <PreviewRow label="Compact cycle">
          <ThemeSwitch
            value={theme}
            onValueChange={setTheme}
            variant="icon-only"
            viewTransition={false}
          />
        </PreviewRow>
        <PreviewRow label="Dropdown">
          <ThemeSwitch
            value={theme}
            onValueChange={setTheme}
            variant="dropdown"
            viewTransition={false}
          />
        </PreviewRow>
        <PreviewRow label="Two-state switch">
          <ThemeSwitch
            value={theme === "system" ? "light" : theme}
            onValueChange={setTheme}
            variant="switch"
            viewTransition={false}
          />
        </PreviewRow>
      </div>

      <PreviewRow label="Pill selector">
        <ThemeSwitch
          value={theme}
          onValueChange={setTheme}
          variant="pill"
          title="Pill theme"
          viewTransition={false}
        />
      </PreviewRow>
    </div>
  );
}

function PreviewRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <p className="text-muted-foreground mb-3 text-sm">{label}</p>
      {children}
    </div>
  );
}
