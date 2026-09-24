import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  DemoSessionProvider,
  useDemoSession,
} from "@/features/auth/session/session-provider";
import type { DemoSessionService } from "@/features/auth/session/session-service";
import { serviceSuccess } from "@/lib/service-result";
import { DEMO_USERS } from "@/mocks/users";

function Consumer() {
  const { login, logout, state } = useDemoSession();
  return (
    <div>
      <output>{state.status}</output>
      {state.status === "authenticated" ? (
        <span>
          {state.identity.role}:{state.permissions.join(",")}
        </span>
      ) : null}
      <button onClick={() => void login("demo-user-manager")}>Login</button>
      <button onClick={() => void logout()}>Logout</button>
    </div>
  );
}

function createService(): DemoSessionService {
  return {
    restore: vi.fn(async () =>
      serviceSuccess({
        identity: null,
        persistence: { source: "persistent" as const },
      }),
    ),
    signIn: vi.fn(async () =>
      serviceSuccess({
        identity: { ...DEMO_USERS[1] },
        persistence: { source: "persistent" as const },
      }),
    ),
    signOut: vi.fn(async () =>
      serviceSuccess({
        identity: null,
        persistence: { source: "persistent" as const },
      }),
    ),
  };
}

describe("DemoSessionProvider", () => {
  it("does not render an authenticated state before restoration and derives permissions", async () => {
    const user = userEvent.setup();
    render(
      <DemoSessionProvider service={createService()}>
        <Consumer />
      </DemoSessionProvider>,
    );
    expect(screen.getByText("initializing")).toBeVisible();
    await waitFor(() => expect(screen.getByText("anonymous")).toBeVisible());

    await user.click(screen.getByRole("button", { name: "Login" }));
    expect(await screen.findByText(/^manager:/)).toHaveTextContent(
      "customers.update",
    );
    expect(screen.getByText(/^manager:/)).not.toHaveTextContent(
      "customers.delete",
    );
    await user.click(screen.getByRole("button", { name: "Logout" }));
    expect(await screen.findByText("anonymous")).toBeVisible();
  });
});
