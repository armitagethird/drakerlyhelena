# Públicos e interatividade: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar o site drakerlyhelena.com.br mais legível para o público mais velho e mais interativo (de forma útil) para todos, sem perder SEO, conforme o spec.

**Architecture:** Site estático (HTML + Tailwind v4 compilado + JS puro + GSAP via CDN). Cada tarefa é dona de um conjunto de arquivos; tarefas da Fase 2 rodam em paralelo e não tocam arquivos umas das outras. A Fase 1 (legibilidade global) roda antes e a Fase 3 (cabeçalho, rodapé, FAB, sitemap, changelog) roda depois, porque tocam todas as páginas.

**Tech Stack:** HTML5, Tailwind CSS v4 (`npm run build:css` gera `output.css`), JavaScript vanilla (`main.js`, `glass.js`, scripts inline por página), GSAP 3 (CDN), feather-icons (CDN), Node 24 para scripts de verificação (`npm test`) e screenshots (`npm run shot`).

**Spec:** `docs/superpowers/specs/2026-09-28-publicos-interatividade-design.md` (leia antes de executar qualquer tarefa; o spec manda sobre o plano em caso de conflito).

## Global Constraints

- Branch de trabalho: `mudancas-do-fable-5.1-28-09-2026`. Nunca `git merge`, nunca `git push`, nunca trocar de branch. Só `git add <caminhos explícitos>` + `git commit`.
- Mensagens de commit em português, sem acentos, sem trailer de coautoria de IA (nada de `Co-Authored-By`). Se o commit falhar por `index.lock` (outro agente commitando), espere 5 s e tente de novo, até 5 vezes.
- Só edite os arquivos listados em **Files** da sua tarefa. Nunca edite `docs/`, `scripts/`, `.gitignore`, `package.json`.
- Nunca exibir preços ou valores; nenhuma promessa de resultado (sem "cura", "garante", "elimina", "definitivo", antes e depois); nunca reintroduzir "não reconhece", "apenas complementar", "não substitui".
- Nenhuma dependência nova, nenhum CDN novo, nenhum framework. JS puro, progressive enhancement: todo conteúdo novo existe no HTML sem JS.
- Preservar URLs, canonicals, `<title>`, meta description e tipos JSON-LD existentes. Perguntas do `FAQPage` devem continuar idênticas ao texto visível.
- Tokens de cor novos (definidos na Tarefa 1 em `input.css`): `--color-blush-600: #8E4F66`, `--color-blush-700: #7A4257`, `--color-yoga-gold-deep: #8A6D12`.
- Legibilidade: sem `font-light` em `p/li/dd/label/figcaption`; opacidade de texto mínima `/80`; sem `text-[10px]`/`text-[11px]`; sem `text-blush-400`; parágrafos ≥ `text-base`; controles com alvo ≥ 44 px; `prefers-reduced-motion` respeitado em toda animação JS.
- Classes Tailwind novas exigem `npm run build:css`; commite `output.css` junto.
- Verificação mínima de toda tarefa: `npm test` sem NENHUM erro nos arquivos da sua tarefa (erros em arquivos de outras tarefas podem restar até as tarefas irmãs terminarem; cite-os no relatório) e screenshot da(s) página(s) alterada(s) via `npm run shot -- --url <path> --out audit-screenshots/<nome>.png` sem `pageerror`/`console.error`. Passe `--url` SEM a barra inicial (`--url faq/`, `--url menopausa/diario-de-sintomas/`, `--url index.html` para a home): o Git Bash converte `/faq/` em caminho Windows. Servidor local: `PORT=<porta única> node scripts/dev-server.js --no-watch` em background (use a porta indicada na tarefa) e `--base http://127.0.0.1:<porta>` no shot. Abra as imagens com a ferramenta Read e descreva o que viu no relatório.
- Números e telefone da clínica: WhatsApp `5598981532153`; endereço "Av. Coronel Colares Moreira, Sala 310, Condomínio Edifício Monumental, Jardim Renascença, São Luís, MA, CEP 65065-720"; coordenadas `-2.5016951,-44.2886734`; horário "Segunda a sexta, das 08h às 18h, exclusivamente com hora marcada".

## Review Focus

1. Uma leitora de 62 anos com óculos de leitura no celular: todo texto informativo em 16 px ou mais, peso 400, contraste ≥ 4,5:1 (Tarefa 1; `npm test` cobre classes e tokens).
2. Quem termina o quiz sem preencher dados: vê o resultado completo e consegue agendar pelo WhatsApp com o resumo na mensagem (Tarefa 2, passos 2.9 e 2.10).
3. Quem chega ao FAQ por um link com hash: a pergunta abre sozinha; a busca sem resultado mostra estado vazio e limpar a busca restaura tudo (Tarefa 4, passo 4.6).
4. Navegador sem Web Speech API: o botão "Ouvir este artigo" não aparece e nada quebra (Tarefa 5, passo 5.5).
5. Página interna com FAB: "Quero entender o que sinto" leva à home e abre o quiz sem erro de console (Tarefa 2, passo 2.11; Tarefa 7, passo 7.2).

---

### Task 1: Legibilidade global (peso, opacidade, tamanho e contraste) em todas as páginas

**Files:**
- Modify: `input.css` (tokens), `styles.css` (`.glass--cta`, `.headline-editorial`), `index.html`, `medicina-integrativa/index.html`, `menopausa/index.html`, `ortomolecular/index.html`, `convenio-apcef/index.html`, `pacotes/index.html`, `faq/index.html`, `yoga/index.html`, `blog/index.html`, `blog/primeira-consulta-ginecologia-integrativa/index.html`, `blog/sinais-perimenopausa/index.html`, `blog/yoga-na-menopausa/index.html`, `privacy/index.html`, `404.html`, `output.css` (gerado).
- Test: `npm test` (`scripts/verify-site.js`), screenshots.

**Interfaces:**
- Produces: tokens `blush-600`, `blush-700`, `yoga-gold-deep` no `@theme` de `input.css`; classes `text-blush-600`, `bg-blush-600`, `hover:bg-blush-700`, `text-yoga-gold-deep`, `bg-yoga-gold-deep` disponíveis no `output.css` para todas as tarefas seguintes.

- [ ] **Step 1: Ver a linha de base**

Run: `npm test`
Expected: FALHOU com erros de "token ausente", "texto de 10-11px", "opacidade de texto abaixo de /80", "text-blush-400", "font-light em texto de corpo". Anote a contagem.

- [ ] **Step 2: Tokens em `input.css`**

Dentro do bloco `@theme { ... }`, logo após `--color-blush-500: #A9637B;`, adicione:

```css
    --color-blush-600: #8E4F66;   /* texto e botões: ~5,9:1 sobre sand/nude */
    --color-blush-700: #7A4257;   /* hover de botão */
```

Após `--color-yoga-gold: #C5A028;` adicione:

```css
    --color-yoga-gold-deep: #8A6D12; /* texto e botões da página Yoga: ~4,9:1 sobre branco */
```

Remova de `input.css` o bloco `.headline-editorial:hover { letter-spacing: -0.01em; }` (efeito de hover no título, spec R2.6). Mantenha `.headline-editorial em`.

- [ ] **Step 3: `styles.css`**

Troque o CTA do cabeçalho:

```css
.glass--cta {
    background: rgba(142, 79, 102, 0.92);   /* blush-600 */
    border-color: rgba(255, 255, 255, 0.35);
}
.glass--cta:hover { background: rgba(122, 66, 87, 0.94); }   /* blush-700 */
```

Remova o bloco `/* Fluid Letter Hover Animation */ @media (hover: hover) and (pointer: fine) { .hover-char ... }` inteiro (spec R2.6).

- [ ] **Step 4: Substituições mecânicas em TODOS os HTML listados**

Aplique, em ordem, em cada arquivo (use um script Node ou sed; confira o resultado com `git diff --stat`):

