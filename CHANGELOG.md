# Changelog — Site Dra. Kerly Helena

Registro das atualizações do site (`drakerlyhelena.com.br`). Entradas mais recentes no topo.

> Lembrete de build/deploy: o CSS é Tailwind v4 (`input.css` → `output.css`). Sempre que mudar classes Tailwind no HTML/JS, rodar **`npm run build:css`** na pasta `DraKerly/` e **commitar o `output.css`**. Deploy via GitHub Pages (`.nojekyll`): só reflete após `git push`.

---

## [2026-07-12] Correções críticas: paleta unificada, analytics e SEO técnico

Correção de 5 problemas técnicos identificados em auditoria: paleta de cores divergente em duas páginas, analytics quebrado, sitemap incompleto e sinal de preço residual no JSON-LD.

### Paleta unificada (`/pacotes/` e `/privacy/`)
- Removido o Tailwind Play CDN (`cdn.tailwindcss.com`) e o `tailwind.config` inline com paleta divergente (`blush-500: #B5664E`, `charcoal: #2C2622` etc.) de `pacotes/index.html` e `privacy/index.html`.
- Adicionado `<link rel="stylesheet" href="/output.css">` nas duas páginas, no mesmo padrão já usado em `faq/index.html` e `yoga/index.html` — agora as 5 páginas do site usam a mesma paleta oficial do `@theme` (`input.css`).
- Corrigida a classe `hover:bg-blush-50` em `pacotes/index.html` (não existe no tema oficial, que só define `blush-100`–`500`) para `hover:bg-blush-100`.

### Analytics
- `faq/index.html` e `yoga/index.html`: o bloco de Google Analytics 4 estava comentado com placeholder `G-XXXXXXXXXX`. Substituído pelo snippet GA4 real e ativo (`G-GSWCEYS7QB`, mesmo usado na home), sem Clarity nem Meta Pixel.
- `index.html`: Microsoft Clarity e Meta Pixel estavam ativos com placeholders inválidos (`CLARITY_TAG_ID`, `META_PIXEL_ID`), gerando requisições 404 a cada visita. Comentados até que a Doutora forneça os IDs reais. O GA4 da home (`G-GSWCEYS7QB`) não foi alterado — continua ativo.

### SEO técnico
- `sitemap.xml`: adicionada a URL `/pacotes/` (changefreq monthly, priority 0.9), que estava faltando apesar de ser a principal página de conversão.
- JSON-LD `MedicalClinic` (`index.html` e `pacotes/index.html`): removido `priceRange: "$$$"` (regressão — sinal de preço havia voltado a aparecer). Em `pacotes/index.html`, removido também o sub-bloco `priceSpecification` (moeda) das Offers do `hasOfferCatalog`, que ficam só com nome e descrição.

### Verificação realizada
- `npm run build:css` sem erros (Tailwind v4.2.1); classes exclusivas de `pacotes/` (ex.: `scroll-mt-32`) confirmadas no `output.css` gerado.
- Todos os blocos `application/ld+json` alterados validados com `node -e "JSON.parse(...)"`.
- Varredura confirmou zero ocorrências de `cdn.tailwindcss.com`, `priceRange`/`priceSpecification`, "ortomolecular" ou "R$" nas páginas do site.

### Arquivos alterados
- `index.html`, `pacotes/index.html`, `privacy/index.html`, `faq/index.html`, `yoga/index.html`, `sitemap.xml`, `output.css`, `CHANGELOG.md`.

### SEO on-page e mídia social
- **Title da home** (`index.html`): `Dra. Kerly Helena - Ginecologia Integrativa` → `Dra. Kerly Helena | Ginecologia Integrativa em São Luís - MA` (60 caracteres, com localização).
- **Imagem OG dedicada**: gerada `assets/og-image.jpg` (1200×630, ~25 KB) a partir de `assets/_DSC2884.jpg`, com crop manual validado visualmente (rosto centralizado, sem corte). `og:image`/`twitter:image` de `index.html`, `faq/index.html` e `pacotes/index.html` passaram a apontar para ela (URL absoluta), com `og:image:width`/`og:image:height`/`og:image:type` adicionados; `og:image:alt` existentes mantidos. `og:image` do `yoga/index.html` não foi alterado (imagem própria do curso). Removido o comentário `TODO` da home referente a essa imagem. `pacotes/index.html` não tinha bloco Twitter Card — adicionado reaproveitando o `og:title`/`og:description` já existentes na página (nenhuma copy nova).
- **`srcset` do hero da home** (LCP): geradas 3 variantes WebP (`assets/_DSC2884-640.webp`, `-960.webp`, `-1280.webp`), proporção 4:5 preservada com o mesmo enquadramento facial do crop atual (`object-[center_25%]`). `<img>` do hero e o `<link rel="preload">` do LCP atualizados com `srcset`/`sizes` (e `imagesrcset`/`imagesizes` no preload) usando `sizes="(min-width:1024px) 30vw, (min-width:640px) 384px, calc(100vw - 3rem)"`, calculado a partir do grid de 12 colunas real da seção hero.
- **`theme-color`** (`#FDFCFB`) adicionado no `<head>` das 5 páginas do site.
- **`sitemap.xml`**: `lastmod` de `2026-07-12` adicionado nas 5 URLs.
- **Titles/descriptions**: title do FAQ encurtado de 67 para 58 caracteres (`FAQ - Medicina Integrativa em São Luís | Dra. Kerly Helena`); meta description da home encurtada de 183 para 157 caracteres, mantendo "São Luís - MA". Demais titles/descriptions já estavam dentro dos critérios (≤60 / ~140-160) e não foram alterados.

