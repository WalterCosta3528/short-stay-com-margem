// Áudio 100% sintetizado (WebAudio): sem arquivos externos => sem risco de licença e zero download.
let ac = null, master, sfxBus, musBus, delay, started = false, musicTimer = null;
let vols = { music: 0.5, sfx: 0.8 };
const PENTA = [0, 2, 4, 7, 9]; // pentatônica maior
const noteHz = (deg, base = 261.63) => base * Math.pow(2, (PENTA[deg % 5] + 12 * Math.floor(deg / 5)) / 12);

export function initAudio() {
  if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = 0.9; master.connect(ac.destination);
    sfxBus = ac.createGain(); musBus = ac.createGain();
    delay = ac.createDelay(1); delay.delayTime.value = 0.28;
    const fb = ac.createGain(); fb.gain.value = 0.35; const wet = ac.createGain(); wet.gain.value = 0.3;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    sfxBus.connect(master); sfxBus.connect(delay); musBus.connect(master); musBus.connect(delay);
    setVolumes(vols.music, vols.sfx);
  } catch { ac = null; }
}
export function setVolumes(music, sfx) {
  vols = { music, sfx };
  if (!ac) return;
  musBus.gain.value = music * 0.35; sfxBus.gain.value = sfx * 0.6;
}
function tone({ f, type = 'sine', dur = 0.25, vol = 0.4, attack = 0.005, slide = 0, bus = sfxBus, when = 0 }) {
  if (!ac) return;
  const t0 = ac.currentTime + when;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + attack); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(bus); o.start(t0); o.stop(t0 + dur + 0.05);
}
export const sfx = {
  click: () => tone({ f: 520, type: 'triangle', dur: 0.08, vol: 0.25 }),
  select: () => tone({ f: 660, type: 'triangle', dur: 0.1, vol: 0.25, slide: 1.3 }),
  place: () => { tone({ f: 200, type: 'triangle', dur: 0.12, vol: 0.4, slide: 1.8 }); tone({ f: 880, type: 'sine', dur: 0.1, vol: 0.12 }); },
  rotate: () => tone({ f: 420, type: 'square', dur: 0.06, vol: 0.1, slide: 1.25 }),
  remove: () => tone({ f: 400, type: 'triangle', dur: 0.1, vol: 0.25, slide: 0.6 }),
  fire: () => { tone({ f: 110, type: 'sawtooth', dur: 0.6, vol: 0.25, slide: 6 }); tone({ f: 330, type: 'sine', dur: 0.5, vol: 0.2, slide: 4 }); },
  hit: (i = 0, big = false) => {
    const f = noteHz(Math.min(i, 14), 329.63);
    tone({ f, type: 'sine', dur: 0.55, vol: 0.38 });
    tone({ f: f * 2, type: 'triangle', dur: 0.35, vol: 0.14 });
    if (big) tone({ f: f / 2, type: 'sine', dur: 0.7, vol: 0.3 });
  },
  clear: () => [0, 2, 4, 7, 9].forEach((d, i) => tone({ f: noteHz(d + 5), type: 'triangle', dur: 0.5, vol: 0.28, when: i * 0.09 })),
  star: (i) => tone({ f: noteHz(7 + i * 2, 523.25), type: 'sine', dur: 0.5, vol: 0.3 }),
  fail: () => { tone({ f: 300, type: 'sawtooth', dur: 0.5, vol: 0.2, slide: 0.4 }); tone({ f: 150, type: 'triangle', dur: 0.7, vol: 0.25, slide: 0.5 }); },
  pick: () => [0, 4, 7].forEach((d, i) => tone({ f: noteHz(d, 440), type: 'triangle', dur: 0.3, vol: 0.25, when: i * 0.06 })),
};
// Música ambiente generativa: acordes suaves + notas aleatórias da pentatônica.
export function startMusic() {
  if (!ac || started) return; started = true;
  const chords = [[0, 2, 4], [2, 4, 7], [4, 7, 9], [0, 4, 7]];
  let step = 0;
  const bar = () => {
    if (!ac || vols.music <= 0.001) return;
    const ch = chords[step++ % chords.length];
    ch.forEach((d) => tone({ f: noteHz(d, 130.81), type: 'sine', dur: 6.5, vol: 0.22, attack: 1.2, bus: musBus }));
    for (let i = 0; i < 4; i++) if (Math.random() < 0.7) tone({ f: noteHz(Math.floor(Math.random() * 10), 392), type: 'triangle', dur: 1.2, vol: 0.1, attack: 0.02, bus: musBus, when: 0.8 + i * 1.3 });
  };
  bar(); musicTimer = setInterval(bar, 6000);
}
export function stopMusic() { clearInterval(musicTimer); started = false; }
