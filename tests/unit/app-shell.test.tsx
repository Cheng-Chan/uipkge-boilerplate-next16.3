import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppShell } from "@/components/shared/app-shell/app-shell";

const mocks = vi.hoisted(() => ({
  logout: vi.fn(),
  pathname: "/dashboard",
  replace: vi.fn(),
  role: "viewer" as "admin" | "manager" | "viewer",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock("@/components/shared/theme-switcher", () => ({
  ThemeSwitcher: () => <div aria-label="Theme control" />,
}));

vi.mock("@/features/auth/account-switcher", () => ({
  AccountSwitcher: () => <div>Account switcher</div>,
}));

vi.mock("@/features/auth/session/session-provider", () => ({
  useDemoSession: () => ({
    logout: mocks.logout,
    state: {
      status: "authenticated",
      identity: {
        id: `demo-user-${mocks.role}`,
        username: `demo-${mocks.role}`,
        displayName: `Demo ${mocks.role}`,
        role: mocks.role,
      },
      permissions: [],
      persistence: { source: "persistent" },
    },
  }),
}));

describe("AppShell", () => {
  beforeEach(() => {
    mocks.logout.mockReset();
    mocks.logout.mockResolvedValue({ ok: true, data: { status: "anonymous" } });
    mocks.pathname = "/dashboard";
    mocks.replace.mockReset();
    mocks.role = "viewer";
  });

  it("shows the warning, current role, breadcrumbs, and filtered navigation", () => {
    render(
      <AppShell>
        <h1>Page content</h1>
      </AppShell>,
    );
    expect(screen.getByLabelText("Demo security warning")).toHaveTextContent(
      "Do not enter real credentials",
    );
    expect(screen.getByText("viewer")).toBeVisible();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.queryByRole("link", { name: "Access control" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toHaveTextContent("Application/Dashboard");
  });

  it("exposes mobile navigation state and admin-only links", async () => {
    const user = userEvent.setup();
    mocks.role = "admin";
    render(
      <AppShell>
        <p>Content</p>
      </AppShell>,
    );
    const menu = screen.getByRole("button", { name: "Menu" });
    expect(menu).toHaveAttribute("aria-expanded", "false");
    await user.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Access control" })).toBeVisible();
  });

  it("logs out from the user menu and returns to the landing page", async () => {
    const user = userEvent.setup();
    render(
      <AppShell>
        <p>Content</p>
      </AppShell>,
    );
    await user.click(screen.getByText("Demo viewer"));
    await user.click(screen.getByRole("button", { name: "Log out" }));
    expect(mocks.logout).toHaveBeenCalledOnce();
    expect(mocks.replace).toHaveBeenCalledWith("/");
  });

  it("keeps a failed logout visible in the user menu", async () => {
    const user = userEvent.setup();
    mocks.logout.mockResolvedValueOnce({
      ok: false,
      error: { code: "INTERNAL", message: "Local sign-out failed." },
    });
    render(
      <AppShell>
        <p>Content</p>
      </AppShell>,
    );
    await user.click(screen.getByText("Demo viewer"));
    await user.click(screen.getByRole("button", { name: "Log out" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Local sign-out failed.",
    );
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});
