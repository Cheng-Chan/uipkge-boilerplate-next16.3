import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { catalogueSnapshot } from "@/catalogue/data";
import { PreviewReveal } from "@/features/showcase/gallery/preview-reveal";
import { groupVerifiedItems } from "@/features/showcase/gallery/verified-gallery";

describe("verified component gallery", () => {
  it("groups every verified visual preview without hard-coded counts", () => {
    const groups = groupVerifiedItems(catalogueSnapshot.items);
    const items = groups.flatMap((group) => group.items);

    expect(items).toHaveLength(
      catalogueSnapshot.summary.catalogueByStatus.verified ?? 0,
    );
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    expect(groups.map((group) => group.label)).toEqual([
      "Action",
      "Chart",
      "Control",
      "Data",
      "Data Display",
    ]);
  });

  it("loads and hides an isolated preview only after an explicit action", async () => {
    const user = userEvent.setup();
    render(<PreviewReveal itemId="kbd" title="Kbd" />);

    expect(screen.queryByText("Keyboard shortcuts")).not.toBeInTheDocument();
    const load = screen.getByRole("button", { name: "Load Kbd preview" });
    expect(load).toHaveAttribute("aria-expanded", "false");

    await user.click(load);
    expect(await screen.findByText("Keyboard shortcuts")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Hide Kbd preview" }),
    ).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: "Hide Kbd preview" }));
    expect(screen.queryByText("Keyboard shortcuts")).not.toBeInTheDocument();
  });
});
