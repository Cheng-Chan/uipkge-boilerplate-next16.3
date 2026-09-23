import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeSwitcher } from "@/components/shared/theme-switcher";

const themeState = vi.hoisted(() => ({
  setTheme: vi.fn<(theme: string) => void>(),
  theme: "system",
}));

vi.mock("@/lib/use-theme", () => ({
  useTheme: () => themeState,
}));

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    themeState.setTheme.mockClear();
    themeState.theme = "system";
  });

  it("exposes three named choices and identifies the selected theme", () => {
    render(<ThemeSwitcher />);

    expect(screen.getByRole("group", { name: "Color theme" })).toBeVisible();
    expect(screen.getByRole("button", { name: "light" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "dark" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "system" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("changes theme from the keyboard", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    const darkButton = screen.getByRole("button", { name: "dark" });
    darkButton.focus();
    await user.keyboard("{Enter}");

    expect(themeState.setTheme).toHaveBeenCalledWith("dark");
  });
});
