#!/usr/bin/env node
// Screenshot de uma pagina servida localmente, com Chrome via puppeteer-core.
// Uso:
//   node scripts/shot.js --url /menopausa/ --out audit-screenshots/menopausa.png
//   opcoes: --base http://127.0.0.1:5500  --width 390  --height 844  --desktop  --full
//           --eval "openSymptomModal()"  --wait 800  --scroll 1200
// Imprime erros de console e exceptions da pagina (uteis para achar JS quebrado).
// Antes: PORT=5500 node scripts/dev-server.js --no-watch  (em outro terminal / background)

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf('--' + name); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : def; };
const flag = (name) => args.includes('--' + name);

const base = opt('base', 'http://127.0.0.1:5500');
// O Git Bash (MSYS) converte argumentos que comecam com "/" em caminhos Windows
// ("/faq/" vira "C:/Program Files/Git/faq/"). Desfaz isso e aceita "faq/" sem barra.
let url = opt('url', '/').replace(/\\/g, '/').replace(/^[A-Za-z]:\/(Program Files\/)?Git\/?/i, '/');
if (!/^https?:/i.test(url) && !url.startsWith('/')) url = '/' + url;
const out = opt('out', 'audit-screenshots/shot.png');
const desktop = flag('desktop');
const width = +opt('width', desktop ? 1440 : 390);
const height = +opt('height', desktop ? 900 : 844);
const full = flag('full');
const evalJs = opt('eval', '');
const wait = +opt('wait', 800);
const scrollTo = +opt('scroll', 0);

(async () => {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  const problems = [];
  page.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') problems.push('console.error: ' + m.text()); });
  await page.setViewport({ width, height, deviceScaleFactor: desktop ? 1 : 2, isMobile: !desktop, hasTouch: !desktop });
  await page.goto(base + url, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => {
    if (typeof ScrollTrigger !== 'undefined') { try { ScrollTrigger.getAll().forEach((t) => t.kill()); } catch (e) {} }
    if (typeof gsap !== 'undefined') { try { gsap.killTweensOf('.gs-reveal'); } catch (e) {} }
    document.querySelectorAll('.gs-reveal').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; el.querySelectorAll('img').forEach((i) => { i.style.transform = 'none'; }); });
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
  });
  if (scrollTo) await page.evaluate((y) => window.scrollTo(0, y), scrollTo);
  if (evalJs) await page.evaluate(evalJs);
  await new Promise((r) => setTimeout(r, wait));
  await page.screenshot({ path: out, fullPage: full });
  await browser.close();
  console.log('screenshot ->', out);
  if (problems.length) { console.log('PROBLEMAS NA PAGINA:'); problems.forEach((p) => console.log('  - ' + p)); process.exitCode = 2; }
  else console.log('sem erros de console/pageerror');
})().catch((e) => { console.error('FALHA:', e.message); process.exit(1); });
