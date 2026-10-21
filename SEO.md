# busca, prévias de links e acesso por assistentes

O site publica título, descrição, URL canônica, Open Graph, Twitter Card e dados estruturados em HTML, sem depender de JavaScript. A fotografia pública do perfil é usada nas prévias. Título, descrição e temas são editáveis em `content/site.json` e no Pages CMS.

As seções têm versões HTML completas em `/rumos-e-habilidades/`, `/portfolio/` e `/contato/`. A navegação em conversa e suas rotas antigas continuam funcionando. O mesmo conteúdo editorial alimenta as duas apresentações. Páginas estáticas são geradas no build, não devem ser editadas manualmente.

O build gera `sitemap.xml`, `robots.txt` e `llms.txt`. O sitemap contém somente páginas indexáveis e artigos publicados. A listagem vazia de artigos recebe `noindex` e não é anunciada no sitemap; a primeira publicação válida torna a coleção indexável. Rascunhos e fixtures não entram nesses arquivos nem no pacote público. A página 404 recebe `noindex`.

Os artigos futuros recebem título, resumo, URL própria, autoria e marcação BlogPosting automaticamente. Não são inventadas datas de atualização, credenciais ou artigos.

`robots.txt` permite o rastreamento público, inclusive por buscadores e agentes de busca de IA. Não foi introduzida uma política específica de treinamento de modelos. Busca e treinamento são finalidades distintas; nenhuma regra de robôs deve ser tratada como proteção de confidencialidade. A proteção principal continua sendo não publicar dados restritos.

`llms.txt` é um índice textual complementar, sem garantia de adoção pelos assistentes. Não substitui HTML legível, conteúdo confiável, sitemap ou indexação e não contém comandos para influenciar respostas. Não existe garantia de posição nas buscas, referência, citação ou inclusão em respostas de IA.

## verificações e acompanhamento

Execute `npm run build:artifact` e a suíte Playwright contra o pacote `_site`. Os testes verificam metadados em cada página, leitura sem JavaScript, autoria JSON-LD, artigos futuros com fixtures, exclusão de rascunhos, fotos, sitemap e navegação.

Após o deploy, confira o HTML servido e as URLs da imagem. Plataformas de compartilhamento mantêm caches próprios, portanto uma prévia antiga pode persistir por algum tempo. Não foi afirmado que houve atualização do cache de WhatsApp, Facebook, LinkedIn ou outros serviços.

O acompanhamento de indexação depende de acesso do titular ao Google Search Console e, se desejado, Bing Webmaster Tools. Enviar `https://tecnorganico.github.io/sitemap.xml` nesses painéis ajuda a informar as URLs; não garante indexação. Nenhuma conta ou propriedade foi criada nesta etapa.

## documentação consultada

- Google: https://developers.google.com/search/docs/appearance/ai-features
- OpenAI: https://developers.openai.com/api/docs/bots
- Anthropic: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Open Graph: https://ogp.me/