#### Arquivos criados
- `assets/og-image.jpg`, `assets/_DSC2884-640.webp`, `assets/_DSC2884-960.webp`, `assets/_DSC2884-1280.webp`.

#### Verificação realizada
- `node -e` com `sharp` confirmou `og-image.jpg` em 1200×630 (~25 KB, < 300 KB) e as 3 variantes do hero nas larguras 640/960/1280 com proporção 4:5 exata.
- Imagem `og-image.jpg` e variante `_DSC2884-960.webp` conferidas visualmente (rosto enquadrado, não cortado).
- `grep` confirmou `og-image.jpg` e `og:image:width` presentes em `index.html`, `faq/index.html` e `pacotes/index.html`; `srcset`/`imagesrcset` presentes em `index.html`; `theme-color` (1 ocorrência) nas 5 páginas; `lastmod` (5 ocorrências) em `sitemap.xml`.
- Todos os blocos `application/ld+json` das páginas tocadas revalidados com `JSON.parse`.
- Varredura confirmou zero ocorrências novas de "ortomolecular", "R$ " ou "priceRange" nas páginas do site.

### Robustez, limpeza e acessibilidade
- **Guard do GSAP** (`main.js`): se o CDN do GSAP falhar ou for bloqueado, o site não quebra mais. `gsap.registerPlugin(ScrollTrigger)`, `initHeroStagger()` e o reveal-on-scroll (`.gs-reveal`) agora rodam dentro de `if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined')`; menu mobile, smooth scroll, ano do rodapé e analytics continuam fora do guard (sempre executam). `transitionQuizStage()` e `runHealthFingerprint()` ganharam fallback sem animação (troca de estágio instantânea / resultado direto) quando `gsap` não está disponível.
- **Código morto removido**: `tailwind.config.js` (resquício do Tailwind v3 — o v4 usa o `@theme` do `input.css` e não lê esse arquivo; build confirmado byte-idêntico com e sem ele via `git hash-object`); o floating-menu antigo em `main.js` (`window.toggleFloatingMenu`, listener de click-outside e bloco `#floating-container`) — os elementos `#floating-menu`/`#floating-container`/`#floating-main-btn`/`#floating-btn-icon` não existem em nenhum HTML, o FAB atual é o `<details class="wa-fab">` (CSS puro); o comentário morto "Yoga Marquee Banner" em `index.html` (evento de 04/04 já passado); e o comentário órfão em `faq/index.html` que apontava para essa lógica removida.
- **CSS órfão removido** (`styles.css`): `.text-golden-glow`/`@keyframes shine`, `.animate-marquee`/`@keyframes marquee`, `.animate-pulse-fast`/`@keyframes pulse-fast`, `.bg-sage-soft`, `.bg-terracotta-soft`, `.bg-blush-soft`, `.dimension-badge`, `.text-terracotta`, `.anim-ring`, `.anim-line`, `.anim-figure` — todas com zero uso confirmado por grep em `.html`/`.js` antes da remoção. As variáveis `--sage` e `--terracotta` do `:root` também foram removidas por terem ficado sem nenhum uso. As classes ativas da animação do quiz (`.anim-aura`, `.anim-petal-outer`/`.anim-petal-inner`, `.anim-rose-pistil`, `.anim-particle`/`.anim-particles`) não foram tocadas.
- **Tokens de cor alinhados** (`styles.css` `:root`) à paleta oficial do `@theme` (`input.css`): `--charcoal` `#3d3330` → `#4A3B40`, `--blush-400` `#d4a395` → `#C7889D`, `--blush-100` `#f5ebe7` → `#F9EAEF`, `--sand-100` `#fdfaf8` → `#FDFCFB` (`--blush-500` já estava correto). Efeito visual sutil e desejado (bordas/hover do quiz).
- **`pacotes/index.html`**: cor de borda residual da paleta antiga do card da Jornada (`#D89A85`) trocada pelo blush-300 oficial (`#E0AEBE`).
- **`yoga/index.html`**: script do `feather-icons` passou a carregar com `defer` (antes bloqueava o parsing). Como `feather.replace()` era chamado de forma síncrona num `<script>` inline no fim do body, a chamada foi movida para dentro de um listener de `DOMContentLoaded` (que só dispara depois que os scripts `defer` já executaram), evitando um `ReferenceError` que interromperia o restante do script (incluindo o wiring do menu mobile).
- **Acessibilidade**: modal do quiz (`#symptom-modal`, `index.html`) ganhou `role="dialog"`, `aria-modal="true"` e `aria-labelledby="quiz-welcome-title"` (novo `id` adicionado ao `<h2>` do estágio de boas-vindas). Botão de menu mobile (`#mobile-menu-btn`) em `index.html`, `pacotes/index.html`, `faq/index.html` e `yoga/index.html` ganhou `aria-controls="mobile-menu"` e `aria-expanded="false"`; o JS de toggle de cada página (`main.js`, usado por home e FAQ; scripts inline em `pacotes` e `yoga`) passou a alternar `aria-expanded` entre `"true"`/`"false"` junto com a abertura/fechamento do menu. Sem focus trap completo (fora do escopo desta rodada).
- **SEO**: `og:title` e `twitter:title` do FAQ alinhados ao novo `<title>` (`FAQ - Medicina Integrativa em São Luís | Dra. Kerly Helena`), que uma correção anterior havia atualizado sem propagar para as meta tags sociais.

