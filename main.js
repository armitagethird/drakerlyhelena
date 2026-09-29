// --- Analytics helper ---------------------------------------------------
// Fires events to GA4 (gtag) and Microsoft Clarity if loaded.
// No-ops if neither is configured. Keeps tracking decoupled from features.
window.trackEvent = function (name, params) {
    params = params || {};
    try {
        if (typeof window.gtag === 'function') {
            window.gtag('event', name, params);
        }
        if (typeof window.clarity === 'function') {
            window.clarity('event', name);
            Object.entries(params).forEach(function (kv) {
                window.clarity('set', kv[0], String(kv[1]));
            });
        }
        if (typeof window.fbq === 'function') {
            const pixelMap = {
                quiz_start: 'InitiateCheckout',
                quiz_complete: 'Lead',
                book_consultation: 'Schedule',
                whatsapp_click: 'Contact'
            };
            const pixelEvent = pixelMap[name];
            if (pixelEvent) window.fbq('track', pixelEvent, params);
        }
    } catch (e) { /* analytics never breaks the page */ }
};

// Auto-track WhatsApp link clicks + quiz CTAs across the site.
function wireAnalytics() {
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
        a.addEventListener('click', function () {
            var section = a.closest('section, header, footer');
            window.trackEvent('whatsapp_click', {
                source: (section && section.id) || (section && section.tagName.toLowerCase()) || 'unknown',
                href: a.getAttribute('href')
            });
        });
    });

    // Scroll depth (fires once per threshold)
    var fired = {};
    window.addEventListener('scroll', function () {
        var doc = document.documentElement;
        var pct = Math.round(((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100);
        [50, 75, 90].forEach(function (mark) {
            if (pct >= mark && !fired[mark]) {
                fired[mark] = true;
                window.trackEvent('scroll_depth', { percent: mark });
            }
        });
    }, { passive: true });
}

function initHeroStagger() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.7 } });
    tl.from('#hero [data-stagger="0"]', { opacity: 0, y: 12 })
        .from('#hero [data-stagger="1"]', { opacity: 0, y: 12 }, '-=0.6')
        .from('#hero [data-stagger="2"]', { opacity: 0, y: 12 }, '-=0.6')
        .from('#hero [data-stagger="3"]', { opacity: 0, y: 12 }, '-=0.55')
        .from('#hero [data-stagger="4"]', { opacity: 0, y: 12 }, '-=0.55')
        .from('#hero [data-stagger="5"]', { opacity: 0, y: 12 }, '-=0.55')
        .from('.gs-hero-photo img', { scale: 1.02, duration: 1.4 }, 0)
        .from('.hero-rail-line', { scaleY: 0, transformOrigin: 'top center', duration: 1 }, 0.2)
        .from('.gs-hero-card', { opacity: 0, y: 16, duration: 0.8 }, 0.9);

    // Flutuação contínua e suave do card "Pausa e Reconexão" — começa após a entrada do card (~1.7s)
    gsap.to('.gs-hero-card', { y: -10, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.8 });
}

