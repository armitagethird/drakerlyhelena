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
        .from('.gs-hero-card', { opacity: 0, y: 16, duration: 0.8 }, 0.9)
        .from('.gs-hero-scrollhint', { opacity: 0, duration: 0.6 }, 1.1);

    // Flutuação contínua e suave do card "Pausa e Reconexão" — começa após a entrada do card (~1.7s)
    gsap.to('.gs-hero-card', { y: -10, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.8 });

    const hint = document.querySelector('.gs-hero-scrollhint');
    if (hint) {
        hint.style.transition = 'opacity 400ms ease';
        window.addEventListener('scroll', () => {
            hint.style.opacity = window.scrollY > 200 ? '0' : '1';
        }, { passive: true });
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    wireAnalytics();

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Auto-open quiz when arriving from another page with ?quiz=1
    try {
        if (new URLSearchParams(window.location.search).get('quiz') === '1'
            && typeof window.openSymptomModal === 'function') {
            setTimeout(() => window.openSymptomModal(), 450);
        }
    } catch (e) { /* ignore */ }

    // GSAP-dependent enhancements: skip gracefully if the CDN failed/was blocked,
    // so mobile menu, smooth scroll, footer year and analytics below still work.
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Navbar scroll-state (.is-scrolled) é gerido por glass.js (header pílula).

        // Hero stagger (above-the-fold; runs once on load, not via ScrollTrigger)
        initHeroStagger();

        // Reveal Elements on Scroll with advanced, satisfying physics
        const revealElements = document.querySelectorAll('.gs-reveal');

        revealElements.forEach((elem) => {
            // Find if element has an image to add a subtle scale effect
            const img = elem.querySelector('img');

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%", // Trigger when top of element hits 85% of viewport
                    toggleActions: "play none none reverse"
                }
            });

            tl.fromTo(elem,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.4,
                    ease: "power4.out",
                }
            );

            // If there's an image inside, give it a beautiful zoom-out reveal
            if (img) {
                tl.fromTo(img,
                    { scale: 1.15 },
                    { scale: 1, duration: 1.8, ease: "power2.out" },
                    "-=1.4" // Start at the same time
                );
            }
        });
    }

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');

            // Adjust icon
            if (mobileMenu.classList.contains('hidden')) {
                mobileBtn.innerHTML = '<i data-feather="menu"></i>';
                mobileBtn.setAttribute('aria-expanded', 'false');
            } else {
                mobileBtn.innerHTML = '<i data-feather="x"></i>';
                mobileBtn.setAttribute('aria-expanded', 'true');
            }
            feather.replace();
        });

        // Close menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileBtn.innerHTML = '<i data-feather="menu"></i>';
                mobileBtn.setAttribute('aria-expanded', 'false');
                feather.replace();
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

    // Fluid Letter Hover Animation (Desktop Only)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        // Target main text elements to add the playful letter interaction
        const textElements = document.querySelectorAll('main h1, main h2, main h3');

        textElements.forEach(el => {
            // Check if element has text nodes to split. Avoid already structured or complex interactive elements like cards if they glitch, but standard text is fine.
            Array.from(el.childNodes).forEach(node => {
                // Process only raw text nodes that have visible characters
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                    const words = node.textContent.split(/(\s+)/);
                    const fragment = document.createDocumentFragment();

                    words.forEach(word => {
                        if (word.trim() === '') {
                            // Keep whitespaces intact
                            fragment.appendChild(document.createTextNode(word));
                        } else {
                            // Wrap words to prevent them from breaking halfway to the next line
                            const wordSpan = document.createElement('span');
                            wordSpan.style.display = 'inline-block';
                            wordSpan.style.whiteSpace = 'nowrap';

                            // Wrap each character individually
                            for (let i = 0; i < word.length; i++) {
                                const charSpan = document.createElement('span');
                                charSpan.className = 'hover-char';
                                charSpan.textContent = word[i];
                                wordSpan.appendChild(charSpan);
                            }
                            fragment.appendChild(wordSpan);
                        }
                    });

                    node.parentNode.replaceChild(fragment, node);
                }
            });
        });
    }
});