#### Verificação realizada
- `node --check main.js` sem erros de sintaxe.
- `git hash-object output.css` idêntico antes/depois da remoção do `tailwind.config.js`; arquivo confirmado inexistente.
- `grep` confirmou zero ocorrências de `toggleFloatingMenu`, `floating-container`, `floating-menu`, `floating-main-btn` em `main.js` e em todos os `.html` do site.
- `grep` confirmou zero ocorrências das classes CSS removidas fora de `styles.css`; `.anim-aura`, `.anim-petal-outer`/`.anim-petal-inner`, `.anim-rose-pistil`, `.anim-particle` seguem presentes em `styles.css`. Zero ocorrências de `D89A85`.
- `aria-expanded` presente em `index.html`, `pacotes/index.html`, `faq/index.html` e `yoga/index.html`; `role="dialog"` presente em `index.html`.
- `npm run build:css` final sem erros.
- Varredura confirmou zero ocorrências de "ortomolecular" ou "R$ " nas páginas do site.

#### Arquivos alterados / removidos
- Alterados: `main.js`, `styles.css`, `index.html`, `pacotes/index.html`, `faq/index.html`, `yoga/index.html`, `CHANGELOG.md`.
- Removidos: `tailwind.config.js`.

### Ajuste visual: header mobile
- **Header "oval descolado" no mobile** (`styles.css`): `.glass--header` usa `border-radius: 9999px` (pílula "dynamic island") em todos os breakpoints. Abaixo de 768px — onde existe o botão hambúrguer —, isso destoava do painel do menu (`#mobile-menu`, `rounded-3xl` = 24px), dando a impressão de um "óvulo" descolado do dropdown. Adicionada a regra `@media (max-width: 767px) { .glass--header { border-radius: 1.5rem; } }` logo após o bloco `.glass--header`, para o header usar o mesmo raio de 24px do dropdown no mobile (fechado e aberto ficam visualmente coesos). Desktop (≥768px, sem hambúrguer) não foi alterado — pílula 9999px mantida de propósito.

#### Verificação realizada
- Screenshots via `puppeteer-core` (Chrome local, `scripts/dev-server.js`) em `375×812`: header com cantos de 24px de menu fechado, e header + dropdown com o mesmo raio de menu aberto — conferidos visualmente.
- Screenshot em `1280×800`: pílula 9999px do desktop sem alteração (`getComputedStyle` confirmou `border-radius: 9999px`).
- `git diff styles.css` isolado à nova regra (nenhuma outra linha tocada); nenhuma classe Tailwind alterada, então `output.css` não foi regenerado (hash SHA-256 conferido idêntico antes/depois).

#### Arquivos alterados
- `styles.css`, `CHANGELOG.md`.

### Rodada 2: imagens responsivas, favicons e limpeza de assets

