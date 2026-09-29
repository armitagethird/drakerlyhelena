# Site Dra. Kerly Helena: legibilidade, interatividade útil e higiene de SEO

Data: 2026-09-28. Branch: `mudancas-do-fable-5.1-28-09-2026` (a partir de `885066a`, main).

## Objetivo

Deixar o site mais interativo e interessante para o público jovem e para o público mais velho,
mantendo-o fácil para quem tem mais idade, sem prejudicar o SEO (e melhorando onde der).
A tese: menos efeito decorativo, mais interatividade útil, texto legível, e o quiz entregando
o resultado antes de pedir dados.

## Diagnóstico que fundamenta o spec (medido em 2026-09-28)

| O que | Onde | Hoje | Alvo |
|---|---|---|---|
| Peso do texto de corpo | parágrafos, passos, cards, depoimentos | Lato 300 com 60 a 80% de opacidade | 400 com no mínimo 80% |
| Rosa escuro como texto | blush-500 `#A9637B` sobre `#FDFCFB` | 4,3:1 | 4,5:1 ou mais |
| Rosa claro como texto | blush-400 `#C7889D` sobre `#FDFCFB` | 2,8:1 | 4,5:1 |
| Dourado da página Yoga | `#C5A028` em botões e links | 2,5:1 | 4,5:1 |
| Menor texto funcional | rails, rodapé, dicas de toque | 10 a 11 px | 12 px ou mais |
| Altura da home no celular | index.html | ~16.800 px | endereço, horário e telefone no primeiro terço |
| Telas do quiz antes do resultado | modal do quiz | 9 perguntas + 5 telas de dados | 9 perguntas, dados opcionais depois |
| Perguntas do FAQ numa lista só | /faq/ | 15, sem busca nem âncora | busca, grupos e âncoras |

Outros achados: nenhum vídeo no site; único link `tel:` do site fica na última seção da home e está
rotulado "WhatsApp"; botão "Agendar Consulta" da seção de endereço abre o quiz; lista "Talvez você
esteja aqui porque" sem affordance de botão no celular; cards da abordagem com texto só no hover;
`h2`/`h3` dentro do modal do quiz poluem o outline da home; efeito de letras pulando divide títulos
em spans por caractere; reveals GSAP ignoram `prefers-reduced-motion` e escondem de novo ao rolar
para cima; JSON-LD dos artigos aponta autor/publisher só por `@id` definido apenas na home; FAB nas
páginas internas dispara erro antes de navegar; quiz promete "te enviar o resultado" mas o Apps
Script só grava planilha; backup de leads em localStorage; consentimento único para resultado e
novidades; overlay do modal fecha e zera respostas ao toque; botão do menu mobile sem padding;
`focus:outline-none` no botão do menu e nos 15 botões do FAQ; feather-icons do unpkg sem versão.

## Restrições do cliente (já registradas no CHANGELOG, valem para tudo)

1. Nunca exibir preços ou valores (nem `priceRange`, `offers` com preço, "R$").
2. Nenhuma promessa de resultado: sem "cura", "garante", "elimina", "definitivo", antes e depois.
3. Não reintroduzir ressalvas do CFM nem vocabulário de subordinação ("não reconhece",
   "apenas complementar", "não substitui").
4. Medicina integrativa e ortomolecular são apresentadas lado a lado com a medicina convencional.
5. Depoimentos são os do perfil do Google, reproduzidos como estão; não inventar números.
6. Seção de Medicina Ortomolecular na home foi pedida pela cliente em julho/2026: não remover.

## Restrições de processo (pedido do dono do projeto)

- Trabalho só na branch local `mudancas-do-fable-5.1-28-09-2026`. Nunca fazer merge, nunca push.
- Commits em português, sem acentos, sem trailer de coautoria de IA, autoria = identidade git local.
- Nenhuma dependência nova de runtime; nenhum CDN novo. JS puro. Tailwind v4 compilado por
  `npm run build:css` com `output.css` commitado.
- Todo conteúdo novo entra no HTML estático; JS só melhora (progressive enhancement).
- URLs, canonicals, titles, descriptions e tipos JSON-LD existentes são preservados; só se
  adiciona ou corrige.

## Requisitos

### R1. Legibilidade para o público mais velho (site inteiro)

