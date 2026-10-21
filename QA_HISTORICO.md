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
- **Artefato:** inclui somente `index.html`, `style.css`, `script.js`, `content/site.json`, fontes/licença, imagens referenciadas pelo conteúdo público e `posts/`; imagens de teste não referenciadas, testes, documentação, CMS, scripts, dependências e caches ficam fora.
- **Resultado:** 23 testes Chromium contra o artefato e 8 testes de publicações em Chromium/móvel aprovados. A transição publicado→rascunho→exclusão removeu a página do build seguinte.
- **Deploy:** não executado. O workflow futuro usa `upload-pages-artifact@v4` e `deploy-pages@v4`, mas a ativação da fonte Actions no Settings do GitHub Pages continua manual e pendente.


## 2026-10-19 — Site pessoal publicado no GitHub Pages

Lançamento autorizado diretamente por Raffael e executado pelo Codex após limite do Copilot. URL: https://tecnorganico.github.io/. Fonte alterada de legacy para workflow antes da integração fast-forward de cms-test em master. Commit publicado: aa133c6; versão anterior preservada no histórico: b28adda24f1d24633db6f8e68d5b2d4c76cce966.

Validação remota de cms-test: https://github.com/tecnorganico/tecnorganico.github.io/actions/runs/39203007287. Build e deploy de master concluídos com sucesso: https://github.com/tecnorganico/tecnorganico.github.io/actions/runs/39203141459. Workflow validado com actionlint. Corrigido teste que exigia coleção sempre vazia e bloquearia o primeiro artigo real.

Verificação pós-deploy: 46 testes aprovados em 16,1 s, Chromium e Chromium móvel. 40 cenários acessaram a URL pública; seis verificações de fixtures/gerador foram locais. Não confundir emulação com aparelho real. Não há artigo autoral publicado: a página individual foi verificada com fixture local.

Para editar oficialmente: selecionar master no Pages CMS; salvar cria commit e inicia build, QA e deploy. cms-test continua sendo teste e não publica. O primeiro salvamento de produção pelo CMS ainda não foi realizado nesta etapa. Imagens de teste preservadas no repositório e excluídas do artefato por ausência de referência pública. Conteúdo editorial da trajetória e projetos continua passível de revisão, sem inventar informações.

## 2026-10-20 — rumos & habilidades e portfólio em linha do tempo

- Sincronizadas e preservadas as 19 edições anteriores do CMS, até e512768.
- Colinha de 11 trabalhos e oito marcos de portfólio com duas fotografias, fontes e gravação no YouTube. As imagens não recebem autoria ou evento específico sem comprovação; coautorias e caráter coletivo da InfoCria preservados.
- Navegação derivada dos rótulos editáveis. Manifesto de artigos controla a seção escritos sem expor rascunhos. Campos opcionais ausentes não produzem conteúdo indefinido ou listas quebradas.
- QA local contra o pacote final: 50 testes aprovados em Chromium/computador e Chromium móvel (23,4 s). Após a separação de uma foto genérica de mediação, oito testes editoriais repetidos e aprovados (4,5 s). Conferidas capturas desktop e móvel, carregamento das fotos, contraste automatizado, retornos e reaparecimento de escritos com um manifesto simulado de artigo publicado.
- A primeira execução sem permissão de navegador foi bloqueada pelo ambiente; não foi classificada como defeito do site. A execução com permissão apropriada passou.
- YAML do CMS, JavaScript, diff e workflow validados. Resultado remoto e publicação serão registrados após confirmação.
- Limites: ano da palestra Afroya proveniente do acervo de 2023, sem inventar dia/mês; registro fotográfico genérico sem atribuição indevida ao seminário. Gravação validada por metadados, não assistida integralmente. Portfólio inicial selecionado, ampliável após conferência das demais experiências.

### confirmação da publicação

Commit 353857a publicado pelo workflow https://github.com/tecnorganico/tecnorganico.github.io/actions/runs/39518854700. Oito verificações pós-deploy passaram em 5,3 s, incluindo timeline, fotos, acessibilidade e disponibilidade condicional dos escritos. Os cenários zero/uma publicação usam manifesto simulado. README e fixture de rascunho retornaram 404 no site final. Fonte Pages encontrada em legacy durante a execução e restaurada para workflow; sem atribuir causa à mudança. A versão final usa o pacote filtrado.

## 2026-10-20 — ampliação inicial do portfólio (substituída pela revisão posterior)