Segunda rodada da mesma data: `srcset`/`sizes` nas imagens de conteúdo que ainda pesavam mais de 80 KB, padronização do favicon/apple-touch-icon e arquivamento dos assets sem uso para fora do repositório.

- **Imagens responsivas** (`index.html`, `yoga/index.html`): geradas variantes WebP em 640/960/1280px (`quality: 80`, resize por largura preservando a proporção da fonte — sem replicar crop, o `object-cover` do CSS continua cuidando do enquadramento visual) para as 7 imagens de conteúdo acima de 80 KB: `assets/_DSC2944.webp` (Sobre Mim), `assets/_DSC4966.webp` e `assets/_DSC4968.webp` (galeria "O Espaço" da home), `assets/ambiente/_DSC4966.webp`, `_DSC4976.webp`, `_DSC4981.webp` e `_DSC4970.webp` (carrossel "O Espaço" do Yoga) — fonte de cada variante é o `.jpg` original de câmera correspondente, auto-orientado via EXIF (`.rotate()`, mesmo padrão de `scripts/convert-to-webp.js`). `srcset`/`sizes` adicionados mantendo `loading="lazy"`, `width`/`height` e classes existentes; `sizes` calculado a partir do layout real de cada seção — `(min-width: 1024px) 456px, (min-width: 768px) calc(50vw - 3.5rem), calc(100vw - 3rem)` para "Sobre Mim" (grid 2 colunas em `max-w-5xl`), `(min-width: 1152px) 536px, (min-width: 768px) calc(50vw - 2.5rem), calc(100vw - 3rem)` para a galeria da home (grid 2 colunas em `max-w-6xl`), `(min-width: 768px) 600px, 80vw` para os slides do carrossel Swiper do Yoga (`w-4/5 md:w-[600px]`).
- Imagens ≤80 KB deixadas como estavam, sem `srcset`: `assets/_DSC4964.webp` (36 KB) e `assets/_DSC4972.webp` (46 KB) na home; `assets/Kerly.webp` (35 KB), `assets/Marina.webp` (32 KB), `assets/ambiente/_DSC4972.webp` (63 KB) e `assets/ambiente/_DSC4982.webp` (61 KB) no Yoga. `assets/_DSC2944.webp` estava a 78,1 KB (bem no limiar dos 80 KB) e foi tratado como acima do limite por segurança. Hero da home (`assets/_DSC2884.webp`) não foi tocado — `srcset` já implementado em rodada anterior.
- **Favicon e apple-touch-icon**: gerados com `sharp` `assets/favicon.png` (512×512, recodificado a partir de `assets/Favicon/Favicon Kerly.png`, descartando o metadata XMP do Canva embutido no PNG original) e `assets/apple-touch-icon.png` (180×180, fundo sólido `#FDFCFB` sem transparência via `.flatten()` + `.removeAlpha()`, arte centralizada com ~12% de padding). Nas 5 páginas, `<link rel="icon">` passou a apontar para `/assets/favicon.png` e ganhou um `<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">` logo em seguida; o `<img>` do logo no header (`index.html`, `pacotes/index.html`, `faq/index.html`, `yoga/index.html`) também foi padronizado para `/assets/favicon.png` (a home usava caminho relativo com espaço no nome do arquivo, `assets/Favicon/Favicon%20Kerly.png`; as internas já eram absolutas mas igualmente apontavam para o arquivo antigo). `privacy/index.html` não tem logo no header, só o `<link rel="icon">`.
- **Limpeza de assets não usados**: script levantou todo caminho `assets/...` referenciado (`src`, `srcset`, `href`, meta/JSON-LD, com `%20` decodificado) nas 5 páginas + os 4 stubs de redirect; tudo fora dessa lista foi **movido** (não apagado) para `C:\Projetos Antigravity\Projeto Kerly\assets-backup-2026-07-12\`, fora do repositório, preservando a estrutura de subpastas. 35 arquivos movidos (115,3 MB): os 22 JPGs originais de câmera da raiz de `assets/` e os 6 de `assets/ambiente/` (as variantes WebP já cobrem o uso real), a pasta `assets/Favicon/` inteira (substituída por `assets/favicon.png`) e a pasta `assets_em_uso/` inteira (6 JPGs, resquício do pipeline antigo, não referenciada por nenhum HTML). As pastas `assets/Favicon/` e `assets_em_uso/` ficaram vazias e foram removidas; `assets/` caiu de 92 MB (70 arquivos) para 3,3 MB (41 arquivos). `scripts/convert-to-webp.js` não foi alterado — as fontes `.jpg` que ele referencia seguem disponíveis no backup.

#### Verificação realizada
- Script Node extraiu todas as referências `assets/...` (decodificando `%20`) dos 5 HTMLs, incluindo cada URL dentro de `srcset`/`imagesrcset`: 51 referências (41 arquivos únicos), **zero** faltando em disco.
- `sharp` `metadata()` confirmou a largura nominal (640/960/1280) de cada uma das 21 variantes geradas, e `apple-touch-icon.png` em exatamente 180×180 com `hasAlpha: false` (3 canais).
- Dev server (`node scripts/dev-server.js --no-watch`) + `puppeteer-core` (Chrome local) carregaram `/`, `/yoga/` e `/pacotes/` com todas as `<img loading="lazy">` forçadas a carregar: **zero** respostas HTTP ≥400 em qualquer URL `/assets/` (18 requisições de imagem observadas no total). As duas únicas falhas de rede do teste (`google-analytics.com/g/collect` e o iframe do Google Maps, ambas `net::ERR_ABORTED` pelo fechamento da página) são chamadas de terceiros sem relação com os assets do site. Screenshot da galeria "O Espaço" da home (`audit-screenshots/o-espaco-gallery.png`, gitignored) confirmou as 4 fotos renderizando corretamente.
- `git status --short` conferido: só os 5 HTMLs modificados, os 21 WebPs + `favicon.png` + `apple-touch-icon.png` untracked, e os 35 arquivos movidos aparecendo como deletados — exatamente o esperado (nada commitado).

#### Arquivos alterados / criados
- Alterados: `index.html`, `yoga/index.html`, `pacotes/index.html`, `faq/index.html`, `privacy/index.html`, `CHANGELOG.md`.
- Criados: 21 variantes WebP (`assets/_DSC2944-{640,960,1280}.webp`, `assets/_DSC4966-{640,960,1280}.webp`, `assets/_DSC4968-{640,960,1280}.webp`, `assets/ambiente/_DSC4966-{640,960,1280}.webp`, `assets/ambiente/_DSC4976-{640,960,1280}.webp`, `assets/ambiente/_DSC4981-{640,960,1280}.webp`, `assets/ambiente/_DSC4970-{640,960,1280}.webp`), `assets/favicon.png`, `assets/apple-touch-icon.png`.
- Movidos para backup fora do repo (aparecem como deletados no `git status`, não commitados): 35 arquivos — ver "Limpeza de assets não usados" acima.

### Rodada 2b: 404, robustez do FAQ e focus trap

Terceira rodada da mesma data: página 404 personalizada, guard do GSAP no acordeão do FAQ (mesmo padrão de fallback já usado no restante do site) e focus trap completo no modal do quiz.

- **Página `404.html`** (nova, raiz do repo — GitHub Pages serve automaticamente em URLs inexistentes): `<head>` no mesmo padrão das outras páginas (GA4 real `G-GSWCEYS7QB`, favicon/apple-touch-icon novos, Google Fonts, `/styles.css` + `/output.css`, `theme-color #FDFCFB`, `robots: noindex, follow`). Corpo minimalista sem header/nav (como `/privacy/`): fundo `bg-sand-100` centrado vertical, logo (`/assets/favicon.png`, 64px), eyebrow "404", título serif "Esta página *não existe*." (`<em>` em blush itálico, mesmo padrão dos títulos do site), uma frase acolhedora curta, dois CTAs (botão pílula "Voltar ao início" para `/` e link sublinhado "Falar no WhatsApp") e rodapé mínimo com CRM/RQE. Sem JavaScript além do GA4.
- **Guard do GSAP no acordeão do FAQ** (`faq/index.html`): `openItem()`/`closeItem()` (script inline que anima o acordeão) lançavam `ReferenceError` se o CDN do GSAP falhasse, matando o restante do bloco. Seguindo o mesmo padrão de `transitionQuizStage()` em `main.js`, as chamadas `gsap.to(...)` agora ficam atrás de `if (typeof gsap === 'undefined') { ...fallback...; return; }`, com o toggle de classe (`item.classList.add/remove('active')`) sempre incondicional. No fallback, os `style` inline (`maxHeight`, `transform`, `backgroundColor`, `color`, `boxShadow`) são aplicados/limpos diretamente — como `.faq-content-wrapper` e `.faq-icon-wrapper` já têm `transition-all duration-500` do Tailwind, o acordeão continua abrindo/fechando com uma transição suave mesmo sem GSAP. Comportamento com GSAP presente não foi alterado.
- **Focus trap no modal do quiz** (`#symptom-modal`, `main.js` + `index.html`): ao abrir (`openSymptomModal`), o elemento com foco é salvo em `modalPreviouslyFocusedEl` e o foco move para `#symptom-modal-content` (novo `tabindex="-1"` no HTML), com `try/catch` no mesmo estilo de `showIntroSubstep`. Um listener de `keydown` em `#symptom-modal` (registrado uma única vez, em `wireModalFocusTrap()`, chamado do `DOMContentLoaded`) prende o `Tab`: calcula os elementos focáveis visíveis (`a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])`, filtrando por `offsetParent !== null` para ignorar estágios `.hidden`) e cicla Shift+Tab no primeiro → último e Tab no último → primeiro (também prende o Shift+Tab imediato a partir do próprio container, que não está na lista de focáveis). `Escape` chama `closeSymptomModal()`. Ao fechar, o foco volta ao elemento salvo, se ainda existir no DOM (`document.body.contains`).

