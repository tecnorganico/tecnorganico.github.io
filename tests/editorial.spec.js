const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

test("hides writings without public posts and safely handles their old URL", async ({ page }) => {
  await page.route("**/posts/manifest.json", (route) => route.fulfill({ json: [] }));
  await page.goto("/#escritos");
  await expect(page.getByRole("button", { name: "rumos & habilidades", exact: true })).toBeVisible();
  await expect(page.locator('[data-nav="escritos"]')).toBeHidden();
  await expect(page.getByRole("button", { name: "escritos", exact: true })).toHaveCount(0);
});

test("restores writings automatically after the first published post", async ({ page }) => {
  await page.route("**/posts/manifest.json", (route) => route.fulfill({ json: [{ slug: "exemplo", title: "exemplo" }] }));
  await page.goto("/");
  await expect(page.getByRole("button", { name: "escritos", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "escritos", exact: true }).click();
  await expect(page.locator('[data-nav="escritos"]')).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "ler os textos" })).toHaveAttribute("href", "posts/index.html");
});

test("offers the eleven confirmed kinds of work without internal notes", async ({ page }) => {
  await page.goto("/#trajetoria");
  await expect(page.locator(".reading-panel li")).toHaveCount(11);
  await expect(page.locator(".reading-panel")).toContainText("uso de assistentes de IA na produção educacional, com revisão humana");
  await expect(page.locator("[data-conversation]")).not.toContainText("undefined");
  await expect(page.locator("[data-conversation]")).not.toContainText("revisão editorial");
});

test("presents an accessible timeline with real photographs and a video link", async ({ page }, testInfo) => {
  await page.goto("/#projetos");
  const timeline = page.locator(".timeline");
  await expect(timeline.locator(":scope > li")).toHaveCount(8);
  for (const img of await timeline.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveJSProperty("complete", true);
    expect(await img.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
    expect(await img.getAttribute("alt")).toBeTruthy();
  }
  await expect(timeline.getByRole("link", { name: "assistir à gravação no YouTube" })).toHaveAttribute("href", /YKuAiRSScMs/);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await expect(page.locator("body")).toHaveJSProperty("scrollWidth", await page.locator("body").evaluate((body) => body.clientWidth));
  await page.screenshot({ path: testInfo.outputPath("portfolio.png"), fullPage: true });
  await page.getByRole("button", { name: "voltar ao início", exact: true }).click();
  await expect(timeline).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("inicio.png"), fullPage: true });
});
