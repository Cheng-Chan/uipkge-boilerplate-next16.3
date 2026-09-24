import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import AttachmentPreview from "@/features/showcase/previews/attachment";
import AvatarPreview from "@/features/showcase/previews/avatar";
import BadgePreview from "@/features/showcase/previews/badge";
import CarouselPreview from "@/features/showcase/previews/carousel";
import ChipPreview from "@/features/showcase/previews/chip";
import CodeBlockPreview from "@/features/showcase/previews/code-block";
import DataListPreview from "@/features/showcase/previews/data-list";
import GanttPreview from "@/features/showcase/previews/gantt";
import IconBoxPreview from "@/features/showcase/previews/icon-box";
import IconsPreview from "@/features/showcase/previews/icons";
import KanbanPreview from "@/features/showcase/previews/kanban";
import KbdPreview from "@/features/showcase/previews/kbd";
import LabeledValuePreview from "@/features/showcase/previews/labeled-value";
import LazyImagePreview from "@/features/showcase/previews/lazy-image";
import ListPreview from "@/features/showcase/previews/list";
import PaymentCardPreview from "@/features/showcase/previews/payment-card";
import QrCodePreview from "@/features/showcase/previews/qr-code";
import TablePreview from "@/features/showcase/previews/table";
import TimelinePreview from "@/features/showcase/previews/timeline";
import TransferPreview from "@/features/showcase/previews/transfer";
import TreeViewPreview from "@/features/showcase/previews/tree-view";
import VirtualListPreview from "@/features/showcase/previews/virtual-list";

beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    }),
  });
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn(async () => undefined) },
  });
  Object.defineProperties(HTMLElement.prototype, {
    scrollTo: { configurable: true, value: () => undefined },
    scrollIntoView: { configurable: true, value: () => undefined },
  });
});

describe("CAT006 data-display primitives", () => {
  it("renders all five previews and updates attachment and chip state", async () => {
    const user = userEvent.setup();
    const attachment = render(<AttachmentPreview />);
    await user.click(
      screen.getByRole("button", { name: "Remove product-brief.pdf" }),
    );
    expect(screen.getByText("1 removable attachments remain.")).toBeVisible();
    attachment.unmount();

    const avatar = render(<AvatarPreview />);
    expect(screen.getByText("+5")).toBeVisible();
    avatar.unmount();
    const badge = render(<BadgePreview />);
    expect(screen.getByText("Verified")).toBeVisible();
    badge.unmount();

    const carousel = render(<CarouselPreview />);
    expect(screen.getByText("Slide 1 of 3")).toBeVisible();
    carousel.unmount();

    render(<ChipPreview />);
    await user.click(screen.getByRole("checkbox", { name: "Responsive" }));
    expect(screen.getByText("Selected: Accessible, Responsive")).toBeVisible();
  });
});

describe("CAT007 rich display primitives", () => {
  it("collapses source, changes metadata state, and exercises Gantt controls", async () => {
    const user = userEvent.setup();
    const code = render(<CodeBlockPreview />);
    await user.click(screen.getByRole("button", { name: "Hide code" }));
    expect(screen.getByRole("button", { name: "Show code" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    code.unmount();

    const data = render(<DataListPreview />);
    await user.click(screen.getByRole("button", { name: "Toggle status" }));
    expect(screen.getByText("Paused")).toBeVisible();
    data.unmount();

    const gantt = render(<GanttPreview />);
    await user.click(screen.getByRole("button", { name: "Week" }));
    await user.click(screen.getAllByText("Research")[0]);
    expect(screen.getByText("Research", { selector: "p" })).toBeVisible();
    gantt.unmount();

    const boxes = render(<IconBoxPreview />);
    expect(screen.getByLabelText("Verified")).toBeVisible();
    boxes.unmount();
    render(<IconsPreview />);
    await user.click(screen.getByRole("button", { name: "Rotate direction" }));
    expect(screen.getByText("Rotation: 90 degrees")).toBeVisible();
  });
});

describe("CAT008 collection primitives", () => {
  it("moves a Kanban card and exposes keyboard, value, image, and list states", async () => {
    const user = userEvent.setup();
    const kanban = render(<KanbanPreview />);
    const card = screen
      .getByText("Audit manifest")
      .closest('[data-slot="kanban-card"]');
    expect(card).toBeInstanceOf(HTMLElement);
    (card as HTMLElement).focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("audit moved to doing")).toBeVisible();
    kanban.unmount();

    const kbd = render(<KbdPreview />);
    fireEvent.keyDown(
      screen.getByRole("heading", { name: "Keyboard shortcuts" })
        .parentElement!,
      { key: "K" },
    );
    expect(screen.getByText(/Last key pressed.*K/)).toBeVisible();
    kbd.unmount();

    const value = render(<LabeledValuePreview />);
    await user.click(screen.getByRole("button", { name: "Toggle status" }));
    expect(screen.getByText("Review")).toBeVisible();
    value.unmount();

    const image = render(<LazyImagePreview />);
    await user.click(screen.getByRole("button", { name: "Show fallback" }));
    fireEvent.error(
      screen.getByRole("img", { name: "Abstract blue landscape" }),
    );
    expect(
      screen.getByRole("img", { name: "Image failed to load" }),
    ).toBeVisible();
    image.unmount();

    render(<ListPreview />);
    await user.click(screen.getByText("Data display"));
    expect(screen.getByText("Selected: data")).toBeVisible();
  });
});

describe("CAT009 structured data primitives", () => {
  it("updates payment, QR, table, timeline, and transfer state", async () => {
    const user = userEvent.setup();
    const payment = render(<PaymentCardPreview />);
    await user.click(screen.getByRole("button", { name: "Show back" }));
    expect(screen.getByRole("button", { name: "Show front" })).toBeVisible();
    payment.unmount();

    const qr = render(<QrCodePreview />);
    await user.click(screen.getByRole("button", { name: "expired" }));
    await user.click(await screen.findByRole("button", { name: "Refresh" }));
    expect(screen.getByRole("button", { name: "active" })).toBeVisible();
    qr.unmount();

    const table = render(<TablePreview />);
    await user.click(screen.getByRole("button", { name: /Files/ }));
    expect(
      within(screen.getAllByRole("row")[1]).getByText("Data Table"),
    ).toBeVisible();
    table.unmount();

    const timeline = render(<TimelinePreview />);
    await user.click(screen.getByRole("button", { name: "Toggle density" }));
    expect(screen.getByText("Manifest audited")).toBeVisible();
    timeline.unmount();

    render(<TransferPreview />);
    expect(screen.getByText("Available")).toBeVisible();
    expect(screen.getByText("Selected keys: tests")).toBeVisible();
  });
});

describe("CAT010 scalable trees and lists", () => {
  it("selects a tree node and virtualizes one thousand rows", async () => {
    const user = userEvent.setup();
    const tree = render(<TreeViewPreview />);
    await user.click(screen.getByText("README.md"));
    expect(screen.getByText("Selected: readme")).toBeVisible();
    tree.unmount();

    render(<VirtualListPreview />);
    expect(screen.getByText("1,000 virtualized rows")).toBeVisible();
    expect(screen.queryByText("Catalogue row 1000")).not.toBeInTheDocument();
  });
});
