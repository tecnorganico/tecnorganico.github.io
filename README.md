# Tecnorgânico — site pessoal

## Estrutura encontrada

Este repositório era um site estático artesanal, publicado diretamente pelo GitHub Pages na branch `master`. A estrutura encontrada antes da implementação era:

- `index.html`: página principal, com HTML e CSS embutido;
- `style.css`: estilos de uma versão anterior;
- `anotado/`: páginas arquivadas (`arquivo.html`, `avidaoriginal.html`, `eu.html`, `trabalhos.html` e `uses.html`);
- `bagulhos/`: arquivos históricos, imagens, favicon, JavaScript, CSS e PDFs.

Não havia `package.json`, framework, bundler, workflow de publicação ou gerenciador de conteúdo.

## Decisões tomadas

- Mantive o projeto como site estático para preservar a publicação pelo GitHub Pages sem introduzir uma etapa de build desnecessária.
- Reescrevi a entrada principal como uma conversa responsiva e acessível, com navegação lateral no desktop e coluna única no celular.
- Separei a lógica em `script.js`, os estilos em `style.css` e o conteúdo editável em `content/site.json`.
- Mantive os arquivos históricos em `anotado/` e `bagulhos/`; eles não são apagados nem republicados automaticamente.
- Adicionei `.pages.yml` na raiz para permitir edição futura pelo Pages CMS.
- Não copiei integralmente os textos do WriteFreely. Os links e metadados inventariados estão em `MIGRACAO_DE_CONTEUDO.md`, aguardando revisão humana.
- A implementação foi enviada somente à branch isolada `cms-test` para teste do Pages CMS; `master` não foi alterada e o site não foi publicado por essa operação.

## Executar localmente

Como o conteúdo é carregado por `fetch`, sirva a pasta com um servidor HTTP simples:

```bash
python3 -m http.server 8000
```

Abra `http://127.0.0.1:8000/`.

## Editar conteúdo e tema

- Edite `content/site.json` para alterar saudação, identidade, biografia, fotografia, caminhos, respostas e links.
- A fotografia otimizada está em `assets/media/raffael-baptista.jpeg`; o original permanece fora do projeto, sem alteração e sem licença aberta atribuída.
- Edite as variáveis no início de `style.css` para trocar cores, bordas e temas.
- `script.js` contém somente a lógica de renderização e interação.
- Execute a rotina completa de QA com `npm run qa`; ela abre o relatório HTML em `playwright-report/` e mantém resultados, capturas e traces regeneráveis fora do Git.
- O `.pages.yml` descreve os campos editoriais de `content/site.json` para o Pages CMS; a edição pelo CMS gera commits no repositório e não publica nada sozinha fora do fluxo configurado pelo GitHub Pages. A edição de `content/site.json` foi validada na branch isolada `cms-test`; upload de imagens, criação de artigos e automação de build/publicação ainda não foram testados.
- A sincronização posterior confirmou `cms-test` local no mesmo commit remoto, sem alterações locais pendentes; `master` continua isolada.
- A criação de uma publicação fictícia e a associação de uma imagem foram confirmadas pelo Pages CMS em `cms-test`; o artigo permanece com `draft: true` e não entra na saída gerada. A primeira falha de upload permanece sem causa confirmada; a segunda tentativa funcionou. Imagens de teste não devem ser confundidas com conteúdo editorial.
- A edição do resumo do rascunho também foi confirmada pelo CMS e sincronizada localmente; o campo continua excluído da saída enquanto `draft: true` permanecer ativo.
- A exclusão do rascunho pelo CMS também foi confirmada em `cms-test`; o artigo saiu do repositório e da saída gerada, enquanto as imagens de teste permaneceram preservadas.

## Build e publicação futura