document.addEventListener("DOMContentLoaded", (event) => {
    wireAnalytics();
    wireModalFocusTrap();

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Abre o quiz ao chegar com #quiz ou ?quiz=1 (vindo de outra página)
    const wantsQuiz = location.hash === '#quiz' || new URLSearchParams(location.search).get('quiz') === '1';
    if (wantsQuiz && typeof window.openSymptomModal === 'function') setTimeout(() => window.openSymptomModal(), 450);
    window.addEventListener('hashchange', () => { if (location.hash === '#quiz') window.openSymptomModal(); });

    const overlay = document.getElementById('quiz-overlay');
    if (overlay) overlay.addEventListener('click', () => {
        if (!document.getElementById('quiz-welcome').classList.contains('hidden')) window.closeSymptomModal();
    });

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

    // Endereço: copiar e carregar mapa sob demanda
    const ADDRESS_TEXT = 'Av. Coronel Colares Moreira, Sala 310, Condomínio Edifício Monumental, Jardim Renascença, São Luís, MA, CEP 65065-720';
    const copyBtn = document.getElementById('copy-address');
    if (copyBtn) copyBtn.addEventListener('click', () => {
        if (!navigator.clipboard) { prompt('Copie o endereço:', ADDRESS_TEXT); return; }
        navigator.clipboard.writeText(ADDRESS_TEXT).then(() => {
            const label = copyBtn.textContent;
            copyBtn.textContent = 'Endereço copiado';
            setTimeout(() => { copyBtn.textContent = label; }, 2000);
        }, () => prompt('Copie o endereço:', ADDRESS_TEXT));
    });
    const loadMapBtn = document.getElementById('load-map');
    if (loadMapBtn) loadMapBtn.addEventListener('click', () => {
        const facade = document.getElementById('map-facade');
        facade.innerHTML = '<iframe src="https://maps.google.com/maps?q=Dra.+Kerly+Helena+Ginecologia+Integrativa+Maranhão&t=&z=15&ie=UTF8&iwloc=&output=embed" title="Mapa do consultório Dra Kerly Helena em São Luís" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="w-full h-full min-h-[320px] rounded-3xl border-0"></iframe>';
    });

    // GSAP-dependent enhancements: skip gracefully if the CDN failed/was blocked,
    // so mobile menu, smooth scroll, footer year and analytics below still work.
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Navbar scroll-state (.is-scrolled) é gerido por glass.js (header pílula).

        // Hero stagger (above-the-fold; runs once on load, not via ScrollTrigger)
        initHeroStagger();

        // Reveal Elements on Scroll with advanced, satisfying physics
        const revealElements = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? []
            : document.querySelectorAll('.gs-reveal');

        revealElements.forEach((elem) => {
            // Find if element has an image to add a subtle scale effect
            const img = elem.querySelector('img');

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%", // Trigger when top of element hits 85% of viewport
                    toggleActions: "play none none none"
                }
            });

            tl.fromTo(elem,
                { y: 32, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: "power4.out",
                }
            );

            // If there's an image inside, give it a beautiful zoom-out reveal
            if (img) {
                tl.fromTo(img,
                    { scale: 1.15 },
                    { scale: 1, duration: 1.8, ease: "power2.out" },
                    "-=0.9" // Start at the same time
                );
            }
        });
    }

    // Tamanho da letra: '' (normal) -> 'grande' -> 'maior'. O atributo inicial vem do script do <head>.
    const NIVEIS_FONTE = ['', 'grande', 'maior'];
    const NOME_FONTE = { '': 'normal', grande: 'grande', maior: 'maior' };
    const rotularFonte = () => {
        const nivel = document.documentElement.dataset.fonte || '';
        document.querySelectorAll('.fonte-toggle').forEach(btn => {
            btn.setAttribute('aria-label', `Tamanho da letra: ${NOME_FONTE[nivel] || 'normal'}. Toque para mudar.`);
        });
    };
    document.querySelectorAll('.fonte-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const atual = NIVEIS_FONTE.indexOf(document.documentElement.dataset.fonte || '');
            const proximo = NIVEIS_FONTE[(atual + 1) % NIVEIS_FONTE.length];
            if (proximo) document.documentElement.dataset.fonte = proximo;
            else delete document.documentElement.dataset.fonte;
            try { localStorage.setItem('drakerly_fonte', proximo); } catch (e) { /* navegação privada: vale só nesta página */ }
            rotularFonte();
        });
    });
    rotularFonte();

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        const cabecalho = mobileMenu.closest('header') || mobileBtn.parentElement;
        let fechando;
        const esconder = () => {
            clearTimeout(fechando);
            mobileMenu.removeEventListener('transitionend', aoTerminarTransicao);
            mobileMenu.classList.add('hidden');
        };
        const aoTerminarTransicao = (e) => { if (e.target === mobileMenu) esconder(); };
        const definirMenu = (aberto) => {
            clearTimeout(fechando);
            mobileMenu.removeEventListener('transitionend', aoTerminarTransicao);
            mobileBtn.setAttribute('aria-expanded', String(aberto));
            mobileBtn.classList.toggle('is-open', aberto);
            if (aberto) {
                mobileMenu.classList.remove('hidden');
                void mobileMenu.offsetWidth; // reflow: a transição parte do estado fechado
                mobileMenu.classList.add('is-open');
                return;
            }
            mobileMenu.classList.remove('is-open');
            mobileMenu.addEventListener('transitionend', aoTerminarTransicao);
            fechando = setTimeout(esconder, 260); // reserva: movimento reduzido não dispara transitionend
        };
        const estaAberto = () => mobileBtn.getAttribute('aria-expanded') === 'true';

        mobileBtn.addEventListener('click', () => definirMenu(!estaAberto()));

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape' || !estaAberto()) return;
            definirMenu(false);
            mobileBtn.focus();
        });
        document.addEventListener('click', (e) => {
            if (estaAberto() && !cabecalho.contains(e.target)) definirMenu(false);
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => definirMenu(false));
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

// --- New Modal Questionnaire Logic (4 Stages) ---

let currentQuestionIndex = 0;
let quizAnswers = [];
let userData = { name: '', phone: '', email: '', age: '', phase: '' };

// Elemento que tinha o foco antes de abrir o modal (para devolver ao fechar).
let modalPreviouslyFocusedEl = null;

// Elementos focáveis VISÍVEIS dentro do modal (ignora os que estão dentro de
// estágios .hidden — offsetParent é null para elementos não renderizados).
function getModalFocusableElements() {
    const modal = document.getElementById('symptom-modal');
    if (!modal) return [];
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(modal.querySelectorAll(selector)).filter(el => el.offsetParent !== null);
}

// Trap de Tab + Escape no modal do quiz. Registrado uma única vez: o listener
// fica em #symptom-modal e só recebe eventos quando o foco está dentro dele
// (o modal fechado é display:none, então nada dentro dele pode estar focado).
function wireModalFocusTrap() {
    const modal = document.getElementById('symptom-modal');
    if (!modal) return;

    modal.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            window.closeSymptomModal();
            return;
        }
        if (e.key !== 'Tab') return;

        const focusable = getModalFocusableElements();
        if (!focusable.length) return;

        const activeIndex = focusable.indexOf(document.activeElement);
        const lastIndex = focusable.length - 1;

        if (e.shiftKey && activeIndex <= 0) {
            // Shift+Tab no primeiro (ou com foco fora da lista, ex. no container) -> vai ao último.
            e.preventDefault();
            focusable[lastIndex].focus();
        } else if (!e.shiftKey && (activeIndex === -1 || activeIndex === lastIndex)) {
            // Tab no último (ou com foco fora da lista) -> volta ao primeiro.
            e.preventDefault();
            focusable[0].focus();
        }
    });
}