1. `font-light` removido da `class` de `<p>`, `<li>`, `<dd>`, `<label>`, `<figcaption>`, `<a>`, `<button>`, `<span>` que contenham texto de leitura. Mantenha `font-light` apenas em `h1/h2/h3` e em `<em>` dentro de títulos.
2. `text-charcoal/40`, `/45`, `/50`, `/55`, `/60`, `/65`, `/70` → `text-charcoal/80`. Idem `text-yoga-dark/…` → `text-yoga-dark/80` e `text-white/40..70` → `text-white/90`. Inclui variantes com prefixo (`hover:text-charcoal/70` → `hover:text-charcoal`).
3. `text-blush-400` → `text-blush-600`, exceto em elementos com `text-3xl` ou maior (números decorativos "01/02/03"), onde vira `text-blush-500`.
4. `text-blush-500` em elementos de texto que não sejam `h1/h2/h3`, `<i data-feather>` ou `<svg>` → `text-blush-600`. Inclui `hover:text-blush-500` → `hover:text-blush-600`.
5. Botões e links-botão `bg-blush-500 hover:bg-blush-400` → `bg-blush-600 hover:bg-blush-700`. Qualquer `hover:bg-blush-400` restante → `hover:bg-blush-700`.
6. `text-[10px]` e `text-[11px]` → `text-xs`.
7. `<p class="text-xs …">`, `<figcaption class="text-xs …">`, datas e legendas com `text-xs` → `text-sm`. Rótulos em caixa alta (eyebrows com `uppercase tracking-…`) podem ficar em `text-xs`.
8. `<p class="text-sm …">` dentro de `<main>` → `text-base` (respostas do FAQ, descrições de cards, textos de passos). Chips e badges curtos podem ficar em `text-sm`.
9. Em `index.html`, remova o bloco do scroll hint: o `<div>` que contém "Role para explorar" (classe `gs-hero-scrollhint`).
10. Em `yoga/index.html`, no `<style>` inline: `.text-yoga-gold-dark { color: #8A6D12; }`, `.bg-yoga-gold { background-color: #8A6D12; }`, `.bg-yoga-gold:hover { background-color: #7A5F0F; }`; adicione `.text-yoga-gold-deep { color: #8A6D12; }`. Troque `text-yoga-gold` por `text-yoga-gold-deep` em links, botões e rótulos de texto (mantenha `text-yoga-gold` só em ícones e no `<span>` do título `Íntima Feminina`, que é texto grande). Troque `hover:bg-yellow-600` por `hover:bg-[#7A5F0F]`.

- [ ] **Step 5: Rebuild e verificação**

Run: `npm run build:css && npm test`
Expected: `OK: N paginas verificadas, 0 erros`. Se sobrar erro, corrija o arquivo apontado.

Run (dev server na porta 5601): `PORT=5601 node scripts/dev-server.js --no-watch &` e depois `npm run shot -- --base http://127.0.0.1:5601 --url index.html --out audit-screenshots/t1-home.png --scroll 900`, idem `--url faq/`, `--url yoga/`, `--url menopausa/`.
Expected: texto de corpo visivelmente mais escuro, botões rosa mais profundos, nenhum `pageerror`. Abra as imagens (Read) e confira.

- [ ] **Step 6: Commit**

```bash
git add input.css styles.css output.css index.html 404.html medicina-integrativa/index.html menopausa/index.html ortomolecular/index.html convenio-apcef/index.html pacotes/index.html faq/index.html yoga/index.html blog/index.html blog/primeira-consulta-ginecologia-integrativa/index.html blog/sinais-perimenopausa/index.html blog/yoga-na-menopausa/index.html privacy/index.html
git commit -m "Legibilidade: peso 400, opacidade minima, texto minimo de 12px e tokens de contraste em todas as paginas"
```

---

### Task 2: Home e quiz (resultado antes dos dados, affordances, endereço, fechamento)

**Files:**
- Modify: `index.html`, `main.js`, `styles.css`, `input.css` (só se precisar de keyframe), `output.css` (gerado).
- Test: `npm test`, screenshots e fluxo do quiz via `--eval`.

**Interfaces:**
- Consumes: tokens da Tarefa 1; anchor `/yoga/#respiracao` (criado pela Tarefa 6) para o card "Respiração & Meditação".
- Produces: `window.openSymptomModal(options)` com `options.presetIndex` (índice da pergunta a exibir primeiro); função `buildWhatsappMessage()`; home abre o quiz com `location.hash === '#quiz'` ou `?quiz=1`; `<main id="conteudo">` NÃO é desta tarefa (Tarefa 7).

- [ ] **Step 2.1: Lista "Talvez você esteja aqui porque" (index.html + styles.css)**

Em `styles.css`, na regra `.desire-item`: adicione `border-radius: 1rem; padding: 1.1rem 1rem;` e um estado ativo `background: rgba(255,255,255,0.55)`. A seta `.desire-arrow` passa a ficar sempre visível (`opacity: 1; transform: none;` fora de qualquer media query; remova a regra que só mostra no hover). No `index.html`, mova o `<p>` "Toque na frase que mais ressoa" para ANTES da `<ul>`, com texto "Toque na frase que mais combina com você" e classes `text-sm text-charcoal/80 mb-4`. Cada `<button class="desire-item">` passa a chamar `openSymptomModal({ presetIndex: N })` com N = 0 (energia), 1 (leveza), 2 (sono), 5 (autoestima), 4 (presenca), 7 (vitalidade), mantendo o `trackEvent('desire_click', …)`.

- [ ] **Step 2.2: Cards "A abordagem integrativa"**

Para cada um dos 6 cards da grade em `#integrative`: remova `tabindex="0"`, `cursor-pointer`, `hover:-translate-y-1`; troque o `<span class="text-charcoal font-medium text-lg">` do título por `<h3 class="text-charcoal font-medium text-lg">`; troque o wrapper `grid grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus:grid-rows-[1fr] …` por um `<div>` simples e o `<p>` da descrição fica sempre visível (`text-base text-charcoal/80 pt-3 mt-3 border-t border-blush-100/50`).

- [ ] **Step 2.3: Quarto card de acessos rápidos**

Na `<section aria-label="Acessos rápidos">`, a grade vira `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` e recebe um quarto `<a href="#location">` no mesmo padrão dos três existentes, ícone feather `map-pin`, título "Onde fica e horários", subtítulo "Edifício Monumental · Seg a sex, 08h às 18h".

- [ ] **Step 2.4: Seção `#location`**

1. O `<button onclick="openSymptomModal()">Agendar Consulta</button>` vira `<a href="https://wa.me/5598981532153?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20agendar%20uma%20consulta%20com%20a%20Dra.%20Kerly%20Helena." target="_blank" rel="noopener noreferrer">Agendar pelo WhatsApp</a>` com as mesmas classes de botão. Abaixo, link secundário `<button type="button" onclick="openSymptomModal()" class="underline text-blush-600">Fazer o teste de bem-estar (2 min)</button>`.
2. O bloco do telefone: `<strong>Telefone</strong>` com `<a href="tel:+5598981532153">Ligar: (98) 98153-2153</a>` e, na linha seguinte, `<a href="https://wa.me/5598981532153" target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</a>`.
3. Mapa: substitua o `<a>` que envolve o `<iframe>` por:

```html
<div id="map-facade" class="relative h-full min-h-[280px] rounded-3xl bg-nude-200 border border-blush-100 flex flex-col items-center justify-center gap-4 p-6 text-center">
    <i data-feather="map-pin" class="text-blush-600 w-8 h-8"></i>
    <p class="text-base text-charcoal/80">Edifício Monumental, Sala 310<br>Av. Coronel Colares Moreira, Jardim Renascença</p>
    <div class="flex flex-wrap justify-center gap-3">
        <a href="https://www.google.com/maps/dir/?api=1&destination=-2.5016951,-44.2886734" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-blush-600 hover:bg-blush-700 text-white px-5 py-3 rounded-full text-base font-medium">Rota no Google Maps</a>
        <a href="https://waze.com/ul?ll=-2.5016951,-44.2886734&navigate=yes" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 border border-blush-300 text-charcoal px-5 py-3 rounded-full text-base font-medium">Abrir no Waze</a>
        <button type="button" id="copy-address" class="inline-flex items-center gap-2 border border-blush-300 text-charcoal px-5 py-3 rounded-full text-base font-medium">Copiar endereço</button>
    </div>
    <button type="button" id="load-map" class="text-blush-600 underline text-base">Ver mapa aqui</button>
</div>
```