Incluídos Hand Talk TV (2022), capítulo em coautoria com Pietra Canle no livro da Desvelar/LiteraRUA (2025), artigo da Aman-Ti-Kyr (2023), Instituto Bola Pra Frente (2021), locais de atuação e outros projetos. Exibição somente de anos/intervalos de anos. Registros sem ano confirmado ficam em outros percursos, sem gerar datas artificiais.

Confirmação direta de Raffael: Cineclube 2022–2025, como cineclubista e assistente de produção; AMAR em 2022, por seis meses. Informação autoral mais recente substitui o ano de 2021 do registro anterior. Fontes e limites em docs/2026-10-20_AMPLIACAO_DO_PORTFOLIO.md.

Oito testes editoriais aprovados em 11,2 s antes da correção final de datas, em Chromium/computador e Chromium móvel: presença de todos os registros, fotos, link de vídeo, anos, acessibilidade, retorno ao início e escritos condicionais. YAML do CMS e workflow validados. Resultado remoto/pós-deploy será registrado após confirmação.

### confirmação da publicação ampliada

Commit 6441ac8 publicado em https://tecnorganico.github.io/ pelo workflow https://github.com/tecnorganico/tecnorganico.github.io/actions/runs/39523369996, concluído com sucesso. Oito verificações pós-deploy aprovadas em 5,9 s, em Chromium/computador e Chromium móvel, incluindo todos os 43 registros e datas somente em anos, fotos, acessibilidade automatizada, retornos e disponibilidade condicional dos escritos. Os cenários zero/uma publicação usam manifesto simulado; emulação não substitui aparelho real. Os períodos corrigidos de Cineclube e AMAR estão incluídos nesta versão final.

## 2026-10-20 — retirada imediata e revisão autorizada

Retirados oito registros por solicitação expressa do autor e corrigidas três descrições. Portfólio atual com 35 registros. A lista de restrições e a justificativa detalhada ficam exclusivamente na memória privada; não devem ser reproduzidas em documentação pública. Experiências encontradas em acervos privados não estão automaticamente autorizadas para publicação.

Publicação da correção confirmada: commit d89b691, workflow 39525098149 concluído com sucesso. Conteúdo servido pela URL oficial verificado: 35 registros, oito itens retirados e três textos corrigidos. Oito testes editoriais locais passaram em 5,4 s. Versões antigas continuam no histórico Git; não foi realizada reescrita de histórico.

## 2026-10-20 — oficina O Que O Futuro Quer?

Registro de 2024 incluído por solicitação expressa do autor, com local, material e parcerias fornecidos por ele. Colagem responsiva com três fotografias originais, sem geração ou alteração das pessoas retratadas. Fotos e textos alternativos editáveis pelo CMS; pacote inclui as imagens da colagem. Oito testes editoriais passaram em 5,9 s em Chromium/computador e móvel; composição visual e YAML conferidos.

## 2026-10-20 — SEO e prévias de links

Adicionados metadados HTML por página, URLs canônicas, Open Graph/Twitter com fotografia do perfil, autoria JSON-LD, sitemap e robots. Seções públicas ganham versões HTML legíveis sem JavaScript; experiência de conversa e rotas anteriores preservadas. Índice llms.txt é complementar, sem garantia de adoção. Temas educação digital crítica e vulnerabilidade digital autorizados explicitamente pelo autor. Nenhum dado confidencial foi incluído.

QA local contra o pacote: 58 testes aprovados em 20,4 s em Chromium/computador e móvel; dez verificações finais de SEO e acessibilidade estática passaram em 5,1 s. Incluem leitura sem JavaScript, conteúdo do portfólio, metadados de todas as páginas, foto de prévia, fixtures de artigos futuros e exclusão de rascunhos. A listagem vazia não entra no sitemap e recebe noindex; página 404 também recebe noindex. Acesso a Search Console, indexação real e atualização de caches de aplicativos não foram confirmados.

Publicação confirmada: commit 3271251, workflow https://github.com/tecnorganico/tecnorganico.github.io/actions/runs/39535074862 concluído com sucesso. Dez verificações pós-deploy aprovadas em 7,2 s em Chromium/computador e móvel: oito acessam o site oficial e duas geram artigos de fixture localmente. Cinco páginas têm metadados e foto de prévia disponível; sitemap com quatro URLs indexáveis. Não foi verificada indexação pelos provedores nem atualização de caches de redes sociais.
