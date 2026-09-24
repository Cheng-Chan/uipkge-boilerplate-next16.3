import { expect, test, type Page } from "@playwright/test";

async function loginAs(
  page: Page,
  username: "admin" | "manager" | "viewer",
  next = "/dashboard",
) {
  await page.goto(`/login/?next=${encodeURIComponent(next)}`);
  await page.getByRole("button", { name: `Use demo-${username}` }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();
}

test("redirects an anonymous deep link and restores it after login", async ({
  page,
}) => {
  const response = await page.goto("/dashboard/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/login\/?\?next=%2Fdashboard/);
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();
  await expect(page).toHaveURL(/\/dashboard\/$/);
  await expect(
    page.getByRole("heading", { name: "Application shell" }),
  ).toBeVisible();
  await expect(page.getByLabel("Demo security warning")).toBeVisible();
  await expect(page.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.getByRole("link", { name: "Access control" })).toHaveCount(
    0,
  );
});

test("shows the complete inspector to admin and 403 states to other roles", async ({
  page,
}) => {
  await loginAs(page, "admin", "/access-control");
  await expect(page).toHaveURL(/\/access-control\/$/);
  await expect(
    page.getByRole("heading", { name: "Demo access control" }),
  ).toBeVisible();
  await expect(
    page.getByText("customers.delete", { exact: true }),
  ).toBeVisible();

  await page.goto("/");
  await page.getByRole("button", { name: "Log out" }).click();
  await loginAs(page, "manager");
  await page.goto("/access-control/");
  await expect(
    page.getByRole("heading", {
      name: "This demo role cannot open this page",
    }),
  ).toBeVisible();

  await page.goto("/");
  await page.getByRole("button", { name: "Log out" }).click();
  await loginAs(page, "viewer");
  await page.goto("/access-control/");
  await expect(
    page.getByRole("heading", {
      name: "This demo role cannot open this page",
    }),
  ).toBeVisible();
});

test("supports mobile shell navigation and account controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginAs(page, "admin");
  const menu = page.getByRole("button", { name: "Menu" });
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("link", { name: "Access control" }),
  ).toBeVisible();
  await page.getByText("Demo Administrator", { exact: true }).click();
  await expect(page.getByLabel("Demo account", { exact: true })).toBeVisible();
});
