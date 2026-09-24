import { describe, expect, it } from "vitest";

import {
  evaluateRouteAccess,
  hasPermission,
  matchRoutePolicy,
  PERMISSIONS,
  permissionsForRole,
  ROUTE_POLICIES,
  satisfiesPermissionRequirement,
} from "@/features/access-control/policy";

describe("permission policy", () => {
  it("grants every explicit permission only to admin", () => {
    expect(permissionsForRole("admin")).toEqual(PERMISSIONS);
    expect(hasPermission("manager", "customers.update")).toBe(true);
    expect(hasPermission("manager", "customers.delete")).toBe(false);
    expect(hasPermission("viewer", "customers.view")).toBe(true);
    expect(hasPermission("viewer", "data.export")).toBe(false);
    expect(hasPermission("admin", "unknown.permission")).toBe(false);
  });

  it("uses explicit any/all semantics and denies empty requirements", () => {
    expect(
      satisfiesPermissionRequirement("manager", {
        mode: "all",
        permissions: ["customers.view", "customers.update"],
      }),
    ).toBe(true);
    expect(
      satisfiesPermissionRequirement("manager", {
        mode: "all",
        permissions: ["customers.update", "customers.delete"],
      }),
    ).toBe(false);
    expect(
      satisfiesPermissionRequirement("viewer", {
        mode: "any",
        permissions: ["customers.update", "customers.view"],
      }),
    ).toBe(true);
    expect(
      satisfiesPermissionRequirement("admin", {
        mode: "any",
        permissions: [],
      }),
    ).toBe(false);
  });

  it("accounts for every required destination", () => {
    expect(ROUTE_POLICIES.map(({ path }) => path)).toEqual(
      expect.arrayContaining([
        "/dashboard",
        "/403",
        "/projects",
        "/customers",
        "/kanban",
        "/calendar",
        "/activity",
        "/messages",
        "/settings",
        "/ui-kit",
        "/blocks",
        "/charts",
        "/maps",
        "/editor",
        "/access-control",
      ]),
    );
  });

  it("matches nested paths only on segment boundaries", () => {
    expect(matchRoutePolicy("/projects/project-demo-lantern")?.path).toBe(
      "/projects",
    );
    expect(matchRoutePolicy("/projects/")?.path).toBe("/projects");
    expect(matchRoutePolicy("/projectship")).toBeNull();
    expect(matchRoutePolicy("//projects")).toBeNull();
    expect(matchRoutePolicy("projects")).toBeNull();
  });

  it("allows public routes and denies anonymous, forbidden, and unknown access", () => {
    expect(evaluateRouteAccess(null, "/login")).toMatchObject({
      allowed: true,
    });
    expect(evaluateRouteAccess(null, "/projects")).toMatchObject({
      allowed: false,
      reason: "anonymous",
    });
    expect(evaluateRouteAccess("viewer", "/access-control")).toMatchObject({
      allowed: false,
      reason: "forbidden",
    });
    expect(evaluateRouteAccess("admin", "/not-mapped")).toEqual({
      allowed: false,
      policy: null,
      reason: "unknown-route",
    });
  });
});
