#!/usr/bin/env node
// Verificacao do site estatico (roda com `npm test`).
// Checa: JSON-LD valido; perguntas do FAQPage presentes no texto visivel; palavras proibidas
// pela diretriz da cliente; hierarquia de headings; links e assets internos existentes;
// title/description/canonical; contraste dos tokens de cor; classes que ferem a legibilidade.
// Sai com codigo 1 quando ha erro. Avisos nao derrubam o teste.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', '.superpowers', 'audit-screenshots', 'docs', 'scripts', 'shots']);

const FORBIDDEN = [
  [/R\$/, 'valor em reais (diretriz: nao exibir precos)'],
  [/\bcura\b/i, 'promessa de cura'],
  [/garantimos|resultados? garantidos?|garantia de resultado/i, 'promessa de resultado'],
  [/elimina(r|mos)? (o|a|os|as|todos|todas)? ?(sintoma|sintomas|dor|dores)/i, 'promessa de eliminar sintomas'],
  [/antes e depois/i, 'antes e depois'],
  [/n[aã]o reconhece/i, 'ressalva do CFM (descontinuada)'],
  [/apenas complementar/i, 'vocabulario de subordinacao (descontinuado)'],
  [/n[aã]o substitui/i, 'vocabulario de subordinacao (descontinuado)'],
];

// Classes que ferem a legibilidade minima (spec R1).
const BAD_CLASSES = [
  [/\btext-\[1[01]px\]/, 'texto de 10-11px (piso e text-xs)'],
  [/\btext-(charcoal|yoga-dark|white)\/(40|45|50|55|60|65|70)\b/, 'opacidade de texto abaixo de /80'],
  [/\btext-blush-400\b/, 'text-blush-400 como cor de texto (2,8:1)'],
];
const BAD_FONT_LIGHT = /<(p|li|dd|label|figcaption)\b[^>]*\bclass="[^"]*\bfont-light\b/g;

// Pares (texto, fundo) que precisam de contraste >= 4.5:1, por token do input.css.
const CONTRAST_PAIRS = [
  ['blush-600', 'sand-100'], ['blush-600', 'nude-100'], ['blush-600', 'nude-200'], ['blush-600', 'blush-100'],
  ['white', 'blush-600'], ['white', 'blush-700'],
  ['yoga-gold-deep', 'yoga-light'], ['white', 'yoga-gold-deep'],
];

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = path.relative(ROOT, full);
    if (fs.statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(full, out);
    } else if (name.endsWith('.html')) {
      out.push(rel.split(path.sep).join('/'));
    }
  }
  return out;
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·', ndash: '–', mdash: '—', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', copy: '©', hellip: '…', rarr: '→', larr: '←' };
function decode(s) {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(parseInt(e[1] === 'x' || e[1] === 'X' ? e.slice(2) : e.slice(1), e[1] === 'x' || e[1] === 'X' ? 16 : 10));
    return ENTITIES[e] !== undefined ? ENTITIES[e] : m;
  });
}
const norm = (s) => decode(s).replace(/\s+/g, ' ').replace(/[“”"]/g, '').trim().toLowerCase();

function visibleText(html) {
  return norm(html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' '));
}

function checkJsonLd(file, html, text) {
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    let data;
    try { data = JSON.parse(m[1]); } catch (e) { err(file, `JSON-LD invalido: ${e.message}`); continue; }
    const nodes = [];
    const collect = (n) => { if (!n || typeof n !== 'object') return; if (Array.isArray(n)) return n.forEach(collect); nodes.push(n); Object.values(n).forEach(collect); };
    collect(data);
    for (const n of nodes) {
      if (n['@type'] === 'FAQPage' && Array.isArray(n.mainEntity)) {
        for (const q of n.mainEntity) {
          if (!q.name) { err(file, 'FAQPage: pergunta sem name'); continue; }
          if (!text.includes(norm(q.name))) err(file, `FAQPage: pergunta nao aparece no texto visivel: "${q.name.slice(0, 60)}"`);
        }
      }
      if (n['@type'] === 'BlogPosting') {
        for (const k of ['headline', 'datePublished', 'dateModified', 'author', 'publisher', 'image']) if (!n[k]) err(file, `BlogPosting sem ${k}`);
        if (n.author && !n.author.name) err(file, 'BlogPosting: author sem name');
        if (n.publisher && !n.publisher.name) err(file, 'BlogPosting: publisher sem name');
      }
      for (const k of ['priceRange', 'price', 'offers']) if (n[k] !== undefined) err(file, `JSON-LD contem ${k} (diretriz: sem precos)`);
    }
  }
}

function checkForbidden(file, text) {
  for (const [re, why] of FORBIDDEN) {
    const m = text.match(re);
    if (m) err(file, `${why}: "...${text.slice(Math.max(0, m.index - 30), m.index + 40)}..."`);
  }
}

