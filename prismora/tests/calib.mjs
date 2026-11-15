import { newRun, generateLevel, drawHand, makeOffers, applyOffer, relicCtx } from '../src/engine.js';
import { solve } from '../src/solver.js';
const N = 30, R = 10; const rows = Array.from({ length: R + 1 }, () => []);
const prio = (o) => o.type === 'relic' ? 3 : (['lens', 'prism', 'mirrors'].includes(o.id) ? 2 : 1);
for (let n = 0; n < N; n++) {
  const run = newRun('cal' + n);
  for (run.round = 1; run.round <= R; run.round++) {
    const lvl = generateLevel(run.seed, run.round); const hand = drawHand(run);
    const s = solve(lvl, hand, relicCtx(run.relics), `c${n}${run.round}`, 14, 150);
    rows[run.round].push(s.score);
    const offers = makeOffers(run).sort((a, b) => prio(b) - prio(a)); applyOffer(run, offers[0]);
  }
}
for (let r = 1; r <= R; r++) { const a = rows[r].sort((x, y) => x - y); console.log(`R${r} p10=${a[3]} p25=${a[7]} med=${a[15]} p75=${a[22]} max=${a[29]}`); }