- `npm run build:artifact` gera `posts/` e monta o artefato mínimo em `_site/`, contendo somente a entrada do site, estilos, comportamento, `content/site.json`, fontes/licença, imagens referenciadas pelo conteúdo público e páginas de publicações geradas. Imagens de teste não referenciadas ficam fora.
- O workflow `.github/workflows/pages.yml` instala dependências com `npm ci`, instala Chromium, gera o artefato, executa o QA contra `_site/` e interrompe antes do upload se uma verificação falhar.
- O workflow só pode executar build/deploy quando `github.ref` é `refs/heads/master`; `cms-test` não dispara publicação, inclusive por execução manual.
- O deploy usa `actions/upload-pages-artifact` e `actions/deploy-pages`, sem commitar os arquivos gerados.
- A configuração atual do GitHub Pages ainda é `legacy`, publicada pela raiz de `master`. Para ativar o workflow, a fonte de publicação deverá ser alterada manualmente em **Settings → Pages → Build and deployment → GitHub Actions**, depois que a branch e o workflow forem aprovados.
- O deploy não foi executado nesta etapa. A validação realizada em `cms-test` cobre somente build, composição do artefato e QA local servido a partir dele.
- Publicações individuais ficam em `content/posts/*.md` e são geradas para `posts/*.html` por `npm run build:posts`. Apenas arquivos sem `draft: true` entram na listagem, busca e páginas públicas. O build é uma etapa local/reprodutível; para publicação futura será necessário executá-lo em uma branch de teste ou em um workflow antes de publicar pelo GitHub Pages.
- O Pages CMS pode editar `content/site.json` (identidade, biografia, fotografia, trajetória, escritos, projetos e contatos) e criar arquivos Markdown em `content/posts/`. A configuração não autentica o CMS por si só. O repositório remoto ainda usa GitHub Pages legado; salvar no CMS cria commits, mas novos posts só aparecerão no site depois de `npm run build:posts` e da publicação dos arquivos gerados.

## Conteúdo e revisão editorial

- `MIGRACAO_DE_CONTEUDO.md`: inventário da fonte autorizada, limites de migração e pendências.
- `TAREFAS_HUMANAS_PARA_DELEGAR.md`: decisões pequenas que precisam de Raffael ou de uma pessoa responsável pelo conteúdo.

Os textos do WriteFreely não foram copiados integralmente. Antes de criar páginas próprias para eles, confirme título, data, categoria, imagens, créditos, links e autorização de republicação.

## Compatibilidade com GitHub Pages

O site não depende de servidor, banco de dados ou backend. Todos os caminhos são relativos, e o conteúdo JSON é carregado a partir de `content/site.json`, portanto a estrutura pode ser publicada em um repositório `*.github.io`.

## Validação realizada

- inspeção da estrutura, README, configurações e oito commits recentes;
- verificação da existência e sintaxe do conteúdo JSON;
- verificação local da navegação por teclado, foco visível, `aria-live`, temas e responsividade no código;
- verificação de que a implementação não usa rolagem horizontal;
- inventário manual das páginas autorizadas do WriteFreely e seus metadados;
- nenhum deploy, commit ou push realizado.


## Publicação oficial — 19/10/2026

Site: https://tecnorganico.github.io/. GitHub Pages usa GitHub Actions, com deploy exclusivo de master após build e QA. Para editar em produção no Pages CMS, selecione master, edite e salve. Acompanhe a execução na aba Actions; cms-test não publica. Rascunhos no repositório público continuam acessíveis no GitHub, embora excluídos do site gerado.

Lançamento aa133c6: https://github.com/tecnorganico/tecnorganico.github.io/actions/runs/39203141459. Pós-deploy: 46 testes aprovados, 40 contra a URL pública e seis com fixtures locais.

## rumos, portfólio e escritos — 20/10/2026

Os nomes da navegação vêm de `content/site.json`; os IDs de rota continuam estáveis. A seção rumos & habilidades reúne os trabalhos oferecidos. A seção portfólio contém `timeline`, editável no Pages CMS: período, título, descrição, fotografia, legenda e links. A ordem da lista no painel define a ordem na página.

Escritos usa `requiresPublications: true`. O build gera `posts/manifest.json` somente com artigos publicados; enquanto estiver vazio, a seção fica oculta no início e na navegação. Um acesso ao endereço antigo volta à apresentação inicial. Ao publicar o primeiro artigo, o próximo build reativa a seção automaticamente. Não é necessário editar o código.

A grafia editorial usa minúsculas nos textos corridos e controles, preservando nomes próprios, siglas e títulos de obras. Os textos são armazenados assim; não há uma regra CSS que altere arbitrariamente o conteúdo.

## busca e prévias de links

O build também gera versões HTML das seções, metadados de busca/compartilhamento, dados de autoria, sitemap e índice textual. Configuração editorial em `content/site.json`, editável pelo CMS. Detalhes, fontes e limites em [SEO.md](SEO.md). Edite as fontes; as páginas de `portfolio/`, `rumos-e-habilidades/` e `contato/` são geradas automaticamente.