function checkHeadings(file, html) {
  const body = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/gi, '');
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m; let prev = 0; let h1 = 0;
  while ((m = re.exec(body))) {
    const level = +m[1];
    const txt = norm(m[2].replace(/<[^>]+>/g, ' ')).slice(0, 50);
    if (level === 1) h1++;
    if (prev && level > prev + 1) err(file, `heading pula de h${prev} para h${level} ("${txt}")`);
    prev = level;
  }
  if (h1 !== 1) err(file, `esperado exatamente 1 h1, encontrado ${h1}`);
  if (/<div[^>]*id="symptom-modal"[\s\S]*?<h[1-6]/i.test(body) && /id="symptom-modal"/.test(body)) {
    const modal = body.slice(body.indexOf('id="symptom-modal"'));
    if (/<h[1-6]\b/i.test(modal)) warn(file, 'ha headings dentro de #symptom-modal (spec R3.7 pede nenhum)');
  }
}

function checkLinks(file, html) {
  const dir = path.dirname(path.join(ROOT, file));
  const body = html.replace(/<!--[\s\S]*?-->/g, '');
  const urls = [];
  let m;
  const attr = /\b(href|src|poster|data-src)="([^"]+)"/g;
  while ((m = attr.exec(body))) urls.push(m[2]);
  const sets = /\b(srcset|imagesrcset)="([^"]+)"/g;
  while ((m = sets.exec(body))) m[2].split(',').forEach((c) => urls.push(c.trim().split(/\s+/)[0]));
  for (const raw of urls) {
    const u = raw.trim();
    if (/^(https?:)?\/\//i.test(u) || /^(mailto|tel|javascript|data):/i.test(u) || u.startsWith('#') || u === '') continue;
    let p = u.split('#')[0].split('?')[0];
    if (p === '') continue;
    let full = p.startsWith('/') ? path.join(ROOT, p) : path.join(dir, p);
    if (p.endsWith('/')) full = path.join(full, 'index.html');
    if (!fs.existsSync(full)) {
      if (fs.existsSync(full + '.html')) continue;
      if (fs.existsSync(path.join(full, 'index.html'))) continue;
      err(file, `link/asset interno inexistente: ${u}`);
    }
  }
}

function checkMeta(file, raw) {
  const html = raw.replace(/<!--[\s\S]*?-->/g, '');
  if (!/<title>[^<]+<\/title>/i.test(html)) err(file, 'sem <title>');
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html) && !/<meta\s+content="[^"]+"\s+name="description"/i.test(html)) err(file, 'sem meta description');
  if (!/rel="canonical"/i.test(html) && !/404\.html$/.test(file)) err(file, 'sem canonical');
  if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i.test(html)) err(file, 'viewport bloqueia zoom');
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  for (const tag of imgs) if (!/\balt=/.test(tag)) err(file, `img sem alt: ${tag.slice(0, 80)}`);
  const blanks = html.match(/<a\b[^>]*target="_blank"[^>]*>/gi) || [];
  for (const tag of blanks) if (!/rel="[^"]*noopener/.test(tag)) err(file, `target=_blank sem rel=noopener: ${tag.slice(0, 80)}`);
}

function checkClasses(file, html) {
  const body = html.replace(/<!--[\s\S]*?-->/g, '');
  for (const [re, why] of BAD_CLASSES) {
    const all = body.match(new RegExp(re.source, 'g')) || [];
    if (all.length) err(file, `${why}: ${all.length} ocorrencia(s), ex.: ${all[0]}`);
  }
  const fl = body.match(BAD_FONT_LIGHT) || [];
  if (fl.length) err(file, `font-light em texto de corpo: ${fl.length} ocorrencia(s), ex.: ${fl[0].slice(0, 90)}`);
}

// --- Contraste ---------------------------------------------------------------
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
}
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
function checkTokens() {
  const css = fs.readFileSync(path.join(ROOT, 'input.css'), 'utf8');
  const tokens = { white: '#ffffff' };
  const re = /--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,6})/g;
  let m;
  while ((m = re.exec(css))) tokens[m[1]] = m[2];
  for (const [fg, bg] of CONTRAST_PAIRS) {
    if (!tokens[fg] || !tokens[bg]) { err('input.css', `token ausente para o par ${fg} / ${bg}`); continue; }
    const c = contrast(tokens[fg], tokens[bg]);
    if (c < 4.5) err('input.css', `contraste ${fg} sobre ${bg} = ${c.toFixed(2)}:1 (minimo 4.5:1)`);
  }
}

// --- Main ----------------------------------------------------------------------
const files = walk(ROOT, []).sort();
for (const file of files) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (html.length < 1000 || /http-equiv="refresh"/i.test(html)) continue; // stubs de redirect
  const text = visibleText(html);
  checkJsonLd(file, html, text);
  checkForbidden(file, text);
  checkHeadings(file, html);
  checkLinks(file, html);
  checkMeta(file, html);
  checkClasses(file, html);
}
checkTokens();

if (warnings.length) { console.log(`Avisos (${warnings.length}):`); warnings.forEach((w) => console.log('  - ' + w)); }
if (errors.length) {
  console.log(`\nErros (${errors.length}):`);
  errors.forEach((e) => console.log('  - ' + e));
  console.log(`\nFALHOU: ${errors.length} erro(s) em ${files.length} paginas.`);
  process.exit(1);
}
console.log(`OK: ${files.length} paginas verificadas, 0 erros, ${warnings.length} aviso(s).`);
