// --- Liquid Glass (iOS 26) init -----------------------------------------
// Standalone, no dependencies (não usa GSAP) — carrega em todas as páginas.
// 1) Injeta o filtro SVG de refração uma única vez.
// 2) Liga a refração (.glass--refract) só em navegadores que suportam SVG
//    como backdrop-filter (Chromium). Safari/Firefox ficam no blur CSS puro.
// 3) Header pílula: alterna .is-scrolled ao rolar (micro efeito "island").
(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';

    // 1) Filtro SVG (refração sutil via feTurbulence + feDisplacementMap).
    // Construído via createElementNS (sem innerHTML) para garantir o namespace
    // SVG correto em todos os navegadores.
    function el(tag, attrs) {
        var node = document.createElementNS(SVG_NS, tag);
        for (var k in attrs) node.setAttribute(k, attrs[k]);
        return node;
    }
    function injectFilter() {
        if (document.getElementById('liquid-glass')) return;
        var svg = el('svg', { width: '0', height: '0', 'aria-hidden': 'true' });
        svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
        var filter = el('filter', { id: 'liquid-glass', x: '0', y: '0', width: '100%', height: '100%' });
        filter.appendChild(el('feTurbulence', {
            type: 'fractalNoise', baseFrequency: '0.008 0.008', numOctaves: '2', seed: '4', result: 'noise'
        }));
        filter.appendChild(el('feGaussianBlur', { in: 'noise', stdDeviation: '2', result: 'blurred' }));
        filter.appendChild(el('feDisplacementMap', {
            in: 'SourceGraphic', in2: 'blurred', scale: '14', xChannelSelector: 'R', yChannelSelector: 'G'
        }));
        svg.appendChild(filter);
        document.body.appendChild(svg);
    }

    // 2) Refração só onde o navegador suporta SVG em backdrop-filter (Chromium).
    function supportsSvgBackdrop() {
        if (!window.CSS || !CSS.supports) return false;
        // Respeita preferências de acessibilidade.
        if (window.matchMedia &&
            (matchMedia('(prefers-reduced-transparency: reduce)').matches ||
             matchMedia('(prefers-reduced-motion: reduce)').matches)) return false;
        return CSS.supports('backdrop-filter', 'url(#liquid-glass)') ||
               CSS.supports('-webkit-backdrop-filter', 'url(#liquid-glass)');
    }

    function enableRefraction() {
        if (!supportsSvgBackdrop()) return;
        // Cards/seções/footer ganham refração; header e CTA ficam só com blur
        // (legibilidade do texto que passa por trás).
        var els = document.querySelectorAll('.glass:not(.glass--header):not(.glass--cta)');
        for (var i = 0; i < els.length; i++) els[i].classList.add('glass--refract');
    }

    // 3) Header pílula: contrai ao rolar.
    function wireHeaderScroll() {
        var header = document.getElementById('navbar');
        if (!header) return;
        var update = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 50);
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
    }

    function init() {
        injectFilter();
        enableRefraction();
        wireHeaderScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