Em `main.js` (dentro do `DOMContentLoaded`): `#copy-address` copia "Av. Coronel Colares Moreira, Sala 310, Condomínio Edifício Monumental, Jardim Renascença, São Luís, MA, CEP 65065-720" com `navigator.clipboard.writeText` e troca o texto do botão para "Endereço copiado" por 2 s (se `clipboard` não existir, mostra `prompt('Copie o endereço:', texto)`). `#load-map` substitui o conteúdo de `#map-facade` pelo `<iframe>` original (mesmo `src`, `title`, `loading="lazy"`, `referrerpolicy`), com `class="w-full h-full min-h-[320px] rounded-3xl border-0"`.

- [ ] **Step 2.5: Bloco de fechamento antes do `</main>`**

Depois da `<section id="location">`, adicione:

```html
<section id="fechamento" class="py-16 md:py-20 bg-nude-200">
    <div class="container mx-auto px-6 max-w-4xl grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-10 items-center">
        <figure class="rounded-[2rem] overflow-hidden">
            <img src="assets/IMG_4354-wide-960.webp" srcset="assets/IMG_4354-wide-640.webp 640w, assets/IMG_4354-wide-960.webp 960w, assets/IMG_4354-wide.webp 1600w" sizes="(min-width:768px) 40vw, calc(100vw - 3rem)" alt="Dra. Kerly Helena sorrindo em seu consultório em São Luís" width="1600" height="686" loading="lazy" decoding="async" class="w-full h-full object-cover">
        </figure>
        <div>
            <h2 class="text-3xl md:text-4xl font-serif text-charcoal leading-tight mb-4">Você não precisa atravessar isso sozinha.</h2>
            <p class="text-lg text-charcoal/80 mb-8">Conte o que está sentindo. A gente combina o melhor horário e você chega à consulta sabendo o que esperar.</p>
            <a href="https://wa.me/5598981532153?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20agendar%20uma%20consulta%20com%20a%20Dra.%20Kerly%20Helena." target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-blush-600 hover:bg-blush-700 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg">Agendar pelo WhatsApp <i data-feather="arrow-right" class="w-5 h-5"></i></a>
            <p class="mt-5 text-base"><a href="/blog/" class="text-blush-600 underline">Prefere ler primeiro? Veja o blog</a></p>
        </div>
    </div>
</section>
```

- [ ] **Step 2.6: Cabeçalho e depoimentos**

Em `styles.css`, adicione `.glass--header .nav-brand { margin-right: 1.5rem; }`. Em `#depoimentos`, ao lado do link "Ver mais avaliações no Google", adicione `<a href="https://share.google/mytP6jGcdTPTe1DJ4" target="_blank" rel="noopener noreferrer" class="… mesmo estilo …">Avaliar no Google</a>`.

- [ ] **Step 2.7: Remover o efeito de letras em `main.js`**

Apague o bloco inteiro `// Fluid Letter Hover Animation (Desktop Only) if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) { … }`.

- [ ] **Step 2.8: Reveals respeitam reduced-motion e não escondem ao voltar (`main.js`)**

No bloco dos `.gs-reveal`: envolva com `if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) { … }` e mude `toggleActions: "play none none reverse"` para `"play none none none"`; `duration: 1.4` vira `0.9` e `y: 60` vira `y: 32`. Em `initHeroStagger`, remova as linhas que referenciam `.gs-hero-scrollhint` (o elemento não existe mais).

- [ ] **Step 2.9: Novo fluxo do quiz no `index.html`**

1. Remova o estágio `<div id="quiz-intro">` inteiro (progresso, substeps 0-4 e navegação Voltar/Próximo).
2. Nenhum heading dentro de `#symptom-modal`: `h2` → `<p class="… mesmas classes …">`, `h3` → `<p>`. O `<p id="quiz-welcome-title">` mantém o id (o `aria-labelledby` do dialog continua apontando para ele). Remova o `<h3 id="quiz-question-title">Pergunta</h3>`; o cabeçalho do estágio de perguntas fica só com o progresso, e o container do progresso recebe `pr-14` (para o botão X não sobrepor). O texto do progresso passa a "Pergunta X de 9".
3. O overlay `<div onclick="closeSymptomModal()">` vira `<div id="quiz-overlay">` sem onclick; em `main.js`, o overlay só fecha quando o estágio de boas-vindas está visível (`if (!document.getElementById('quiz-welcome').classList.contains('hidden')) closeSymptomModal();`).
4. Na tela de resultado: o botão `Agendar pelo WhatsApp` dentro do card primário é removido (fica o da barra fixa `#quiz-sticky-cta`). No lugar dele, dentro do card, entra o passo opcional de contato:

```html
<form id="quiz-contact" class="mt-6 space-y-4" novalidate>
    <p class="text-base text-charcoal/80">Quer que a equipe da Dra. Kerly veja seu mapa antes da conversa? Deixe seu nome e WhatsApp. É opcional.</p>
    <div>
        <label for="quiz-name" class="block text-base font-medium text-charcoal mb-1">Seu nome</label>
        <input type="text" id="quiz-name" autocomplete="given-name" class="w-full rounded-xl border-2 border-blush-300 bg-white px-4 py-3 text-lg text-charcoal focus:border-blush-600">
    </div>
    <div>
        <label for="quiz-phone" class="block text-base font-medium text-charcoal mb-1">WhatsApp</label>
        <input type="tel" id="quiz-phone" inputmode="tel" autocomplete="tel" placeholder="(98) 90000-0000" oninput="formatPhoneInput(this)" class="w-full rounded-xl border-2 border-blush-300 bg-white px-4 py-3 text-lg text-charcoal focus:border-blush-600">
    </div>
    <label class="flex items-start gap-3 text-base text-charcoal/80 cursor-pointer">
        <input type="checkbox" id="quiz-consent" class="mt-0.5 w-6 h-6 shrink-0 accent-blush-600">
        <span>Concordo que a equipe entre em contato sobre este resultado. Dados tratados conforme a <a href="/privacy/" target="_blank" rel="noopener noreferrer" class="underline">Política de Privacidade</a>.</span>
    </label>
    <p id="quiz-contact-error" class="hidden text-base text-red-700"></p>
    <button type="submit" class="w-full bg-blush-600 hover:bg-blush-700 text-white px-6 py-4 rounded-full text-lg font-medium">Enviar e abrir o WhatsApp</button>
</form>
```

5. Ícones do resultado: em `main.js`, `serviceTemplates[*].icon` passa a ser o nome de um ícone feather (`ENERGIA: 'sun'`, `DESCANSO: 'wind'`, `PRESENCA: 'moon'`, `VITALIDADE: 'feather'`) renderizado como `<i data-feather="${s.icon}" class="w-6 h-6 text-blush-600"></i>` (e `feather.replace()` já roda ao mostrar resultados).

- [ ] **Step 2.10: Novo fluxo do quiz em `main.js`**

Substitua a lógica de intro/lead por:

