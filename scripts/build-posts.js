const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceDir = path.resolve(process.env.POSTS_SOURCE || path.join(root, "content/posts"));
const outputDir = path.resolve(process.env.POSTS_OUTPUT || path.join(root, "posts"));

function parseValue(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed.slice(1, -1).split(",").map((item) => item.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
  }
  return trimmed.replace(/^['"]|['"]$/g, "");
}

function parsePost(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`Frontmatter ausente: ${filePath}`);
  const data = {};
  let listKey = null;
  for (const line of match[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && listKey) {
      if (!Array.isArray(data[listKey])) data[listKey] = [];
      data[listKey].push(parseValue(listItem[1]));
      continue;
    }
    const separator = line.indexOf(":");
    if (separator < 1) throw new Error(`Campo inválido em ${filePath}: ${line}`);
    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1);
    if (!rawValue.trim()) {
      listKey = key;
      data[key] = [];
    } else {
      listKey = null;
      data[key] = parseValue(rawValue);
    }
  }
  return { ...data, body: match[2].trim(), source: filePath };
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

function renderMarkdown(markdown) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => {
      const text = escapeHtml(block.trim());
      if (text.startsWith("### ")) return `<h3>${text.slice(4)}</h3>`;
      if (text.startsWith("## ")) return `<h2>${text.slice(3)}</h2>`;
      if (text.startsWith("# ")) return `<h2>${text.slice(2)}</h2>`;
      return `<p>${text.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");
}

function publicPosts() {
  if (!fs.existsSync(sourceDir)) return [];
  return fs.readdirSync(sourceDir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => parsePost(path.join(sourceDir, file)))
    .filter((post) => post.draft !== true)
    .sort((left, right) => String(right.date).localeCompare(String(left.date)));
}

function pageShell(title, content, depth = 0) {
  const prefix = "../".repeat(depth);
  return `<!doctype html>
<html lang="pt-BR" data-theme="classic">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(title)} — Raffael Baptista">
    <link rel="stylesheet" href="${prefix}style.css">
    <link rel="icon" type="image/jpeg" href="${prefix}assets/media/raffael-baptista.jpeg">
    <title>${escapeHtml(title)} — Raffael Baptista</title>
  </head>
  <body>
    <main class="post-main">
      ${content}
    </main>
  </body>
</html>`;
}

function renderIndex(posts) {
  const entries = posts.map((post) => `<article class="post-card" data-post data-search="${escapeHtml(`${post.title} ${post.summary} ${(post.categories || []).join(" ")}`.toLowerCase())}">
  <h2><a href="${escapeHtml(`${post.slug}.html`)}">${escapeHtml(post.title)}</a></h2>
  <p>${escapeHtml(post.summary)}</p>
  <p class="post-meta">${escapeHtml(post.date)}${post.categories?.length ? ` · ${escapeHtml(post.categories.join(", "))}` : ""}</p>
</article>`).join("\n");
  const empty = `<p data-empty-posts>${posts.length ? "nenhum texto encontrado para esta busca." : "os textos estão sendo cultivados. enquanto isso, conheça meus rumos e meu portfólio."}</p>`;
  return pageShell("Publicações", `<a class="post-back" href="../#escritos">voltar ao início</a>
<h1>Publicações</h1>
<label class="post-search"${posts.length ? "" : " hidden"}>buscar publicações
  <input type="search" data-post-search placeholder="título, resumo ou categoria">
</label>
<section data-post-list>${entries}${empty}</section>
<script>
const input = document.querySelector("[data-post-search]");
const cards = [...document.querySelectorAll("[data-post]")];
const empty = document.querySelector("[data-empty-posts]");
input.addEventListener("input", () => {
  const query = input.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const match = card.dataset.search.includes(query);
    card.hidden = !match;
    if (match) visible += 1;
  });
  if (empty) empty.hidden = visible > 0;
});
</script>`, 1);
}

function renderPost(post) {
  const image = post.image ? `<img class="post-image" src="../${escapeHtml(post.image.replace(/^\/+/, ""))}" alt="${escapeHtml(post.image_alt || "")}">` : "";
  return pageShell(post.title, `<a class="post-back" href="index.html">voltar às publicações</a>
<article class="post-article">
  <p class="post-meta">${escapeHtml(post.date)}${post.categories?.length ? ` · ${escapeHtml(post.categories.join(", "))}` : ""}</p>
  <h1>${escapeHtml(post.title)}</h1>
  <p class="post-summary">${escapeHtml(post.summary)}</p>
  ${image}
  <div class="post-body">${renderMarkdown(post.body)}</div>
</article>
<p><a class="post-back" href="../#escritos">voltar ao início</a></p>`, 1);
}

function build() {
  const posts = publicPosts();
  fs.mkdirSync(outputDir, { recursive: true });
  for (const file of fs.readdirSync(outputDir)) {
    if (file.endsWith(".html")) fs.rmSync(path.join(outputDir, file));
  }
  fs.writeFileSync(path.join(outputDir, "index.html"), renderIndex(posts));
  fs.writeFileSync(path.join(outputDir, "manifest.json"), JSON.stringify(posts.map(({ slug, title }) => ({ slug, title }))));
  for (const post of posts) fs.writeFileSync(path.join(outputDir, `${post.slug}.html`), renderPost(post));
  console.log(`Generated ${posts.length} published post(s) in ${outputDir}`);
}

if (require.main === module) build();
module.exports = { build, parsePost, publicPosts, renderMarkdown };
