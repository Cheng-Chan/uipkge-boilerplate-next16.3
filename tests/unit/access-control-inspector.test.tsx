import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AccessControlInspector } from "@/features/access-control/access-control-inspector";
import { PERMISSIONS } from "@/features/access-control/policy";

describe("AccessControlInspector", () => {
  it("renders every fixture role and exact policy permission", () => {
    render(<AccessControlInspector />);
    expect(screen.getByText("Demo Administrator")).toBeVisible();
    expect(screen.getByText("Demo Manager")).toBeVisible();
    expect(screen.getByText("Demo Viewer")).toBeVisible();

    const matrix = screen.getByRole("table", {
      name: "Effective permissions for admin, manager, and viewer demo roles",
    });
    for (const permission of PERMISSIONS) {
      expect(within(matrix).getByText(permission)).toBeVisible();
    }
    const deleteRow = within(matrix)
      .getByText("customers.delete")
      .closest("tr");
    expect(deleteRow).not.toBeNull();
    expect(
      within(deleteRow as HTMLTableRowElement).getAllByText("Denied"),
    ).toHaveLength(2);
  });

  it("states the frontend-only limitation", () => {
    render(<AccessControlInspector />);
    expect(
      screen.getByText(/does not provide server enforcement/i),
    ).toBeVisible();
  });
});