// 8 desire-based scale questions + 1 phase-of-life multiple-choice = 9 total.
// Scale weights: Muito = 3, Um pouco = 1, Nada = 0.
// Higher score in a dimension = stronger desire to improve there.
const quizQuestions = [
    { type: "scale", text: "Quero ter mais energia e disposição no meu dia.", dimension: "ENERGIA" },
    { type: "scale", text: "Quero me sentir leve no meu corpo, sem dores ou tensão.", dimension: "ENERGIA" },
    { type: "scale", text: "Quero dormir profundamente e acordar descansada.", dimension: "DESCANSO" },
    { type: "scale", text: "Quero conseguir desacelerar minha mente quando preciso.", dimension: "DESCANSO" },
    { type: "scale", text: "Quero estar mais presente comigo mesma e nas pequenas coisas do dia.", dimension: "PRESENCA" },
    { type: "scale", text: "Quero me sentir bonita e em paz com meu corpo.", dimension: "PRESENCA" },
    { type: "scale", text: "Quero perceber meu corpo em equilíbrio (ciclo, libido, humor).", dimension: "VITALIDADE" },
    { type: "scale", text: "Quero redescobrir prazer e desejo no meu dia a dia.", dimension: "VITALIDADE" },
    { type: "choice", text: "Em qual momento da sua vida você está agora?", dimension: "FASE", choices: [
        { label: "Fase fértil, sem grandes mudanças", value: "fertil" },
        { label: "Tentando engravidar", value: "tentando" },
        { label: "Pós-parto / amamentando", value: "pos_parto" },
        { label: "Perimenopausa (sintomas começando)", value: "perimenopausa" },
        { label: "Menopausa ou pós-menopausa", value: "menopausa" },
        { label: "Prefiro não dizer", value: "indefinido" }
    ] }
];

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

