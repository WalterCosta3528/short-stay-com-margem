import { W, H, DIRS } from './data.js';

export const COL = { R: '#ff4d6d', G: '#3ddc97', B: '#4dabff', W: '#e9e5ff' };
const GOLD = '#ffd166';

export function layout(canvas) {
  const box = canvas.parentElement;
  const size = Math.max(240, Math.floor(Math.min(box.clientWidth, box.clientHeight || box.clientWidth)));
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
  canvas.width = Math.floor(size * dpr); canvas.height = Math.floor(size * dpr);
  const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { size, c: size / W };
}

function poly(ctx, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }

export function crystalShape(ctx, color, cx, cy, r) {
  if (color === 'R') poly(ctx, [[cx, cy - r], [cx + r * 0.95, cy + r * 0.7], [cx - r * 0.95, cy + r * 0.7]]);
  else if (color === 'G') poly(ctx, Array.from({ length: 6 }, (_, i) => [cx + Math.cos(i * Math.PI / 3 + Math.PI / 6) * r, cy + Math.sin(i * Math.PI / 3 + Math.PI / 6) * r]));
  else if (color === 'B') poly(ctx, [[cx, cy - r * 1.05], [cx + r * 0.8, cy], [cx, cy + r * 1.05], [cx - r * 0.8, cy]]);
  else { ctx.beginPath(); ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2); }
}

export function drawCrystal(ctx, cell, cx, cy, s, lit, labels, time = 0) {
  const r = s * 0.34, col = COL[cell.color];
  ctx.save();
  if (lit) { ctx.shadowColor = col; ctx.shadowBlur = 18 + 6 * Math.sin(time * 5); }
  crystalShape(ctx, cell.color, cx, cy, r);
  const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  g.addColorStop(0, lit ? '#ffffff' : col); g.addColorStop(1, lit ? col : shade(col, 0.45));
  ctx.fillStyle = g; ctx.globalAlpha = lit ? 1 : 0.78; ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = lit ? '#fff' : col; ctx.stroke();
  ctx.restore();
  ctx.fillStyle = lit ? '#1a1033' : '#0b0a1f'; ctx.font = `800 ${s * 0.22}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(cell.value + (cell.bonus || 0)), cx, cy + 1);
  if (labels && cell.color !== 'W') { ctx.fillStyle = '#fff'; ctx.font = `800 ${s * 0.16}px system-ui`; ctx.fillText(cell.color, cx + r * 0.95, cy - r * 0.9); }
}

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${Math.round((n >> 16) * k)},${Math.round(((n >> 8) & 255) * k)},${Math.round((n & 255) * k)})`;
}