- R1.1 Texto de corpo com peso 400 (sem `font-light` em `p`, `li`, `dd`, `label`, `figcaption`).
- R1.2 Opacidade mínima de texto: nenhuma classe `text-charcoal/40` a `/70`, `text-yoga-dark/40`
  a `/70`, `text-white/40` a `/70`. Piso é `/80`.
- R1.3 Novos tokens: `--color-blush-600: #8E4F66` (texto e botões, ~5,9:1 sobre `#FDFCFB`),
  `--color-blush-700: #7A4257` (hover de botão), `--color-yoga-gold-deep: #8A6D12` (texto e botões
  da página Yoga, ~4,9:1 sobre branco). Todos verificados por `npm test` (≥ 4,5:1).
- R1.4 `text-blush-400` deixa de existir como cor de texto; `text-blush-500` só em títulos
  (`h1`, `h2`, `h3`) e ícones; demais textos em `text-blush-600`. Botões primários
  `bg-blush-600 hover:bg-blush-700 text-white`. CTA do cabeçalho (`.glass--cta`) idem.
- R1.5 Nenhum `text-[10px]`/`text-[11px]`; piso `text-xs` (12 px) para rótulos; parágrafos
  informativos no mínimo `text-base`; datas, legendas e chips no mínimo `text-sm`.
- R1.6 "Role para explorar" removido. Rails "№ 0X" mantidos, em 12 px.
- R1.7 Zoom por pinça continua liberado. Alvos de toque de controles ≥ 44 px.
- R1.8 `prefers-reduced-motion` honrado por todas as animações JS (reveals GSAP inclusive).

### R2. Home (`index.html`, `main.js`, `styles.css`)

- R2.1 Lista "Talvez você esteja aqui porque": seta sempre visível, borda ou fundo sutil,
  dica "Toque na frase que mais combina com você" acima da lista em `text-sm`. Cada frase abre
  o quiz já na etapa de perguntas, com a pergunta correspondente exibida primeiro.
- R2.2 Cards "A abordagem integrativa": descrição sempre visível; título em `h3`; sem
  `tabindex`, sem hover que esconde/mostra.
- R2.3 Acessos rápidos: quarto card "Onde fica e horários" → `#location`, com
  "Edifício Monumental · Seg a sex, 08h às 18h".
- R2.4 Seção de endereço: botão principal vira link de WhatsApp; link "tel:" rotulado
  "Ligar"; iframe do Google Maps só carrega ao clicar em "Ver mapa"; botões "Rota no Google Maps",
  "Abrir no Waze" e "Copiar endereço".
- R2.5 Bloco de fechamento antes do rodapé: foto, uma frase acolhedora sem promessa e um único
  botão de WhatsApp, com "Ler o blog" como link secundário.
- R2.6 Efeito de letras (`.hover-char`, `.headline-editorial:hover`) removido.
- R2.7 Cabeçalho desktop: espaço entre o nome da médica e "Início".
- R2.8 Link "Avaliar no Google" ao lado de "Ver mais avaliações no Google" (mesma URL do perfil).

### R3. Quiz (`index.html` modal + `main.js`)

- R3.1 Fluxo: boas-vindas → 9 perguntas → animação → resultado. Dados só depois do resultado,
  opcionais: nome + WhatsApp + 1 checkbox de consentimento (24 px) sobre contato acerca do
  resultado. Sem e-mail, sem idade. Sem promessa de "enviar o resultado".
- R3.2 Botão "Agendar pelo WhatsApp" leva o resumo do resultado na mensagem: dimensões, fase de
  vida e nome (se informado).
- R3.3 Toque no overlay não fecha o modal depois da tela de boas-vindas; só o botão X fecha.
- R3.4 Botão X não sobrepõe o indicador de progresso em telas de 390 px.
- R3.5 Um único CTA de WhatsApp visível por vez na tela de resultado (barra fixa).
- R3.6 Ícones do resultado via feather, não emoji.
- R3.7 Nenhum `h1`..`h6` dentro do modal. `aria-labelledby` continua válido.
- R3.8 Nenhum dado pessoal em `localStorage`. Payload para o Apps Script mantém as chaves
  existentes (`name`, `phone`, `email`, `age`, `phase`, `topDimensions`, `scores`, `timestamp`,
  `page`), com `email` e `age` vazios.
- R3.9 Em páginas sem o modal, `openSymptomModal` redireciona para `/#quiz` sem erro; a home
  abre o quiz com `#quiz` e continua aceitando `?quiz=1`.