window.closeSymptomModal = function () {
    const modal = document.getElementById('symptom-modal');
    const modalContent = document.getElementById('symptom-modal-content');
    modal.classList.add('opacity-0');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
    stopAnimationTweens();
    document.getElementById('quiz-sticky-cta').classList.add('hidden');

    // Acessibilidade: devolve o foco a quem abriu o modal, se ainda existir no DOM.
    if (modalPreviouslyFocusedEl && document.body.contains(modalPreviouslyFocusedEl)) {
        try { modalPreviouslyFocusedEl.focus({ preventScroll: true }); } catch (e) { modalPreviouslyFocusedEl.focus(); }
    }
    modalPreviouslyFocusedEl = null;
};

window.formatPhoneInput = function (input) {
    let digits = input.value.replace(/\D/g, '').slice(0, 11);
    let out = digits;
    if (digits.length > 0) out = '(' + digits.slice(0, 2);
    if (digits.length >= 2) out += ') ' + digits.slice(2, digits.length === 11 ? 7 : 6);
    if (digits.length > (digits.length === 11 ? 7 : 6)) out += '-' + digits.slice(digits.length === 11 ? 7 : 6);
    input.value = out;
};

window.startQuestions = function () {
    window.trackEvent('quiz_start');
    transitionQuizStage('quiz-welcome', 'quiz-questions', () => {
        renderQuestion();
    });
};

