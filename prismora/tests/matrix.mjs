// Matriz de decisão. Notas 0-10 são JULGAMENTO MEU (subjetivo), não dado de mercado. Para custo/complexidade/concorrência, 10 = melhor (mais barato/fácil/menos concorrido).
const crit = [['Originalidade', 1.0], ['Potencial comercial', 1.5], ['Público', 1.0], ['Clareza', 1.0], ['Viralização', 1.2], ['Rejogabilidade', 1.2], ['Facilidade dev', 1.2], ['Baixo custo', 1.0], ['Pouca concorrência', 1.0], ['Monetização', 0.8], ['Expansão', 0.8]];
const games = [
  ['1. PRISMORA — roguelite de puzzle de luz', [8, 7, 7, 9, 8, 9, 8, 9, 7, 7, 8]],
  ['2. Tidebound Tavern — bar cozy com automação', [6, 6, 7, 8, 6, 6, 6, 6, 6, 7, 7]],
  ['3. Pocket Kingdoms — auto-battler de bolso', [5, 6, 7, 7, 6, 8, 6, 6, 3, 6, 8]],
  ['4. Heist Loop — roubo em loop temporal', [8, 6, 6, 6, 7, 6, 4, 4, 7, 5, 6]],
  ['5. Fungal Frontier — ecossistema roguelite', [7, 5, 6, 5, 5, 7, 5, 5, 6, 6, 7]],
  ['6. Cargo Cult — co-op de física/caos (4 jog.)', [7, 8, 8, 9, 10, 7, 3, 3, 5, 6, 6]],
  ['7. Span Rogue — pontes/estruturas roguelite', [6, 5, 6, 7, 6, 7, 5, 6, 3, 5, 6]],
  ['8. Deepwatch — horror co-op de trabalho', [6, 7, 7, 8, 9, 6, 3, 3, 2, 6, 6]],
  ['9. Lexicon Forge — roguelite de palavras', [5, 6, 8, 9, 6, 8, 8, 9, 5, 6, 6]],
  ['10. Gravity Garden — sandbox de física', [7, 4, 5, 6, 6, 5, 6, 6, 6, 4, 5]],
];
const wsum = crit.reduce((a, [, w]) => a + w, 0);
const rows = games.map(([n, s]) => ({ n, s, tot: s.reduce((a, v, i) => a + v * crit[i][1], 0) / wsum }));
console.log('| Conceito | ' + crit.map(([c]) => c).join(' | ') + ' | **Nota ponderada** |');
console.log('|---|' + crit.map(() => ':-:').join('|') + '|:-:|');
for (const r of rows) console.log(`| ${r.n} | ${r.s.join(' | ')} | **${r.tot.toFixed(2)}** |`);
console.log('\nPesos: ' + crit.map(([c, w]) => `${c} ×${w}`).join(', '));
console.log('Ranking: ' + [...rows].sort((a, b) => b.tot - a.tot).slice(0, 4).map((r) => `${r.n.split(' — ')[0]} (${r.tot.toFixed(2)})`).join(' > '));
