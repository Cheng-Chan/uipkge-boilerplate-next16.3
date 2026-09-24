import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";

vi.mock("@/features/auth/demo-account-panel", () => ({
  DemoAccountPanel: () => <div data-testid="demo-account-panel" />,
}));

describe("HomePage", () => {
  it("identifies the application foundation", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "UIPKGE boilerplate and component laboratory",
      }),
    ).toBeVisible();
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