#### Verificação realizada
- `node --check main.js` e `node --check` no script do acordeão do FAQ (extraído para arquivo temporário) sem erros de sintaxe.
- `npm run build:css`: hash do `output.css` mudou (`git hash-object`: `9fb77da…` → `63910f2…`) — a nova classe `.gap-5` (grupo dos CTAs do 404) não estava compilada antes; confirmado via `git diff --word-diff` isolado a essa e outras classes novas do 404.
- Dev server (`node scripts/dev-server.js --no-watch`) + `puppeteer-core` (Chrome local):
  - `/404.html` em 375×812 e 1280×800: sem overflow horizontal (`scrollWidth === clientWidth` nos dois), layout centrado conferido visualmente nos dois screenshots.
  - Home: clique no botão "Quero entender o que sinto" abriu o modal com foco em `#symptom-modal-content`; 15 `Tab` consecutivos alternaram entre o botão fechar (×) e "Começar agora" — os dois únicos elementos focáveis do estágio de boas-vindas — sem nunca sair de `#symptom-modal` (`modal.contains(document.activeElement)` true nas 15 checagens). `Escape` fechou o modal e devolveu o foco exatamente ao botão de origem ("Quero entender o que sinto").
  - `/faq/` com GSAP presente: abrir a pergunta 1 (`maxHeight` anima até ~1000px), abrir a pergunta 2 (fecha a 1 automaticamente, acordeão) e fechar a 2 — comportamento idêntico ao anterior, sem regressão.
  - `/faq/` com `cdnjs.cloudflare.com` bloqueado (request interception): `typeof gsap === 'undefined'` confirmado; acordeão abriu (`max-height: 1000px`, conteúdo visível) e fechou (`max-height: 0px`) normalmente via fallback; console só registrou os 2 `net::ERR_FAILED` esperados dos scripts bloqueados, nenhuma exceção relacionada a `gsap`.
