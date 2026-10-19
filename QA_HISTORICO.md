# Histórico de QA

## 2026-10-18 21:40:22 -0300 — correção da navegação

- **Escopo:** navegação da conversa, retorno ao início, sincronização de fragmento/seleção, foco, tema, contatos públicos e acessibilidade automatizada.
- **Resultado:** 72 testes aprovados em 26,3 s.
- **Projetos executados:** Chromium, Firefox, WebKit e Chromium móvel (Pixel 5).
- **Cobertura:** abertura inicial, quatro caminhos, retornos individuais e repetidos, área de leitura, teclado, foco, tema, URL, ausência de rolagem horizontal, erros JavaScript, axe-core e endereços de contato.
- **Correções confirmadas:** rotina única `navigate()`, tratamento de `popstate`/`hashchange`, retorno real por “Voltar à conversa”, distinção visual entre selecionado/hover/foco, remoção de notas internas do texto público, heading `h1` e contraste do crédito fotográfico.
- **Evidências:** relatório HTML completo preservado fora do repositório público em `.../73.01 NUCLEO RAMINDEX/70 GOVERNANCA RAMINDEX/70.02 LOGS/TECNORGANICO_SITE_QA/2026-10-18_21-40-22-0300/playwright-report/index.html`.
- **Evidências pré-correção:** não foram preservadas em pasta histórica. As falhas foram reproduzidas e registradas em `QA.md`, mas os screenshots/traces temporários da execução anterior não fazem parte deste arquivo histórico.
- **Limitações:** WebKit é uma aproximação automatizada, não substitui Safari; Chromium móvel é emulação, não substitui aparelho real; o Pages CMS ainda não foi autenticado/testado; Signal e Telegram continuam pendentes de teste humano.

Os resultados desta entrada são QA automatizado. Inspeção visual e validação humana permanecem categorias separadas em `QA.md`.

## 2026-10-18 21:55 — subtítulo e texto alternativo da fotografia

- **Decisão:** exibir abaixo de “Raffael Baptista” a frase exata “Autonomia digital se faz em coletivo”.
- **Preservação:** a assinatura editorial “Vida, técnica e palavra.” não foi alterada; o crédito da fotografia continua no campo estruturado `photo.credit` e editável pelo Pages CMS, mas não é mais visível no cabeçalho.
- **Acessibilidade:** o texto alternativo passou a ser “Raffael Baptista sorrindo, de óculos, diante de um fundo laranja. Fotografia autoral de Raffael Baptista, editada utilizando GPT-5.1.”
- **Verificação focada:** 4 testes aprovados em 2,3 s em Chromium e Chromium móvel: subtítulo, ausência do crédito visível e varredura axe-core da página inicial.
- **Inspeção visual:** capturas desktop e móvel conferiram legibilidade da frase, fotografia atual e ausência de espaço vazio no local do crédito.
- **Limitação:** não foi repetida a bateria completa de 72 testes; ela permanece registrada na entrada anterior.

## 2026-10-18 22:16 — estrutura editorial e publicações

- **Escopo:** schema Pages CMS, upload/seleção de imagens, coleção Markdown, filtro de rascunhos, listagem pública, página individual e retorno para `#escritos`.
- **Resultado:** 6 testes aprovados em 2,7 s em Chromium e Chromium móvel.
- **Verificações:** rascunho excluído da saída, listagem e busca; publicação de fixture renderizada em página individual; link direto de retorno; listagem pública sem artigos inventados; axe-core na listagem.
- **Conteúdo:** nenhum artigo do WriteFreely foi copiado. Os links externos aprovados foram preservados; a coleção começa sem publicações próprias.
- **Limitação:** a integração autenticada do Pages CMS não foi testada. O build local (`npm run build:posts`) ainda precisa ser executado em branch/workflow antes de uma publicação que inclua novos posts.

## 2026-10-18 22:26 — branch isolada para teste do Pages CMS

