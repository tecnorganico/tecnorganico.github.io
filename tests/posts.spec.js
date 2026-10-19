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

test("removes a post page after it becomes a draft or is deleted", async () => {
  const transitionSource = path.join(__dirname, "..", "test-results", "post-transition-source");
  const transitionOutput = path.join(__dirname, "..", "test-results", "post-transition-output");
  fs.rmSync(transitionSource, { recursive: true, force: true });
  fs.rmSync(transitionOutput, { recursive: true, force: true });
  fs.mkdirSync(transitionSource, { recursive: true });

  const published = `---
title: Publicação transitória
slug: publicacao-transitoria
date: 2026-10-18
summary: Conteúdo temporário.
draft: false
---
Texto temporário.
`;
  const sourcePath = path.join(transitionSource, "publicacao-transitoria.md");
  fs.writeFileSync(sourcePath, published);

  const build = () => execFileSync(process.execPath, [generator], {
    env: { ...process.env, POSTS_SOURCE: transitionSource, POSTS_OUTPUT: transitionOutput },
    stdio: "pipe",
  });

  build();
  expect(fs.existsSync(path.join(transitionOutput, "publicacao-transitoria.html"))).toBe(true);

  fs.writeFileSync(sourcePath, published.replace("draft: false", "draft: true"));
  build();
  expect(fs.existsSync(path.join(transitionOutput, "publicacao-transitoria.html"))).toBe(false);

  fs.rmSync(sourcePath);
  build();
  expect(fs.existsSync(path.join(transitionOutput, "publicacao-transitoria.html"))).toBe(false);
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
  const posts = require("../scripts/build-posts").publicPosts();
  await expect(page.locator("[data-post]")).toHaveCount(posts.length);
  if (posts.length === 0) {
    await expect(page.locator("[data-empty-posts]")).toContainText("Ainda não há publicações próprias publicadas.");
  } else {
    for (const post of posts) {
      await expect(page.locator("[data-post]")).toContainText([post.title]);
    }
  }
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
