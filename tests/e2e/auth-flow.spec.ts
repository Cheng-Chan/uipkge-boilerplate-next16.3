import { expect, test } from "@playwright/test";

test("logs in, restores, switches, and logs out a local demo session", async ({
  page,
}) => {
  await page.goto("/login/?next=%2F");
  await page.getByRole("button", { name: "Use demo-manager" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByLabel("Current demo account")).toContainText(
    "Role: manager",
  );
  const stored = await page.evaluate(() =>
    sessionStorage.getItem("uipkge.demo:demo-session:v1"),
  );
  expect(stored).not.toContain("password");
  expect(stored).not.toContain("permissions");

  await page.reload();
  await expect(page.getByLabel("Current demo account")).toContainText(
    "Role: manager",
  );
  await page
    .getByLabel("Demo account", { exact: true })
    .selectOption("demo-user-viewer");
  await expect(page.getByLabel("Current demo account")).toContainText(
    "Role: viewer",
  );
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(
    page.getByRole("link", { name: "Open demo login" }),
  ).toBeVisible();
});

test("simulates sign-up without retaining the submitted password", async ({
  page,
}) => {
  await page.goto("/signup/");
  await page.getByLabel("Display name").fill("Sample Person");
  await page.getByLabel("Demo email").fill("sample@example.invalid");
  await page.getByLabel("Experimental password").fill("not-a-real-password");
  await page.getByRole("button", { name: "Simulate sign-up" }).click();

  await expect(page.getByRole("status")).toContainText(
    "No real account was created",
  );
  await expect(page.getByLabel("Experimental password")).toHaveValue("");
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
});
