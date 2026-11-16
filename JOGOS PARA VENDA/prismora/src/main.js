import { W, H, RELICS, PACKS, targetFor, WIN_ROUND, MAX_RELICS } from './data.js';
import { newRun, composeBoard, trace, relicCtx, makeOffers, applyOffer, starsFor, drawHand } from './engine.js';
import { prepareRound, tutorialRound } from './solver.js';
import { t, setLang, getLang, detectLang, ACHIEVEMENTS } from './i18n.js';
import { load, save, reset, data } from './save.js';
import { initAudio, sfx, setVolumes, startMusic } from './audio.js';
import { layout, drawScene, drawPiece, cellAt, COL } from './render.js';

const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const fmt = (n) => Math.round(n).toLocaleString(getLang() === 'pt' ? 'pt-BR' : 'en-US');
const utcDate = () => new Date().toISOString().slice(0, 10);

let SAVE, G = null, L = null;
const canvas = $('#board'); const ctx2d = canvas.getContext('2d');
const S = { board: [], preview: null, anim: null, litSet: new Set(), hover: -1, ghost: null, canPlace: false, particles: [], floaters: [], shake: 0, opts: { shake: true, labels: false, particles: true } };

// ---------- util UI ----------
function show(name) { $('#menu').classList.toggle('hidden', name !== 'menu'); $('#game').classList.toggle('hidden', name !== 'game'); if (name === 'game') requestAnimationFrame(resize); }
function toast(msg) { const e = el('div', 'toast', msg); $('#toast-root').appendChild(e); setTimeout(() => e.remove(), 3300); }
function modal(html, { closable = false, onClose } = {}) {
  const bg = el('div', 'modal-bg'); const m = el('div', 'modal', html); bg.appendChild(m); $('#modal-root').appendChild(bg);
  const close = () => { bg.remove(); onClose && onClose(); };
  if (closable) bg.addEventListener('pointerdown', (e) => { if (e.target === bg) close(); });
  m.close = close; return m;
}
const closeAllModals = () => { $('#modal-root').innerHTML = ''; };
function pieceCanvas(p, size = 64) {
  const c = document.createElement('canvas'); const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = c.height = size * dpr; const g = c.getContext('2d'); g.scale(dpr, dpr); drawPiece(g, p, size / 2, size / 2, size); return c;
}
function applyOpts() {
  const s = SAVE.settings; S.opts.shake = s.shake; S.opts.labels = s.labels; S.opts.particles = s.particles;
  setVolumes(s.music, s.sfx);
}

