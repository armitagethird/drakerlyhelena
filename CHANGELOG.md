# Changelog — Site Dra. Kerly Helena

Registro das atualizações do site (`drakerlyhelena.com.br`). Entradas mais recentes no topo.

> Lembrete de build/deploy: o CSS é Tailwind v4 (`input.css` → `output.css`). Sempre que mudar classes Tailwind no HTML/JS, rodar **`npm run build:css`** na pasta `DraKerly/` e **commitar o `output.css`**. Deploy via GitHub Pages (`.nojekyll`): só reflete após `git push`.

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
