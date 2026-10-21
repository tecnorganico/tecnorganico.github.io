const fs = require('fs');
const path = require('path');
const { base, routes, readSite, escape: e, absolute, metadata } = require('./seo');
const { publicPosts } = require('./build-posts');
const root = path.resolve(__dirname, '..');
function buildSEO() {
  const site = readSite();
  const posts = publicPosts();
  const sections = site.paths.filter(section => !section.requiresPublications || posts.length);
  const nav = `<nav aria-label="navegação do site"><a href="/">início</a>${sections.map(s => `<a href="/${routes[s.id]}">${e(s.label)}</a>`).join('')}</nav>`;
  const link = l => `<a href="${e(l.url)}">${e(l.label || l.title || 'abrir conteúdo')}</a>`;
  const photo = p => `<img src="${e(p.src)}" alt="${e(p.alt)}" loading="lazy" decoding="async">`;
  function timeline(entries) {
    return `<ol class="timeline">${entries.map(x => `<li><article>${x.date ? `<time datetime="${e(x.date)}">${e(x.period || x.date)}</time>` : ''}<h2>${e(x.title)}</h2><p>${e(x.description)}</p>${x.images?.length || x.image ? `<figure><div${x.images?.length ? ' class="timeline-collage"' : ''}>${(x.images?.length ? x.images : [{src:x.image,alt:x.image_alt}]).map(photo).join('')}</div>${x.caption ? `<figcaption>${e(x.caption)}</figcaption>` : ''}</figure>` : ''}${x.links?.length ? `<div class="timeline-links">${x.links.map(link).join('')}</div>` : ''}</article></li>`).join('')}</ol>`;
  }
  function sectionBody(s) {
    const r = s.reading;
    return `<p>${e(s.response)}</p>${r ? `<section><h2>${e(r.title)}</h2>${r.text ? `<p>${e(r.text)}</p>` : ''}${r.points?.length ? `<ul>${r.points.map(p=>`<li>${e(p)}</li>`).join('')}</ul>` : ''}</section>` : ''}${s.id==='trajetoria' ? `<section><h2>temas de trabalho e escrita</h2><p>${e(site.seo.topics.join(', '))}.</p></section>` : ''}${s.timeline?.length ? timeline(s.timeline) : ''}${(s.links || []).map(x=>`<section><h2>${e(x.title)}</h2>${x.summary ? `<p>${e(x.summary)}</p>` : ''}${x.address ? `<p>${e(x.address)}</p>` : ''}${link(x)}</section>`).join('')}`;
  }
  function page(title, url, body, description, noindex=false) {
    return `<!doctype html>\n<html lang="pt-BR" data-theme="classic"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${metadata({title,description,url,noindex,schemaType:url==='portfolio/'?'CollectionPage':'WebPage'})}<link rel="stylesheet" href="../style.css"><link rel="icon" type="image/jpeg" href="${e(site.photo.src)}"></head><body><main class="post-main seo-page">${nav}<h1>${e(title)}</h1>${body}<p><a href="/">voltar ao início</a></p></main></body></html>\n`;
  }
  const urls = [''];
  for (const s of sections.filter(s => s.id !== 'escritos')) {
    const url=routes[s.id];
    const titles={trajetoria:'rumos & habilidades — Raffael Baptista | educação digital',projetos:'portfólio de Raffael Baptista — educação e tecnologia',contato:'contato — Raffael Baptista'};
    const descriptions={trajetoria:'Formação em educação digital e popular, inclusão digital, design instrucional e autonomia digital com Raffael Baptista, na Baixada Fluminense.',projetos:'Portfólio de Raffael Baptista: oficinas, projetos, palestras e publicações sobre educação digital, racismo algorítmico e território.',contato:'Entre em contato com Raffael Baptista para colaborações em educação digital, formação, tecnologia e autonomia digital.'};
    fs.mkdirSync(path.join(root,url),{recursive:true});
    fs.writeFileSync(path.join(root,url,'index.html'),page(titles[s.id],url,sectionBody(s),descriptions[s.id]));
    urls.push(url);
  }
  if(posts.length) urls.push('posts/',...posts.map(p=>'posts/'+p.slug+'.html'));
  let home=fs.readFileSync(path.join(root,'index.html'),'utf8');
  home=home.replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/,`<!-- SEO:START -->\n    ${metadata({schemaType:'ProfilePage'})}\n    <!-- SEO:END -->`);
  home=home.replace(/<div class="conversation-inner" data-conversation>[\s\S]*?<\/div>/,`<div class="conversation-inner" data-conversation><article class="message message-received"><p>${e(site.greeting)}</p></article><article class="message message-received"><p>${e(site.introduction)}</p></article><article class="message message-received"><h2 class="message-title">temas de trabalho e escrita</h2><p>${e(site.seo.topics.join(", "))}.</p></article></div>`);
  home=home.replace(/<div class="choice-grid" data-choices>[\s\S]*?<\/div>/,`<div class="choice-grid" data-choices>${sections.map(s=>`<a class="choice-button" href="${routes[s.id]}">${e(s.label)}</a>`).join('')}</div>`);
  home=home.replace(/<noscript>[\s\S]*?<\/noscript>/,`<noscript><p class="noscript">você pode navegar pelas seções usando os links desta página.</p></noscript>`);
  home=home.replace(/href="[^"]*" data-nav="(trajetoria|projetos|contato)"/g,(_,id)=>`href="${routes[id]}" data-nav="${id}"`);
  fs.writeFileSync(path.join(root,'index.html'),home);
  fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${e(absolute(u))}</loc></url>`).join('')}</urlset>\n`);
  fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n`);
  const references=site.paths.flatMap(s=>(s.timeline||[]).flatMap(t=>(t.links||[]).filter(l=>/^https:\/\//.test(l.url)).map(l=>`- [${t.title}: ${l.label}](${l.url})`)));
  fs.writeFileSync(path.join(root,'llms.txt'),`# ${site.identity.name}\n\n> ${site.seo.description}\n\n${site.introduction}\n\n## Páginas\n${sections.map(s=>`- [${s.label}](${absolute(routes[s.id])})`).join('\n')}\n\n## Temas públicos\n${site.seo.topics.join(', ')}.\n\n## Publicações e fontes externas\n${references.join('\n')}\n`);
  fs.writeFileSync(path.join(root,'404.html'),page('página não encontrada','404.html','<p>este endereço não foi encontrado. volte ao início para continuar.</p>','Página não encontrada no site de Raffael Baptista.',true).replace('href="../style.css"','href="/style.css"'));
  console.log(`Generated SEO metadata, ${urls.length} sitemap URLs and static sections.`);
}
if(require.main===module)buildSEO();
module.exports={buildSEO};
