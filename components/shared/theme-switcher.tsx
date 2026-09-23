"use client";

import { useSyncExternalStore } from "react";

import { useTheme } from "@/lib/use-theme";
import { cn } from "@/lib/utils";

const themeOptions = ["light", "dark", "system"] as const;

const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeSwitcher() {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { setTheme, theme } = useTheme();

  return (
    <fieldset className="border-border bg-card text-card-foreground rounded-lg border p-1 shadow-sm">
      <legend className="sr-only">Color theme</legend>
      <div className="flex gap-1">
        {themeOptions.map((option) => {
          const selected = mounted && theme === option;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              className={cn(
                "focus-visible:ring-ring focus-visible:ring-offset-background rounded-md px-3 py-2 text-xs font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              onClick={() => setTheme(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
