import { W, H, DIRS, COLORS, START_DECK, START_LIVES, BASE_HAND, PACKS, RELICS, MAX_RELICS } from './data.js';
import { rng } from './rng.js';

export function relicCtx(ids) {
  const s = new Set(ids);
  return {
    lensMult: s.has('polished') ? 3 : 2,
    mirrorAdd: s.has('clean') ? 1 : 0,
    crystalAdd: s.has('living') ? 10 : 0,
    prism3: s.has('prism3'),
    matchMult: s.has('chroma') ? 4 : 3,
    emitterPower: s.has('gold') ? 2 : 1,
    totalBonus: s.has('constellation') ? 2 : 1.5,
    resonance: s.has('resonant'),
    handBonus: s.has('fullhand') ? 1 : 0,
    rerolls: 1 + (s.has('recycle') ? 2 : 0),
  };
}

const idx = (x, y) => y * W + x;

/**
 * Simula todos os feixes. `board` = array W*H de células (ou null).
 * Retorna segmentos (para animação), acertos e pontuação total.
 */
export function trace(board, ctx) {
  const segs = [], hits = [];
  const hitCount = new Map();
  let steps = 0;
  let crystals = 0;
  const queue = [];
  for (let i = 0; i < board.length; i++) {
    const c = board[i];
    if (!c) continue;
    if (c.k === 'crystal') crystals++;
    if (c.k === 'emitter') {
      queue.push({ x: i % W, y: (i / W) | 0, dir: c.dir, color: c.color || 'W', power: ctx.emitterPower, t: 0, hist: new Set() });
    }
  }
  while (queue.length) {
    const b = queue.shift();
    let { x, y, dir, color, power, t } = b;
    let sx = x, sy = y, st = t; // início do segmento atual
    const flush = (ex, ey, et) => {
      if (ex !== sx || ey !== sy) segs.push({ x1: sx, y1: sy, x2: ex, y2: ey, t1: st, t2: et, color, power });
    };
    for (;;) {
      if (++steps > 3000) return finish();
      const [dx, dy] = DIRS[dir];
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) { flush(x + dx * 0.5, y + dy * 0.5, t + 0.5); break; }
      const cell = board[idx(nx, ny)];
      t += 1;
      if (cell && (cell.k === 'wall' || cell.k === 'emitter')) { flush(nx - dx * 0.5, ny - dy * 0.5, t - 0.5); break; }
      const key = idx(nx, ny) * 4 + dir;
      if (b.hist.has(key)) { flush(nx, ny, t); break; }
      b.hist.add(key);
      x = nx; y = ny;
      if (!cell) continue;
      if (cell.k === 'crystal') {
        flush(x, y, t);
        const n = hitCount.get(idx(x, y)) || 0;
        hitCount.set(idx(x, y), n + 1);
        const match = cell.color !== 'W' && cell.color === color;
        const gain = (cell.value + ctx.crystalAdd) * power * (match ? ctx.matchMult : 1) * (ctx.resonance && n > 0 ? 2 : 1);
        hits.push({ idx: idx(x, y), x, y, t, gain, power, match, color });
        break;
      }
      if (cell.k === 'mirror') {
        flush(x, y, t);
        dir = cell.o === 0 ? [3, 2, 1, 0][dir] : [1, 0, 3, 2][dir]; // '/' : → ↑, ↓ ←, ← ↓, ↑ →  '\' : → ↓, ↓ →, ← ↑, ↑ ←
        power += ctx.mirrorAdd;
        sx = x; sy = y; st = t; continue;
      }
      if (cell.k === 'lens') { flush(x, y, t); power *= ctx.lensMult; sx = x; sy = y; st = t; continue; }
      if (cell.k === 'filter') { flush(x, y, t); color = cell.color; sx = x; sy = y; st = t; continue; }
      if (cell.k === 'prism') {
        flush(x, y, t);
        const outs = [(dir + 1) % 4, (dir + 3) % 4];
        if (ctx.prism3) outs.push(dir);
        for (const d of outs) queue.push({ x, y, dir: d, color, power, t, hist: new Set(b.hist) });
        break;
      }
    }
  }
  return finish();

  function finish() {
    let total = 0;
    for (const h of hits) total += h.gain;
    const lit = hitCount.size;
    const allLit = crystals > 0 && lit === crystals;
    const base = total;
    if (allLit) total = Math.round(total * ctx.totalBonus);
    return { segs, hits, base, total, allLit, lit, crystals };
  }
}

/** Monta o tabuleiro final: células fixas + peças colocadas (Map idx->peça). */
export function composeBoard(fixed, placed) {
  const b = fixed.slice();
  for (const [i, p] of placed) b[i] = p;
  return b;
}

