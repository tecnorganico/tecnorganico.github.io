const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const site = require('../content/site.json');
const { base } = require('../scripts/seo');

test.use({ javaScriptEnabled: false });

test('serves readable content and public links without JavaScript', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-conversation]')).toContainText(site.introduction);
  await expect(page.locator('[data-conversation]')).toContainText('vulnerabilidade digital');
  await page.locator('[data-choices]').getByRole('link', {name:'portfólio',exact:true}).click();
  await expect(page).toHaveURL(/\/portfolio\/$/);
  const entries = site.paths.find(s=>s.id==='projetos').timeline;
  await expect(page.locator('.timeline article')).toHaveCount(entries.length);
  for(const entry of entries) await expect(page.getByRole('heading',{name:entry.title,exact:true})).toHaveCount(1);
  const imgs=page.locator('.timeline img');
  for(const img of await imgs.all()) {
    const result=await page.request.get(await img.getAttribute('src'));
    expect(result.ok()).toBe(true);
  }
});

test('provides canonical URLs, social photo and parseable authorship on every public page', async ({ page }) => {
  const pages=['','rumos-e-habilidades/','portfolio/','contato/','posts/'];
  const titles=[];
  for(const route of pages) {
    await page.goto('/'+route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',base+route);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',base+route);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content',new URL(site.photo.src,base).href);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content',new URL(site.photo.src,base).href);
    expect((await page.locator('meta[name="description"]').getAttribute('content')).length).toBeGreaterThan(30);
    const graph=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    expect(graph.find(n=>n['@type']==='Person').name).toBe(site.identity.name);
    expect(graph.find(n=>n['@type']==='Person').knowsAbout).toContain('educação digital crítica');
    expect(graph.find(n=>n['@id']===base+route+'#pagina')).toBeTruthy();
    titles.push(await page.title());
  }
  expect(new Set(titles).size).toBe(pages.length);
});

test('sitemap and llms directory omit drafts and empty writings; error page is not indexable', async ({ request, page }) => {
  const posts=require('../scripts/build-posts').publicPosts();
  const sitemap=await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain(base+'portfolio/');
  expect(sitemap).not.toContain('#');
  expect(sitemap).not.toContain('fixture');
  expect(sitemap.includes(base+'posts/')).toBe(posts.length>0);
  const llms=await (await request.get('/llms.txt')).text();
  expect(llms).toContain('vulnerabilidade digital');
  expect(llms).toContain(base+'portfolio/');
  expect(llms).not.toContain('fixture');
  expect(await (await request.get('/robots.txt')).text()).toContain('Allow: /');
  await page.goto('/404.html');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,follow');
});

test('new articles receive their own SEO and public author without exposing draft fixtures', async () => {
  const output=path.resolve('test-results/seo-posts-fixtures');
  execFileSync(process.execPath,['scripts/build-posts.js'],{env:{...process.env,POSTS_SOURCE:path.resolve('tests/fixtures/posts'),POSTS_OUTPUT:output}});
  const html=fs.readFileSync(path.join(output,'fixture-publicada.html'),'utf8');
  expect(html).toContain('https://tecnorganico.github.io/posts/fixture-publicada.html');
  expect(html).toContain('BlogPosting');
  expect(html).toContain('property="og:type" content="article"');
  expect(fs.existsSync(path.join(output,'fixture-rascunho.html'))).toBe(false);
});

test.describe('static page accessibility', () => {
  test.use({javaScriptEnabled:true});
  test('keeps every section accessible and within the viewport', async ({page}) => {
    const AxeBuilder=require('@axe-core/playwright').default;
    for(const route of ['rumos-e-habilidades/','portfolio/','contato/']) {
      await page.goto('/'+route);
      expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
      expect(await page.locator('body').evaluate(b=>b.scrollWidth<=b.clientWidth)).toBe(true);
    }
  });
});
