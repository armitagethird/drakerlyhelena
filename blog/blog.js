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
