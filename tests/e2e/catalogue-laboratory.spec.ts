import { expect, test } from "@playwright/test";

test("opens the verified gallery from home and reveals previews on demand", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  const requests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/");
  await page.getByRole("link", { name: /View 39 live components/ }).click();
  await expect(page).toHaveURL(/\/login\/?\?next=%2Fui-kit%2Fgallery/);
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "39 verified components, ready to try",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Component groups" }),
  ).toContainText("Data Display (22)");

  await page.getByRole("button", { name: "Load Kbd preview" }).click();
  const keyboardPreview = page
    .getByRole("heading", { name: "Keyboard shortcuts" })
    .locator("..");
  await expect(keyboardPreview).toBeVisible();
  await keyboardPreview.focus();
  await page.keyboard.press("K");
  await expect(
    page.getByText("Last key pressed in this panel: K"),
  ).toBeVisible();

  await page.goto("/ui-kit/?status=verified&q=kbd");
  await expect(page.getByText("1 matching items")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Open live preview/ }),
  ).toHaveAttribute("href", "/ui-kit/kbd/");

  expect(
    requests.every((url) => url.startsWith("http://127.0.0.1:4173/")),
  ).toBe(true);
  expect(browserErrors).toEqual([]);
});

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

test("renders the CAT002 chart bundle without external provider requests", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  const requests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/login/?next=%2Fui-kit%2Fcharts");
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();

  await expect(page.getByRole("heading", { name: "Charts" })).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Pipeline and closed revenue for 7 days" }),
  ).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(3);

  await page.getByRole("button", { name: "30 days" }).click();
  await page.getByRole("button", { name: "Stack series" }).click();
  await expect(page.getByText("30 days · stacked series")).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Pipeline and closed revenue for 30 days" }),
  ).toBeVisible();
  await expect(page.getByText("External map boundary")).toBeVisible();

  expect(
    requests.every((url) => url.startsWith("http://127.0.0.1:4173/")),
  ).toBe(true);
  expect(browserErrors).toEqual([]);
});

test("exercises every CAT003 control preview without external requests", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  const requests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/login/?next=%2Fui-kit%2Fbutton");
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();

  await expect(page.getByRole("heading", { name: "Button" })).toBeVisible();
  await page
    .getByRole("heading", { name: "Variants" })
    .locator("..")
    .getByRole("button", { name: "Default", exact: true })
    .click();
  await expect(page.getByText("Default button activated")).toBeVisible();

  await page.goto("/ui-kit/cascade-select/");
  const cascade = page.getByRole("combobox", { name: "Office location" });
  await cascade.click();
  const chooser = page.getByRole("dialog", { name: "Choose an option" });
  await chooser
    .getByRole("textbox", { name: "Search options" })
    .fill("Bangkok");
  await chooser
    .getByRole("button", { name: "Asia / Thailand / Bangkok" })
    .click();
  await expect(
    page.getByText("Selection: asia / thailand / bangkok"),
  ).toBeVisible();

  await page.goto("/ui-kit/fab/");
  await page.getByRole("button", { name: "Create item" }).click();
  await expect(page.getByText("Local create actions: 1")).toBeVisible();

  await page.goto("/ui-kit/float-label/");
  await page.getByLabel("Project name").fill("Atlas");
  await expect(page.getByText("Project: Atlas")).toBeVisible();

  await page.goto("/ui-kit/input/");
  const query = page.getByRole("textbox", { name: "Search query" });
  await query.click();
  await page.getByRole("button", { name: "Clear input" }).click();
  await expect(page.getByText("Query: empty")).toBeVisible();
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(
    page.getByRole("button", { name: "Hide password" }),
  ).toHaveAttribute("aria-pressed", "true");

  expect(
    requests.every((url) => url.startsWith("http://127.0.0.1:4173/")),
  ).toBe(true);
  expect(browserErrors).toEqual([]);
});

