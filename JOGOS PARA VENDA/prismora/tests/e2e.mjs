// Teste ponta a ponta no Chromium: menu -> tutorial -> rodada 1 -> draft, com screenshots e checagem de erros de console.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const { chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright');
const URL = process.env.URL || 'http://localhost:8765/index.html';
const OUT = process.env.OUT || '/tmp/shots'; fs.mkdirSync(OUT, { recursive: true });
const errors = [];
const browser = await chromium.launch();
async function session(viewport, tag, mobile = false) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, locale: 'pt-BR', hasTouch: mobile, isMobile: mobile });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`[${tag}] pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${tag}] console: ${m.text()}`); });
  await page.goto(URL); await page.waitForTimeout(300);
  return page;
}
const ok = (c, msg) => { console.log((c ? 'PASS ' : 'FAIL ') + msg); if (!c) errors.push('assert: ' + msg); };

// ---- Desktop ----
let page = await session({ width: 1280, height: 800 }, 'desktop');
await page.screenshot({ path: `${OUT}/01-menu.png` });
await page.click('text=Jogar'); await page.waitForTimeout(500);
ok(await page.evaluate(() => __prismora.G.run.round === 0), 'tutorial inicia na rodada 0');
await page.screenshot({ path: `${OUT}/02-tutorial.png` });
// resolve o tutorial via API (prisma em (2,3), espelhos em (2,1) '/' e (2,5) '\')
await page.evaluate(() => { const g = __prismora; const h = g.G.hand; g.onCard(h[2]); g.onCell(23); g.onCard(h[0]); g.onCell(9); g.onCard(h[1]); g.onCard(h[1]); g.onCell(37); });
await page.waitForTimeout(200);
const prev = await page.evaluate(() => __prismora.S.preview.total);
ok(prev === 45, `prévia do tutorial = 45 (obtido ${prev})`);
await page.screenshot({ path: `${OUT}/03-preview.png` });
await page.click('#btn-fire'); await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/04-firing.png` });
await page.waitForSelector('.modal', { timeout: 8000 });
await page.screenshot({ path: `${OUT}/05-tutorial-clear.png` });
await page.click('.modal #go'); await page.waitForTimeout(900);
ok(await page.evaluate(() => __prismora.G.run.round === 1), 'avança para rodada 1');
await page.screenshot({ path: `${OUT}/06-round1.png` });
// joga a rodada 1 com a solução do solver
const best = await page.evaluate(async () => {
  const { solve } = await import('./src/solver.js'); const g = __prismora.G;
  const s = solve(g.fixed, g.hand, g.ctx, 'e2e', 30, 200);
  for (const pl of s.placement) { if (pl.cell < 0) continue; const p = g.hand.find((x) => x.id === pl.piece.id); p.o = pl.o; __prismora.onCard(p); __prismora.onCell(pl.cell); }
  return { score: s.score, target: g.target };
});
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/07-solved.png` });
await page.click('#btn-fire'); await page.waitForTimeout(1200); await page.screenshot({ path: `${OUT}/08-fire2.png` });
await page.waitForSelector('.modal', { timeout: 9000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/09-result.png` });
ok(best.score >= best.target, `solver supera meta (${best.score} >= ${best.target})`);
await page.click('.modal #go'); await page.waitForSelector('.offers', { timeout: 3000 });
await page.screenshot({ path: `${OUT}/10-draft.png` });
await page.click('.offer >> nth=0'); await page.waitForTimeout(900);
ok(await page.evaluate(() => __prismora.G.run.round === 2), 'draft leva à rodada 2');
ok(await page.evaluate(() => !!JSON.parse(localStorage.getItem('prismora.v1')).run), 'run salva no localStorage');
await page.screenshot({ path: `${OUT}/11-round2.png` });
// persistência: recarrega e continua
await page.reload(); await page.waitForTimeout(400);
ok(await page.locator('text=Continuar run').count() === 1, 'botão Continuar após recarregar');
await page.click('text=Continuar run'); await page.waitForTimeout(600);
ok(await page.evaluate(() => __prismora.G.run.round === 2), 'continua na rodada 2');
await page.screenshot({ path: `${OUT}/12-resumed.png` });

// ---- Mobile ----
const m = await session({ width: 390, height: 780 }, 'mobile', true);
await m.evaluate(() => { const d = JSON.parse(localStorage.getItem('prismora.v1') || '{}'); d.tutorialDone = true; localStorage.setItem('prismora.v1', JSON.stringify(d)); });
await m.reload(); await m.waitForTimeout(300);
await m.screenshot({ path: `${OUT}/20-m-menu.png` });
await m.tap('text=Jogar'); await m.waitForTimeout(700);
await m.screenshot({ path: `${OUT}/21-m-game.png` });
const overflow = await m.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
ok(!overflow, 'sem overflow horizontal no mobile');
await m.tap('#tray .card >> nth=0'); await m.tap('#board', { position: { x: 120, y: 120 } }); await m.waitForTimeout(200);
ok(await m.evaluate(() => __prismora.G.placed.size === 1), 'toque posiciona peça no mobile');
await m.screenshot({ path: `${OUT}/22-m-placed.png` });
await browser.close();
console.log(errors.length ? '\nERROS:\n' + errors.join('\n') : '\nTUDO OK');
process.exit(errors.length ? 1 : 0);
