import fs from 'node:fs'; import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const { chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright');
const URL = process.env.URL || 'http://localhost:8765/index.html'; const OUT = process.env.OUT || '/tmp/shots'; fs.mkdirSync(OUT, { recursive: true });
const sizes = [[1920, 1080], [1366, 768], [1024, 768], [768, 1024], [412, 915], [360, 640]];
const b = await chromium.launch(); let bad = 0;
for (const [w, h] of sizes) {
  const c = await b.newContext({ viewport: { width: w, height: h }, locale: 'pt-BR' }); const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(URL); await p.evaluate(() => { const d = { tutorialDone: true }; localStorage.setItem('prismora.v1', JSON.stringify(d)); }); await p.reload(); await p.waitForTimeout(200);
  await p.click('text=Jogar'); await p.waitForTimeout(600);
  const m = await p.evaluate(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(); const cv = r('#board'), f = r('#btn-fire'), t = r('#tray'); return { ovx: document.documentElement.scrollWidth > innerWidth + 1, canvas: Math.round(cv.width), fireVisible: f.bottom <= innerHeight + 1 && f.top >= 0, trayVisible: t.bottom <= innerHeight + 1 }; });
  const ok = !m.ovx && m.fireVisible && m.canvas >= 240 && !errs.length; if (!ok) bad++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${w}x${h} canvas=${m.canvas}px fogo visível=${m.fireVisible} bandeja visível=${m.trayVisible} overflowX=${m.ovx} ${errs.join(';')}`);
  await p.screenshot({ path: `${OUT}/vp-${w}x${h}.png` }); await c.close();
}
await b.close(); process.exit(bad ? 1 : 0);