// ---------- menu ----------
function buildMenu() {
  $('#m-tag').textContent = t('tagline'); $('#m-foot').textContent = 'v0.1 · ' + t('daySeed') + ': ' + utcDate();
  const box = $('#menu-btns'); box.innerHTML = '';
  const add = (label, cls, fn) => { const b = el('button', 'btn ' + cls, label); b.addEventListener('click', () => { initAudio(); startMusic(); sfx.click(); fn(); }); box.appendChild(b); return b; };
  if (SAVE.run) add(t('cont') + ` · ${t('round')} ${SAVE.run.round}`, 'gold', () => resumeRun());
  add(t('play'), 'primary', () => startRun('normal'));
  add(t('daily'), '', () => startRun('daily'));
  add(t('how'), 'ghost', showHowTo);
  add(t('ach'), 'ghost', showAchievements);
  add(t('settings'), 'ghost', showSettings);
  const st = SAVE.stats; $('#m-foot').textContent += `  ·  ${t('bestRun')}: ${fmt(st.bestScore)} · ★ ${st.stars}`;
}
function showHowTo() {
  let i = 0; const m = modal('', { closable: true });
  const draw = () => {
    m.innerHTML = `<h2>${t('how')}</h2><div class="slides"><p>${t('htp')[i]}</p>${i === 1 ? '<div class="pieces-legend" id="leg"></div>' : ''}</div><div class="row"><button class="btn ghost" id="pv">${t('back')}</button><button class="btn primary" id="nx">${i < 2 ? t('next') : 'OK'}</button></div>`;
    if (i === 1) for (const p of [{ k: 'mirror', o: 0 }, { k: 'prism' }, { k: 'lens' }, { k: 'filter', color: 'G' }]) { const d = el('div', 'pl'); d.appendChild(pieceCanvas(p, 48)); d.appendChild(el('div', '', `<b>${t('piece.' + p.k)}</b>${t('pd.' + p.k)}`)); $('#leg', m).appendChild(d); }
    $('#pv', m).onclick = () => { sfx.click(); if (i === 0) m.close(); else { i--; draw(); } };
    $('#nx', m).onclick = () => { sfx.click(); if (i < 2) { i++; draw(); } else m.close(); };
  }; draw();
}
function showAchievements() {
  const m = modal('', { closable: true });
  m.innerHTML = `<h2>${t('ach')}</h2><div class="achs">${ACHIEVEMENTS.map((a) => `<div class="ach ${SAVE.ach[a] ? 'on' : ''}"><div class="ic">★</div><div><b>${t('a.' + a + '.n')}</b><br><small>${t('a.' + a + '.d')}</small></div></div>`).join('')}</div><div class="row"><button class="btn primary" id="ok">${t('back')}</button></div>`;
  $('#ok', m).onclick = () => m.close();
}
function showSettings() {
  const s = SAVE.settings; const m = modal('', { closable: true, onClose: () => { save(); buildMenu(); } });
  const tg = (k) => `<button class="tgl ${s[k] ? 'on' : ''}" data-k="${k}" role="switch" aria-checked="${!!s[k]}"></button>`;
  m.innerHTML = `<h2>${t('settings')}</h2>
  <div class="set"><span>${t('lang')}</span><select id="sl"><option value="pt">Português</option><option value="en">English</option></select></div>
  <div class="set"><span>${t('music')}</span><input type="range" id="sm" min="0" max="1" step="0.05" value="${s.music}"></div>
  <div class="set"><span>${t('sfx')}</span><input type="range" id="ss" min="0" max="1" step="0.05" value="${s.sfx}"></div>
  <div class="set"><span>${t('shake')}</span>${tg('shake')}</div>
  <div class="set"><span>${t('particles')}</span>${tg('particles')}</div>
  <div class="set"><span>${t('labels')}</span>${tg('labels')}</div>
  <div class="row"><button class="btn ghost" id="rs">${t('reset')}</button><button class="btn primary" id="ok">${t('back')}</button></div>`;
  $('#sl', m).value = getLang();
  $('#sl', m).onchange = (e) => { s.lang = e.target.value; setLang(s.lang); save(); m.close(); showSettings(); };
  $('#sm', m).oninput = (e) => { s.music = +e.target.value; applyOpts(); };
  $('#ss', m).oninput = (e) => { s.sfx = +e.target.value; applyOpts(); };
  $('#ss', m).onchange = () => sfx.click();
  m.querySelectorAll('.tgl').forEach((b) => b.onclick = () => { s[b.dataset.k] = !s[b.dataset.k]; b.classList.toggle('on', s[b.dataset.k]); b.setAttribute('aria-checked', !!s[b.dataset.k]); applyOpts(); sfx.click(); });
  $('#rs', m).onclick = () => { if (confirm(t('resetAsk'))) { SAVE = reset(); setLang(detectLang()); applyOpts(); m.close(); buildMenu(); } };
  $('#ok', m).onclick = () => m.close();
}

// ---------- run ----------
function startRun(mode) {
  const seed = mode === 'daily' ? 'daily-' + utcDate() : 'r' + Math.random().toString(36).slice(2, 10);
  const run = newRun(seed, mode);
  run.round = !SAVE.tutorialDone ? 0 : 1;
  G = { run }; show('game'); closeAllModals(); loadRound();
}
function resumeRun() { G = { run: SAVE.run }; show('game'); loadRound(); }
function persist() { SAVE.run = G.run.round >= 1 ? JSON.parse(JSON.stringify(G.run)) : null; save(); }