```js
let questionOrder = quizQuestions.map((_, i) => i);   // ordem de exibição

window.openSymptomModal = function (options) {
    options = options || {};
    const modal = document.getElementById('symptom-modal');
    if (!modal) { window.location.href = '/#quiz'; return; }   // páginas internas
    const modalContent = document.getElementById('symptom-modal-content');
    modalPreviouslyFocusedEl = document.activeElement;
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modalContent.classList.remove('scale-95'); }, 10);
    document.body.style.overflow = 'hidden';
    document.getElementById('quiz-sticky-cta').classList.add('hidden');
    currentQuestionIndex = 0; quizAnswers = []; userData = { name: '', phone: '', email: '', age: '', phase: '' };
    questionOrder = quizQuestions.map((_, i) => i);
    if (Number.isInteger(options.presetIndex) && quizQuestions[options.presetIndex]) {
        questionOrder = [options.presetIndex].concat(questionOrder.filter(i => i !== options.presetIndex));
    }
    ['quiz-welcome', 'quiz-questions', 'quiz-animation', 'quiz-results'].forEach(id => document.getElementById(id).classList.add('hidden'));
    const form = document.getElementById('quiz-contact');
    if (form) { form.reset(); document.getElementById('quiz-contact-error').classList.add('hidden'); }
    if (Number.isInteger(options.presetIndex)) { document.getElementById('quiz-questions').classList.remove('hidden'); renderQuestion(); }
    else document.getElementById('quiz-welcome').classList.remove('hidden');
    try { modalContent.focus({ preventScroll: true }); } catch (e) { modalContent.focus(); }
    window.trackEvent('quiz_open', { preset: options.presetIndex ?? null });
};
```

`renderQuestion` usa `quizQuestions[questionOrder[currentQuestionIndex]]` e `handleAnswer` grava `quizQuestions[questionOrder[currentQuestionIndex]].dimension`. `advanceQuiz`, ao terminar a última pergunta, chama `transitionQuizStage('quiz-questions', 'quiz-animation', runHealthFingerprint)` diretamente. `showResults` continua igual, mas chama `submitLead` só quando houver contato (ver abaixo), e o card "Respiração & Meditação" vira um `<a href="/yoga/#respiracao">`.

Mensagem do WhatsApp com resumo:

```js
const PHASE_LABELS = { fertil: 'fase fértil', tentando: 'tentando engravidar', pos_parto: 'pós-parto', perimenopausa: 'perimenopausa', menopausa: 'menopausa ou pós-menopausa' };
let lastTopDimensions = [];
function buildWhatsappMessage() {
    const dims = lastTopDimensions.map(d => dimensionLabelsShort[d]).filter(Boolean).join(' e ');
    let msg = 'Olá! Fiz o teste de bem-estar no site.';
    if (dims) msg += ' Meu mapa apontou: ' + dims + '.';
    if (PHASE_LABELS[userData.phase]) msg += ' Momento de vida: ' + PHASE_LABELS[userData.phase] + '.';
    if (userData.name) msg += ' Meu nome é ' + userData.name + '.';
    return msg + ' Gostaria de agendar uma consulta integrativa.';
}
```

onde `dimensionLabelsShort = { ENERGIA: 'energia e leveza', DESCANSO: 'descanso e sono', PRESENCA: 'presença e paz com o corpo', VITALIDADE: 'vitalidade e prazer' }` e `showResults` faz `lastTopDimensions = topDimensions`. `bookConsultation` usa `buildWhatsappMessage()`.

Formulário de contato (`#quiz-contact` submit):

```js
const contactForm = document.getElementById('quiz-contact');
if (contactForm) contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('quiz-name').value.trim();
    const digits = document.getElementById('quiz-phone').value.replace(/\D/g, '');
    const consent = document.getElementById('quiz-consent').checked;
    const errEl = document.getElementById('quiz-contact-error');
    let error = '';
    if (name.length < 2) error = 'Escreva como quer ser chamada.';
    else if (digits.length < 10 || digits.length > 11) error = 'O WhatsApp precisa ter DDD e número (10 ou 11 dígitos).';
    else if (!consent) error = 'Marque a caixa de consentimento para enviar seus dados.';
    if (error) { errEl.textContent = error; errEl.classList.remove('hidden'); return; }
    errEl.classList.add('hidden');
    userData.name = name; userData.phone = document.getElementById('quiz-phone').value.trim();
    submitLead({ scores: lastScores, top: lastTopDimensions });
    window.bookConsultation();
});
```

(`lastScores` é preenchido em `showResults`.) Remova por completo o backup em `localStorage` dentro de `submitLead`, as constantes/funções `INTRO_TOTAL_SUBSTEPS`, `INTRO_FIELD_BY_SUBSTEP`, `showIntroError`, `clearIntroError`, `clearAllIntroErrors`, `validateIntroSubstep`, `showIntroSubstep`, `nextIntroSubstep`, `prevIntroSubstep`, `finalizeLeadCapture`. `notifyWhatsappClick` só posta quando `userData.phone` não estiver vazio. O payload de `submitLead` mantém as chaves `email: ''` e `age: ''`.

- [ ] **Step 2.11: Abertura por hash e por parâmetro (`main.js`)**

No `DOMContentLoaded`: `const wantsQuiz = location.hash === '#quiz' || new URLSearchParams(location.search).get('quiz') === '1'; if (wantsQuiz && typeof window.openSymptomModal === 'function') setTimeout(() => window.openSymptomModal(), 450);` e `window.addEventListener('hashchange', () => { if (location.hash === '#quiz') window.openSymptomModal(); });`. Na home, o link do FAB "Quero entender o que sinto" passa a `href="#quiz"` com o mesmo `onclick`.

- [ ] **Step 2.12: Verificação**

Run: `npm run build:css && npm test`
Expected: 0 erros; nenhum aviso sobre headings no modal.

Dev server porta 5602. Screenshots: `--url  --scroll 3200` (lista de frases), `--url  --scroll 6400` (cards), `--url  --scroll 15000` (endereço e fechamento), `--url  --eval "openSymptomModal({presetIndex:2})"` (deve mostrar a pergunta do sono primeiro), e o fluxo completo: `--eval "openSymptomModal(); startQuestions(); for (let i=0;i<8;i++) handleAnswer(3); handlePhase('perimenopausa');" --wait 9000` (resultado com formulário opcional e barra fixa). Confira as imagens. Nenhum `pageerror`.

- [ ] **Step 2.13: Commits**

```bash
git add index.html main.js styles.css input.css output.css
git commit -m "Home: frases com affordance, cards visiveis, acesso a endereco, mapa sob demanda e bloco de fechamento"
```

(Se preferir, faça dois commits: um da home e outro do quiz, com a mensagem `Quiz: resultado antes dos dados, contato opcional, resumo no WhatsApp e modal sem headings`.)

---

### Task 3: Menopausa (checklist de sinais, "Em que fase estou?", diário de sintomas)

**Files:**
- Modify: `menopausa/index.html`, `output.css` (gerado).
- Create: `menopausa/diario-de-sintomas/index.html`.
- Test: `npm test`, screenshots.

**Interfaces:**
- Produces: URL `/menopausa/diario-de-sintomas/` (Tarefa 5 linka; Tarefa 7 põe no sitemap); ids `#fase` e `#sinais` na página de menopausa.

- [ ] **Step 3.1: Checklist de sinais**

Na seção "Sinais de que vale procurar acompanhamento" (`<ul>` com os sinais), dê `id="sinais"` à seção e transforme cada `<li>` em:

```html
<li class="flex items-start gap-4 py-3 border-t border-blush-100/60">
    <label class="flex items-start gap-4 cursor-pointer w-full">
        <input type="checkbox" class="sinal-check mt-1 w-6 h-6 shrink-0 accent-blush-600" value="Fogachos e ondas de calor, de dia ou à noite">
        <span class="text-base text-charcoal/80">Fogachos e ondas de calor, de dia ou à noite</span>
    </label>
</li>
```

(o `value` repete o texto visível de cada sinal). Após a lista:

```html
<div class="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
    <a id="sinais-whatsapp" href="https://wa.me/5598981532153?text=Ol%C3%A1!%20Vim%20pela%20p%C3%A1gina%20de%20menopausa%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20com%20a%20Dra.%20Kerly%20Helena." target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 bg-blush-600 hover:bg-blush-700 text-white px-6 py-4 rounded-full text-lg font-medium">Levar esses sinais para a consulta</a>
    <p id="sinais-status" class="text-base text-charcoal/80">Marque o que você percebe em você. A mensagem do WhatsApp vai pronta com a sua lista.</p>
</div>
```

Script inline no fim da página (antes de `</body>`):

```js
(function () {
    var checks = document.querySelectorAll('.sinal-check');
    var link = document.getElementById('sinais-whatsapp');
    var status = document.getElementById('sinais-status');
    if (!checks.length || !link) return;
    var base = 'Olá! Vim pela página de menopausa e gostaria de agendar uma avaliação com a Dra. Kerly Helena.';
    function update() {
        var marcados = Array.prototype.filter.call(checks, function (c) { return c.checked; }).map(function (c) { return c.value.toLowerCase(); });
        var msg = marcados.length ? 'Olá! Vim pela página de menopausa. Os sinais que percebo em mim: ' + marcados.join('; ') + '. Gostaria de agendar uma avaliação com a Dra. Kerly Helena.' : base;
        link.href = 'https://wa.me/5598981532153?text=' + encodeURIComponent(msg);
        status.textContent = marcados.length ? marcados.length + ' sinal(is) marcado(s). A mensagem já está pronta.' : 'Marque o que você percebe em você. A mensagem do WhatsApp vai pronta com a sua lista.';
    }
    checks.forEach(function (c) { c.addEventListener('change', update); });
})();
```

- [ ] **Step 3.2: Bloco "Em que fase estou?"**

Antes da seção "Climatério, perimenopausa e menopausa: qual a diferença", adicione uma `<section id="fase" class="max-w-3xl mx-auto mt-20 md:mt-24">` com eyebrow "Para se situar", `<h2>` "Em que fase eu posso estar?", um `<p>` "Escolha a frase que mais parece com o seu momento. Isso ajuda a se situar; só a consulta confirma." e três `<details name="fase" class="group glass rounded-2xl border border-blush-100 px-6 py-5">` com `<summary class="cursor-pointer font-serif text-lg text-charcoal flex items-center justify-between gap-4">`:

1. "Meus ciclos ainda são regulares, mas algo mudou (sono, humor, energia)" → conteúdo: "Pode ser o início do climatério, a transição como um todo. Vale observar os ciclos por alguns meses e anotar o que muda." + link `#diferenca` (dê esse id à seção das definições) "Ver a diferença entre as fases".
2. "Meus ciclos mudaram e tenho sintomas (calores, noites ruins, irritabilidade)" → "Esse quadro costuma corresponder à perimenopausa, quando os hormônios oscilam. É a fase em que o acompanhamento mais ajuda." + link `#sinais` "Ver os sinais e levar para a consulta".
3. "Estou há mais de 12 meses sem menstruar" → "Doze meses seguidos sem menstruação é o marco que caracteriza a menopausa; a partir dele começa a pós-menopausa. O cuidado continua, com foco em ossos, coração, sono e bem-estar." + link para a seção de consulta.

Abaixo dos três, o cálculo dos 12 meses:

```html
<div class="mt-6 glass rounded-2xl border border-blush-100 px-6 py-5">
    <label for="ultima-menstruacao" class="block text-base font-medium text-charcoal mb-2">Se quiser, informe a data da sua última menstruação</label>
    <input type="date" id="ultima-menstruacao" class="rounded-xl border-2 border-blush-300 bg-white px-4 py-3 text-lg text-charcoal">
    <p id="ultima-menstruacao-resultado" class="mt-3 text-base text-charcoal/80" aria-live="polite"></p>
</div>
```

Script inline: ao mudar a data, calcule `marco = data + 12 meses`; se `marco > hoje`: "Se a menstruação não voltar até {marco em pt-BR, ex.: 14 de março de 2027}, esse será o marco de 12 meses." senão: "Você completou 12 meses sem menstruar em {marco}. Esse marco caracteriza a menopausa; a avaliação em consulta continua importante." Datas futuras ou vazias: mensagem vazia.

- [ ] **Step 3.3: Página do diário de sintomas**

Crie `menopausa/diario-de-sintomas/index.html` seguindo o `<head>` das páginas internas (GA4, fontes, `output.css` e `styles.css` com caminho `../../`, favicon), com:
- `<title>Diário de sintomas para imprimir | Dra. Kerly Helena</title>`, meta description "Diário de sintomas de 4 semanas para imprimir e levar à consulta: fogachos, sono, humor, ciclo e observações. Material gratuito da Dra. Kerly Helena, ginecologista em São Luís.", canonical `https://drakerlyhelena.com.br/menopausa/diario-de-sintomas/`, `robots index, follow`, OG básico reaproveitando `assets/og-menopausa.jpg`.
- JSON-LD `WebPage` (name, description, url, `isPartOf` `#website`, `about` MedicalCondition "Climatério") + `BreadcrumbList` (Início › Menopausa e Climatério › Diário de sintomas).
- Cabeçalho e rodapé iguais aos de `menopausa/index.html` (copie, ajustando caminhos relativos para `../../`).
- Conteúdo: `<h1>` "Diário de sintomas: 4 semanas", instruções em 3 frases (anotar todo dia, levar à consulta, sem julgamento), botão `<button onclick="window.print()">Imprimir</button>`, e uma `<table>` por semana (4 tabelas, `<caption>Semana 1</caption>`…) com colunas Dia | Fogachos (0 a 3) | Sono (0 a 3) | Humor (0 a 3) | Sangramento (sim/não) | Observações, e 7 linhas por semana com células vazias com altura de 2,2 rem. Legenda: "0 = nada, 1 = leve, 2 = moderado, 3 = intenso".
- `<style media="print">` que esconde cabeçalho, FAB, rodapé e o botão, e mantém as tabelas com bordas de 1 px pretas.
- Link de volta "← Menopausa e climatério" e o disclaimer padrão das páginas ("Este material tem caráter informativo…").

Na página `menopausa/index.html`, na seção "Sinais…", adicione um parágrafo com link `<a href="/menopausa/diario-de-sintomas/">Baixe o diário de sintomas para imprimir</a>`.

- [ ] **Step 3.4: Verificação e commit**

Run: `npm run build:css && npm test` → 0 erros. Dev server porta 5603; screenshots `--url menopausa/ --scroll 1800`, `--url menopausa/ --scroll 3400 --eval "document.querySelector('.sinal-check').click()"`, `--url menopausa/diario-de-sintomas/`. Nenhum `pageerror`.

```bash
git add menopausa/index.html menopausa/diario-de-sintomas/index.html output.css
git commit -m "Menopausa: checklist de sinais para o WhatsApp, bloco em que fase estou e diario de sintomas para imprimir"
```

---

### Task 4: FAQ com `<details>` nativo, grupos, busca e âncoras

**Files:**
- Modify: `faq/index.html`, `output.css` (gerado).
- Test: `npm test` (confere `FAQPage` × texto visível), screenshots.

**Interfaces:**
- Produces: ids por pergunta (`faq-<slug>`), 3 `h2` de grupo. JSON-LD `FAQPage` inalterado.

- [ ] **Step 4.1: Inventário**

Liste as 15 perguntas e respostas atuais (`.faq-item`) e confira que o JSON-LD `FAQPage` tem as mesmas 15. Não altere nenhuma palavra de pergunta ou resposta.

- [ ] **Step 4.2: Estrutura nova**

Substitua `<div id="faq-accordion">` por três blocos, cada um `<section class="mt-12"> <h2 class="text-2xl md:text-3xl font-serif text-charcoal mb-6">…</h2> <div class="space-y-4">…</div> </section>`, com os grupos "Consulta, agendamento e convênio", "Medicina integrativa e ortomolecular" e "Menopausa e fases da vida" (distribua as 15 perguntas pelo tema; toda pergunta entra em exatamente um grupo). Cada pergunta:

