import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
  vi.stubGlobal(
    "ResizeObserver",
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

describe("CAT001 action components", () => {
  it("exposes a pressed state and toggles it from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold">Bold</Toggle>);
    const toggle = screen.getByRole("button", { name: "Bold" });

    expect(toggle).toHaveAttribute("aria-pressed", "false");
    toggle.focus();
    await user.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("supports controlled single and multiple toggle groups", async () => {
    const user = userEvent.setup();

    function Fixture() {
      const [view, setView] = useState("grid");
      const [formatting, setFormatting] = useState<string[]>(["bold"]);
      return (
        <>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => value && setView(value)}
            aria-label="View mode"
          >
            <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
            <ToggleGroupItem value="list">List</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="multiple"
            value={formatting}
            onValueChange={setFormatting}
            aria-label="Formatting"
          >
            <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
            <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
          </ToggleGroup>
        </>
      );
    }

    render(<Fixture />);
    const viewMode = screen.getByRole("radiogroup", { name: "View mode" });
    const formatting = screen.getByRole("toolbar", { name: "Formatting" });

    await user.click(within(viewMode).getByRole("radio", { name: "List" }));
    expect(
      within(viewMode).getByRole("radio", { name: "List" }),
    ).toHaveAttribute("data-state", "on");
    await user.click(
      within(formatting).getByRole("button", { name: "Italic" }),
    );
    expect(
      within(formatting).getByRole("button", { name: "Italic" }),
    ).toHaveAttribute("data-state", "on");
  });

  it("switches among the project's three supported theme values", async () => {
    const user = userEvent.setup();

    function Fixture() {
      const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
      return (
        <>
          <ThemeSwitch
            value={theme}
            onValueChange={setTheme}
            title="Preview theme"
            viewTransition={false}
          />
          <output>{theme}</output>
        </>
      );
    }

    render(<Fixture />);
    const group = screen.getByRole("radiogroup", { name: "Preview theme" });
    await user.click(within(group).getByRole("radio", { name: "Dark" }));
    expect(within(group).getByRole("radio", { name: "Dark" })).toBeChecked();
    expect(screen.getByText("dark", { selector: "output" })).toBeVisible();
  });
});
