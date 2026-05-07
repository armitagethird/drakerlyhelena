const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://127.0.0.1:8765';
const OUT_DIR = path.resolve(__dirname, '..', 'audit-screenshots');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  { url: '/index.html', name: 'index' },
  { url: '/faq/',   name: 'faq' },
  { url: '/yoga/',  name: 'yoga' }
];

const viewports = [
  { width: 375, height: 667, label: '375' },  // iPhone SE
  { width: 414, height: 896, label: '414' }   // iPhone 11 Pro Max
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  const issues = [];

  for (const vp of viewports) {
    for (const t of targets) {
      const page = await browser.newPage();
      await page.setViewport({
        width: vp.width, height: vp.height,
        deviceScaleFactor: 2, isMobile: true, hasTouch: true
      });
      await page.setUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) ' +
        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      );
      console.log(`Loading ${t.name} @ ${vp.label}…`);
      await page.goto(BASE + t.url, { waitUntil: 'networkidle0', timeout: 30000 });

      // Kill ScrollTrigger, force-show gs-reveal items, eagerly load images.
      await page.evaluate(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          try { ScrollTrigger.getAll().forEach(t => t.kill()); } catch (e) {}
        }
        if (typeof gsap !== 'undefined') {
          try { gsap.killTweensOf('.gs-reveal'); } catch (e) {}
        }
        document.querySelectorAll('.gs-reveal').forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.querySelectorAll('img').forEach(img => {
            img.style.transform = 'none';
          });
        });
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
          img.loading = 'eager';
          if (!img.complete) {
            const src = img.src;
            img.src = '';
            img.src = src;
          }
        });
      });
      // Wait for all images to fully load
      await page.evaluate(async () => {
        await Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(r => { img.onload = img.onerror = r; setTimeout(r, 5000); }))
        );
      });
      await new Promise(r => setTimeout(r, 500));

      // Detect horizontal overflow
      const overflowing = await page.evaluate(() => {
        const out = [];
        const docW = document.documentElement.clientWidth;
        document.querySelectorAll('*').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.right > docW + 1) {
            const tag = el.tagName.toLowerCase();
            const id  = el.id ? '#' + el.id : '';
            const cls = el.className && typeof el.className === 'string'
              ? '.' + el.className.split(' ').slice(0, 2).join('.')
              : '';
            const txt = (el.textContent || '').trim().slice(0, 40);
            out.push({
              tag: tag + id + cls,
              right: Math.round(r.right),
              docW,
              text: txt
            });
          }
        });
        return out.slice(0, 20);
      });

      if (overflowing.length) {
        issues.push({ page: t.name, viewport: vp.label, overflowing });
      }

      const file = path.join(OUT_DIR, `${t.name}-${vp.label}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`  -> ${file}`);

      await page.close();
    }
  }

  // Also: capture quiz modal stages
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.openSymptomModal());
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'modal-intro-375.png') });
  await page.evaluate(() => {
    document.getElementById('quiz-name').value = 'Maria';
    document.getElementById('quiz-phone').value = '98 99999-0000';
    window.startQuiz();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'modal-question-375.png') });

  // Skip to results
  await page.evaluate(() => {
    // Push 8 scale answers (mixed) + phase
    for (let i = 0; i < 8; i++) {
      window.handleAnswer(i % 2 === 0 ? 3 : 1);
    }
    window.handlePhase('perimenopausa');
  });
  // Wait for animation to finish (~6s) and results to show
  await new Promise(r => setTimeout(r, 8000));
  await page.screenshot({ path: path.join(OUT_DIR, 'modal-results-375.png'), fullPage: false });

  // Also capture the result with the modal scrolled
  await page.evaluate(() => {
    const modal = document.getElementById('symptom-modal-content');
    modal.scrollTop = modal.scrollHeight;
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT_DIR, 'modal-results-bottom-375.png') });

  await page.close();

  await browser.close();

  console.log('\n=== Horizontal overflow issues ===');
  console.log(JSON.stringify(issues, null, 2));
})();
