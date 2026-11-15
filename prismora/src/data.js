// Dados de design (balanceamento fica aqui, separado da lógica).
export const W = 7, H = 7;
export const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // 0=→ 1=↓ 2=← 3=↑
export const COLORS = ['R', 'G', 'B'];
export const MAX_RELICS = 5;
export const START_LIVES = 3;
export const WIN_ROUND = 8;
export const BASE_HAND = 5;

export const RELICS = [
  { id: 'polished',      glyph: '◎' }, // lentes x3
  { id: 'clean',         glyph: '╱' }, // espelhos +1 poder
  { id: 'living',        glyph: '◆' }, // cristais +10
  { id: 'prism3',        glyph: '▲' }, // prisma mantém feixe central
  { id: 'fullhand',      glyph: '✋' }, // +1 peça na mão
  { id: 'chroma',        glyph: '❖' }, // combinação de cor x4
  { id: 'gold',          glyph: '☼' }, // emissores poder 2
  { id: 'constellation', glyph: '✦' }, // bônus total x2
  { id: 'recycle',       glyph: '↻' }, // +2 redistribuições
  { id: 'resonant',      glyph: '≋' }, // cristal atingido de novo vale x2
];

// Pacotes de peças oferecidos no draft.
export const PACKS = [
  { id: 'mirrors', pieces: [{ k: 'mirror' }, { k: 'mirror' }] },
  { id: 'prism',   pieces: [{ k: 'prism' }] },
  { id: 'lens',    pieces: [{ k: 'lens' }] },
  { id: 'filterR', pieces: [{ k: 'filter', color: 'R' }] },
  { id: 'filterG', pieces: [{ k: 'filter', color: 'G' }] },
  { id: 'filterB', pieces: [{ k: 'filter', color: 'B' }] },
];

export const START_DECK = [
  { k: 'mirror' }, { k: 'mirror' }, { k: 'mirror' }, { k: 'mirror' },
  { k: 'prism' }, { k: 'lens' },
  { k: 'filter', color: 'R' }, { k: 'filter', color: 'G' }, { k: 'filter', color: 'B' },
];

// Curva de meta de pontos por rodada (calibrada via tests/sim.mjs).
export function targetFor(round) {
  const t = 40 * Math.pow(1.55, round - 1);
  return Math.round(t / 10) * 10;
}
export const FEASIBLE_FACTOR = 1.25; // o solver precisa achar >= meta x fator, senão o mapa é regenerado