function loadRound() {
  const run = G.run; G.busy = true;
  setTimeout(() => {
    const prep = run.round === 0 ? tutorialRound() : prepareRound(run);
    G.fixed = prep.fixed; G.par = prep.par; G.hand = prep.hand.map((p, i) => ({ ...p, id: p.id ?? i, o: p.o ?? 0 }));
    G.target = run.round === 0 ? 30 : targetFor(run.round);
    G.ctx = relicCtx(run.relics); G.placed = new Map(); G.selected = null; G.rerolls = G.ctx.rerolls; G.busy = false; G.phase = 'play';
    S.anim = null; S.litSet = new Set(); S.particles = []; S.floaters = []; G.shownScore = 0; G.dispScore = 0;
    if (run.round >= 1 && !G.keepRerollsFor) { /* nova rodada */ }
    persist(); refresh(); fit();
  }, 30);
}
function board() { return composeBoard(G.fixed, G.placed); }
function refresh() {
  S.board = board(); S.preview = trace(S.board, G.ctx); S.litSet = new Set(S.preview.hits.map((h) => h.idx));
  const sel = G.hand.find((p) => p.id === G.selected); S.ghost = sel || null;
  $('#l-round').textContent = t('round'); $('#l-target').textContent = t('target'); $('#l-score').textContent = t('preview'); $('#l-lives').textContent = t('lives'); $('#l-hand').textContent = t('hand');
  $('#v-round').textContent = G.run.round === 0 ? '·' : G.run.round; $('#v-target').textContent = fmt(G.target);
  G.dispScore = S.preview.total; renderScore();
  $('#v-lives').textContent = '◆'.repeat(G.run.lives) + '◇'.repeat(Math.max(0, 3 - G.run.lives));
  $('#par').textContent = G.run.round >= 1 ? `${t('par')}: ${fmt(G.par)}` : '';
  const rb = $('#btn-reroll'); rb.textContent = `${t('reroll')} (${G.rerolls})`; rb.disabled = G.rerolls <= 0 || G.run.round === 0 || G.phase !== 'play';
  $('#btn-clear').textContent = t('clear'); $('#btn-clear').disabled = G.phase !== 'play';
  const fb = $('#btn-fire'); fb.textContent = t('fire'); fb.disabled = G.phase !== 'play' || G.busy;
  const rl = $('#relics'); rl.innerHTML = '';
  if (!G.run.relics.length) rl.appendChild(el('span', 'empty-note', t('noRelics')));
  for (const id of G.run.relics) { const r = RELICS.find((x) => x.id === id); const b = el('div', 'relic', r.glyph); b.title = `${t('r.' + id + '.n')} — ${t('r.' + id + '.d')}`; b.setAttribute('aria-label', b.title); rl.appendChild(b); }
  renderTray(); renderHint();
  $('#v-score').parentElement.classList.toggle('ok', S.preview.total >= G.target);
}
function renderScore() { $('#v-score').textContent = fmt(G.dispScore); }
function renderTray() {
  const tray = $('#tray'); tray.innerHTML = '';
  G.hand.forEach((p, i) => {
    const used = [...G.placed.values()].includes(p);
    const b = el('button', 'card' + (G.selected === p.id ? ' sel' : '') + (used ? ' used' : ''));
    b.title = `${t('piece.' + p.k)} — ${t('pd.' + p.k)}`; b.setAttribute('aria-label', b.title);
    b.appendChild(pieceCanvas(p, 72)); b.appendChild(el('span', 'key', String(i + 1)));
    b.addEventListener('click', () => onCard(p));
    tray.appendChild(b);
  });
}
function renderHint() {
  const h = $('#hint');
  if (G.run.round !== 0 || G.phase !== 'play') { h.classList.add('hidden'); return; }
  const n = G.placed.size; const hasPrism = [...G.placed.values()].some((p) => p.k === 'prism');
  h.textContent = n === 0 ? t('hint1') : !hasPrism ? t('hint3') : t('hint4');
  if (n === 1) h.textContent = t('hint2') + ' ' + t('hint3');
  h.classList.remove('hidden');
}

function onCard(p) {
  if (G.phase !== 'play') return; initAudio();
  const used = [...G.placed.entries()].find(([, v]) => v === p);
  if (used) { G.placed.delete(used[0]); sfx.remove(); G.selected = null; refresh(); return; }
  if (G.selected === p.id) { if (p.k === 'mirror') { p.o ^= 1; sfx.rotate(); } else G.selected = null; }
  else { G.selected = p.id; sfx.select(); }
  refresh();
}
function onCell(i) {
  if (G.phase !== 'play' || i < 0) return; initAudio();
  if (G.fixed[i]) return;
  const existing = G.placed.get(i);
  const sel = G.hand.find((p) => p.id === G.selected);
  if (existing && !sel) { if (existing.k === 'mirror') { existing.o ^= 1; sfx.rotate(); refresh(); } else { G.placed.delete(i); sfx.remove(); refresh(); } return; }
  if (sel && !existing) { G.placed.set(i, sel); G.selected = null; sfx.place(); spawnBurst(i, '#8a7dff', 8); refresh(); return; }
  if (sel && existing) { // troca: devolve a antiga para a bandeja
    G.placed.set(i, sel); G.selected = null; sfx.place(); refresh();
  }
}
function removeAt(i) { if (G.phase === 'play' && G.placed.has(i)) { G.placed.delete(i); sfx.remove(); refresh(); } }