test("exercises every CAT004 advanced-control preview locally", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  const requests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/login/?next=%2Fui-kit%2Fpassword-input");
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();

  await expect(
    page.getByRole("heading", { name: "Password Input" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show password" }).first().click();
  await expect(
    page.getByRole("button", { name: "Hide password" }).first(),
  ).toBeVisible();
  await page.getByLabel("Demonstration passphrase").fill("Stronger-Demo-2026!");
  await expect(
    page.getByRole("status", { name: "Password strength: strong" }),
  ).toBeVisible();

  await page.goto("/ui-kit/select/");
  await page.getByRole("combobox", { name: "Framework" }).click();
  await page.getByRole("option", { name: "Vue" }).click();
  await expect(page.getByText("Framework: vue")).toBeVisible();
  await page
    .getByRole("combobox", { name: "Interface density" })
    .selectOption("spacious");
  await expect(page.getByText("Density: spacious")).toBeVisible();

  await page.goto("/ui-kit/signature-pad/");
  const canvas = page.getByRole("img", { name: "Signature pad", exact: true });
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    await page.mouse.move(box.x + 20, box.y + 20);
    await page.mouse.down();
    await page.mouse.move(box.x + 100, box.y + 70, { steps: 5 });
    await page.mouse.up();
  }
  await expect(page.getByText("Signature: captured locally")).toBeVisible();
  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.getByText("Signature: empty")).toBeVisible();

  await page.goto("/ui-kit/speed-dial/");
  await page.getByRole("button", { name: "Share actions" }).click();
  const actionMenu = page.getByRole("menu", { name: "Share actions" });
  await actionMenu.getByRole("menuitem", { name: "Copy draft" }).click();
  await expect(page.getByText("Draft copied locally")).toBeVisible();

  await page.goto("/ui-kit/tree-select/");
  const team = page.getByRole("combobox", { name: "Primary team" });
  await team.click();
  const treeDialog = page.getByRole("dialog", { name: "Primary team options" });
  await treeDialog
    .getByRole("textbox", { name: "Search tree" })
    .fill("Frontend");
  await treeDialog.getByText("Frontend", { exact: true }).click();
  await expect(page.getByText("Team: frontend")).toBeVisible();
  await team.focus();
  await page.keyboard.press("Delete");
  await expect(page.getByText("Team: none")).toBeVisible();

  expect(
    requests.every((url) => url.startsWith("http://127.0.0.1:4173/")),
  ).toBe(true);
  expect(browserErrors).toEqual([]);
});

test("exercises every CAT005 data preview without external requests", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  const requests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/login/?next=%2Fui-kit%2Fboard");
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();

  await expect(page.getByRole("heading", { name: "Board" })).toBeVisible();
  const boardCard = page.getByRole("button", { name: "Confirm project brief" });
  await boardCard.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByText("1 item moved to In progress")).toBeVisible();

  await page.goto("/ui-kit/data-table/");
  const projects = page.getByRole("region", { name: "Projects" });
  const search = projects.getByRole("textbox", { name: "Search projects" });
  await search.fill("Juniper");
  await expect(projects.getByText("Juniper", { exact: true })).toBeVisible();
  await expect(projects.getByText("Atlas", { exact: true })).toHaveCount(0);
  await search.fill("");
  await projects.getByRole("button", { name: "Sort by Project" }).click();
  await projects.getByText("Atlas", { exact: true }).click();
  await expect(page.getByText("Selected project: Atlas")).toBeVisible();

  await page.goto("/ui-kit/tree-table/");
  const hierarchy = page.getByRole("treegrid", { name: "Workspace hierarchy" });
  await hierarchy.getByRole("checkbox", { name: "Select Tokens" }).click();
  await expect(page.getByText("Selected rows: tokens")).toBeVisible();
  await hierarchy.getByRole("button", { name: "Collapse" }).first().click();
  await expect(hierarchy.getByText("Tokens", { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("status", { name: "Loading rows" }),
  ).toBeVisible();

  expect(
    requests.every((url) => url.startsWith("http://127.0.0.1:4173/")),
  ).toBe(true);
  expect(browserErrors).toEqual([]);
});

test("exercises every CAT006 display preview without external requests", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  const requests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/login/?next=%2Fui-kit%2Fattachment");
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();
  await page.getByRole("button", { name: "Remove product-brief.pdf" }).click();
  await expect(page.getByText("1 removable attachments remain.")).toBeVisible();

  await page.goto("/ui-kit/avatar/");
  await expect(page.getByText("+5")).toBeVisible();
  await page.goto("/ui-kit/badge/");
  await expect(page.getByText("Badge variants")).toBeVisible();
  await page.goto("/ui-kit/carousel/");
  await page.getByRole("button", { name: "Next slide" }).click();
  await expect(page.getByText("Slide 2 of 3")).toBeVisible();
  await page.goto("/ui-kit/chip/");
  await page.getByRole("checkbox", { name: "Responsive" }).click();
  await expect(
    page.getByText("Selected: Accessible, Responsive"),
  ).toBeVisible();

  expect(
    requests.every((url) => url.startsWith("http://127.0.0.1:4173/")),
  ).toBe(true);
  expect(browserErrors).toEqual([]);
});

