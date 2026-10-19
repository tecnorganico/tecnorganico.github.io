const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { execFileSync } = require("child_process");
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const root = path.resolve(__dirname, "..");
const generator = path.join(root, "scripts/build-posts.js");
const fixtureSource = path.join(__dirname, "fixtures/posts");
const fixtureOutput = path.join(root, "test-results/posts-fixture-output");

test("excludes draft posts from generated pages, listing, and search", async () => {
  fs.rmSync(fixtureOutput, { recursive: true, force: true });
  execFileSync(process.execPath, [generator], {
    env: { ...process.env, POSTS_SOURCE: fixtureSource, POSTS_OUTPUT: fixtureOutput },
    stdio: "pipe",
  });
  const output = fs.readdirSync(fixtureOutput);
  expect(output).toContain("fixture-publicada.html");
  expect(output).toContain("index.html");
  expect(output).not.toContain("fixture-rascunho.html");
  const listing = fs.readFileSync(path.join(fixtureOutput, "index.html"), "utf8");
  expect(listing).toContain("Fixture publicada");
  expect(listing).not.toContain("Fixture em rascunho");
});

test("renders a published individual page with a direct return link", async ({ page }) => {
  fs.rmSync(fixtureOutput, { recursive: true, force: true });
  execFileSync(process.execPath, [generator], {
    env: { ...process.env, POSTS_SOURCE: fixtureSource, POSTS_OUTPUT: fixtureOutput },
    stdio: "pipe",
  });
  await page.goto(pathToFileURL(path.join(fixtureOutput, "fixture-publicada.html")).href);
  await expect(page.getByRole("heading", { name: "Fixture publicada" })).toBeVisible();
  await expect(page.locator(".post-body")).toContainText("Este texto existe apenas durante o teste");
  await expect(page.getByRole("link", { name: "Voltar ao início" })).toHaveAttribute("href", "../#escritos");
});

test("provides a public writings listing and return link", async ({ page }) => {
  await page.goto("/posts/");
  await expect(page.getByRole("heading", { name: "Publicações" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Voltar ao início" })).toHaveAttribute("href", "../#escritos");
  await expect(page.getByRole("searchbox", { name: "Buscar publicações" })).toBeVisible();
  await expect(page.locator("[data-post]")).toHaveCount(0);
  await expect(page.locator("[data-empty-posts]")).toContainText("Ainda não há publicações próprias publicadas.");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
