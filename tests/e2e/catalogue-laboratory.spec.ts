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
