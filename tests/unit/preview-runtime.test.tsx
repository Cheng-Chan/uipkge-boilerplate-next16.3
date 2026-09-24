import { render, screen } from "@testing-library/react";
import { lazy } from "react";
import { expect, it, vi } from "vitest";

import {
  CataloguePreview,
  PreviewRuntime,
} from "@/features/showcase/previews/preview-runtime";

it("loads one explicitly selected preview", async () => {
  const loader = vi.fn(async () => ({
    default: () => <button>Interactive preview</button>,
  }));
  const Preview = lazy(loader);
  render(<PreviewRuntime preview={Preview} />);
  expect(
    await screen.findByRole("button", { name: "Interactive preview" }),
  ).toBeVisible();
  expect(loader).toHaveBeenCalledTimes(1);
});

it("contains lazy preview failures", async () => {
  const consoleError = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined);
  const Preview = lazy(() => Promise.reject(new Error("preview failed")));
  render(<PreviewRuntime preview={Preview} />);
  expect(await screen.findByRole("alert")).toHaveTextContent("could not load");
  consoleError.mockRestore();
});

it("does not treat a tracked record as a completed preview", () => {
  render(<CataloguePreview itemId="button" status="discovered" />);
  expect(screen.getByText("Preview not installed")).toBeVisible();
  expect(screen.getByText(/does not substitute a placeholder/i)).toBeVisible();
});