```html
<details id="faq-o-que-e-medicina-integrativa" class="faq-item group glass rounded-2xl border border-blush-100/50 px-6 py-5">
    <summary class="cursor-pointer list-none flex items-center justify-between gap-4 min-h-[44px]">
        <span class="flex items-center gap-4">
            <span class="w-10 h-10 rounded-xl bg-blush-100 flex items-center justify-center shrink-0"><i data-feather="sun" class="w-5 h-5 text-blush-600"></i></span>
            <h3 class="font-serif text-lg text-charcoal">O que é medicina integrativa?</h3>
        </span>
        <i data-feather="plus" class="w-6 h-6 text-blush-600 shrink-0 transition-transform group-open:rotate-45"></i>
    </summary>
    <div class="pt-4 mt-4 border-t border-blush-100/60 space-y-3 text-base text-charcoal/80">
        <p>…resposta idêntica…</p>
        <p class="pt-2"><a href="#faq-o-que-e-medicina-integrativa" class="faq-link text-sm text-blush-600 underline">Copiar link desta pergunta</a></p>
    </div>
</details>
```

(mantenha o ícone feather que cada pergunta já tinha). O `<h3>` que existe hoje na seção de CTA ao final ("Quer entender como…") vira `<h2>`.

- [ ] **Step 4.3: Busca e controles**

Antes do primeiro grupo:

```html
<div class="max-w-3xl mx-auto mb-10">
    <label for="faq-busca" class="block text-base font-medium text-charcoal mb-2">Buscar nas dúvidas</label>
    <input type="search" id="faq-busca" placeholder="Ex.: convênio, menopausa, exames" class="w-full rounded-xl border-2 border-blush-300 bg-white px-4 py-3 text-lg text-charcoal focus:border-blush-600" autocomplete="off">
    <div class="mt-3 flex flex-wrap items-center gap-4 text-base">
        <button type="button" id="faq-abrir-todas" class="text-blush-600 underline">Abrir todas</button>
        <button type="button" id="faq-fechar-todas" class="text-blush-600 underline">Fechar todas</button>
        <span id="faq-contagem" class="text-charcoal/80" aria-live="polite"></span>
    </div>
    <p id="faq-vazio" class="hidden mt-6 text-base text-charcoal/80">Nenhuma pergunta com esse termo. Tente outra palavra ou <a href="https://wa.me/5598981532153" target="_blank" rel="noopener noreferrer" class="text-blush-600 underline">pergunte no WhatsApp</a>.</p>
</div>
```

- [ ] **Step 4.4: Script inline (substitui o script do acordeão GSAP)**

```js
(function () {
    var items = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('main section'));
    var input = document.getElementById('faq-busca');
    var vazio = document.getElementById('faq-vazio');
    var contagem = document.getElementById('faq-contagem');
    function normaliza(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function filtra() {
        var termo = normaliza(input.value.trim());
        var visiveis = 0;
        items.forEach(function (d) {
            var ok = !termo || normaliza(d.textContent).indexOf(termo) !== -1;
            d.hidden = !ok;
            if (ok) { visiveis++; if (termo) d.open = true; }
        });
        sections.forEach(function (s) { var alg = s.querySelector('.faq-item:not([hidden])'); if (s.querySelector('.faq-item')) s.hidden = !alg; });
        vazio.classList.toggle('hidden', visiveis > 0);
        contagem.textContent = termo ? visiveis + ' de ' + items.length + ' perguntas' : '';
    }
    if (input) input.addEventListener('input', filtra);
    document.getElementById('faq-abrir-todas').addEventListener('click', function () { items.forEach(function (d) { d.open = true; }); });
    document.getElementById('faq-fechar-todas').addEventListener('click', function () { items.forEach(function (d) { d.open = false; }); });
    document.querySelectorAll('.faq-link').forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            var url = location.origin + location.pathname + a.getAttribute('href');
            var done = function () { a.textContent = 'Link copiado'; setTimeout(function () { a.textContent = 'Copiar link desta pergunta'; }, 2000); };
            if (navigator.clipboard) navigator.clipboard.writeText(url).then(done); else { window.prompt('Copie o link:', url); }
        });
    });
    function abrePeloHash() { var alvo = location.hash && document.querySelector(location.hash); if (alvo && alvo.classList.contains('faq-item')) { alvo.open = true; alvo.scrollIntoView({ block: 'start' }); } }
    window.addEventListener('hashchange', abrePeloHash); abrePeloHash();
})();
```

Remova da página os `<script>` do GSAP e do ScrollTrigger, as classes `gs-reveal`, o CSS `.faq-item.active …` e qualquer `focus:outline-none`.

- [ ] **Step 4.5: Verificação e commit**

Run: `npm run build:css && npm test` → 0 erros (o teste confere que as 15 perguntas do `FAQPage` seguem no texto visível e que não há salto de heading). Dev server porta 5604; screenshots `--url faq/`, `--url faq/ --eval "document.getElementById('faq-busca').value='convenio'; document.getElementById('faq-busca').dispatchEvent(new Event('input'))"`, `--url faq/#faq-<um-id> --wait 1200`. Nenhum `pageerror`.

```bash
git add faq/index.html output.css
git commit -m "FAQ: details nativo em tres grupos, busca instantanea, abrir todas e link por pergunta"
```

---

### Task 5: Blog (schema completo, datas, índice, ouvir, compartilhar)

**Files:**
- Modify: `blog/index.html`, `blog/primeira-consulta-ginecologia-integrativa/index.html`, `blog/sinais-perimenopausa/index.html`, `blog/yoga-na-menopausa/index.html`, `output.css` (gerado).
- Create: `blog/blog.js`.
- Test: `npm test` (checa `author.name`, `publisher.name`, `dateModified`), screenshots.

**Interfaces:**
- Consumes: `/menopausa/diario-de-sintomas/` (Tarefa 3).
- Produces: ids nos `h2` dos artigos; `blog/blog.js` carregado por `<script src="/blog/blog.js" defer>` nos 3 artigos.

- [ ] **Step 5.1: JSON-LD dos artigos e do índice**

Em cada `BlogPosting` (3 artigos) e no `Blog` do índice, troque `author`/`publisher` por:

```json
"author": { "@type": "Person", "name": "Dra. Kerly Helena", "url": "https://drakerlyhelena.com.br/", "sameAs": ["https://www.instagram.com/kerly.helena", "https://www.tiktok.com/@drakerlyhelena"] },
"publisher": { "@type": "Organization", "@id": "https://drakerlyhelena.com.br/#clinic", "name": "Clínica Dra. Kerly Helena - Ginecologia Integrativa", "url": "https://drakerlyhelena.com.br/", "logo": { "@type": "ImageObject", "url": "https://drakerlyhelena.com.br/assets/apple-touch-icon.png" } }
```

e `"dateModified": "2026-09-28"`. Mantenha `datePublished`.

- [ ] **Step 5.2: Datas, tempo de leitura e índice**

Na linha "Por Dra. Kerly Helena · … — 10 de agosto de 2026" de cada artigo, envolva a data em `<time datetime="2026-08-10">10 de agosto de 2026</time>` e acrescente " · Leitura de N min" (N = palavras do `<article>` ÷ 200, arredondado para cima; calcule e escreva o número fixo). Nos cards do índice, a data também vira `<time datetime="2026-08-10">`.

Após o parágrafo de introdução de cada artigo, insira:

```html
<nav aria-label="Neste artigo" class="my-10 rounded-2xl border border-blush-100 bg-nude-200 px-6 py-5">
    <p class="text-sm uppercase tracking-widest text-blush-600 font-semibold mb-3">Neste artigo</p>
    <ol class="space-y-2 text-base list-decimal pl-5">
        <li><a href="#o-que-e-perimenopausa" class="text-charcoal underline">O que é a perimenopausa e quando ela costuma começar</a></li>
        …um item por h2…
    </ol>
</nav>
```