test("exercises every CAT007 rich display preview without external requests", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  const requests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/login/?next=%2Fui-kit%2Fcode-block");
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();
  await page.getByRole("button", { name: "Hide code" }).click();
  await expect(page.getByRole("button", { name: "Show code" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );

  await page.goto("/ui-kit/data-list/");
  await page.getByRole("button", { name: "Toggle status" }).click();
  await expect(page.getByText("Paused")).toBeVisible();
  await page.goto("/ui-kit/gantt/");
  await page.getByRole("button", { name: "Week" }).click();
  await page.getByText("Research", { exact: true }).first().click();
  await expect(
    page.getByText("Research", { exact: true }).last(),
  ).toBeVisible();
  await page.goto("/ui-kit/icon-box/");
  await expect(page.getByLabel("Verified")).toBeVisible();
  await page.goto("/ui-kit/icons/");
  await page.getByRole("button", { name: "Rotate direction" }).click();
  await expect(page.getByText("Rotation: 90 degrees")).toBeVisible();

  expect(
    requests.every((url) => url.startsWith("http://127.0.0.1:4173/")),
  ).toBe(true);
  expect(browserErrors).toEqual([]);
});

test("exercises every CAT008 collection preview without external requests", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  const requests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/login/?next=%2Fui-kit%2Fkanban");
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();
  const card = page
    .getByText("Audit manifest")
    .locator('xpath=ancestor::*[@data-slot="kanban-card"]');
  await card.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByText("audit moved to doing")).toBeVisible();

  await page.goto("/ui-kit/kbd/");
  const keyboardPanel = page
    .getByRole("heading", { name: "Keyboard shortcuts" })
    .locator("..");
  await keyboardPanel.focus();
  await page.keyboard.press("K");
  await expect(
    page.getByText(/Last key pressed in this panel: K/),
  ).toBeVisible();
  await page.goto("/ui-kit/labeled-value/");
  await page.getByRole("button", { name: "Toggle status" }).click();
  await expect(page.getByText("Review")).toBeVisible();
  await page.goto("/ui-kit/lazy-image/");
  await page.getByRole("button", { name: "Show fallback" }).click();
  await expect(
    page.getByRole("img", { name: "Image failed to load" }),
  ).toBeVisible();
  await page.goto("/ui-kit/list/");
  await page.getByText("Data display", { exact: true }).click();
  await expect(page.getByText("Selected: data")).toBeVisible();

  expect(
    requests.every((url) => url.startsWith("http://127.0.0.1:4173/")),
  ).toBe(true);
  expect(browserErrors).toEqual([]);
});

test("exercises every CAT009 structured-data preview without external requests", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  const requests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/login/?next=%2Fui-kit%2Fpayment-card");
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();
  await page.getByRole("button", { name: "Show back" }).click();
  await expect(page.getByRole("button", { name: "Show front" })).toBeVisible();

  await page.goto("/ui-kit/qr-code/");
  await page.getByRole("button", { name: "expired" }).click();
  await page.getByRole("button", { name: "Refresh" }).click();
  await expect(page.getByRole("button", { name: "active" })).toBeVisible();
  await page.goto("/ui-kit/table/");
  await page.getByRole("button", { name: /Files/ }).click();
  await expect(page.getByRole("row").nth(1)).toContainText("Data Table");
  await page.goto("/ui-kit/timeline/");
  await page.getByRole("button", { name: "Toggle density" }).click();
  await expect(page.getByText("Manifest audited")).toBeVisible();
  await page.goto("/ui-kit/transfer/");
  await page.getByRole("textbox").first().fill("Audit");
  await expect(page.getByText("Audit manifests")).toBeVisible();
  await expect(page.getByText("Selected keys: tests")).toBeVisible();

  expect(
    requests.every((url) => url.startsWith("http://127.0.0.1:4173/")),
  ).toBe(true);
  expect(browserErrors).toEqual([]);
});

test("exercises every CAT010 scalable-data preview without external requests", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  const requests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/login/?next=%2Fui-kit%2Ftree-view");
  await page.getByRole("button", { name: "Use demo-viewer" }).click();
  await page.getByRole("button", { name: "Enter demo" }).click();
  await page.getByText("README.md").click();
  await expect(page.getByText("Selected: readme")).toBeVisible();

  await page.goto("/ui-kit/virtual-list/");
  await page.getByRole("button", { name: "Last" }).click();
  await expect(page.getByText("Catalogue row 1000")).toBeVisible();

  expect(
    requests.every((url) => url.startsWith("http://127.0.0.1:4173/")),
  ).toBe(true);
  expect(browserErrors).toEqual([]);
});