- **Branch enviada:** `cms-test`.
- **Commit da estrutura enviada:** `1017bb4595b1a53ee31171f10197a1b5b4b0ab55` (`feat: prepare Pages CMS test branch`).
- **Conteúdo:** estrutura editorial, `.pages.yml`, fotografia aprovada, coleção Markdown, gerador, testes, documentação e dependências declaradas; `node_modules`, caches, relatórios e registros privados ficaram fora do commit.
- **Verificações antes do envio:** `npm run qa` com 88 testes aprovados em Chromium, Firefox, WebKit e Chromium móvel; `npm run build:posts`; validação do JSON, sintaxe JavaScript, credenciais e `git diff --check`.
- **Isolamento:** a referência remota de `master` permaneceu em `b28adda24f1d24633db6f8e68d5b2d4c76cce966`; o GitHub Pages continua configurado para publicar somente `master` pela raiz, em modo legado.
- **Automação:** não houve execução de workflow para `cms-test`. O push enviou arquivos ao GitHub, mas não publicou o site.
- **Estado do CMS:** ainda não validado. Falta autorizar o Pages CMS, editar um texto pelo painel e confirmar o commit gerado. Upload de imagens, criação de artigos e automação de publicação continuam pendências separadas.

## 2026-10-18 23:33 — primeira edição real pelo Pages CMS

- **Resultado:** validação parcial confirmada. O painel carregou a branch `cms-test` e exibiu a confirmação `File "content/site.json" saved successfully`.
- **Commit remoto:** `94d7a366dc04af89878a971fae6a92338ee48706`, com a mensagem `content(update): content/site.json`.
- **Campos alterados:** `identity.signature` passou de `Vida, técnica e palavra.` para `Autonomia digital se faz em coletivo`; `photo.src` passou a usar `/assets/media/raffael-baptista.jpeg`; o CMS acrescentou `primary: false` aos links que não são o contato principal e reorganizou alguns campos de contato sem alterar seus endereços.
- **Sincronização:** a cópia local foi atualizada por fast-forward, sem descartar alterações pendentes. `npm run build:posts` continuou gerando zero publicações próprias.
- **Prévia:** o novo valor da assinatura foi carregado em computador e celular emulado; a fotografia e seu texto alternativo permaneceram presentes.
- **QA:** 36 testes focados passaram. Dois testes falharam porque a expectativa automatizada ainda protege a assinatura editorial anterior; a falha torna visível uma decisão editorial alterada pelo painel e não foi escondida nem corrigida automaticamente.
- **Escopo validado:** edição e commit de `content/site.json` pelo Pages CMS. Upload de imagens, criação de artigos e automação de build/publicação continuam pendências independentes.

## 2026-10-18 23:39 — sincronização pós-edição confirmada

- **Sincronização:** `cms-test` local foi conferida com `origin/cms-test` no commit `714f56ecb7f0395a4e09b25b948929ca126e94c6`, sem alterações locais pendentes e sem uso de reset ou descarte.
- **Conteúdo visível:** a prévia carregou `Raffael Baptista`, o subtítulo aprovado, a assinatura atualmente salva pelo CMS e a fotografia com o texto alternativo aprovado.
- **Build:** `npm run build:posts` concluiu com zero publicações próprias; não houve publicação.
- **Limites:** `master` permaneceu em `b28adda24f1d24633db6f8e68d5b2d4c76cce966`. Upload de imagens e criação/edição/exclusão de artigos continuam pendentes de teste.

## 2026-10-18 23:45 — publicação fictícia em rascunho e upload de imagem

