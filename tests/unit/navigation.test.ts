import { describe, expect, it } from "vitest";

import {
  NAVIGATION_ITEMS,
  navigationForRole,
  navigationItemForPath,
} from "@/config/navigation";

describe("navigation metadata", () => {
  it("tracks all policy destinations without exposing unavailable routes", () => {
    expect(NAVIGATION_ITEMS.map(({ path }) => path)).toEqual(
      expect.arrayContaining([
        "/dashboard",
        "/customers",
        "/projects",
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
    expect(navigationForRole("viewer").map(({ path }) => path)).toEqual([
      "/dashboard",
      "/ui-kit",
    ]);
  });

  it("filters links with the same role policy used by route access", () => {
    expect(navigationForRole("admin").map(({ path }) => path)).toEqual([
      "/dashboard",
      "/ui-kit",
      "/access-control",
    ]);
    expect(navigationForRole("manager").map(({ path }) => path)).toEqual([
      "/dashboard",
      "/ui-kit",
    ]);
  });

  it("matches nested paths on segment boundaries", () => {
    expect(navigationItemForPath("/projects/project-demo")?.path).toBe(
      "/projects",
    );
    expect(navigationItemForPath("/projectship")).toBeNull();
  });
});
