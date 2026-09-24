import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";

vi.mock("@/features/auth/demo-account-panel", () => ({
  DemoAccountPanel: () => <div data-testid="demo-account-panel" />,
}));

describe("HomePage", () => {
  it("presents the laboratory and its live snapshot coverage", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Explore the system. Own every component.",
      }),
    ).toBeVisible();
    expect(screen.getByText("713")).toBeVisible();
    expect(screen.getByText("675")).toBeVisible();
    expect(screen.getByText("38")).toBeVisible();
  });

  it("links to the UI kit and public auth experiments", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("link", { name: /View 39 live components/ }),
    ).toHaveAttribute("href", "/ui-kit/gallery");
    expect(
      screen.getByRole("link", { name: /Explore UI kit/ }),
    ).toHaveAttribute("href", "/ui-kit");
    expect(
      screen.getByRole("link", { name: "View demo accounts" }),
    ).toHaveAttribute("href", "/login");
  });

  it("shows the demo security warning", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("complementary", { name: "Demo security warning" }),
    ).toHaveTextContent(
      "Do not enter real credentials or sensitive information.",
    );
  });
});