$('#btn-clear').onclick = () => { if (G.phase !== 'play') return; G.placed.clear(); G.selected = null; sfx.remove(); refresh(); };
$('#btn-reroll').onclick = () => {
  if (G.rerolls <= 0 || G.phase !== 'play') return; sfx.click();
  const left = G.rerolls - 1; G.run.handNonce++; G.busy = true; refresh();
  setTimeout(() => { const prep = prepareRound(G.run); G.fixed = prep.fixed; G.par = prep.par; G.hand = prep.hand.map((p, i) => ({ ...p, id: p.id ?? i })); G.placed.clear(); G.selected = null; G.rerolls = left; G.busy = false; refresh(); }, 20);
};
$('#btn-fire').onclick = fire;
$('#btn-pause').onclick = pauseMenu;
function pauseMenu() {
  if (G.phase === 'anim') return;
  const m = modal(`<h2>${t('menu')}</h2><div class="row"><button class="btn ghost" id="a">${t('settings')}</button><button class="btn ghost" id="c">${t('how')}</button></div><div class="row"><button class="btn primary" id="r">OK</button><button class="btn" id="mn">${t('menu')}</button></div>`, { closable: true });
  $('#a', m).onclick = showSettings; $('#c', m).onclick = showHowTo; $('#r', m).onclick = () => m.close();
  $('#mn', m).onclick = () => { m.close(); persist(); show('menu'); buildMenu(); };
}

// ---------- disparo & animação ----------
function fire() {
  if (G.phase !== 'play' || G.busy) return; initAudio(); startMusic();
  G.phase = 'anim'; G.selected = null; refresh();
  const res = trace(board(), G.ctx); const maxT = Math.max(1, ...res.segs.map((s) => s.t2));
  S.anim = { res, t: 0, speed: Math.max(11, maxT / 2.4), maxT, done: new Set(), hitN: 0, finishedAt: null };
  G.dispScore = 0; renderScore(); S.litSet = new Set(); sfx.fire();
}
const cellCenter = (i) => ({ x: (i % W + 0.5) * L.c, y: (((i / W) | 0) + 0.5) * L.c });
function spawnBurst(i, color, n = 14, speed = 1) {
  if (!SAVE.settings.particles || !L) return; const { x, y } = cellCenter(i);
  for (let k = 0; k < n; k++) { const a = Math.random() * 6.283, v = (0.6 + Math.random() * 2.2) * speed * L.c * 0.02 * 60 / 60; S.particles.push({ x, y, vx: Math.cos(a) * v * 60, vy: Math.sin(a) * v * 60, life: 0.7, max: 0.7, r: 2 + Math.random() * 3, color }); }
}
function floater(i, text, color, scale = 0.42) { const { x, y } = cellCenter(i); S.floaters.push({ x, y: y - L.c * 0.3, text, color, life: 1.3, max: 1.3, scale, vy: -L.c * 0.7 }); }

function tick(dt) {
  const a = S.anim;
  if (a) {
    a.t += a.speed * dt;
    for (const h of a.res.hits) {
      if (a.done.has(h) || a.t < h.t) continue; a.done.add(h);
      S.litSet.add(h.idx); G.dispScore += h.gain; renderScore();
      const big = h.gain >= 100; sfx.hit(a.hitN++, big);
      spawnBurst(h.idx, COL[h.color] || '#fff', big ? 30 : 16, big ? 1.6 : 1);
      floater(h.idx, '+' + fmt(h.gain) + (h.match ? ' ✦' : ''), h.match ? '#ffd166' : '#fff', big ? 0.55 : 0.42);
      S.shake = Math.min(1.2, S.shake + (big ? 0.7 : 0.3));
    }
    if (a.t > a.maxT + 0.3 && a.finishedAt == null) {
      a.finishedAt = performance.now();
      if (a.res.allLit) {
        const hi = a.res.hits[a.res.hits.length - 1]; floater(hi.idx, t('allLit') + ' ×' + G.ctx.totalBonus, '#ffd166', 0.5);
        G.dispScore = a.res.total; renderScore(); sfx.clear(); S.shake = 1.2;
        for (const h of a.res.hits) spawnBurst(h.idx, '#ffd166', 20, 1.4);
      }
    }
    if (a.finishedAt != null && performance.now() - a.finishedAt > (a.res.allLit ? 1300 : 800)) { const res = a.res; S.anim = null; finishRound(res); }
  }
  S.shake *= Math.pow(0.02, dt);
  for (const p of S.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96; p.life -= dt; }
  S.particles = S.particles.filter((p) => p.life > 0);
  for (const f of S.floaters) { f.y += f.vy * dt; f.vy *= 0.97; f.life -= dt; }
  S.floaters = S.floaters.filter((f) => f.life > 0);
}

