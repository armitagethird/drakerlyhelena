# Página de checklist para post do Instagram

Modelo usado em `/checklist/estresse/` (carrossel "6 sinais que parecem estresse"). O último slide do post manda a pessoa ao site, ela marca o que faz parte da rotina dela e leva a lista pronta para o WhatsApp do consultório.

São páginas de campanha: ficam fora do Google (`noindex, follow`), do `sitemap.xml`, do `llms.txt` e do menu. Só se chega a elas pelo link do post ou do anúncio.

## Como funciona

- O comportamento vem do `/checklist.js`, o mesmo componente dos checklists do blog. Ele lê só atributos do HTML:
  - `[data-checklist="abertura da mensagem"]` envolve tudo: checkboxes, botão e status.
  - Cada `input type="checkbox"` tem um `value`, que é o texto que entra na mensagem.
  - `[data-checklist-whatsapp]` é o link `wa.me` que recebe a mensagem montada.
  - `[data-checklist-status]` (com `aria-live="polite"`) mostra quantos itens foram marcados e volta ao texto original quando tudo é desmarcado.
- Mensagem montada: `abertura + " O que percebo em mim: item; item." + " Gostaria de agendar uma avaliação com a Dra. Kerly Helena."`. Sem nada marcado, fica só `abertura + fecho`.
- Nada é guardado (sem `localStorage`, sem envio a servidor). A mensagem só sai se a pessoa tocar no botão e enviar no WhatsApp.
- Medição: o listener do `main.js` dispara `whatsapp_click` no GA4 com `page_path` (ex.: `/checklist/estresse/`) e `link_location`. O bloco tem `data-cta-source="checklist"`, então o botão da lista chega como `link_location = checklist` e o botão flutuante como `botao_flutuante`. A lista de sinais nunca vai para o GA4.
- O Meta Pixel não está instalado nestas páginas (hoje só a home tem o código, ainda sem o ID real). Enquanto isso não muda, o evento `Contact` não chega ao Meta a partir daqui.

## Visual (rosas, cartões e foto)

- O visual vem de `/checklist/checklist.css`, compartilhado por todas as páginas de checklist. Só tem classes `.ck-`; o resto é Tailwind do site. Não copie nem edite esse CSS por página: um ajuste nele vale para todas.
- As rosas são desenhadas em traço fino uma única vez, no `<svg class="ck-defs">` do começo do `<main>` (ids `ck-r-veu`, `ck-r-haste`, `ck-r-folhas`, `ck-r-botao`, `ck-r-rosa` e os símbolos `ck-botao`, `ck-folha`, `ck-bud`), e reaproveitadas com `<use>`. Ao copiar a página, mantenha esse bloco inteiro.
- Onde aparecem: um ramo ao lado do título no celular (some abaixo de 360 px e com a letra ampliada, para não encostar no texto), que no desktop desce para a coluna da esquerda; um botão de rosa no lugar dos travessões da lista da consulta; um botãozinho que se desenha embaixo da caixinha quando a linha é marcada; um fio com botão de rosa antes da assinatura; e um ramo no canto da foto.
- No fim, a assinatura fica num cartão com a foto da Dra. em arco (`/assets/IMG_4369-2-640.webp` e `-960.webp`, a mesma foto da imagem de compartilhamento), o nome, CRM/RQE e o aviso de privacidade.
- Movimento, sempre leve: o ramo do topo se desenha uma vez ao abrir a página (termina em ~2,5 s), as seções de baixo sobem de leve ao entrar na tela e a foto se acomoda (só `transform`, onde o navegador suporta `animation-timeline`). Regras: nenhuma animação infinita; nada automático passando de 5 s (WCAG 2.2.2); título, apoio e caixinhas nunca animam; com "reduzir movimento" no aparelho tudo fica parado; em alto contraste a decoração some e os cartões ganham contorno.
- Os breakpoints do `checklist.css` (360, 640, 768, 1024) espelham os do Tailwind do site: se mudarem lá, mudar lá também.

## Criar a página de um próximo post

1. **Copiar a pasta** `checklist/estresse/` para `checklist/<slug>/`. Slug curto, minúsculo, sem acento, com hífen (ex.: `checklist/sono/`).
2. **`<head>`** — trocar `title`, `description`, `canonical`, `og:url`, `og:title`, `og:description`, `twitter:title` e `twitter:description`. O `canonical` e o `og:url` apontam para a própria página. Manter `<meta name="robots" content="noindex, follow">`.
3. **Imagem de compartilhamento (OG)** — reaproveitar uma das `assets/og-*.jpg` (1200 × 630) ou criar uma nova nesse tamanho, e atualizar `og:image`, `og:image:alt` e `twitter:image`.
4. **Abertura da mensagem** — no `data-checklist`, no formato `Olá! Vim pelo post <nome do post>.`
5. **Link padrão do botão** — o `href` do `[data-checklist-whatsapp]` precisa ser a mensagem sem itens (abertura + fecho), para funcionar mesmo sem JavaScript. Gerar com:

   ```bash
   node -e "console.log('https://wa.me/5598981532153?text=' + encodeURIComponent('Olá! Vim pelo post <nome>. Gostaria de agendar uma avaliação com a Dra. Kerly Helena.'))"
   ```

