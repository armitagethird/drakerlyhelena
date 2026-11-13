// Checklist que vira mensagem de WhatsApp (blog e páginas de /checklist/). Marcação:
//   [data-checklist="abertura da mensagem"] envolve os checkboxes (o value de cada um entra na lista),
//   o link [data-checklist-whatsapp] e o texto [data-checklist-status] (com aria-live).
// Nada é guardado nem enviado daqui: a mensagem só sai se a pessoa tocar no link.
(function () {
    'use strict';
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
})();
