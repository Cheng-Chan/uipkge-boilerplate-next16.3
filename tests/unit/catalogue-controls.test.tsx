import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { Button, ButtonGroup } from "@/components/ui/button";
import {
  CascadeSelect,
  type CascadeOption,
} from "@/components/ui/cascade-select";
import { Fab } from "@/components/ui/fab";
import { FloatLabel } from "@/components/ui/float-label";
import { Input } from "@/components/ui/input";

const options: CascadeOption[] = [
  {
    value: "asia",
    label: "Asia",
    children: [
      {
        value: "thailand",
        label: "Thailand",
        children: [{ value: "bangkok", label: "Bangkok" }],
      },
    ],
  },
];

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
});

describe("CAT003 control components", () => {
  it("defaults buttons and FABs to non-submitting controls", async () => {
    const user = userEvent.setup();
    const activated = vi.fn();
    render(
      <>
        <ButtonGroup aria-label="Actions">
          <Button onClick={activated}>Save locally</Button>
          <Button variant="outline">Cancel</Button>
        </ButtonGroup>
        <Fab position="inline" ariaLabel="Create item" onClick={activated}>
          +
        </Fab>
        <Fab position="inline" ariaLabel="Unavailable action" disabled>
          ×
        </Fab>
      </>,
    );

    expect(screen.getByRole("group", { name: "Actions" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Save locally" }),
    ).toHaveAttribute("type", "button");
    expect(screen.getByRole("button", { name: "Create item" })).toHaveAttribute(
      "type",
      "button",
    );
    await user.click(screen.getByRole("button", { name: "Save locally" }));
    await user.click(screen.getByRole("button", { name: "Create item" }));
    await user.click(
      screen.getByRole("button", { name: "Unavailable action" }),
    );
    expect(activated).toHaveBeenCalledTimes(2);
  });

  it("selects a searched cascade path and exposes its popup relationship", async () => {
    const user = userEvent.setup();
    render(
      <CascadeSelect
        ariaLabel="Office location"
        options={options}
        placeholder="Choose an office"
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Office location" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", {
      name: "Choose an option",
    });
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);
    await user.type(
      within(dialog).getByRole("textbox", { name: "Search options" }),
      "Bangkok",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Asia / Thailand / Bangkok" }),
    );
    expect(trigger).toHaveTextContent("Asia / Thailand / Bangkok");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("associates and floats labels for empty, entered, and prefilled values", async () => {
    const user = userEvent.setup();
    render(
      <>
        <FloatLabel label="Project name" data-testid="empty-label">
          <input />
        </FloatLabel>
        <FloatLabel label="Prefilled name" data-testid="prefilled-label">
          <input defaultValue="Atlas" />
        </FloatLabel>
      </>,
    );

    const empty = screen.getByTestId("empty-label");
    const project = screen.getByLabelText("Project name");
    expect(empty).toHaveAttribute("data-floating", "false");
    expect(screen.getByTestId("prefilled-label")).toHaveAttribute(
      "data-floating",
      "true",
    );
    await user.type(project, "Roadmap");
    expect(empty).toHaveAttribute("data-floating", "true");
  });

  it("clears controlled input text and toggles password visibility", async () => {
    const user = userEvent.setup();

    function Fixture() {
      const [value, setValue] = useState("Quarterly plan");
      return (
        <>
          <Input
            aria-label="Search query"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            allowClear
          />
          <Input
            aria-label="Demo password"
            type="password"
            defaultValue="not-a-secret"
            showPasswordToggle
          />
        </>
      );
    }

    render(<Fixture />);
    const query = screen.getByRole("textbox", { name: "Search query" });
    await user.click(query);
    await user.click(screen.getByRole("button", { name: "Clear input" }));
    expect(query).toHaveValue("");

    const password = screen.getByLabelText("Demo password");
    expect(password).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "Hide password" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
