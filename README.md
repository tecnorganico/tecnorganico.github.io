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
