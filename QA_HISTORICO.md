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
