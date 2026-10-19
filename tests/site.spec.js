const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const paths = [
  { label: "Minha trajetória", id: "trajetoria" },
  { label: "Ler meus escritos", id: "escritos" },
  { label: "Conhecer os projetos", id: "projetos" },
  { label: "Falar comigo", id: "contato" },
];

async function clickHome(page) {
  const homeLink = page.locator('[data-nav="home"]');
  if (await homeLink.isVisible()) {
    await homeLink.click();
  } else {
    await page.getByRole("button", { name: "voltar ao início" }).click();
  }
}

async function expectHome(page) {
  await expect(page.locator("[data-conversation]")).toContainText("Pode me chamar de Raffael");
  await expect(page.getByRole("button", { name: "Minha trajetória" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ler meus escritos" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Conhecer os projetos" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Falar comigo" })).toBeVisible();
  await expect(page.locator(".reading-panel")).toHaveCount(0);
  await expect(page.locator('[data-nav="home"]')).toHaveAttribute("aria-current", "page");
}

async function expectNoUnhandledErrors(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return () => expect(errors, `JavaScript errors: ${errors.join("; ")}`).toEqual([]);
}

test("restores navigation and reading return behavior", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Falar comigo" }).click();
  await expect(page.locator("[data-conversation]")).toContainText("WhatsApp");
  await clickHome(page);
  await expectHome(page);

  await page.getByRole("button", { name: "Minha trajetória" }).click();
  await page.getByRole("link", { name: "Voltar à conversa" }).click();
  await expectHome(page);
});

test("renders the approved public contact wording", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Falar comigo" }).click();
  await expect(page.locator("[data-conversation]")).toContainText("Você também pode falar comigo pelo Signal.");
  await expect(page.locator("[data-conversation]")).not.toContainText("teste humano");
  await expect(page.locator("[data-conversation]")).not.toContainText("configurações de privacidade");
});

test("renders the approved header subtitle and keeps photo credit out of visible content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-site-subtitle]")).toHaveText("Autonomia digital se faz em coletivo");
  await expect(page.locator("[data-site-signature]")).toHaveText("Vida, técnica e palavra.");
  await expect(page.locator("[data-photo-credit]")).toHaveCount(0);
  await expect(page.locator("[data-site-photo]")).toHaveAttribute(
    "alt",
    "Raffael Baptista sorrindo, de óculos, diante de um fundo laranja. Fotografia autoral de Raffael Baptista, editada utilizando GPT-5.1.",
  );
});

test.describe("site QA", () => {
  test("opens with greeting and four initial paths", async ({ page }) => {
    await page.goto("/");
    await expectHome(page);
  });

  for (const path of paths) {
    test(`opens and returns from ${path.label}`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: path.label }).click();
      await expect(page.locator('[data-nav="' + path.id + '"]')).toHaveAttribute("aria-current", "page");
      await expect(page.locator('[data-nav="home"]')).not.toHaveAttribute("aria-current", "page");
      await page.getByRole("button", { name: "voltar ao início" }).click();
      await expectHome(page);
    });
  }

  test("opens reading and returns through Voltar à conversa", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Minha trajetória" }).click();
    await expect(page.getByRole("heading", { name: "Minha trajetória" })).toBeVisible();
    await page.getByRole("link", { name: "Voltar à conversa" }).click();
    await expectHome(page);
    await expect(page.getByRole("button", { name: "Minha trajetória" })).toBeFocused();
  });

  test("supports repeated subject changes and repeated returns", async ({ page }) => {
    await page.goto("/");
    for (const path of paths) {
      await page.getByRole("button", { name: path.label }).click();
      await expect(page.locator('[data-nav="' + path.id + '"]')).toHaveAttribute("aria-current", "page");
    }
    await page.getByRole("button", { name: "voltar ao início" }).click();
    await expectHome(page);
    await page.getByRole("button", { name: "Falar comigo" }).click();
    await clickHome(page);
    await expectHome(page);
  });

  test("keeps route, URL fragment, and selected navigation synchronized", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Falar comigo" }).click();
    await expect(page).toHaveURL(/#contato$/);
    await expect(page.locator('[data-nav="contato"]')).toHaveAttribute("aria-current", "page");
    await expect(page.locator("[data-conversation]")).toContainText("WhatsApp");
    await page.goBack();
    await expectHome(page);
  });

  test("supports keyboard activation and preserves the theme during return", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "mudar tema" }).click();
    await page.getByRole("button", { name: "Minha trajetória" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-nav="trajetoria"]')).toHaveAttribute("aria-current", "page");
    await page.getByRole("link", { name: "Voltar à conversa" }).focus();
    await page.keyboard.press("Enter");
    await expectHome(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
    await expect(page.getByRole("button", { name: "Minha trajetória" })).toBeFocused();
  });

  test("has no horizontal scrolling and no unhandled JavaScript errors", async ({ page }) => {
    const checkErrors = await expectNoUnhandledErrors(page);
    await page.goto("/");
    for (const path of paths) {
      await page.getByRole("button", { name: path.label }).click();
      await expect(page.locator("body")).toHaveJSProperty("scrollWidth", await page.locator("body").evaluate((body) => body.clientWidth));
    }
    checkErrors();
  });

  for (const state of ["home", ...paths.map((path) => path.id)]) {
    test(`passes automated accessibility scan on ${state}`, async ({ page }) => {
      await page.goto("/");
      if (state !== "home") await page.getByRole("button", { name: paths.find((path) => path.id === state).label }).click();
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test("does not expose internal QA notes publicly and has correct contact URLs", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Falar comigo" }).click();
    await expect(page.locator("[data-conversation]")).not.toContainText("pendente");
    await expect(page.locator('a[href="https://wa.me/5521977229377"]')).toBeVisible();
    await expect(page.locator('a[href="https://signal.me/#p/+5521977229377"]')).toBeVisible();
    await expect(page.locator('a[href="https://t.me/+5521977229377"]')).toBeVisible();
    await expect(page.locator('a[href="mailto:raffael@cuidadosdigitais.com.br"]')).toBeVisible();
    await expect(page.locator('a[href="xmpp:imbariense@conversations.im?message"]')).toBeVisible();
    await expect(page.locator('a[href="https://matrix.to/#/@imbariense:matrix.org"]')).toBeVisible();
  });
});