- **Operação real no Pages CMS:** foi criado na branch `cms-test` o artigo fictício `Rascunho de teste do CMS`, com o commit inicial `99d4d95` e atualização posterior `d961514`.
- **Rascunho:** o arquivo remoto `content/posts/rascunho-de-teste-do-cms.md` contém `draft: true`, resumo, categoria, corpo fictício e permanece preservado para a etapa de limpeza posterior.
- **Imagem associada:** o artigo contém `image: /assets/media/3fb993d9-fb7a-4d49-bc42-796b24ed5a22.jpeg` e `image_alt`; o arquivo existe no repositório e foi criado pelo CMS no commit `e350b4d`.
- **Upload:** a primeira tentativa relatada apresentou erro, mas a causa permanece desconhecida por falta da mensagem exata. A segunda tentativa foi relatada como bem-sucedida e confirmada pelos commits de mídia e pela associação no artigo. Também chegaram ao repositório duas imagens adicionais de tentativas anteriores (`8fcd050` e `020f99c`); elas não foram removidas nesta etapa.
- **Verificação local:** após fast-forward até `d961514`, o parser confirmou `draft: true` e a imagem; o build com `content/posts` gerou zero publicações e não incluiu o título ou o caminho da imagem no índice. Os 6 testes focados de publicações passaram em Chromium e Chromium móvel.
- **Configuração:** a documentação oficial atual descreve `options.media: images` em campos de imagem, enquanto o schema existente usa `media: images` diretamente. Como o upload posterior funcionou, nenhuma alteração de configuração foi feita; a compatibilidade deve ser reavaliada se o erro persistir.

## 2026-10-19 00:06 — edição do rascunho pelo Pages CMS

- **Operação real no Pages CMS:** o resumo de `Rascunho de teste do CMS` foi atualizado e salvo na branch `cms-test`.
- **Commit confirmado:** `507456173d2bab063fe4dd5435c8af45ee0e0e65` (`content(update): content/posts/rascunho-de-teste-do-cms.md`).
- **Campo alterado:** `summary` passou a ser `Texto fictício atualizado para verificar a edição pelo CMS.`.
- **Campos preservados:** slug, categoria, corpo, imagem, `image_alt` e `draft: true`.
- **Sincronização:** a cópia local foi atualizada por fast-forward até o mesmo commit, sem descarte de alterações.
- **QA:** o build gerou somente `index.html`; não houve página individual nem presença do título/resumo na listagem. Os 6 testes focados passaram em Chromium e Chromium móvel.
- **Limite:** a exclusão do rascunho pelo painel ainda não foi executada; o arquivo permanece intencionalmente no GitHub e marcado como rascunho.

## 2026-10-19 00:09 — exclusão do rascunho pelo Pages CMS

- **Operação real no Pages CMS:** o artigo fictício foi excluído na branch `cms-test`.
- **Commit confirmado:** `586e08feff45cf71d00eb982121d03e8f20fc4e2` (`content(delete): content/posts/rascunho-de-teste-do-cms.md`).
- **Escopo da remoção:** o commit removeu somente `content/posts/rascunho-de-teste-do-cms.md`. Os quatro arquivos JPEG em `assets/media/`, inclusive a imagem associada ao artigo, permaneceram no GitHub.
- **Sincronização:** a cópia local foi atualizada por fast-forward, sem descarte de alterações.
- **QA:** `npm run build:posts` gerou zero publicações; não existe fonte do rascunho, página individual ou entrada na listagem. Os 6 testes focados passaram em Chromium e Chromium móvel.
- **Conclusão do ciclo:** criação, associação de imagem, edição, exclusão e exclusão da saída pública foram verificadas. A limpeza posterior dos arquivos de imagem de teste permanece uma ação separada, a ser feita somente para arquivos criados neste teste.

## 2026-10-19 00:42 — workflow de build e publicação preparado

- **Configuração real:** GitHub Pages continua em modo `legacy`, branch `master`, raiz `/`; nenhuma configuração de produção foi alterada.
- **Implementação local em `cms-test`:** `.github/workflows/pages.yml` usa `npm ci`, gera publicações, monta `_site/` por lista explícita, testa o artefato com Chromium e só permite os jobs quando `github.ref` é `refs/heads/master`.
- **Artefato:** inclui somente `index.html`, `style.css`, `script.js`, `content/site.json`, `assets/` e `posts/`; testes, documentação, CMS, scripts, dependências e caches ficam fora.
- **Resultado:** 23 testes Chromium contra o artefato e 8 testes de publicações em Chromium/móvel aprovados. A transição publicado→rascunho→exclusão removeu a página do build seguinte.
- **Deploy:** não executado. O workflow futuro usa `upload-pages-artifact@v4` e `deploy-pages@v4`, mas a ativação da fonte Actions no Settings do GitHub Pages continua manual e pendente.