e dê a cada `<h2>` o `id` correspondente (slug sem acentos).

- [ ] **Step 5.3: Ouvir e compartilhar**

Logo abaixo do índice, em cada artigo:

```html
<div class="flex flex-wrap items-center gap-3 mb-8" data-artigo-acoes>
    <button type="button" data-ouvir class="hidden inline-flex items-center gap-2 border border-blush-300 text-charcoal px-5 py-3 rounded-full text-base font-medium min-h-[44px]"><i data-feather="volume-2" class="w-5 h-5"></i><span>Ouvir este artigo</span></button>
    <a data-compartilhar-whatsapp href="#" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 border border-blush-300 text-charcoal px-5 py-3 rounded-full text-base font-medium min-h-[44px]"><i data-feather="share-2" class="w-5 h-5"></i>Enviar no WhatsApp</a>
    <button type="button" data-copiar-link class="inline-flex items-center gap-2 border border-blush-300 text-charcoal px-5 py-3 rounded-full text-base font-medium min-h-[44px]"><i data-feather="link" class="w-5 h-5"></i><span>Copiar link</span></button>
</div>
```

Repita o mesmo bloco de compartilhar (sem o botão de ouvir) antes do "Leia também". `blog/blog.js`:

```js
(function () {
    'use strict';
    var article = document.querySelector('article');
    if (!article) return;
    var titulo = document.title;
    var url = location.origin + location.pathname;
    document.querySelectorAll('[data-compartilhar-whatsapp]').forEach(function (a) {
        a.href = 'https://wa.me/?text=' + encodeURIComponent(titulo + ' ' + url);
    });
    document.querySelectorAll('[data-copiar-link]').forEach(function (b) {
        b.addEventListener('click', function () {
            var label = b.querySelector('span');
            var done = function () { label.textContent = 'Link copiado'; setTimeout(function () { label.textContent = 'Copiar link'; }, 2000); };
            if (navigator.share) { navigator.share({ title: titulo, url: url }).catch(function () {}); return; }
            if (navigator.clipboard) navigator.clipboard.writeText(url).then(done); else window.prompt('Copie o link:', url);
        });
    });
    var botao = document.querySelector('[data-ouvir]');
    if (!botao || !('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return;
    botao.classList.remove('hidden');
    var label = botao.querySelector('span');
    var falando = false;
    function texto() {
        var partes = [document.querySelector('h1').textContent];
        article.querySelectorAll('h2, p, li').forEach(function (el) { if (!el.closest('[data-artigo-acoes], nav')) partes.push(el.textContent); });
        return partes.join('. ').replace(/\s+/g, ' ');
    }
    botao.addEventListener('click', function () {
        if (falando) { window.speechSynthesis.cancel(); falando = false; label.textContent = 'Ouvir este artigo'; return; }
        var u = new SpeechSynthesisUtterance(texto());
        u.lang = 'pt-BR'; u.rate = 0.95;
        var voz = window.speechSynthesis.getVoices().find(function (v) { return /pt[-_]BR/i.test(v.lang); });
        if (voz) u.voice = voz;
        u.onend = u.onerror = function () { falando = false; label.textContent = 'Ouvir este artigo'; };
        window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
        falando = true; label.textContent = 'Parar de ouvir';
    });
    window.addEventListener('pagehide', function () { window.speechSynthesis.cancel(); });
})();
```

Inclua `<script src="/blog/blog.js" defer></script>` antes de `</body>` nos 3 artigos.

- [ ] **Step 5.4: Link do diário**

No artigo de perimenopausa, no parágrafo "Anotar seus ciclos e sintomas por algumas semanas ajuda muito a consulta", acrescente: ` Se quiser, <a href="/menopausa/diario-de-sintomas/" class="text-blush-600 underline">use o diário de sintomas para imprimir</a>.`

- [ ] **Step 5.5: Verificação e commit**

Run: `npm run build:css && npm test` → 0 erros. Dev server porta 5605; screenshots `--url blog/sinais-perimenopausa/ --scroll 900` (índice e botões), `--url blog/`. Teste sem Web Speech: `--eval "delete window.speechSynthesis"` não é necessário; confira no código que o botão só aparece após a checagem. Nenhum `pageerror`.

```bash
git add blog/index.html blog/blog.js blog/primeira-consulta-ginecologia-integrativa/index.html blog/sinais-perimenopausa/index.html blog/yoga-na-menopausa/index.html output.css
git commit -m "Blog: autor e publisher completos, datas marcadas, indice, ouvir o artigo e compartilhar"
```

---

### Task 6: Yoga (contraste, carrossel, modal, respiração guiada)

**Files:**
- Modify: `yoga/index.html`, `output.css` (gerado).
- Test: `npm test`, screenshots.

**Interfaces:**
- Produces: `<section id="respiracao">` (a Tarefa 2 linka `/yoga/#respiracao`).

- [ ] **Step 6.1: Carrossel**

Na inicialização do Swiper: remova `autoplay` (ou `autoplay: false`); remova `loop` se causar duplicação de slides; mantenha `pagination` e `navigation`. Remova a animação `goldenPulse` do `<style>` e das classes dos slides (borda estática `border border-yoga-gold/40`). Remova `animation: spin 30s linear infinite` do sol do hero. Troque as legendas de uma palavra ("Acolhimento", "Luz e Paz"…) por frases curtas descritivas baseadas no `alt` de cada foto (ex.: "Sala de prática com tapetes e almofadas"). Como não há autoplay, não é preciso botão de pausa.

- [ ] **Step 6.2: Modal de lista de espera → link direto**

Remova `#yoga-modal`, `openYogaModal`/`closeYogaModal` e os `onclick`. Os botões "Quero ser avisada" viram `<a href="https://wa.me/5598981532153?text=Ol%C3%A1%2C%20gostaria%20de%20entrar%20na%20lista%20de%20espera%20do%20Yoga%20para%20Vitalidade%20%C3%8Dntima%20Feminina." target="_blank" rel="noopener noreferrer">Entrar na lista de espera pelo WhatsApp</a>` com as classes de botão. A citação "Decidir cuidar de si mesma não é um luxo…" passa a ficar visível como `<blockquote>` na seção "Reconecte-se com sua essência".

- [ ] **Step 6.3: Seção `#respiracao`**

Após a seção `#detalhes`, adicione:

```html
<section id="respiracao" class="py-24 bg-yoga-light relative">
    <div class="container mx-auto px-6 max-w-3xl text-center">
        <span class="text-sm tracking-[0.2em] text-yoga-gold-deep uppercase font-semibold">Para fazer agora</span>
        <h2 class="text-4xl md:text-5xl font-serif mt-4 text-yoga-dark">Respiração guiada de 3 minutos</h2>
        <p class="mt-6 text-lg text-yoga-dark/80">Sente-se confortável, deixe os ombros soltos e siga o círculo: inspire enquanto ele cresce, segure, solte enquanto ele encolhe. Se sentir qualquer desconforto, pare.</p>
        <div class="mt-10 flex flex-col items-center gap-6">
            <div id="resp-circulo" class="w-48 h-48 rounded-full bg-yoga-gold/20 border-2 border-yoga-gold/50 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out">
                <span id="resp-fase" class="font-serif text-3xl text-yoga-dark">Pronta?</span>
            </div>
            <p id="resp-tempo" class="text-lg text-yoga-dark/80" aria-live="polite">3:00</p>
            <button type="button" id="resp-botao" class="inline-flex items-center gap-2 bg-yoga-gold-deep hover:bg-[#7A5F0F] text-white px-8 py-4 rounded-full text-lg font-medium min-h-[44px]">Começar</button>
        </div>
    </div>
</section>
```

