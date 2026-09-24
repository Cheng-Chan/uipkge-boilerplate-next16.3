import { expect, test } from "@playwright/test";

test("searches the snapshot and refreshes a generated item route", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/login/?next=%2Fui-kit");
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();
  await expect(
    page.getByRole("heading", { name: "UIPKGE React catalogue" }),
  ).toBeVisible();
  await expect(page.getByText("713", { exact: true }).first()).toBeVisible();

  await page.getByRole("searchbox", { name: "Search" }).fill("map-standard-3d");
  await expect(page.getByText("1 matching items")).toBeVisible();
  await expect(page).toHaveURL(/q=map-standard-3d/);
  await page.getByRole("link", { name: /Open item record/ }).click();
  await expect(
    page.getByRole("heading", { name: "Map Standard 3D" }),
  ).toBeVisible();
  await expect(page.getByText("Preview not installed")).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Map Standard 3D" }),
  ).toBeVisible();
  expect(
    requests.every((url) => url.startsWith("http://127.0.0.1:4173/")),
  ).toBe(true);
});

test("exercises the CAT001 action previews with keyboard-accessible state", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/login/?next=%2Fui-kit%2Ftheme-switch");
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();

  await expect(
    page.getByRole("heading", { name: "Theme Switch" }),
  ).toBeVisible();
  const themeCards = page.getByRole("radiogroup", { name: "Theme cards" });
  await themeCards.getByRole("radio", { name: "Dark" }).click();
  await expect(themeCards.getByRole("radio", { name: "Dark" })).toBeChecked();
  await expect(page.getByText("dark", { exact: true }).first()).toBeVisible();

  await page.goto("/ui-kit/toggle/");
  const bold = page.getByRole("button", { name: "Bold", exact: true });
  await bold.focus();
  await page.keyboard.press("Space");
  await expect(bold).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Bold is on")).toBeVisible();

  await page.goto("/ui-kit/toggle-group/");
  const list = page.getByRole("radio", { name: "List view" });
  await list.click();
  await expect(list).toHaveAttribute("data-state", "on");
  await expect(page.getByText("list view selected")).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Toggle Group" }),
  ).toBeVisible();

  expect(browserErrors).toEqual([]);
});
