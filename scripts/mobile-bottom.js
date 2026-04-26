const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.resolve(__dirname, '..', 'audit-screenshots');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 800, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'networkidle0' });

  // Force reveals + eager load images
  await page.evaluate(() => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.getAll().forEach(t => t.kill());
    if (typeof gsap !== 'undefined') gsap.killTweensOf('.gs-reveal');
    document.querySelectorAll('.gs-reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.querySelectorAll('img').forEach(img => { img.style.transform = 'none'; });
    });
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.loading = 'eager';
      if (!img.complete) { const s = img.src; img.src = ''; img.src = s; }
    });
  });
  await page.evaluate(async () => {
    await Promise.all(Array.from(document.images).filter(i => !i.complete)
      .map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 5000); })));
  });
  await new Promise(r => setTimeout(r, 800));

  // Take viewport-sized screenshots at specific section anchors
  const sections = ['#depoimentos', '#location', 'footer'];
  for (const sel of sections) {
    const safe = sel.replace(/[^a-z]/gi, '_');
    await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, sel);
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(OUT, `index-section${safe}-375.png`), fullPage: false });
    console.log('captured', sel);
  }

  // Yoga page sections
  await page.goto('http://127.0.0.1:8765/yoga.html', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.getAll().forEach(t => t.kill());
    document.querySelectorAll('.gs-reveal').forEach(el => {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.loading = 'eager';
      if (!img.complete) { const s = img.src; img.src = ''; img.src = s; }
    });
  });
  await page.evaluate(async () => {
    await Promise.all(Array.from(document.images).filter(i => !i.complete)
      .map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 5000); })));
  });
  await new Promise(r => setTimeout(r, 1200));

  for (const sel of ['#detalhes', '#professoras', '#ambiente']) {
    const safe = sel.replace(/[^a-z]/gi, '_');
    await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, sel);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT, `yoga-section${safe}-375.png`), fullPage: false });
    console.log('captured yoga', sel);
  }

  // Yoga top of page
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT, 'yoga-top-375.png'), fullPage: false });

  await browser.close();
})();