- `grep -in "ortomolecular\|R\$ "` em `404.html`: zero ocorrências.
- `git status --short` conferido: `404.html` novo; `faq/index.html`, `index.html`, `main.js`, `output.css` e `CHANGELOG.md` modificados, além do que a rodada anterior já havia deixado no working tree.

#### Arquivos alterados / criados
- Criados: `404.html`.
- Alterados: `faq/index.html`, `index.html`, `main.js`, `output.css`, `CHANGELOG.md`.

### Fix: caminhos relativos para visualização local

Bug reproduzido: a Doutora confere o site abrindo os HTML direto do disco (`file://`), onde caminhos absolutos (`/assets/...`, `/styles.css`, `/output.css`, `/glass.js`, `/main.js`) resolviam para a raiz do drive `C:\` em vez da pasta do site — o logo do header sumia na home e as páginas internas sempre renderizaram quebradas via `file://`. Em produção (GitHub Pages, site na raiz do domínio) e no dev-server os caminhos absolutos funcionavam normalmente, então o fix precisava preservar esse comportamento — relativização por profundidade da página, não substituição cega.

- **`index.html`** (raiz): `/assets/favicon.png` → `assets/favicon.png` (`<link rel="icon">`, `<link rel="apple-touch-icon">` e `<img>` do logo do header) e `/glass.js` → `glass.js`. Demais assets locais já eram relativos (`styles.css`, `output.css`, `main.js`, imagens de conteúdo).
- **`pacotes/index.html`, `faq/index.html`, `yoga/index.html`, `privacy/index.html`** (1 nível abaixo da raiz): todo asset local absoluto trocado para `../`: favicon/apple-touch-icon, logo do header (`pacotes`, `faq`, `yoga` — `privacy` não tem logo no header), `/styles.css` → `../styles.css`, `/output.css` → `../output.css`, `/glass.js` → `../glass.js` e `/main.js` → `../main.js` (só existe em `faq/index.html`). Em `yoga/index.html`, também as imagens de conteúdo (`Kerly.webp`, `Marina.webp`, as 6 fotos do carrossel "Nosso Ambiente" e cada URL dentro de `srcset`).
- **Não alterados, de propósito**: `404.html` (fica 100% absoluto — o GitHub Pages serve essa página em qualquer rota inexistente, ex. `/a/b/`, onde caminhos relativos quebrariam); URLs completas `https://...` (og:image, twitter:image, canonical, JSON-LD, Google Fonts/CDNs); links de navegação (`href="/"`, `/pacotes/`, `/faq/`, `/yoga/`, `/privacy/`, `/#hero`, `/?quiz=1` etc. — corretos em produção, navegação via `file://` fora do escopo); `sitemap.xml`, `robots.txt`; `main.js` não referencia assets por caminho (confirmado via grep).