6. **Botão flutuante** — trocar a mensagem da opção "Falar no WhatsApp" (`wa-fab__option--wa`) para `Olá! Vim pelo post <nome> e gostaria de agendar uma avaliação com a Dra. Kerly Helena.`, codificada do mesmo jeito.
7. **Topo** — sobretítulo, H1 com o **mesmo título do carrossel** e o texto de apoio. Quem chega do anúncio precisa reconhecer o post na hora.
8. **Itens** — um `<li>` por slide, copiando o bloco existente. O `value` do checkbox é o título em minúsculas (é o que aparece na mensagem); dentro do rótulo vão o título e uma linha de explicação. Atualizar também o `<legend class="sr-only">` do `fieldset` (ex.: `Os 5 sinais`): ele não aparece na tela, mas é o que o leitor de tela anuncia.
9. **Blocos finais** — a nota sobre o que pode estar por trás dos sinais (`.ck-note`, sempre lembrando outras causas), como é a consulta (cada item com o botão de rosa), e o cartão da assinatura (`.ck-sign`) com foto, CRM e RQE e o aviso de privacidade. A foto pode ficar a mesma; se trocar, atualizar `src`, `srcset`, `alt` e conferir o enquadramento do rosto no arco.
10. **Não** adicionar a página ao `sitemap.xml`, ao `llms.txt` nem ao menu.
11. Se usar alguma classe Tailwind que não existe no site, rodar `npm run build:css` e incluir o `output.css` no commit.
12. No anúncio, usar o link com UTM para separar a campanha no GA4, por exemplo `https://drakerlyhelena.com.br/checklist/estresse/?utm_source=instagram&utm_medium=paid_social&utm_campaign=6-sinais-estresse`. O `canonical` ignora os parâmetros.

Detalhes de layout que valem para qualquer post (não remover ao editar):

- No celular, o botão "Levar para a consulta" fica preso ao pé da tela enquanto a lista está à vista (`sticky`). A margem direita (`mr-[4.25rem]`) deixa o botão flutuante do WhatsApp livre ao lado, e o `scroll-pb-28` do `<html>` impede que o foco do teclado pare escondido atrás do botão.
- Texto do conteúdo com 18 px ou mais no celular (`text-lg`). A linha inteira do item é a área de toque (bem acima de 44 px), e o checkbox tem 28 px.

## Regras de texto (CFM e Meta)

- Sem promessa de resultado ("garantido", "elimina", "acaba com", "resolve") e sem "cura".
- Sem "antes e depois", depoimento com resultado ou foto de paciente.
- Sem preço nem "R$".
- **Nada de "você tem X" ou "você sofre de X"**, nem pergunta que insinue diagnóstico ("Você está na menopausa?"). A política de anúncios da Meta proíbe afirmar ou insinuar condição de saúde de quem lê. Descrever os sinais ("Pavio curto", "A palavra some") ou falar em terceira pessoa ("Muitas mulheres confundem").
- A página não diagnostica. Pede para marcar o que "faz parte da rotina", lembra que os sinais têm outras causas e que a resposta vem da avaliação.
- Assinatura com nome, especialidade, CRM e RQE: `Dra. Kerly Helena · Ginecologista e Obstetra · CRM/MA 3130 · RQE 5232`.
- O `npm test` (`scripts/verify-site.js`) barra no HTML: "R$", "cura", "garantimos"/"resultado garantido", "eliminar sintomas/dores", "antes e depois", "não reconhece", "apenas complementar" e "não substitui". Ele não avalia o tom, então as regras acima precisam de leitura humana, inclusive no texto do anúncio.

## Roteiro de verificação

Antes de dizer que está pronto:

1. `npm run build:css` e `npm test` sem erros.
2. Subir o site com `npm run dev -- --no-watch` (porta 5500; no Claude Code, a configuração `site` do `.claude/launch.json` local faz o mesmo) e abrir `http://localhost:5500/checklist/<slug>/` em 375 px:
   - marcar 2 sinais e conferir que o link do WhatsApp traz a abertura e os 2 sinais;
   - desmarcar tudo e conferir a mensagem padrão (abertura + fecho) e o texto inicial do status;
   - navegar só pelo teclado: Tab passa pelos sinais e chega a "Levar para a consulta", Espaço marca, Enter abre o WhatsApp com a lista. O item focado nunca fica escondido atrás do botão preso ao pé da tela;
   - conferir que título, caixinhas e o botão aparecem na primeira tela.
3. Conferir também em 320 px (o rótulo do botão cabe numa linha) e com a letra ampliada pelo botão "A A".
4. Conferir que o checklist de `/blog/cansaco-exames-normais/` continua funcionando igual (mesmo componente).
5. Ver o compartilhamento: `og:image` abre e o `canonical` aponta para a própria página.
6. Conferir o movimento: no console do navegador, `document.getAnimations().filter(a => a.effect.getTiming().iterations === Infinity).length` dá `0`; com "reduzir movimento" ligado (DevTools → Rendering → `prefers-reduced-motion: reduce`) nada se mexe; e o ramo do topo não encosta no título em 360, 375 e 414 px.
7. Conferir a indexação, que o `npm test` não verifica: o `<head>` tem `<meta name="robots" content="noindex, follow">` e `grep -n "checklist/" sitemap.xml llms.txt` não devolve nada.