// ---------- fim de rodada ----------
function unlock(id) { if (!SAVE.ach[id]) { SAVE.ach[id] = true; toast('★ ' + t('a.' + id + '.n')); sfx.star(2); } }
function finishRound(res) {
  const run = G.run; const score = res.total; const pass = score >= G.target;
  G.phase = 'result';
  if (run.round === 0) {
    if (!pass) { toast(t('roundFail')); G.phase = 'play'; refresh(); sfx.fail(); return; }
    SAVE.tutorialDone = true; save(); sfx.clear();
    const m = modal(`<h2>${t('roundClear')}</h2><p class="sub">${t('tutTitle')} ✦</p><div class="big">${fmt(score)}</div><div class="row"><button class="btn primary" id="go">${t('play')}</button></div>`);
    $('#go', m).onclick = () => { m.close(); run.round = 1; run.handNonce = 0; loadRound(); }; return;
  }
  const stars = starsFor(score, G.target, G.par);
  if (res.allLit) unlock('total'); if (score >= 1000) unlock('big');
  if (pass) {
    run.total += score; run.history.push({ round: run.round, score, stars }); SAVE.stats.stars += stars; if (stars === 3) unlock('three');
    unlock('first'); if (run.mode === 'daily') unlock('daily');
    if (run.round >= 12) unlock('inf');
    sfx.clear();
    const m = modal(`<h2>${t('roundClear')}</h2><p class="sub">${t('round')} ${run.round}</p>
      <div class="stars"><span class="s" data-i="0">★</span><span class="s" data-i="1">★</span><span class="s" data-i="2">★</span></div>
      <div class="big">${fmt(score)}</div>
      <div class="kv"><span>${t('target')}</span><b>${fmt(G.target)}</b></div><div class="kv"><span>${t('par')}</span><b>${fmt(G.par)}</b></div>
      ${res.allLit ? `<div class="kv"><span>✦ ${t('allLit')}</span><b>×${G.ctx.totalBonus}</b></div>` : ''}
      <div class="row"><button class="btn primary" id="go">${t('next')}</button></div>`);
    m.querySelectorAll('.s').forEach((s, i) => { if (i < stars) setTimeout(() => { s.classList.add('on'); sfx.star(i); }, 350 + i * 350); });
    $('#go', m).onclick = () => { m.close(); sfx.click(); afterClear(); };
    if (run.mode === 'daily' && SAVE.stats.dailyDate !== utcDate()) { SAVE.stats.dailyDate = utcDate(); SAVE.stats.dailyBest = 0; }
    if (run.mode === 'daily') SAVE.stats.dailyBest = Math.max(SAVE.stats.dailyBest, run.total);
    save();
  } else {
    run.lives--; sfx.fail(); S.shake = 1;
    if (run.lives <= 0) { endRun(false); return; }
    persist();
    const m = modal(`<h2>${t('roundFail')}</h2><p class="sub">${fmt(score)} / ${fmt(G.target)}</p><div class="stars"><span class="s">◆</span></div><p class="sub">${t('lives')}: ${'◆'.repeat(run.lives)}${'◇'.repeat(3 - run.lives)}</p><div class="row"><button class="btn primary" id="go">${t('tryAgain')}</button></div>`);
    $('#go', m).onclick = () => { m.close(); sfx.click(); G.phase = 'play'; refresh(); };
  }
}
function afterClear() {
  const run = G.run;
  if (run.round === WIN_ROUND && !run.won) { run.won = true; unlock('win'); endRun(true); return; }
  openDraft();
}
function openDraft() {
  const run = G.run; const offers = makeOffers(run);
  const m = modal(`<h2>${t('draft')}</h2><p class="sub">${t('draftSub')}</p><div class="offers" id="of"></div>`);
  for (const o of offers) {
    const b = el('button', 'offer ' + o.type);
    if (o.type === 'relic') { const r = RELICS.find((x) => x.id === o.id); b.innerHTML = `<span class="tagl">${t('relicTag')}</span><span class="ico">${r.glyph}</span><b>${t('r.' + o.id + '.n')}</b><small>${t('r.' + o.id + '.d')}</small>`; }
    else { const pk = PACKS.find((p) => p.id === o.id); b.innerHTML = `<span class="tagl">${t('packTag')}</span><span class="ico"></span><b>${t('pack.' + o.id)}</b><small>${t('pack.d')}</small>`; b.querySelector('.ico').appendChild(pieceCanvas({ ...pk.pieces[0], o: 0 }, 48)); }
    b.onclick = () => {
      sfx.pick(); applyOffer(run, o); if (run.relics.length >= MAX_RELICS) unlock('relics'); m.close();
      run.round++; run.handNonce = 0; if (run.round >= 12) unlock('inf'); loadRound();
    };
    $('#of', m).appendChild(b);
  }
}
function shareText(run, ended) {
  const marks = run.history.map((h) => ['⬛', '🟦', '🟨', '🟪'][h.stars]).join('');
  const head = run.mode === 'daily' ? `PRISMORA ${utcDate()}` : 'PRISMORA';
  return `${head} ✦ ${t('round')} ${run.history.length} · ${fmt(run.total)} pts\n${marks}\nprismora`;
}
function endRun(won) {
  const run = G.run; G.phase = 'over'; const st = SAVE.stats; st.runs++;
  const reached = won ? run.round : run.round; st.bestRound = Math.max(st.bestRound, reached); st.bestScore = Math.max(st.bestScore, run.total);
  SAVE.run = null; save();
  const text = shareText(run, true);
  const m = modal(`<h2>${won ? t('youWon') : t('gameOver')}</h2><p class="sub">${t('round')} ${reached}</p><div class="big">${fmt(run.total)}</div>
    <div class="kv"><span>${t('bestRun')}</span><b>${fmt(st.bestScore)}</b></div><div class="kv"><span>${t('stars')}</span><b>★ ${run.history.reduce((a, h) => a + h.stars, 0)}</b></div>
    <div class="row">${won ? `<button class="btn gold" id="inf">${t('keep')}</button>` : ''}<button class="btn" id="sh">${t('share')}</button><button class="btn primary" id="nr">${t('newRun')}</button><button class="btn ghost" id="mn">${t('menu')}</button></div>`);
  if (won) $('#inf', m).onclick = () => { m.close(); G.phase = 'play'; run.won = true; openDraft(); };
  $('#sh', m).onclick = async () => { try { await navigator.clipboard.writeText(text); } catch { /* sem permissão */ } $('#sh', m).textContent = t('copied'); sfx.click(); };
  $('#nr', m).onclick = () => { m.close(); startRun(run.mode); };
  $('#mn', m).onclick = () => { m.close(); show('menu'); buildMenu(); };
}

