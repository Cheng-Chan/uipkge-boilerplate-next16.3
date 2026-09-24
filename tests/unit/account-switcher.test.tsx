import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AccountSwitcher } from "@/features/auth/account-switcher";

const mocks = vi.hoisted(() => ({
  pathname: "/access-control",
  replace: vi.fn(),
  switchIdentity: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock("@/features/auth/session/session-provider", () => ({
  useDemoSession: () => ({
    state: {
      status: "authenticated",
      identity: {
        id: "demo-user-admin",
        username: "demo-admin",
        displayName: "Demo Administrator",
        role: "admin",
      },
    },
    switchIdentity: mocks.switchIdentity,
  }),
}));

describe("AccountSwitcher", () => {
  beforeEach(() => {
    mocks.pathname = "/access-control";
    mocks.replace.mockReset();
    mocks.switchIdentity.mockReset();
    mocks.switchIdentity.mockResolvedValue({
      ok: true,
      data: { status: "authenticated" },
    });
  });

  it("switches fixture identity and leaves a newly forbidden route", async () => {
    const user = userEvent.setup();
    render(<AccountSwitcher />);
    await user.selectOptions(
      screen.getByLabelText("Demo account"),
      "demo-user-manager",
    );
    expect(mocks.switchIdentity).toHaveBeenCalledWith("demo-user-manager");
    expect(mocks.replace).toHaveBeenCalledWith("/");
  });

  it("keeps the current route when the new identity may view it", async () => {
    const user = userEvent.setup();
    mocks.pathname = "/projects/project-demo-lantern";
    render(<AccountSwitcher />);
    await user.selectOptions(
      screen.getByLabelText("Demo account"),
      "demo-user-viewer",
    );
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});