// --- New Modal Questionnaire Logic (4 Stages) ---

let currentQuestionIndex = 0;
let quizAnswers = [];
let userData = { name: '', phone: '', email: '', age: '', phase: '' };

// Intro substep state (5 substeps: name, phone, email, age, consent)
let introSubstep = 0;
const INTRO_TOTAL_SUBSTEPS = 5;

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

window.openSymptomModal = function () {
    const modal = document.getElementById('symptom-modal');
    const modalContent = document.getElementById('symptom-modal-content');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';
    document.getElementById('quiz-sticky-cta').classList.add('hidden');

    currentQuestionIndex = 0;
    quizAnswers = [];

    document.getElementById('quiz-welcome').classList.remove('hidden');
    document.getElementById('quiz-intro').classList.add('hidden');
    document.getElementById('quiz-questions').classList.add('hidden');
    document.getElementById('quiz-animation').classList.add('hidden');
    document.getElementById('quiz-results').classList.add('hidden');

    document.getElementById('quiz-name').value = '';
    document.getElementById('quiz-phone').value = '';
    document.getElementById('quiz-email').value = '';
    document.getElementById('quiz-age').value = '';
    document.getElementById('quiz-consent').checked = false;

    introSubstep = 0;
    showIntroSubstep(0);
    clearAllIntroErrors();

    window.trackEvent('quiz_open');
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
};

// --- Intro Substep Controls ---

const INTRO_FIELD_BY_SUBSTEP = {
    0: 'quiz-name',
    1: 'quiz-phone',
    2: 'quiz-email',
    3: 'quiz-age',
    4: 'quiz-consent'
};

window.formatPhoneInput = function (input) {
    let digits = input.value.replace(/\D/g, '').slice(0, 11);
    let out = digits;
    if (digits.length > 0) out = '(' + digits.slice(0, 2);
    if (digits.length >= 2) out += ') ' + digits.slice(2, digits.length === 11 ? 7 : 6);
    if (digits.length > (digits.length === 11 ? 7 : 6)) out += '-' + digits.slice(digits.length === 11 ? 7 : 6);
    input.value = out;
};

function showIntroError(substep, message) {
    const el = document.querySelector(`[data-error-for="${substep}"]`);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
    const fieldId = INTRO_FIELD_BY_SUBSTEP[substep];
    const field = document.getElementById(fieldId);
    if (field && field.type !== 'checkbox') field.classList.add('!border-red-400');
}

function clearIntroError(substep) {
    const el = document.querySelector(`[data-error-for="${substep}"]`);
    if (el) { el.textContent = ''; el.classList.add('hidden'); }
    const fieldId = INTRO_FIELD_BY_SUBSTEP[substep];
    const field = document.getElementById(fieldId);
    if (field) field.classList.remove('!border-red-400');
}

function clearAllIntroErrors() {
    for (let i = 0; i < INTRO_TOTAL_SUBSTEPS; i++) clearIntroError(i);
}

function validateIntroSubstep(i) {
    if (i === 0) {
        const v = document.getElementById('quiz-name').value.trim();
        if (v.length < 2) { showIntroError(0, 'Conta pra mim como você quer ser chamada.'); return false; }
    } else if (i === 1) {
        const v = document.getElementById('quiz-phone').value.trim();
        const digits = v.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 11) { showIntroError(1, 'WhatsApp precisa ter DDD + número (10 ou 11 dígitos).'); return false; }
    } else if (i === 2) {
        const v = document.getElementById('quiz-email').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { showIntroError(2, 'Esse e-mail não parece válido. Confere?'); return false; }
    } else if (i === 3) {
        const v = parseInt(document.getElementById('quiz-age').value, 10);
        if (!v || v < 18 || v > 99) { showIntroError(3, 'Coloque uma idade entre 18 e 99.'); return false; }
    } else if (i === 4) {
        if (!document.getElementById('quiz-consent').checked) { showIntroError(4, 'Precisamos do seu aceite (LGPD) para seguir.'); return false; }
    }
    clearIntroError(i);
    return true;
}