#### Verificação realizada
- `puppeteer-core` (Chrome local) abrindo as 5 páginas via `file:///...DraKerly/...`: zero requisições `file://` falhas em todas, logo do header com `naturalWidth: 512` nas 4 páginas que têm header (`index`, `pacotes`, `faq`, `yoga`), `getComputedStyle(document.body).fontFamily` = `"Lato, sans-serif"` nas 5.
- Dev server (`node scripts/dev-server.js --no-watch`) + `puppeteer-core`: as 5 páginas + `/404.html` carregadas via `http://localhost:5500/`, zero respostas ≥400 e zero requisições falhas em qualquer asset local — confirma que a relativização não quebrou o modo servido/produção.
- `grep` confirmou zero `src="/` ou `href="/styles|/output|/glass|/main|/assets` restantes nas 4 páginas internas e na home; `404.html` mantém todos os absolutos originais (não tocado).
- `git diff --stat`: só os 5 HTMLs esperados modificados (além do que rodadas anteriores já haviam deixado no working tree); `404.html` intocado.

#### Arquivos alterados
- `index.html`, `pacotes/index.html`, `faq/index.html`, `yoga/index.html`, `privacy/index.html`, `CHANGELOG.md`.

---

## [2026-06-03] Remoção dos valores de consulta e da Medicina Ortomolecular

A pedido da Doutora, o site deixou de **exibir valores de consulta** e a **medicina ortomolecular** foi removida por completo.

### Valores da consulta (removidos)
- **Home**: removido o badge `R$ 600 · valor promocional` + "válido por tempo limitado" do card de resultado do quiz (rótulo "O ponto de partida" mantido).
- **Home (JSON-LD `MedicalClinic`)**: removidos `priceRange` e o bloco `hasOfferCatalog` (que continha `price: 600.00`).
- **FAQ**: removida a pergunta "Quanto custa a consulta?" (acordeão + `FAQPage` JSON-LD).

### Medicina Ortomolecular (removida)
- **Home**: excluída a seção `#ortomolecular`, os dois links de navegação (desktop + mobile), o item `MedicalTherapy "Medicina Ortomolecular"` do JSON-LD `Physician` e todas as menções em `<title>`, meta description, Open Graph, Twitter e descrição do JSON-LD. Título voltou a `Dra. Kerly Helena | Ginecologia Integrativa em São Luís - MA`.
- **FAQ**: removida a pergunta de ortomolecular (acordeão + JSON-LD) e os links de navegação.
- **Arquivos excluídos**: `ortomolecular/index.html` e o stub de redirect `ortomolecular.html`.
- `sitemap.xml`: removida a URL `/ortomolecular/`.
- `scripts/mobile-audit.js`: página removida da lista de auditoria.

### Verificação realizada
- `npm run build:css` sem erros (Tailwind v4.2.1); `output.css` regenerado.
- Os 3 blocos `application/ld+json` (`index`, `faq`) validados com `JSON.parse` — sem vírgulas órfãs após a remoção dos itens.
- Varredura confirmou **zero** referências residuais a "ortomolecular", "R$ 600", "valor promocional", "priceRange" ou "hasOfferCatalog" nas páginas servidas.

### Arquivos alterados / removidos
- Alterados: `index.html`, `faq/index.html`, `sitemap.xml`, `scripts/mobile-audit.js`, `output.css`, `CHANGELOG.md`.
- Removidos: `ortomolecular/index.html`, `ortomolecular.html`.

---

## [2026-06-01] Correções de layout, WhatsApp, Medicina Ortomolecular e SEO

Rodada de **correções + polimento** mantendo a identidade visual atual (blush/areia + Playfair/Lato). Foco: resolver sobreposições relatadas, facilitar o contato por WhatsApp, adicionar a especialização em **medicina ortomolecular** e reforçar o SEO local de São Luís - MA.