function renderQuestion() {
    const question = quizQuestions[questionOrder[currentQuestionIndex]];
    const container = document.getElementById('question-container');
    const progressText = document.getElementById('quiz-progress-text');
    const progressBar = document.getElementById('quiz-progress-bar');
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.innerText = `Pergunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;

    if (question.type === 'choice') {
        const options = question.choices.map(c =>
            `<button onclick="handlePhase('${c.value}')" class="option-btn"><span class="font-medium">${c.label}</span></button>`
        ).join('');
        container.innerHTML = `
            <div class="space-y-6 slide-up">
                <p class="text-xl md:text-2xl font-medium text-charcoal leading-tight">${question.text}</p>
                <div class="space-y-3 pt-4">
                    ${options}
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="space-y-6 slide-up">
                <p class="text-xs uppercase tracking-widest text-blush-600 font-semibold">Marque o quanto isso ressoa com você hoje</p>
                <p class="text-xl md:text-2xl font-medium text-charcoal leading-tight">${question.text}</p>
                <div class="space-y-3 pt-4">
                    <button onclick="handleAnswer(3)" class="option-btn"><span class="font-medium">Muito, é exatamente o que eu quero</span></button>
                    <button onclick="handleAnswer(1)" class="option-btn"><span class="font-medium">Um pouco, está no meu radar</span></button>
                    <button onclick="handleAnswer(0)" class="option-btn"><span class="font-medium">Nada, já estou bem nessa</span></button>
                </div>
            </div>
        `;
    }
}

window.handleAnswer = function (weight) {
    quizAnswers.push({ dimension: quizQuestions[questionOrder[currentQuestionIndex]].dimension, weight: weight });
    advanceQuiz();
};

window.handlePhase = function (value) {
    userData.phase = value;
    advanceQuiz();
};

function advanceQuiz() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        window.trackEvent('quiz_questions_complete', { phase: userData.phase || 'unspecified' });
        transitionQuizStage('quiz-questions', 'quiz-animation', runHealthFingerprint);
    }
}

// Holds infinite tweens (particles, breathing) so we can kill them on modal close
let animationTweens = [];

function stopAnimationTweens() {
    animationTweens.forEach(tw => { try { tw.kill(); } catch (e) {} });
    animationTweens = [];
}

function runHealthFingerprint() {
    if (typeof gsap === 'undefined') { showResults(); return; }

    const textEl = document.getElementById('animation-text');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    stopAnimationTweens();

    // Reset elements to initial state
    gsap.set('.anim-aura', { opacity: 0 });
    gsap.set('.anim-petal-outer path, .anim-petal-inner path', {
        scale: 0, opacity: 0, transformOrigin: '50% 100%'
    });
    gsap.set('.anim-rose-pistil', { opacity: 0, scale: 0.4, transformOrigin: 'center center' });
    gsap.set('.anim-particle', { opacity: 0, y: 0 });
    gsap.set(textEl, { opacity: 1 });

    const phrases = {
        opening: 'Cada resposta sua revela algo...',
        middle:  'Lendo seu padrão de vitalidade...',
        closing: 'Seu mapa de bem-estar está pronto.'
    };
    textEl.innerText = phrases.opening;

    if (reduceMotion) {
        // Static, accessible version
        gsap.set('.anim-aura', { opacity: 0.95 });
        gsap.set('.anim-petal-outer path, .anim-petal-inner path', { scale: 1, opacity: 1 });
        gsap.set('.anim-rose-pistil', { opacity: 1, scale: 1 });
        gsap.delayedCall(2.0, () => {
            textEl.innerText = phrases.closing;
            gsap.delayedCall(1.5, showResults);
        });
        return;
    }

    const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => { showResults(); }
    });

    // 1. Aura fades in
    tl.to('.anim-aura', { opacity: 1, duration: 1.6 }, 0)
      // Mid-animation phrase swap
      .to(textEl, { opacity: 0, duration: 0.4 }, 1.2)
      .add(() => { textEl.innerText = phrases.middle; })
      .to(textEl, { opacity: 1, duration: 0.4 })
      // 2. Rose center glows on
      .to('.anim-rose-pistil', {
          opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)'
      }, 1.8)
      // 3. Outer petals bloom in sequence
      .to('.anim-petal-outer path', {
          scale: 1, opacity: 1,
          duration: 1.0, stagger: 0.08, ease: 'back.out(1.7)'
      }, 2.0)
      // 4. Inner petals bloom (faster, slightly delayed)
      .to('.anim-petal-inner path', {
          scale: 1, opacity: 1,
          duration: 0.8, stagger: 0.06, ease: 'back.out(2)'
      }, 2.7)
      // 5. Closing phrase
      .to(textEl, { opacity: 0, duration: 0.4 }, 4.0)
      .add(() => { textEl.innerText = phrases.closing; })
      .to(textEl, { opacity: 1, duration: 0.4 })
      .to({}, { duration: 1.5 });

    // Continuous loops: rose center pulse + aura breathing
    animationTweens.push(
        gsap.to('.anim-rose-pistil', {
            scale: 1.18, duration: 1.6, repeat: -1, yoyo: true,
            ease: 'sine.inOut', delay: 4
        }),
        gsap.to('.anim-aura', {
            scale: 1.06, transformOrigin: '160px 160px',
            duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2
        })
    );

    // Rising particles loop
    document.querySelectorAll('.anim-particle').forEach((p, i) => {
        const tween = gsap.timeline({ repeat: -1, delay: 3.0 + i * 0.4 })
            .fromTo(p,
                { opacity: 0, y: 0 },
                { opacity: 0.7, duration: 0.7 })
            .to(p, {
                y: -130 - Math.random() * 60,
                opacity: 0,
                duration: 3 + Math.random() * 1.5,
                ease: 'power1.out'
            }, 0.7);
        animationTweens.push(tween);
    });
}

const PHASE_LABELS = { fertil: 'fase fértil', tentando: 'tentando engravidar', pos_parto: 'pós-parto', perimenopausa: 'perimenopausa', menopausa: 'menopausa ou pós-menopausa' };
const dimensionLabelsShort = { ENERGIA: 'energia e leveza', DESCANSO: 'descanso e sono', PRESENCA: 'presença e paz com o corpo', VITALIDADE: 'vitalidade e prazer' };
let lastTopDimensions = [];
let lastScores = {};

function buildWhatsappMessage() {
    const dims = lastTopDimensions.map(d => dimensionLabelsShort[d]).filter(Boolean).join(' e ');
    let msg = 'Olá! Fiz o teste de bem-estar no site.';
    if (dims) msg += ' Meu mapa apontou: ' + dims + '.';
    if (PHASE_LABELS[userData.phase]) msg += ' Momento de vida: ' + PHASE_LABELS[userData.phase] + '.';
    if (userData.name) msg += ' Meu nome é ' + userData.name + '.';
    return msg + ' Gostaria de agendar uma consulta integrativa.';
}

function showResults() {
    const scores = { ENERGIA: 0, DESCANSO: 0, PRESENCA: 0, VITALIDADE: 0 };
    quizAnswers.forEach(a => {
        if (scores[a.dimension] !== undefined) scores[a.dimension] += a.weight;
    });
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topDimensions = [sorted[0][0], sorted[1][0]];
    lastScores = scores;
    lastTopDimensions = topDimensions;
    window.trackEvent('quiz_complete', { phase: userData.phase || 'unspecified' });

    document.getElementById('result-greeting').innerText = 'Aqui está o seu mapa.';

    const dimensionLabels = {
        ENERGIA:    'energia e leveza',
        DESCANSO:   'descanso e silêncio',
        PRESENCA:   'presença e paz com seu corpo',
        VITALIDADE: 'vitalidade e prazer'
    };
    const dimensionEl = document.getElementById('result-dimension');
    if (dimensionEl) {
        dimensionEl.innerText = dimensionLabels[topDimensions[0]] || 'bem-estar';
    }

    const paragraphs = {
        ENERGIA:    "Você quer mais energia e leveza no corpo. Esse é um dos primeiros sinais de que algo no seu equilíbrio interno pede atenção e cuidado.",
        DESCANSO:   "Você quer mais descanso real — sono profundo e mente que sabe pausar. Seu sistema nervoso está pedindo um cuidado mais consciente.",
        PRESENCA:   "Você quer voltar a habitar seu corpo com leveza, presença e aceitação. Esse é o coração do cuidado integrativo.",
        VITALIDADE: "Você quer reencontrar sua vitalidade (ciclo, libido, prazer, humor) em equilíbrio. É exatamente nesse território que a abordagem integrativa atua."
    };

    const phaseAdjustment = {
        fertil:        "",
        tentando:      " A jornada de fertilidade pede um olhar atento — também caminhamos com você nessa fase.",
        pos_parto:     " O pós-parto é uma travessia. Aqui, você é cuidada por inteiro.",
        perimenopausa: " A perimenopausa é uma fase de transformação — não de resignação. Há muito que pode ser feito.",
        menopausa:     " A menopausa é uma nova fase, não um fim. O cuidado integrativo te acompanha de perto.",
        indefinido:    "",
        '':            ''
    };

    const paraEl = document.getElementById('result-paragraph');
    paraEl.innerText = paragraphs[topDimensions[0]] + (phaseAdjustment[userData.phase] || '');

    const serviceTemplates = {
        ENERGIA:    { title: "Yoga",                               desc: "Movimento consciente para devolver leveza e energia ao corpo.",          icon: "sun" },
        DESCANSO:   { title: "Respiração & Meditação",             desc: "Práticas para acalmar o sistema nervoso e melhorar o sono.",             icon: "wind" },
        PRESENCA:   { title: "Meditação",                          desc: "Para voltar a habitar o presente, com mais conexão e silêncio interno.", icon: "moon" },
        VITALIDADE: { title: "Fitoterapia & ajustes integrativos", desc: "Plantas medicinais e ajustes de estilo de vida para equilíbrio hormonal.", icon: "feather" }
    };

    const servicesContainer = document.getElementById('secondary-services');
    servicesContainer.innerHTML = topDimensions.map(dim => {
        const s = serviceTemplates[dim];
        const tag = dim === 'DESCANSO' ? 'a href="/yoga/#respiracao"' : 'div';
        const closeTag = dim === 'DESCANSO' ? 'a' : 'div';
        return `
            <${tag} class="flex items-start gap-4 p-5 bg-white/85 backdrop-blur-sm rounded-2xl border border-blush-100/60 hover:bg-white hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md">
                <div class="w-11 h-11 bg-blush-100/70 rounded-2xl flex items-center justify-center shrink-0"><i data-feather="${s.icon}" class="w-6 h-6 text-blush-600"></i></div>
                <div class="flex-1 min-w-0">
                    <p class="font-serif text-charcoal text-base font-semibold mb-1 leading-tight">${s.title}</p>
                    <p class="text-sm text-charcoal/80 leading-relaxed">${s.desc}</p>
                </div>
            </${closeTag}>
        `;
    }).join('');

    transitionQuizStage('quiz-animation', 'quiz-results', () => {
        const stickyCta = document.getElementById('quiz-sticky-cta');
        stickyCta.classList.remove('hidden');
        if (typeof feather !== 'undefined' && feather.replace) feather.replace();
    });
}

window.bookConsultation = function() {
    window.trackEvent('book_consultation', { source: 'quiz_result', phase: userData.phase || 'unspecified' });
    notifyWhatsappClick();
    const encodedMessage = encodeURIComponent(buildWhatsappMessage());
    const targetPhone = "5598981532153";
    window.open(`https://wa.me/${targetPhone}?text=${encodedMessage}`, '_blank');
};

