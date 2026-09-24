import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GlobalThemeControl } from "@/components/shared/global-theme-control";

const mocks = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
}));

vi.mock("@/components/shared/theme-switcher", () => ({
  ThemeSwitcher: () => <div aria-label="Global theme switcher" />,
}));

describe("GlobalThemeControl", () => {
  it("renders on public routes and defers to the protected shell", () => {
    const { rerender } = render(<GlobalThemeControl />);
    expect(screen.getByLabelText("Global theme switcher")).toBeVisible();

    mocks.pathname = "/dashboard";
    rerender(<GlobalThemeControl />);
    expect(
      screen.queryByLabelText("Global theme switcher"),
    ).not.toBeInTheDocument();
  });
});