function showIntroSubstep(i) {
    document.querySelectorAll('.intro-substep').forEach(el => el.classList.add('hidden'));
    const target = document.querySelector(`.intro-substep[data-substep="${i}"]`);
    if (!target) return;
    target.classList.remove('hidden');

    const progressText = document.getElementById('intro-progress-text');
    const progressBar = document.getElementById('intro-progress-bar');
    if (progressText) progressText.textContent = `Passo ${i + 1} de ${INTRO_TOTAL_SUBSTEPS}`;
    if (progressBar) progressBar.style.width = `${((i + 1) / INTRO_TOTAL_SUBSTEPS) * 100}%`;

    const backBtn = document.getElementById('intro-back-btn');
    const nextBtn = document.getElementById('intro-next-btn');
    if (backBtn) {
        backBtn.classList.remove('hidden');
        backBtn.textContent = i === 0 ? '← Voltar às perguntas' : '← Voltar';
    }
    if (nextBtn) nextBtn.textContent = i === INTRO_TOTAL_SUBSTEPS - 1 ? 'Ver meu resultado' : 'Próximo';

    if (typeof gsap !== 'undefined') {
        gsap.fromTo(target, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    }

    const scrollArea = document.getElementById('quiz-scroll-area');
    if (scrollArea) scrollArea.scrollTop = 0;

    requestAnimationFrame(() => {
        const fieldId = INTRO_FIELD_BY_SUBSTEP[i];
        const field = document.getElementById(fieldId);
        if (field && field.type !== 'checkbox') {
            try { field.focus({ preventScroll: true }); } catch (e) { field.focus(); }
        }
    });
}

window.nextIntroSubstep = function () {
    if (!validateIntroSubstep(introSubstep)) return;
    window.trackEvent('quiz_intro_step', { step_index: introSubstep, field: INTRO_FIELD_BY_SUBSTEP[introSubstep] });
    if (introSubstep < INTRO_TOTAL_SUBSTEPS - 1) {
        introSubstep++;
        showIntroSubstep(introSubstep);
    } else {
        finalizeLeadCapture();
    }
};

window.prevIntroSubstep = function () {
    if (introSubstep > 0) {
        clearIntroError(introSubstep);
        introSubstep--;
        showIntroSubstep(introSubstep);
    } else {
        // From first data-capture step, go back to last question (phase).
        clearIntroError(0);
        transitionQuizStage('quiz-intro', 'quiz-questions', () => {
            currentQuestionIndex = quizQuestions.length - 1;
            renderQuestion();
        });
    }
};

window.startQuestions = function () {
    window.trackEvent('quiz_start');
    transitionQuizStage('quiz-welcome', 'quiz-questions', () => {
        renderQuestion();
    });
};

function finalizeLeadCapture() {
    // Defensive: re-validate all substeps; jump to first failing one if any.
    for (let i = 0; i < INTRO_TOTAL_SUBSTEPS; i++) {
        if (!validateIntroSubstep(i)) {
            introSubstep = i;
            showIntroSubstep(i);
            return;
        }
    }
    userData.name = document.getElementById('quiz-name').value.trim();
    userData.phone = document.getElementById('quiz-phone').value.trim();
    userData.email = document.getElementById('quiz-email').value.trim();
    userData.age = document.getElementById('quiz-age').value.trim();
    window.trackEvent('quiz_complete', { phase: userData.phase || 'unspecified' });
    transitionQuizStage('quiz-intro', 'quiz-animation', () => {
        runHealthFingerprint();
    });
}

function renderQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const container = document.getElementById('question-container');
    const progressText = document.getElementById('quiz-progress-text');
    const progressBar = document.getElementById('quiz-progress-bar');
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.innerText = `Passo ${currentQuestionIndex + 1} de ${quizQuestions.length}`;

    if (question.type === 'choice') {
        const options = question.choices.map(c =>
            `<button onclick="handlePhase('${c.value}')" class="option-btn"><span class="font-medium">${c.label}</span></button>`
        ).join('');
        container.innerHTML = `
            <div class="space-y-6 slide-up">
                <h4 class="text-xl md:text-2xl font-medium text-charcoal leading-tight">${question.text}</h4>
                <div class="space-y-3 pt-4">
                    ${options}
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="space-y-6 slide-up">
                <p class="text-xs uppercase tracking-widest text-blush-400 font-semibold">Marque o quanto isso ressoa com você hoje</p>
                <h4 class="text-xl md:text-2xl font-medium text-charcoal leading-tight">${question.text}</h4>
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
    quizAnswers.push({ dimension: quizQuestions[currentQuestionIndex].dimension, weight: weight });
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
        introSubstep = 0;
        transitionQuizStage('quiz-questions', 'quiz-intro', () => {
            clearAllIntroErrors();
            showIntroSubstep(0);
        });
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

function showResults() {
    const scores = { ENERGIA: 0, DESCANSO: 0, PRESENCA: 0, VITALIDADE: 0 };
    quizAnswers.forEach(a => {
        if (scores[a.dimension] !== undefined) scores[a.dimension] += a.weight;
    });
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topDimensions = [sorted[0][0], sorted[1][0]];

    document.getElementById('result-greeting').innerText = `Olá, ${userData.name}.`;

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
        ENERGIA:    { title: "Yoga",                               desc: "Movimento consciente para devolver leveza e energia ao corpo.",          icon: "🧘" },
        DESCANSO:   { title: "Respiração & Meditação",             desc: "Práticas para acalmar o sistema nervoso e melhorar o sono.",             icon: "🌬️" },
        PRESENCA:   { title: "Meditação",                          desc: "Para voltar a habitar o presente, com mais conexão e silêncio interno.", icon: "🪷" },
        VITALIDADE: { title: "Fitoterapia & ajustes integrativos", desc: "Plantas medicinais e ajustes de estilo de vida para equilíbrio hormonal.", icon: "🌿" }
    };

    const servicesContainer = document.getElementById('secondary-services');
    servicesContainer.innerHTML = topDimensions.map(dim => {
        const s = serviceTemplates[dim];
        return `
            <div class="flex items-start gap-4 p-5 bg-white/85 backdrop-blur-sm rounded-2xl border border-blush-100/60 hover:bg-white hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md">
                <div class="w-11 h-11 bg-blush-100/70 rounded-2xl flex items-center justify-center text-xl shrink-0">${s.icon}</div>
                <div class="flex-1 min-w-0">
                    <h5 class="font-serif text-charcoal text-base font-semibold mb-1 leading-tight">${s.title}</h5>
                    <p class="text-sm text-charcoal/65 font-light leading-relaxed">${s.desc}</p>
                </div>
            </div>
        `;
    }).join('');

    submitLead({ scores: scores, top: topDimensions });
    transitionQuizStage('quiz-animation', 'quiz-results', () => {
        const stickyCta = document.getElementById('quiz-sticky-cta');
        stickyCta.classList.remove('hidden');
        if (typeof feather !== 'undefined' && feather.replace) feather.replace();
    });
}

window.bookConsultation = function() {
    window.trackEvent('book_consultation', { source: 'quiz_result', phase: userData.phase || 'unspecified' });
    notifyWhatsappClick();
    const message = `Olá! Fiz o questionário de bem-estar e gostaria de agendar uma Consulta Integrativa. Meu nome é ${userData.name}.`;
    const encodedMessage = encodeURIComponent(message);
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
    }).catch(function () { /* offline / failed — backup no localStorage */ });
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

    // Backup no localStorage
    try {
        const existing = JSON.parse(localStorage.getItem('drakerly_leads') || '[]');
        existing.push(payload);
        localStorage.setItem('drakerly_leads', JSON.stringify(existing.slice(-50)));
    } catch (e) { /* ignore quota errors */ }

    postToEndpoint(payload);
}

function notifyWhatsappClick() {
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
