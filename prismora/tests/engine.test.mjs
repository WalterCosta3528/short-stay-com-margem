import test from 'node:test';
import assert from 'node:assert/strict';
import { trace, composeBoard, relicCtx, generateLevel, tutorialLevel, newRun, drawHand, makeOffers, applyOffer, starsFor } from '../src/engine.js';
import { W } from '../src/data.js';
import { solve } from '../src/solver.js';

const I = (x, y) => y * W + x;
const empty = () => new Array(49).fill(null);
const base = relicCtx([]);

test('feixe reto atinge cristal', () => {
  const b = empty(); b[I(0, 3)] = { k: 'emitter', dir: 0, color: 'W' }; b[I(5, 3)] = { k: 'crystal', color: 'W', value: 10 };
  const r = trace(b, base);
  assert.equal(r.total, Math.round(10 * 1.5)); // todos acesos => x1.5
  assert.equal(r.hits.length, 1);
});
test('espelho / e \\ desviam corretamente', () => {
  for (const [o, ty] of [[0, 0], [1, 6]]) { // '/' sobe, '\' desce
    const b = empty(); b[I(0, 3)] = { k: 'emitter', dir: 0, color: 'W' }; b[I(3, 3)] = { k: 'mirror', o };
    b[I(3, ty)] = { k: 'crystal', color: 'W', value: 10 };
    assert.equal(trace(b, base).hits.length, 1, `mirror o=${o}`);
  }
});
test('lente multiplica poder; filtro colore; cor igual x3', () => {
  const b = empty(); b[I(0, 3)] = { k: 'emitter', dir: 0, color: 'W' };
  b[I(1, 3)] = { k: 'lens' }; b[I(2, 3)] = { k: 'filter', color: 'R' }; b[I(5, 3)] = { k: 'crystal', color: 'R', value: 10 };
  const r = trace(b, base);
  assert.equal(r.base, 10 * 2 * 3);
  assert.equal(r.total, 60 * 1.5);
});
test('prisma divide em dois feixes perpendiculares', () => {
  const b = empty(); b[I(0, 3)] = { k: 'emitter', dir: 0, color: 'W' }; b[I(3, 3)] = { k: 'prism' };
  b[I(3, 0)] = { k: 'crystal', color: 'W', value: 10 }; b[I(3, 6)] = { k: 'crystal', color: 'W', value: 10 };
  const r = trace(b, base);
  assert.equal(r.hits.length, 2); assert.ok(r.allLit);
});
test('relíquia prism3 mantém feixe central', () => {
  const b = empty(); b[I(0, 3)] = { k: 'emitter', dir: 0, color: 'W' }; b[I(3, 3)] = { k: 'prism' }; b[I(6, 3)] = { k: 'crystal', color: 'W', value: 10 };
  assert.equal(trace(b, base).hits.length, 0);
  assert.equal(trace(b, relicCtx(['prism3'])).hits.length, 1);
});
test('parede bloqueia; loop de espelhos termina', () => {
  const b = empty(); b[I(0, 3)] = { k: 'emitter', dir: 0, color: 'W' }; b[I(2, 3)] = { k: 'wall' }; b[I(5, 3)] = { k: 'crystal', color: 'W', value: 10 };
  assert.equal(trace(b, base).hits.length, 0);
  const l = empty(); l[I(0, 2)] = { k: 'emitter', dir: 0, color: 'W' };
  l[I(2, 2)] = { k: 'mirror', o: 1 }; l[I(2, 4)] = { k: 'mirror', o: 0 }; l[I(4, 4)] = { k: 'mirror', o: 1 }; l[I(4, 2)] = { k: 'mirror', o: 0 };
  l[I(3, 2)] = { k: 'lens' };
  const r = trace(l, base); assert.ok(r.segs.length < 100); // não explode
});
test('ressonância e Prisma Total', () => {
  const b = empty(); b[I(0, 3)] = { k: 'emitter', dir: 0, color: 'W' }; b[I(6, 3)] = { k: 'crystal', color: 'W', value: 10 };
  assert.equal(trace(b, relicCtx(['constellation'])).total, 20);
});
test('geração determinística e válida', () => {
  for (let r = 1; r <= 12; r++) {
    const a = generateLevel('s', r), c = generateLevel('s', r);
    assert.deepEqual(a, c);
    assert.ok(a.some((x) => x && x.k === 'emitter') && a.some((x) => x && x.k === 'crystal'));
  }
});
test('run: mão, ofertas e aplicação', () => {
  const run = newRun('abc'); run.round = 1;
  const h = drawHand(run); assert.equal(h.length, 5);
  const offers = makeOffers(run); assert.equal(offers.length, 3);
  const n = run.deck.length; applyOffer(run, { type: 'pack', id: 'mirrors' }); assert.equal(run.deck.length, n + 2);
});
test('tutorial é resolvível e solver acha pontuação', () => {
  const lvl = tutorialLevel();
  const hand = [{ k: 'mirror', o: 0 }, { k: 'mirror', o: 0 }, { k: 'prism', o: 0 }];
  const s = solve(lvl, hand, base);
  assert.ok(s.score > 0);
});
test('estrelas', () => { assert.equal(starsFor(50, 100, 200), 0); assert.equal(starsFor(120, 100, 200), 1); assert.equal(starsFor(200, 100, 200), 2); assert.equal(starsFor(260, 100, 200), 3); });
