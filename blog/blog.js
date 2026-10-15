(function () {
    'use strict';
    var article = document.querySelector('article');
    if (!article) return;
    var titulo = document.title;
    var url = location.origin + location.pathname;
    document.querySelectorAll('[data-compartilhar-whatsapp]').forEach(function (a) {
        a.href = 'https://wa.me/?text=' + encodeURIComponent(titulo + ' ' + url);
    });
    var rotuloLink = navigator.share ? 'Compartilhar' : 'Copiar link';
    document.querySelectorAll('[data-copiar-link]').forEach(function (b) {
        var label = b.querySelector('span');
        label.textContent = rotuloLink;
        b.addEventListener('click', function () {
            var done = function () { label.textContent = 'Link copiado'; setTimeout(function () { label.textContent = rotuloLink; }, 2000); };
            var manual = function () { window.prompt('Copie o link:', url); };
            if (navigator.share) { navigator.share({ title: titulo, url: url }).catch(function () {}); return; }
            if (navigator.clipboard) navigator.clipboard.writeText(url).then(done).catch(manual); else manual();
        });
    });
    document.querySelectorAll('[data-checklist]').forEach(function (bloco) {
        var checks = bloco.querySelectorAll('input[type="checkbox"]');
        var link = bloco.querySelector('[data-checklist-whatsapp]');
        var status = bloco.querySelector('[data-checklist-status]');
        var instrucao = status.textContent;
        var abertura = bloco.getAttribute('data-checklist');
        var fecho = ' Gostaria de agendar uma avaliação com a Dra. Kerly Helena.';
        bloco.addEventListener('change', function () {
            var marcados = Array.prototype.filter.call(checks, function (c) { return c.checked; }).map(function (c) { return c.value; });
            var lista = marcados.length ? ' O que percebo em mim: ' + marcados.join('; ') + '.' : '';
            link.href = 'https://wa.me/5598981532153?text=' + encodeURIComponent(abertura + lista + fecho);
            status.textContent = marcados.length ? marcados.length + (marcados.length === 1 ? ' item marcado' : ' itens marcados') + '. A mensagem já está pronta.' : instrucao;
        });
    });
    var botao = document.querySelector('[data-ouvir]');
    if (!botao || !('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return;
    botao.hidden = false;
    var label = botao.querySelector('span');
    var falando = false;
    var LIMITE = 600; // o Chrome corta falas longas; por isso a leitura vai em blocos
    function blocos() {
        var partes = [document.querySelector('h1').textContent];
        article.querySelectorAll('h2, p, li').forEach(function (el) { if (!el.closest('[data-artigo-acoes], nav')) partes.push(el.textContent); });
        var saida = [], atual = '';
        partes.forEach(function (p) {
            p = p.replace(/\s+/g, ' ').trim();
            if (!p) return;
            if (!/[.!?:]$/.test(p)) p += '.';
            (p.match(/[^.!?]+[.!?:]*/g) || [p]).forEach(function (frase) {
                frase = frase.trim();
                if (atual && (atual + ' ' + frase).length > LIMITE) { saida.push(atual); atual = ''; }
                atual = atual ? atual + ' ' + frase : frase;
            });
        });
        if (atual) saida.push(atual);
        return saida;
    }
    var sessao = 0;
    function parar() { sessao++; window.speechSynthesis.cancel(); falando = false; label.textContent = 'Ouvir este artigo'; }
    function falar(fila, i, minha) {
        if (minha !== sessao) return;
        if (i >= fila.length) { parar(); return; }
        var u = new SpeechSynthesisUtterance(fila[i]);
        u.lang = 'pt-BR'; u.rate = 0.95;
        var voz = window.speechSynthesis.getVoices().find(function (v) { return /pt[-_]BR/i.test(v.lang); });
        if (voz) u.voice = voz;
        u.onend = function () { falar(fila, i + 1, minha); };
        u.onerror = function () { if (minha === sessao) parar(); };
        window.speechSynthesis.speak(u);
    }
    botao.addEventListener('click', function () {
        if (falando) { parar(); return; }
        sessao++;
        window.speechSynthesis.cancel();
        falando = true; label.textContent = 'Parar de ouvir';
        falar(blocos(), 0, sessao);
    });
    window.addEventListener('pagehide', parar);
})();
