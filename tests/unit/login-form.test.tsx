import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/features/auth/login/login-form";

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  replace: vi.fn(),
  next: "/projects",
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
  useSearchParams: () => new URLSearchParams({ next: mocks.next }),
}));

vi.mock("@/features/auth/session/session-provider", () => ({
  useDemoSession: () => ({
    login: mocks.login,
    state: { status: "anonymous" },
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mocks.login.mockReset();
    mocks.replace.mockReset();
    mocks.next = "/projects";
    mocks.login.mockResolvedValue({
      ok: true,
      data: { status: "authenticated" },
    });
  });

  it("displays the warning, public credentials, and password visibility control", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    expect(screen.getByLabelText("Demo security warning")).toHaveTextContent(
      "Do not enter real credentials",
    );
    expect(screen.getByText(/demo-admin-password/)).toBeVisible();
    const password = screen.getByLabelText("Demo password");
    expect(password).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
  });

  it("reports required fields and invalid credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole("button", { name: "Enter demo" }));
    expect(await screen.findByText("Enter a demo username.")).toBeVisible();
    expect(screen.getByText("Enter a demo password.")).toBeVisible();

    await user.type(screen.getByLabelText("Demo username"), "demo-admin");
    await user.type(screen.getByLabelText("Demo password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Enter demo" }));
    expect(
      await screen.findByText(/do not match a public demo account/i),
    ).toBeVisible();
    expect(mocks.login).not.toHaveBeenCalled();
  });

  it("supports credential selection and keyboard submission", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole("button", { name: "Use demo-manager" }));
    expect(screen.getByLabelText("Demo username")).toHaveValue("demo-manager");
    screen.getByLabelText("Demo password").focus();
    await user.keyboard("{Enter}");
    expect(mocks.login).toHaveBeenCalledWith("demo-user-manager");
    expect(mocks.replace).toHaveBeenCalledWith("/projects");
  });
});
