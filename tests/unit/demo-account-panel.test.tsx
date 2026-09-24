import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DemoAccountPanel } from "@/features/auth/demo-account-panel";

const mocks = vi.hoisted(() => ({
  logout: vi.fn(),
  state: { status: "anonymous" } as Record<string, unknown>,
}));

vi.mock("@/features/auth/account-switcher", () => ({
  AccountSwitcher: () => <div>Account switcher</div>,
}));

vi.mock("@/features/auth/session/session-provider", () => ({
  useDemoSession: () => ({ logout: mocks.logout, state: mocks.state }),
}));

describe("DemoAccountPanel", () => {
  beforeEach(() => {
    mocks.logout.mockReset();
    mocks.logout.mockResolvedValue({ ok: true, data: { status: "anonymous" } });
    mocks.state = { status: "anonymous" };
  });

  it("links anonymous users to both authentication experiments", () => {
    render(<DemoAccountPanel />);
    expect(
      screen.getByRole("link", { name: "Open demo login" }),
    ).toHaveAttribute("href", "/login");
    expect(
      screen.getByRole("link", { name: "Try simulated sign-up" }),
    ).toHaveAttribute("href", "/signup");
  });

  it("shows the current role and logs out authenticated users", async () => {
    const user = userEvent.setup();
    mocks.state = {
      status: "authenticated",
      identity: {
        id: "demo-user-manager",
        username: "demo-manager",
        displayName: "Demo Manager",
        role: "manager",
      },
      permissions: [],
      persistence: { source: "persistent" },
    };
    render(<DemoAccountPanel />);
    expect(screen.getByLabelText("Current demo account")).toHaveTextContent(
      "Role: manager",
    );
    await user.click(screen.getByRole("button", { name: "Log out" }));
    expect(mocks.logout).toHaveBeenCalledOnce();
  });
});
