const KEY = 'prismora.v1';
const DEFAULT = () => ({
  settings: { lang: null, music: 0.5, sfx: 0.8, shake: true, particles: true, labels: false },
  stats: { runs: 0, bestRound: 0, bestScore: 0, stars: 0, dailyDate: null, dailyBest: 0 },
  ach: {}, tutorialDone: false, run: null,
});
let mem = DEFAULT();
export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const o = JSON.parse(raw); mem = { ...DEFAULT(), ...o, settings: { ...DEFAULT().settings, ...(o.settings || {}) }, stats: { ...DEFAULT().stats, ...(o.stats || {}) } }; }
  } catch { /* modo privado / bloqueado: segue em memória */ }
  return mem;
}
export function save() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch { /* ignora */ } }
export function reset() { mem = DEFAULT(); save(); return mem; }
export const data = () => mem;