### Correções de bugs (sobreposição e alinhamento)
- **Botão fixo cobrindo o texto (causa raiz do "card em cima das palavras")**: os botões flutuantes opacos com rótulo longo cobriam o conteúdo no mobile.
  - Removida a pílula redundante do topo da home (`#sticky-cta`, `top-[82px]`).
  - Botões flutuantes agora são **círculo compacto** (só ícone no mobile; rótulo reaparece a partir de `sm:`) em `index`, `faq`, `yoga` e `ortomolecular`.
- **Card flutuante do hero** (home): movido para dentro da foto (`bottom-4 left-4`) para não invadir a coluna de texto no desktop.
- **Modal do quiz** (home): botão fechar elevado acima da animação (z-index `60` → `80`; removido `z-[70]` do estágio de animação); alvo de toque do fechar aumentado (`p-2` → `p-2.5`); reset de scroll passou a mirar o contêiner correto (`#quiz-scroll-area`) em `main.js`.
- **Carrossel do Yoga**: setas de navegação ocultas no mobile (`@media (max-width:767px)`) para não cobrirem a foto — navegação por swipe + paginação.
- **Rodapé com "© 2024"** desatualizado em `faq` e `yoga`: agora ano dinâmico.
- **Travessões (—)** trocados por pontuação mais limpa em copies de UI (opções do quiz, citações, "São Luís - MA").

### WhatsApp / contato
- Um botão flutuante limpo e sempre acessível por página, sem cobrir texto. Caminho direto para o WhatsApp preservado (`wa.me/5598981532153`); a página de ortomolecular abre com mensagem pré-preenchida.

### Medicina Ortomolecular (conteúdo + SEO)
- Nova **seção na home** (`#ortomolecular`) com layout assimétrico (distinto dos grids de cards).
- Nova **página dedicada `/ortomolecular/`** (mobile-first, on-brand): o que é, como apoia a saúde da mulher, como funciona (passos 01/02/03), nota de transparência ética, mini-FAQ e CTA. Stub de redirect `ortomolecular.html`.
- Nova pergunta sobre ortomolecular no **FAQ** (acordeão + `FAQPage` JSON-LD).
- `sitemap.xml` atualizado com `/ortomolecular/`; link na navegação (home, faq, página).
- **Enquadramento ético/CFM**: descrito como abordagem **complementar** ("não substitui", individualizada, baseada em exames). O CFM não reconhece ortomolecular como especialidade isolada — por isso evitamos a palavra "especialidade".

### SEO
- **Título da home**: `Dra. Kerly Helena | Ginecologia Integrativa e Ortomolecular em São Luís - MA`.
- Meta description, Open Graph e Twitter atualizados com ortomolecular + localização.
- JSON-LD do `Physician`: adicionados `address` (PostalAddress) e `alternateName` (incl. "Dra. Kerley").
- Microsoft Clarity e Meta Pixel (que estavam com placeholder inválido) **comentados**, com instrução para ativar quando houver os IDs reais.

### Verificação realizada
- `npm run build:css` sem erros (Tailwind v4.2.1); classes novas confirmadas no `output.css` (auto-detecção v4 varre subpastas).
- Auditoria mobile (`scripts/mobile-audit.js`, 375 e 414px): `index`, `faq` e `ortomolecular` **sem overflow horizontal**. Overflow do Yoga é o carrossel coverflow já existente, contido por `overflow-x-hidden`.
- Conferência visual por screenshots (`audit-screenshots/`): nova página renderiza, botão compacto na FAQ, sem pílula no topo da home, seção ortomolecular no lugar, IDs de seção únicos. Fluxo do quiz rodou de ponta a ponta sem erros.

### Pendências (dependem da Doutora)
- Validar o texto do ortomolecular e informar **credenciais reais** (curso/instituição; RQE só se aplicável).
- Fornecer **Meta Pixel ID** e **Microsoft Clarity ID** se quiser reativar esse rastreamento.
- **Google Meu Negócio** (já verificado): reforçar categorias (Ginecologista + secundárias), descrição com "medicina integrativa, ortomolecular, saúde da mulher, São Luís", fotos do consultório, horário, link do site/WhatsApp, e pedido/resposta de avaliações.

### Arquivos alterados / criados
- Alterados: `index.html`, `faq/index.html`, `yoga/index.html`, `main.js`, `output.css`, `sitemap.xml`, `scripts/mobile-audit.js`.
- Criados: `ortomolecular/index.html`, `ortomolecular.html`.
