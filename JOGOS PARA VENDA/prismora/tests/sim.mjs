// Simulação de balanceamento: um "bot" joga N runs usando o solver. Mede taxa de sucesso por rodada.
import { newRun, generateLevel, drawHand, makeOffers, applyOffer, relicCtx, starsFor } from '../src/engine.js';
import { solve, prepareRound } from '../src/solver.js';
import { targetFor, START_LIVES } from '../src/data.js';
import { rng } from '../src/rng.js';

const N = +(process.argv[2] || 40), SKILL = process.argv[3] || 'mid'; // mid: restarts 6; high: 18
const cfg = SKILL === 'low' ? [2, 80] : SKILL === 'mid' ? [6, 120] : [18, 160];
const reach = new Array(16).fill(0), clears = new Array(16).fill(0);
let wins = 0, totalScore = 0;
const t0 = Date.now();
for (let n = 0; n < N; n++) {
  const run = newRun('sim' + n); const pick = rng('pick' + n);
  for (run.round = 1; run.round <= 15; run.round++) {
    reach[run.round]++;
    const ctx = relicCtx(run.relics);
    let passed = false;
    for (let a = 0; a < 6 && !passed; a++) { // tentativas (vidas) / rerolls
      run.handNonce = a % 2;
      const { fixed: lvl, hand } = prepareRound(run, false);
      const s = solve(lvl, hand, ctx, `b${n}${run.round}${a}`, cfg[0], cfg[1]);
      if (s.score >= targetFor(run.round)) { passed = true; totalScore += s.score; }
      else { run.lives -= a >= 1 ? 1 : 0; if (run.lives <= 0) break; }
    }
    if (!passed) break;
    clears[run.round]++;
    const offers = makeOffers(run); // draft ingênuo: aleatório
    applyOffer(run, pick.pick(offers));
  }
  if (clears[8] && run.round > 8) wins++;
}
console.log(`skill=${SKILL} runs=${N} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
for (let r = 1; r <= 12; r++) console.log(`R${String(r).padStart(2)} meta=${String(targetFor(r)).padStart(6)} chegou=${reach[r]} passou=${clears[r]} (${reach[r] ? Math.round(100 * clears[r] / reach[r]) : 0}%)`);