// ---------- Geração de fases ----------
export function tutorialLevel() {
  const cells = new Array(W * H).fill(null);
  cells[idx(0, 3)] = { k: 'emitter', dir: 0, color: 'W' };
  cells[idx(6, 1)] = { k: 'crystal', color: 'W', value: 10 };
  cells[idx(6, 5)] = { k: 'crystal', color: 'W', value: 20 };
  cells[idx(3, 0)] = { k: 'wall' };
  cells[idx(3, 6)] = { k: 'wall' };
  return cells;
}

export function generateLevel(seed, round, attempt = 0) {
  const r = rng(`${seed}|L${round}|${attempt}`);
  const boss = round % 4 === 0;
  const cells = new Array(W * H).fill(null);
  const edge = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (x === 0 || y === 0 || x === W - 1 || y === H - 1) edge.push(idx(x, y));
  const nEm = round < 3 ? 1 : boss ? 3 : 2;
  const free = (i) => cells[i] === null;
  const blockedFront = new Set();
  for (const i of r.shuffle(edge)) {
    if (blockedFront.size >= nEm) break;
    if (!free(i)) continue;
    const x = i % W, y = (i / W) | 0;
    const opts = [];
    if (x === 0) opts.push(0); if (x === W - 1) opts.push(2);
    if (y === 0) opts.push(1); if (y === H - 1) opts.push(3);
    const dir = r.pick(opts);
    const front = idx(x + DIRS[dir][0], y + DIRS[dir][1]);
    if (!free(front)) continue;
    cells[i] = { k: 'emitter', dir, color: round >= 3 && r() < 0.35 ? r.pick(COLORS) : 'W' };
    blockedFront.add(front);
  }
  const empties = () => cells.map((c, i) => (c === null && !blockedFront.has(i) ? i : -1)).filter((i) => i >= 0);
  const nW = Math.min(14, 2 + Math.floor(round / 2) + (boss ? 5 : 0));
  for (let n = 0; n < nW; n++) { const e = empties(); cells[r.pick(e)] = { k: 'wall' }; }
  const nC = Math.min(7, 3 + Math.floor((round - 1) / 2));
  const maxV = round >= 5 ? 4 : 3;
  for (let n = 0; n < nC; n++) {
    const e = empties();
    cells[r.pick(e)] = { k: 'crystal', color: r() < 0.72 ? r.pick(COLORS) : 'W', value: 10 * (1 + r.int(maxV)) };
  }
  return cells;
}

// ---------- Estado da run ----------
export function newRun(seed, mode = 'normal') {
  const deck = START_DECK.map((p, i) => ({ ...p, id: i + 1, o: 0 }));
  return {
    seed, mode, round: 0, // round 0 = tutorial/intro quando aplicável
    lives: START_LIVES, deck, relics: [], total: 0, history: [], nextId: deck.length + 1, rerollsUsed: 0, handNonce: 0, won: false,
  };
}

export function drawHand(run) {
  const ctx = relicCtx(run.relics);
  const r = rng(`${run.seed}|H${run.round}|${run.handNonce}`);
  const size = BASE_HAND + ctx.handBonus;
  // Garantia anti-frustração: no mínimo 2 espelhos na mão (se existirem no baralho).
  const sh = r.shuffle(run.deck);
  const mirrors = sh.filter((p) => p.k === 'mirror').slice(0, 2);
  const rest = sh.filter((p) => !mirrors.includes(p));
  return [...mirrors, ...rest].slice(0, size).map((p) => ({ ...p }));
}

export function makeOffers(run) {
  const r = rng(`${run.seed}|D${run.round}`);
  const owned = new Set(run.relics);
  const relicPool = RELICS.filter((x) => !owned.has(x.id)).map((x) => ({ type: 'relic', id: x.id }));
  const packs = PACKS.map((p) => ({ type: 'pack', id: p.id }));
  const canRelic = run.relics.length < MAX_RELICS && relicPool.length > 0;
  const nRelics = canRelic ? Math.min(relicPool.length, r() < 0.55 ? 2 : 1) : 0;
  const offers = [...r.shuffle(relicPool).slice(0, nRelics), ...r.shuffle(packs).slice(0, 3 - nRelics)];
  return r.shuffle(offers);
}

export function applyOffer(run, offer) {
  if (offer.type === 'relic') { if (!run.relics.includes(offer.id)) run.relics.push(offer.id); return; }
  const pack = PACKS.find((p) => p.id === offer.id);
  for (const p of pack.pieces) run.deck.push({ ...p, id: run.nextId++, o: 0 });
}

export function starsFor(score, target, par) {
  if (score < target) return 0;
  if (par && score >= par * 1.25) return 3;
  if (par && score >= par) return 2;
  return 1;
}
