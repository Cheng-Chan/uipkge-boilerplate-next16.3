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
      name: "Explore the system. Own every component.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("complementary", { name: "Demo security warning" }),
  ).toBeVisible();
  expect(browserErrors).toEqual([]);
});

test("keeps the landing composition usable at mobile and desktop widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /Explore UI kit/ }),
  ).toBeVisible();
  await expect(
    page.getByText("Live counts from the tracked, hash-backed snapshot."),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(
    page.getByRole("navigation", { name: "Landing navigation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "A laboratory, not a screenshot gallery.",
    }),
  ).toBeVisible();
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
