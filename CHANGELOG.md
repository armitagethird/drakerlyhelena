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
