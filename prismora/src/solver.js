import { W, H } from './data.js';
import { rng } from './rng.js';
import { trace, composeBoard, generateLevel, drawHand, relicCtx, tutorialLevel } from './engine.js';
import { targetFor, FEASIBLE_FACTOR } from './data.js';

/** Busca (hill-climbing com reinícios) pela melhor disposição da mão. Usado p/ validar fases, "Par" das estrelas e simulações. */
export function solve(fixed, hand, ctx, seed = 'solver', restarts = 18, iters = 160) {
  const r = rng(seed);
  const freeCells = [];
  for (let i = 0; i < W * H; i++) if (fixed[i] === null) freeCells.push(i);
  const evalState = (st) => {
    const placed = new Map();
    for (let i = 0; i < st.length; i++) if (st[i].cell >= 0) placed.set(st[i].cell, { ...hand[i], o: st[i].o });
    return trace(composeBoard(fixed, placed), ctx).total;
  };
  let best = { score: -1, st: null };
  for (let rs = 0; rs < restarts; rs++) {
    const taken = new Set();
    let st = hand.map((p) => {
      let cell = -1;
      if (r() < 0.9) { for (let tries = 0; tries < 6; tries++) { const c = r.pick(freeCells); if (!taken.has(c)) { cell = c; taken.add(c); break; } } }
      return { cell, o: r.int(2) };
    });
    let sc = evalState(st);
    for (let it = 0; it < iters; it++) {
      const j = r.int(st.length);
      const old = st[j];
      const mv = r();
      let nu;
      if (mv < 0.15) nu = { cell: -1, o: old.o };
      else if (mv < 0.3) nu = { cell: old.cell, o: 1 - old.o };
      else {
        const c = r.pick(freeCells);
        if (st.some((s, k) => k !== j && s.cell === c)) continue;
        nu = { cell: c, o: r.int(2) };
      }
      st[j] = nu;
      const ns = evalState(st);
      if (ns >= sc) sc = ns; else st[j] = old;
    }
    if (sc > best.score) best = { score: sc, st: st.map((s) => ({ ...s })) };
  }
  return { score: best.score, placement: best.st.map((s, i) => ({ piece: hand[i], cell: s.cell, o: s.o })) };
}

/**
 * Prepara uma rodada: escolhe o primeiro mapa (tentativa) em que o solver prova que a meta é alcançável com a mão dada.
 * Retorna { fixed, hand, par, attempt }. `par` = melhor pontuação encontrada (base das estrelas 2 e 3).
 */
export function prepareRound(run, thorough = true) {
  const ctx = relicCtx(run.relics);
  const hand = drawHand(run);
  const need = targetFor(run.round) * FEASIBLE_FACTOR;
  let best = null;
  for (let attempt = 0; attempt < 12; attempt++) {
    const fixed = generateLevel(run.seed, run.round, attempt);
    const s = solve(fixed, hand, ctx, `${run.seed}|S${run.round}|${attempt}`, thorough ? 20 : 8, 160);
    if (!best || s.score > best.par) best = { fixed, hand, par: s.score, attempt };
    if (s.score >= need) return { fixed, hand, par: s.score, attempt };
  }
  return best;
}
export function tutorialRound() {
  const hand = [{ k: 'mirror', o: 0, id: 9001 }, { k: 'mirror', o: 0, id: 9002 }, { k: 'prism', id: 9003 }];
  const fixed = tutorialLevel();
  return { fixed, hand, par: solve(fixed, hand, relicCtx([]), 'tut', 10, 100).score, attempt: 0 };
}
