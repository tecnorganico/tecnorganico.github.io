const fs = require('fs');
const path = require('path');
const base = 'https://tecnorganico.github.io/';
const routes = { trajetoria: 'rumos-e-habilidades/', projetos: 'portfolio/', contato: 'contato/', escritos: 'posts/' };
const readSite = () => JSON.parse(fs.readFileSync(path.join(__dirname, '../content/site.json'), 'utf8'));
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const absolute = value => new URL(value, base).href;
function json(value) { return JSON.stringify(value).replace(/</g, '\\u003c'); }
function metadata({title, description, url = '', type = 'website', schemaType = 'WebPage', article, noindex = false} = {}) {
  const site = readSite();
  title ||= site.seo.title;
  description ||= site.seo.description;
  const canonical = absolute(url);
  const image = absolute(site.photo.src);
  const person = { '@type':'Person', '@id':`${base}#raffael`, name:site.identity.name, url:base, image, jobTitle:'educador', description:site.introduction, knowsAbout:site.seo.topics, sameAs:['https://bantu.social/@tecnorganico','https://blog.bantu.social/tecnorganico/','https://pixelfed.social/esquecidinho'] };
  const webpage = { '@type':schemaType, '@id':canonical+'#pagina', url:canonical, name:title, description, inLanguage:'pt-BR', isPartOf:{'@id':base+'#site'}, about:{'@id':person['@id']} };
  if (schemaType === 'ProfilePage') webpage.mainEntity = {'@id':person['@id']};
  const graph = [person, {'@type':'WebSite','@id':base+'#site',url:base,name:site.identity.name,inLanguage:'pt-BR',publisher:{'@id':person['@id']}}, webpage];
  if (article) graph.push({'@type':'BlogPosting','@id':canonical+'#artigo',headline:article.title,description:article.summary,datePublished:article.date,author:{'@id':person['@id']},mainEntityOfPage:{'@id':webpage['@id']},inLanguage:'pt-BR',image:article.image ? absolute(article.image) : image});
  return `<meta name="description" content="${escape(description)}">
    <meta name="author" content="${escape(site.identity.name)}">
    <meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="${type}">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:site_name" content="${escape(site.identity.name)}">
    <meta property="og:title" content="${escape(title)}">
    <meta property="og:description" content="${escape(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:secure_url" content="${image}">
    <meta property="og:image:alt" content="${escape(site.photo.alt)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escape(title)}">
    <meta name="twitter:description" content="${escape(description)}">
    <meta name="twitter:image" content="${image}">
    <meta name="twitter:image:alt" content="${escape(site.photo.alt)}">
    ${article ? `<meta property="article:published_time" content="${escape(article.date)}"><meta property="article:author" content="${base}">` : ''}
    <script type="application/ld+json">${json({'@context':'https://schema.org','@graph':graph})}</script>
    <title>${escape(title)}</title>`.replace(/[ \t]+$/gm, "");
}
module.exports = { base, routes, readSite, escape, absolute, metadata };
