import { expect, test } from "@playwright/test";

test("persists explicit themes and returns to the live system preference", async ({
  page,
}) => {
  const browserErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  const root = page.locator("html");
  const lightButton = page.getByRole("button", { name: "light" });
  const darkButton = page.getByRole("button", { name: "dark" });
  const systemButton = page.getByRole("button", { name: "system" });

  await expect(page.getByRole("group", { name: "Color theme" })).toBeVisible();
  await expect(systemButton).toHaveAttribute("aria-pressed", "true");
  await expect(root).toHaveClass(/dark/);

  await lightButton.focus();
  await page.keyboard.press("Enter");
  await expect(lightButton).toHaveAttribute("aria-pressed", "true");
  await expect(root).toHaveClass(/light/);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("theme")))
    .toBe("light");

  await page.reload();
  await expect(lightButton).toHaveAttribute("aria-pressed", "true");
  await expect(root).toHaveClass(/light/);

  await darkButton.click();
  await expect(root).toHaveClass(/dark/);
  await page.reload();
  await expect(darkButton).toHaveAttribute("aria-pressed", "true");
  await expect(root).toHaveClass(/dark/);

  await systemButton.click();
  await expect(systemButton).toHaveAttribute("aria-pressed", "true");
  await expect(root).toHaveClass(/dark/);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("theme")))
    .toBe("system");

  await page.emulateMedia({ colorScheme: "light" });
  await expect(root).toHaveClass(/light/);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(root).toHaveClass(/dark/);

  expect(browserErrors).toEqual([]);
});