/** Desenha uma peça (usado no tabuleiro e nos cartões da bandeja). */
export function drawPiece(ctx, p, cx, cy, s, opts = {}) {
  const a = opts.alpha ?? 1; ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (p.k === 'mirror') {
    const d = s * 0.34; ctx.shadowColor = '#bfb6ff'; ctx.shadowBlur = 10;
    ctx.strokeStyle = '#d9d3ff'; ctx.lineWidth = s * 0.09; ctx.beginPath();
    if (p.o === 0) { ctx.moveTo(cx - d, cy + d); ctx.lineTo(cx + d, cy - d); } else { ctx.moveTo(cx - d, cy - d); ctx.lineTo(cx + d, cy + d); }
    ctx.stroke(); ctx.shadowBlur = 0; ctx.strokeStyle = '#7b6bff'; ctx.lineWidth = s * 0.035; ctx.stroke();
  } else if (p.k === 'prism') {
    const r = s * 0.34; poly(ctx, [[cx, cy - r], [cx + r * 0.95, cy + r * 0.7], [cx - r * 0.95, cy + r * 0.7]]);
    const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r); g.addColorStop(0, 'rgba(255,255,255,.85)'); g.addColorStop(0.5, 'rgba(160,140,255,.35)'); g.addColorStop(1, 'rgba(255,120,200,.45)');
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
  } else if (p.k === 'lens') {
    const rx = s * 0.17, ry = s * 0.36; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,214,102,.28)'; ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; ctx.shadowColor = GOLD; ctx.shadowBlur = 10; ctx.stroke();
    ctx.shadowBlur = 0; ctx.fillStyle = GOLD; ctx.font = `800 ${s * 0.2}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('×', cx, cy + 1);
  } else if (p.k === 'filter') {
    const r = s * 0.3; ctx.fillStyle = COL[p.color] + '55'; ctx.strokeStyle = COL[p.color]; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(cx - r, cy - r, r * 2, r * 2, 6); ctx.fill(); ctx.stroke();
    crystalShape(ctx, p.color, cx, cy, r * 0.5); ctx.fillStyle = COL[p.color]; ctx.fill();
  }
  ctx.restore();
}

function drawFixed(ctx, cell, cx, cy, s, lit, labels, time) {
  if (cell.k === 'wall') {
    const r = s * 0.42; ctx.fillStyle = '#2a2750'; ctx.strokeStyle = '#4a4685'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(cx - r, cy - r, r * 2, r * 2, 8); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#3a3670'; ctx.beginPath(); ctx.moveTo(cx - r * 0.6, cy + r * 0.2); ctx.lineTo(cx + r * 0.2, cy - r * 0.6); ctx.moveTo(cx - r * 0.2, cy + r * 0.6); ctx.lineTo(cx + r * 0.6, cy - r * 0.2); ctx.stroke();
  } else if (cell.k === 'emitter') {
    const col = COL[cell.color]; const r = s * 0.34; ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 16;
    ctx.fillStyle = '#17143a'; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    const [dx, dy] = DIRS[cell.dir]; ctx.fillStyle = col; poly(ctx, [[cx + dx * r * 0.85, cy + dy * r * 0.85], [cx - dy * r * 0.45 - dx * r * 0.1, cy + dx * r * 0.45 - dy * r * 0.1], [cx + dy * r * 0.45 - dx * r * 0.1, cy - dx * r * 0.45 - dy * r * 0.1]]); ctx.fill(); ctx.restore();
  } else if (cell.k === 'crystal') drawCrystal(ctx, cell, cx, cy, s, lit, labels, time);
}

function drawBeams(ctx, segs, c, ox, oy, tLimit, alpha, shadow) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const sg of segs) {
    if (tLimit != null && tLimit < sg.t1) continue;
    let x2 = sg.x2, y2 = sg.y2;
    if (tLimit != null && tLimit < sg.t2) { const k = (tLimit - sg.t1) / (sg.t2 - sg.t1); x2 = sg.x1 + (sg.x2 - sg.x1) * k; y2 = sg.y1 + (sg.y2 - sg.y1) * k; }
    const col = COL[sg.color] || COL.W; const pw = Math.min(1 + Math.log2(sg.power) * 0.55, 4.2);
    const X1 = ox + (sg.x1 + 0.5) * c, Y1 = oy + (sg.y1 + 0.5) * c, X2 = ox + (x2 + 0.5) * c, Y2 = oy + (y2 + 0.5) * c;
    ctx.globalAlpha = alpha * 0.3; ctx.strokeStyle = col; ctx.lineWidth = c * 0.13 * pw; ctx.beginPath(); ctx.moveTo(X1, Y1); ctx.lineTo(X2, Y2); ctx.stroke();
    ctx.globalAlpha = alpha; ctx.shadowColor = shadow ? col : 'transparent'; ctx.shadowBlur = shadow ? 14 : 0; ctx.lineWidth = c * 0.045 * pw; ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(X1, Y1); ctx.lineTo(X2, Y2); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineWidth = c * 0.07 * pw; ctx.globalAlpha = alpha * 0.8; ctx.beginPath(); ctx.moveTo(X1, Y1); ctx.lineTo(X2, Y2); ctx.stroke();
  }
  ctx.restore();
}

/** Cena completa. `S` = estado de visualização do main.js */
export function drawScene(ctx, L, S, now) {
  const { size, c } = L; const time = now / 1000;
  ctx.clearRect(0, 0, size, size);
  let ox = 0, oy = 0;
  if (S.shake > 0.01 && S.opts.shake) { ox = (Math.random() - 0.5) * S.shake * 8; oy = (Math.random() - 0.5) * S.shake * 8; }
  // grade
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const hov = S.hover === y * W + x && S.canPlace;
    ctx.fillStyle = hov ? '#2a2670' : ((x + y) % 2 ? '#14123a' : '#17153f');
    ctx.beginPath(); ctx.roundRect(ox + x * c + 2, oy + y * c + 2, c - 4, c - 4, 8); ctx.fill();
    if (hov) { ctx.strokeStyle = '#8a7dff'; ctx.lineWidth = 2; ctx.stroke(); }
  }
  const litSet = S.litSet;
  // feixes
  const live = S.anim ? null : S.preview;
  if (live) drawBeams(ctx, live.segs, c, ox, oy, null, 0.55, false);
  if (S.anim) drawBeams(ctx, S.anim.res.segs, c, ox, oy, S.anim.t, 1, true);
  // células fixas e peças
  for (let i = 0; i < W * H; i++) {
    const cell = S.board[i]; if (!cell) continue;
    const cx = ox + (i % W + 0.5) * c, cy = oy + (((i / W) | 0) + 0.5) * c;
    if (cell.k === 'crystal') drawCrystal(ctx, cell, cx, cy, c, litSet.has(i), S.opts.labels, time);
    else if (cell.k === 'mirror' || cell.k === 'prism' || cell.k === 'lens' || cell.k === 'filter') drawPiece(ctx, cell, cx, cy, c);
    else drawFixed(ctx, cell, cx, cy, c, false, S.opts.labels, time);
  }
  // fantasma da peça selecionada
  if (S.ghost && S.hover >= 0 && S.canPlace) drawPiece(ctx, S.ghost, ox + (S.hover % W + 0.5) * c, oy + (((S.hover / W) | 0) + 0.5) * c, c, { alpha: 0.55 });
  // partículas
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const p of S.particles) { ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(ox + p.x, oy + p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  // números flutuantes
  for (const f of S.floaters) {
    ctx.save(); ctx.globalAlpha = Math.max(0, f.life / f.max); ctx.fillStyle = f.color; ctx.strokeStyle = 'rgba(10,8,30,.8)'; ctx.lineWidth = 4;
    ctx.font = `900 ${c * f.scale}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const hw = ctx.measureText(f.text).width / 2 + 6; const fx = Math.min(size - hw, Math.max(hw, f.x));
    ctx.strokeText(f.text, ox + fx, oy + f.y); ctx.fillText(f.text, ox + fx, oy + f.y); ctx.restore();
  }
}
export const cellAt = (L, px, py) => { const x = Math.floor(px / L.c), y = Math.floor(py / L.c); return x < 0 || y < 0 || x >= W || y >= H ? -1 : y * W + x; };