- R3.10 Card "Respiração & Meditação" do resultado linka para `/yoga/#respiracao`.

### R4. Menopausa (`menopausa/index.html` + nova `menopausa/diario-de-sintomas/`)

- R4.1 Lista "Sinais de que vale procurar acompanhamento" vira checklist; botão "Levar esses
  sinais para a consulta" abre WhatsApp com os sinais marcados no texto. Sem persistência.
- R4.2 Bloco "Em que fase estou?" com três `<details name="fase">` (acordeão exclusivo nativo),
  cada um apontando para a fase provável e para a seção correspondente, e um cálculo simples
  de 12 meses a partir da data da última menstruação. Texto educativo, sem diagnóstico.
- R4.3 Página imprimível "Diário de sintomas" (4 semanas) em `/menopausa/diario-de-sintomas/`,
  indexável, linkada da página de menopausa.

### R5. FAQ (`faq/index.html`)

- R5.1 15 perguntas e respostas preservadas palavra por palavra; JSON-LD `FAQPage` idêntico.
- R5.2 Três grupos com `h2`; cada pergunta em `<details id="...">` com `<summary><h3>`.
- R5.3 Busca instantânea (filtra pelo texto), "Abrir todas / Fechar todas", link por pergunta
  (âncora + "Copiar link"); abre a pergunta indicada pelo hash da URL.
- R5.4 Sem GSAP na página; sem `focus:outline-none`.

### R6. Blog (`blog/index.html` + 3 artigos + `blog/blog.js`)

- R6.1 JSON-LD dos artigos com `author` (`Person`, nome, url) e `publisher` (`Organization`
  com `@id` do `#clinic`, nome, url, logo) explícitos; `dateModified` real.
- R6.2 `<time datetime>` nas datas; tempo de leitura estático; índice "Neste artigo" com
  âncoras nos `h2`.
- R6.3 Botão "Ouvir este artigo" (Web Speech API, pt-BR; oculto se não suportado).
- R6.4 "Enviar no WhatsApp" e "Copiar link" ao fim do artigo.
- R6.5 Artigo de perimenopausa linka o diário de sintomas.

### R7. Yoga (`yoga/index.html`)

- R7.1 Contraste dos botões e links (R1.3).
- R7.2 Carrossel sem autoplay contínuo: botão pausar/continuar, sem autoplay em
  `prefers-reduced-motion`; sem animação `goldenPulse` infinita; sem `spin` morto; legendas
  descritivas.
- R7.3 Modal de lista de espera substituído por link direto de WhatsApp; a citação do modal
  fica visível na página.
- R7.4 Seção `#respiracao`: respiração guiada de 3 minutos (círculo que cresce e encolhe, texto
  grande "Inspire / Segure / Solte", contador, iniciar/pausar; sem escala em reduced-motion).

### R8. Site inteiro, fase final (todas as páginas, `main.js`, `glass.js`, `styles.css`)

- R8.1 FAB com três opções: "Quero entender o que sinto" (`/#quiz`), "Falar no WhatsApp",
  "Ligar agora" (`tel:+5598981532153`).
- R8.2 Link "Pular para o conteúdo" em todas as páginas; `<main id="conteudo">`.
- R8.3 Botão de tamanho de fonte no cabeçalho (normal / grande / maior), persistido em
  `localStorage`, aplicado antes da pintura.
- R8.4 Botão do menu mobile com padding ≥ 44 px, ícones de menu/fechar inline (sem depender do
  feather), feather fixado em `feather-icons@4.29.2`, sem `focus:outline-none`.
- R8.5 Vidro: refração só em desktop com ponteiro fino; blur reduzido no celular.
- R8.6 Rodapé: "Site desenvolvido por" na mesma linha do copyright.
- R8.7 Convênio APCEF: checklist "O que levar no dia" com imprimir e enviar no WhatsApp.
- R8.8 Privacidade atualizada (sem Clarity/Meta; quiz com nome e WhatsApp opcionais; preferência
  de fonte em localStorage; nada de dados em checklists).
- R8.9 `sitemap.xml` com a página nova e `lastmod` real; entrada no `CHANGELOG.md`.

## Fora deste ciclo (dependem da cliente)

Vídeo e áudio da médica; canal de WhatsApp; página própria do quiz; campo "que dúvida você
quer ver respondida" (exige republicar o Apps Script); mudanças de rótulo do menu ("Pacotes",
"FAQ"); remoção da seção de ortomolecular da home.