// --- Lead capture --------------------------------------------------------
// Google Sheets via Apps Script Web App.
// Cole aqui a URL /exec gerada após publicar o Apps Script como Web App.
const LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycbwjNqyQvQbX8Q0q6hdCCM7u8Kwx4Igs1P-KSHTrV8cudcY60Xo2d2aRwmf8tjISs8YZjg/exec";

function postToEndpoint(payload) {
    if (!LEAD_ENDPOINT) return;
    const body = JSON.stringify(payload);
    // sendBeacon sobrevive navegação (window.open p/ WhatsApp). Fallback fetch keepalive.
    if (navigator.sendBeacon) {
        try {
            const blob = new Blob([body], { type: 'text/plain' });
            if (navigator.sendBeacon(LEAD_ENDPOINT, blob)) return;
        } catch (e) { /* fallback */ }
    }
    fetch(LEAD_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain' },
        body: body
    }).catch(function () { /* offline: sem retry */ });
}

function submitLead(extra) {
    const payload = {
        event: 'lead',
        name: userData.name,
        phone: userData.phone,
        email: userData.email || '',
        age: userData.age || '',
        phase: userData.phase || '',
        topDimensions: (extra && extra.top) || [],
        scores: (extra && extra.scores) || {},
        timestamp: new Date().toISOString(),
        page: window.location.href
    };

    postToEndpoint(payload);
}

