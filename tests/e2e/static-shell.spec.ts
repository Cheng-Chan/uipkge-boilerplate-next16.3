import { expect, test } from "@playwright/test";

test("serves the exported shell without browser errors", async ({ page }) => {
  const browserErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "UIPKGE boilerplate and component laboratory",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("complementary", { name: "Demo security warning" }),
  ).toBeVisible();
  expect(browserErrors).toEqual([]);
});

test("serves the exported not-found page with a 404 status", async ({
  page,
}) => {
  const response = await page.goto("/does-not-exist/");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Return home" })).toHaveAttribute(
    "href",
    "/",
  );
});
