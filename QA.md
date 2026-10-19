# QA local do site

## Executar

```bash
npm run qa
```

O comando executa a suíte em Chromium, Firefox, WebKit e Chromium móvel. O Playwright inicia ou reutiliza a prévia em `http://127.0.0.1:8765`, gera o relatório HTML em `playwright-report/` e grava resultados, capturas, vídeos e traces em `test-results/`. Esses diretórios são regeneráveis e ignorados pelo Git.

Para abrir o relatório depois da execução:

```bash
npm run qa:report
```

## Falhas reproduzidas antes da correção

1. Clicar em **Falar comigo** ou **Início** apenas alterava o fragmento; o conteúdo permanecia na apresentação inicial.
2. **Voltar para a conversa** apenas movia o foco, sem fechar a área de leitura.
3. A resposta pública de contatos expunha a nota interna sobre teste humano e configurações de privacidade.
4. O estado selecionado e o hover usavam a mesma aparência visual, dificultando distinguir seleção, foco e hover.

Os dois primeiros problemas foram registrados como testes Playwright antes da correção e falharam no Chromium. A falha de conteúdo público também foi registrada e falhou com a mensagem interna visível.

## Cenários automatizados

- abertura inicial com saudação e quatro caminhos;
- abertura e retorno ao início para cada caminho;
- abertura da área de leitura e retorno por **Voltar à conversa**;
- trocas sequenciais de assunto e retornos repetidos;
- sincronização entre fragmento, conteúdo e `aria-current`;
- navegação por teclado, ativação por `Enter` e foco após retorno;
- preservação do tema durante a navegação;
- ausência de rolagem horizontal;
- ausência de erros JavaScript não tratados;
- varredura axe-core na abertura, nos quatro caminhos e na área de leitura;
- ausência de notas internas no conteúdo público;
- conferência dos endereços dos contatos sem abrir aplicativos nem enviar mensagens.

## Resultado

Última execução realizada em 18/10/2026:

```bash
npm run qa
```

**72 testes aprovados em 26,3 s**, nos quatro projetos configurados: Chromium, Firefox, WebKit e Chromium móvel. Nenhum navegador configurado ficou indisponível.

A configuração mantém `screenshot: "only-on-failure"`, `video: "retain-on-failure"` e `trace: "retain-on-failure"` para produzir capturas, vídeos e traces quando houver falhas. A última execução não gerou falhas; o relatório HTML está em `playwright-report/`.

O relatório desta execução foi preservado antes de novas execuções em uma pasta privada e datada do núcleo Ramindex. O índice resumido está em `QA_HISTORICO.md`. As evidências temporárias das falhas pré-correção não foram preservadas em arquivo histórico; sua reprodução e ausência estão registradas no índice.

### Verificação focada de 18/10/2026 às 21:55

Foram executados apenas os testes afetados pela alteração do cabeçalho e da fotografia: **4 testes aprovados em 2,3 s**, em Chromium e Chromium móvel. A inspeção visual em capturas desktop e móvel confirmou a legibilidade de “Autonomia digital se faz em coletivo”, a fotografia atual e a remoção do espaço ocupado pelo crédito visível. O campo `photo.credit` continua estruturado e editável pelo Pages CMS.

### Verificação focada de 18/10/2026 às 22:16

Foram executados **6 testes aprovados em 2,7 s**, em Chromium e Chromium móvel, para a estrutura de publicações. Os testes confirmaram que rascunhos ficam fora das páginas, da listagem e da busca geradas; que uma publicação publicada renderiza uma página individual com URL própria e retorno para `#escritos`; e que a listagem sem artigos inventados passa pelo axe-core.

A integração autenticada do Pages CMS não foi testada. O build local também precisa ser executado em branch ou workflow antes de novos posts chegarem ao GitHub Pages.

## Causa e correção

`script.js` renderizava a conversa apenas nos botões internos. Os links laterais atualizavam o fragmento sem passar pela mesma rotina, e o link de retorno não chamava `renderHome()`. A correção centralizou a navegação em `navigate()`, que renderiza o destino, atualiza o histórico, o fragmento e `aria-current`, trata `popstate`/`hashchange` e devolve o foco ao primeiro caminho quando necessário.

O CSS agora usa fundo e barra lateral para `aria-current`, enquanto hover permanece transparente com borda e foco mantém o contorno de foco visível. As notas operacionais foram removidas do conteúdo público e permanecem em `TAREFAS_HUMANAS_PARA_DELEGAR.md`.

## Inspeção visual e limitações

- **Automatizado:** fluxos, estados visíveis, URLs, foco, acessibilidade automatizada e rolagem horizontal.
- **Inspeção visual:** conferir manualmente no navegador a fotografia, a distinção entre selecionado/hover/foco, o enquadramento no desktop e no celular e a densidade dos contatos.
- **Pendente com pessoas:** teste real de abertura do Signal e Telegram; revisão em aparelho físico e Safari; compreensão do roteiro por pessoas sem orientação.
- **Pendente de QA técnico:** autenticar e testar a integração real do Pages CMS. A existência de `.pages.yml` não é considerada validação.
- **Pendente editorial:** trajetória, seleção de textos, categorias, inventário restante e status dos projetos continuam fora do escopo deste QA.

## Roteiro humano curto

Sem explicar a sequência de cliques, peça à pessoa para:

1. encontrar um texto;
2. conhecer um projeto;
3. localizar o contato principal e um canal alternativo;
4. voltar ao início.

Observe onde ela hesita, quais rótulos interpreta de forma diferente, se percebe qual item está selecionado, se entende que o WhatsApp é o contato principal e se consegue retornar sem ajuda. Registre dúvidas e dificuldades sem orientar cada clique.