// ---------- entrada ----------
function pos(e) { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
canvas.addEventListener('pointermove', (e) => { if (!L || !G) return; const i = cellAt(L, ...pos(e)); S.hover = i; S.canPlace = i >= 0 && G.phase === 'play' && !G.fixed?.[i]; });
canvas.addEventListener('pointerleave', () => { S.hover = -1; });
canvas.addEventListener('pointerdown', (e) => { if (!L || !G?.fixed) return; const i = cellAt(L, ...pos(e)); S.hover = i; S.canPlace = i >= 0 && !G.fixed[i]; if (e.button === 2 || e.shiftKey) { removeAt(i); return; } onCell(i); });
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
window.addEventListener('keydown', (e) => {
  if (!G || $('#game').classList.contains('hidden') || $('#modal-root').children.length) return;
  if (e.key === 'Escape') return pauseMenu();
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); return fire(); }
  if (e.key.toLowerCase() === 'r') { const p = G.hand?.find((x) => x.id === G.selected) || G.placed.get(S.hover); if (p?.k === 'mirror') { p.o ^= 1; sfx.rotate(); refresh(); } return; }
  const n = parseInt(e.key, 10); if (n >= 1 && n <= (G.hand?.length || 0)) onCard(G.hand[n - 1]);
});
function fit() { if (!$('#game').classList.contains('hidden')) L = layout(canvas); }
function resize() { fit(); }
window.addEventListener('resize', resize);

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (G && L && !document.hidden && !$('#game').classList.contains('hidden')) { tick(dt); drawScene(ctx2d, L, S, now); if (S.anim) renderScore(); }
  requestAnimationFrame(frame);
}

// testes automatizados e depuração
window.__prismora = { get G() { return G; }, get S() { return S; }, onCell, onCard, fire, startRun, get SAVE() { return SAVE; } };

SAVE = load(); setLang(SAVE.settings.lang || detectLang()); applyOpts(); buildMenu(); show('menu'); requestAnimationFrame(frame);
