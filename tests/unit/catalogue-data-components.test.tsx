import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import BoardPreview from "@/features/showcase/previews/board";
import DataTablePreview from "@/features/showcase/previews/data-table";
import TreeTablePreview from "@/features/showcase/previews/tree-table";

beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Object.defineProperties(HTMLElement.prototype, {
    hasPointerCapture: { configurable: true, value: () => false },
    setPointerCapture: { configurable: true, value: () => undefined },
    releasePointerCapture: { configurable: true, value: () => undefined },
    scrollIntoView: { configurable: true, value: () => undefined },
    scrollTo: { configurable: true, value: () => undefined },
  });
});

describe("CAT005 data components", () => {
  it("moves a board card between lanes with the keyboard", async () => {
    const user = userEvent.setup();
    render(<BoardPreview />);

    const card = screen.getByRole("button", { name: "Confirm project brief" });
    card.focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowRight}");

    expect(screen.getByText("1 item moved to In progress")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Confirm project brief" }),
    ).toBeVisible();
  });

  it("searches, sorts, and selects a data-table row", async () => {
    const user = userEvent.setup();
    render(<DataTablePreview />);

    const region = screen.getByRole("region", { name: "Projects" });
    const search = within(region).getByRole("textbox", {
      name: "Search projects",
    });
    await user.type(search, "Juniper");
    await waitFor(() =>
      expect(within(region).queryByText("Atlas")).not.toBeInTheDocument(),
    );
    expect(within(region).getByText("Juniper")).toBeVisible();

    await user.clear(search);
    await waitFor(() =>
      expect(within(region).getByText("Atlas")).toBeVisible(),
    );
    await user.click(
      within(region).getByRole("button", { name: "Sort by Project" }),
    );
    await user.click(within(region).getByText("Atlas"));
    expect(screen.getByText("Selected project: Atlas")).toBeVisible();
  });

  it("expands, selects, and collapses tree-table rows", async () => {
    const user = userEvent.setup();
    render(<TreeTablePreview />);

    const treegrid = screen.getByRole("treegrid", {
      name: "Workspace hierarchy",
    });
    expect(await within(treegrid).findByText("Tokens")).toBeVisible();
    await user.click(
      within(treegrid).getByRole("checkbox", { name: "Select Tokens" }),
    );
    expect(screen.getByText("Selected rows: tokens")).toBeVisible();

    await user.click(
      within(treegrid).getAllByRole("button", { name: "Collapse" })[0],
    );
    expect(within(treegrid).queryByText("Tokens")).not.toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Loading rows" })).toBeVisible();
  });
});
