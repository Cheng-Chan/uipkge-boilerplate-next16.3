import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Copy, Plus } from "lucide-react";
import { useState } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { PasswordInput } from "@/components/ui/password-input";
import {
  NativeSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignaturePad } from "@/components/ui/signature-pad";
import { SpeedDial } from "@/components/ui/speed-dial";
import { TreeSelect, type TreeSelectNode } from "@/components/ui/tree-select";

const tree: TreeSelectNode[] = [
  {
    value: "engineering",
    label: "Engineering",
    children: [
      { value: "frontend", label: "Frontend" },
      { value: "platform", label: "Platform" },
    ],
  },
];

const canvasContext = {
  beginPath: vi.fn(),
  closePath: vi.fn(),
  fillRect: vi.fn(),
  lineTo: vi.fn(),
  moveTo: vi.fn(),
  scale: vi.fn(),
  stroke: vi.fn(),
  fillStyle: "",
  lineCap: "butt",
  lineJoin: "miter",
  lineWidth: 1,
  strokeStyle: "",
};

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
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    () => canvasContext as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
    "data:image/png;base64,demo",
  );
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CAT004 advanced controls", () => {
  it("reports password strength and toggles visibility", async () => {
    const user = userEvent.setup();
    render(
      <PasswordInput
        aria-label="Demo passphrase"
        defaultValue="Strong-Demo-24!"
        showStrength
        minLength={12}
      />,
    );

    expect(
      screen.getByRole("status", { name: "Password strength: strong" }),
    ).toBeVisible();
    const input = screen.getByLabelText("Demo passphrase");
    expect(input).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
  });

  it("changes custom and native select values", async () => {
    const user = userEvent.setup();

    function Fixture() {
      const [value, setValue] = useState("react");
      return (
        <>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger aria-label="Framework">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
            </SelectContent>
          </Select>
          <NativeSelect
            aria-label="Density"
            options={["Compact", "Comfortable"]}
          />
          <output>{value}</output>
        </>
      );
    }

    render(<Fixture />);
    await user.click(screen.getByRole("combobox", { name: "Framework" }));
    await user.click(await screen.findByRole("option", { name: "Vue" }));
    expect(screen.getByText("vue")).toBeVisible();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Density" }),
      "Comfortable",
    );
    expect(screen.getByRole("combobox", { name: "Density" })).toHaveValue(
      "Comfortable",
    );
  });

  it("draws, exports, and clears a signature locally", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    render(<SignaturePad onModelChange={changed} />);

    const canvas = screen.getByRole("img", { name: "Signature pad" });
    fireEvent.pointerDown(canvas, { pointerId: 1, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(canvas, { pointerId: 1, clientX: 20, clientY: 20 });
    fireEvent.pointerUp(canvas, { pointerId: 1, clientX: 20, clientY: 20 });
    expect(changed).toHaveBeenLastCalledWith("data:image/png;base64,demo");
    expect(canvasContext.stroke).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(changed).toHaveBeenLastCalledWith(null);
  });

  it("opens a speed-dial menu and runs an enabled action", async () => {
    const user = userEvent.setup();
    const copy = vi.fn();
    render(
      <SpeedDial
        position="inline"
        label="Quick actions"
        icon={Plus}
        actions={[
          { icon: Copy, label: "Copy draft", handler: copy },
          { icon: Copy, label: "Unavailable", disabled: true },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Quick actions" }));
    const menu = await screen.findByRole("menu", { name: "Quick actions" });
    await user.click(
      within(menu).getByRole("menuitem", { name: "Copy draft" }),
    );
    expect(copy).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole("menu", { name: "Quick actions" }),
    ).not.toBeInTheDocument();
  });

  it("searches, selects, and clears a tree value", async () => {
    const user = userEvent.setup();
    render(
      <TreeSelect ariaLabel="Primary team" data={tree} defaultExpandAll />,
    );

    const trigger = screen.getByRole("combobox", { name: "Primary team" });
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog", {
      name: "Primary team options",
    });
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);
    await user.type(
      within(dialog).getByRole("textbox", { name: "Search tree" }),
      "Frontend",
    );
    await user.click(within(dialog).getByText("Frontend"));
    expect(trigger).toHaveTextContent("Frontend");

    trigger.focus();
    await user.keyboard("{Delete}");
    expect(trigger).toHaveTextContent("Select...");
  });
});
