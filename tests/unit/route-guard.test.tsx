import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  decideRouteGuard,
  RouteGuard,
} from "@/features/access-control/route-guard";
import type { DemoSessionState } from "@/features/auth/session/session-provider";

const mocks = vi.hoisted(() => ({
  pathname: "/dashboard",
  replace: vi.fn(),
  state: { status: "initializing" } as DemoSessionState,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock("@/features/auth/session/session-provider", async (importOriginal) => {
  const original =
    await importOriginal<
      typeof import("@/features/auth/session/session-provider")
    >();
  return { ...original, useDemoSession: () => ({ state: mocks.state }) };
});

const viewerState: DemoSessionState = {
  status: "authenticated",
  identity: {
    id: "demo-user-viewer",
    username: "demo-viewer",
    displayName: "Demo Viewer",
    role: "viewer",
  },
  permissions: ["dashboard.view"],
  persistence: { source: "persistent" },
};

describe("route guard", () => {
  beforeEach(() => {
    mocks.pathname = "/dashboard";
    mocks.replace.mockReset();
    mocks.state = { status: "initializing" };
  });

  it("keeps protected content hidden while restoring", () => {
    render(
      <RouteGuard>
        <p>Protected content</p>
      </RouteGuard>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Restoring");
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("redirects anonymous users with an encoded known next path", async () => {
    mocks.state = { status: "anonymous" };
    mocks.pathname = "/dashboard";
    render(
      <RouteGuard>
        <p>Protected content</p>
      </RouteGuard>,
    );
    await waitFor(() =>
      expect(mocks.replace).toHaveBeenCalledWith("/login?next=%2Fdashboard"),
    );
  });

  it("renders allowed content and a denied state after role changes", () => {
    expect(decideRouteGuard(viewerState, "/dashboard")).toEqual({
      kind: "allowed",
    });
    expect(decideRouteGuard(viewerState, "/access-control")).toEqual({
      kind: "denied",
      reason: "forbidden",
    });
    expect(decideRouteGuard(viewerState, "/unknown")).toEqual({
      kind: "denied",
      reason: "unknown-route",
    });
  });

  it("renders the frontend-only 403 state for a forbidden role", () => {
    mocks.state = viewerState;
    mocks.pathname = "/access-control";
    render(
      <RouteGuard>
        <p>Admin matrix</p>
      </RouteGuard>,
    );
    expect(
      screen.getByRole("heading", {
        name: "This demo role cannot open this page",
      }),
    ).toBeVisible();
    expect(screen.queryByText("Admin matrix")).not.toBeInTheDocument();
    expect(
      screen.getByLabelText("Frontend-only access limitation"),
    ).toHaveTextContent("not server authorization");
  });
});