function notifyWhatsappClick() {
    if (!userData.phone) return;
    postToEndpoint({
        event: 'whatsapp_click',
        name: userData.name,
        phone: userData.phone,
        timestamp: new Date().toISOString()
    });
}

function transitionQuizStage(fromId, toId, callback) {
    const fromEl = document.getElementById(fromId);
    const toEl = document.getElementById(toId);
    const modalContent = document.getElementById('symptom-modal-content');

    if (typeof gsap === 'undefined') {
        // No animation library: swap stages instantly instead of breaking the quiz.
        fromEl.classList.add('hidden');
        toEl.classList.remove('hidden');
        const scrollArea = document.getElementById('quiz-scroll-area');
        if (scrollArea) scrollArea.scrollTop = 0;
        if (modalContent) modalContent.scrollTop = 0;
        if (callback) callback();
        return;
    }

    gsap.to(fromEl, {
        opacity: 0, y: -20, duration: 0.4, ease: "power2.in",
        onComplete: () => {
            fromEl.classList.add('hidden');
            toEl.classList.remove('hidden');
            
            // Critical: Reset scroll to top. The scrollable area is #quiz-scroll-area;
            // resetting modalContent alone had no effect (it doesn't scroll).
            const scrollArea = document.getElementById('quiz-scroll-area');
            if (scrollArea) scrollArea.scrollTop = 0;
            if (modalContent) modalContent.scrollTop = 0;
            
            gsap.fromTo(toEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
            if (callback) callback();
        }
    });
}