Script inline: ciclo de 4 s inspirar (`scale(1.35)`), 2 s segurar, 6 s soltar (`scale(1)`), com `#resp-fase` = "Inspire" / "Segure" / "Solte"; `#resp-tempo` conta de 3:00 para 0:00; botão alterna "Começar" / "Pausar" / "Continuar" e ao terminar mostra "Feito. Como você se sente?" e volta a "Começar de novo". Se `matchMedia('(prefers-reduced-motion: reduce)').matches`, não altere `transform` (só o texto e o tempo). Use `setTimeout`/`setInterval` limpos ao pausar e ao sair da página (`pagehide`).

- [ ] **Step 6.4: Verificação e commit**

Run: `npm run build:css && npm test` → 0 erros. Dev server porta 5606; screenshots `--url yoga/`, `--url yoga/#respiracao --wait 1200`, `--url yoga/#respiracao --eval "document.getElementById('resp-botao').click()" --wait 3000`. Nenhum `pageerror`.

```bash
git add yoga/index.html output.css
git commit -m "Yoga: contraste dos botoes, carrossel sem autoplay, lista de espera por link direto e respiracao guiada"
```

---

### Task 7: Fase final em todas as páginas (FAB, pular conteúdo, fonte, menu, vidro, rodapé, convênio, privacidade, sitemap, changelog)

**Files:**
- Modify: todas as páginas HTML (`index.html`, `404.html`, `medicina-integrativa/`, `menopausa/` + `menopausa/diario-de-sintomas/`, `ortomolecular/`, `convenio-apcef/`, `pacotes/`, `faq/`, `yoga/`, `blog/` + 3 artigos, `privacy/`), `main.js`, `glass.js`, `styles.css`, `sitemap.xml`, `CHANGELOG.md`, `output.css` (gerado).
- Test: `npm test`, screenshots de 3 páginas em mobile e desktop.

**Interfaces:**
- Consumes: `openSymptomModal` redireciona para `/#quiz` quando não há modal (Tarefa 2); página do diário (Tarefa 3).

- [ ] **Step 7.1: FAB em todas as páginas**

No `<details class="wa-fab">`: o link do quiz vira `href="/#quiz"` (na home `href="#quiz"`), mantendo o `onclick` que chama `openSymptomModal()` quando existir. Adicione uma terceira opção, antes de "Falar no WhatsApp": `<a href="tel:+5598981532153"><span aria-hidden="true">…ícone feather "phone" inline como SVG…</span><span>Ligar agora</span></a>` com as mesmas classes das outras opções.

- [ ] **Step 7.2: Pular para o conteúdo e `main#conteudo`**

Primeiro filho de `<body>` em todas as páginas: `<a href="#conteudo" class="skip-link">Pular para o conteúdo</a>`; `<main>` recebe `id="conteudo"` (na `404.html` idem). Em `styles.css`:

```css
.skip-link { position: absolute; left: 1rem; top: -4rem; z-index: 100; background: #4A3B40; color: #fff; padding: .75rem 1rem; border-radius: .75rem; font-size: 1rem; }
.skip-link:focus { top: 1rem; }
```

- [ ] **Step 7.3: Tamanho de fonte**

No `<head>` de todas as páginas, logo após `<meta name="viewport">`:

```html
<script>try{var f=localStorage.getItem('drakerly_fonte');if(f)document.documentElement.setAttribute('data-fonte',f);}catch(e){}</script>
```

Em `styles.css`: `html[data-fonte="grande"] { font-size: 112.5%; } html[data-fonte="maior"] { font-size: 125%; }`. No cabeçalho de todas as páginas, antes do CTA "Agende sua Consulta" (desktop) e ao lado do botão do menu (mobile), um botão:

```html
<button type="button" class="fonte-toggle inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full text-charcoal" aria-label="Aumentar o tamanho da letra" title="Tamanho da letra"><span aria-hidden="true" class="font-serif text-lg">A<span class="text-sm">A</span></span></button>
```

Em `main.js`: ao clicar, cicla `'' → 'grande' → 'maior' → ''`, aplica em `document.documentElement.dataset.fonte`, salva em `localStorage` e atualiza `aria-label` ("Tamanho da letra: normal/grande/maior. Toque para mudar."). Em `prefers-reduced-motion` nada muda.

- [ ] **Step 7.4: Menu mobile e ícones**

Em todas as páginas: `#mobile-menu-btn` recebe `p-2 -mr-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center` e perde `focus:outline-none`; seu conteúdo vira dois SVGs inline (menu e x, 24 px, `stroke="currentColor"`), o de fechar com `hidden`. Em `main.js`, o toggle alterna a classe `hidden` dos dois SVGs em vez de `innerHTML` + `feather.replace()`. Links do menu mobile: `py-3` (alvo ≥ 44 px). Fixe o CDN: `https://unpkg.com/feather-icons@4.29.2/dist/feather.min.js` em todas as páginas.

- [ ] **Step 7.5: Vidro mais leve no celular (`glass.js`, `styles.css`)**

Em `glass.js`, `supportsSvgBackdrop()` só retorna `true` se também `matchMedia('(min-width: 768px) and (pointer: fine)').matches` e `(navigator.hardwareConcurrency || 4) >= 4`. Em `styles.css`: `@media (max-width: 767px) { .glass:not(.glass--header) { -webkit-backdrop-filter: blur(12px) saturate(140%); backdrop-filter: blur(12px) saturate(140%); } }`.

- [ ] **Step 7.6: Rodapé**

Em todas as páginas com rodapé completo: o `<p>` "Site desenvolvido por VibeSurfDev" some como linha própria e o texto entra no fim da linha do copyright: `© 2026 Dra. Kerly Helena - Ginecologia Integrativa. Todos os direitos reservados. Site por <a …>VibeSurfDev</a>`.

- [ ] **Step 7.7: Convênio APCEF: checklist "O que levar no dia"**

Em `convenio-apcef/index.html`, a lista de "O que levar no dia" vira checklist (mesmo padrão da Tarefa 3, classe `levar-check`, sem persistência) com dois botões abaixo: `Imprimir esta lista` (`window.print()`, com `<style media="print">` que esconde cabeçalho, FAB e rodapé) e `Enviar minha lista no WhatsApp` (mensagem "Olá! Sou beneficiária do Convênio APCEF. Vou levar: …itens marcados…").

- [ ] **Step 7.8: Privacidade**

Em `privacy/index.html`: remova menções a Microsoft Clarity e Meta Pixel; descreva o quiz como "9 perguntas sem cadastro; ao final, nome e WhatsApp são opcionais e só enviados com seu consentimento, para a equipe entrar em contato sobre o resultado"; acrescente que a preferência de tamanho de letra fica salva só no seu navegador e que checklists e o diário não são armazenados; atualize a data de "última atualização" para 28 de setembro de 2026.

- [ ] **Step 7.9: Sitemap e changelog**

`sitemap.xml`: adicione `https://drakerlyhelena.com.br/menopausa/diario-de-sintomas/` (`changefreq yearly`, `priority 0.5`) e ponha `lastmod` `2026-09-28` em todas as páginas alteradas nesta branch. `CHANGELOG.md`: nova entrada no topo, `## [2026-09-28] Legibilidade, quiz com resultado antes dos dados, FAQ com busca, checklists e respiração guiada`, resumindo por página o que mudou e por quê (2 a 4 linhas por área), com a nota de que o Apps Script não precisou mudar.

- [ ] **Step 7.10: Verificação e commit**

Run: `npm run build:css && npm test` → 0 erros. Dev server porta 5607; screenshots mobile de `/`, `/menopausa/`, `/faq/` (FAB aberto: `--eval "document.querySelector('.wa-fab').open=true"`) e desktop (`--desktop`) da home com o botão de fonte; teste o toggle: `--eval "document.querySelector('.fonte-toggle').click(); document.querySelector('.fonte-toggle').click()" --wait 500`. Nenhum `pageerror`.

```bash
git add -A -- '*.html' main.js glass.js styles.css output.css sitemap.xml CHANGELOG.md
git commit -m "Site inteiro: FAB com ligar, pular conteudo, tamanho de fonte, menu acessivel, vidro leve no celular, privacidade, sitemap e changelog"
```
