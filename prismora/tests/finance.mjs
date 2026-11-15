// Modelo financeiro (USD). Premissas explícitas; NÃO é previsão. Rode: node tests/finance.mjs
const LIST = 12.99; // preço de lista sugerido
const scen = { Conservador: 0.62, Intermediário: 0.72, Otimista: 0.82 }; // preço médio realizado / lista (descontos, preço regional)
const REFUND = 0.06; // reembolsos (premissa)
const TAX = 0.15; // imposto efetivo sobre receita após Steam (premissa; validar com contador)
const DEV = 70000; // desenvolvimento (12 meses solo + arte/áudio/QA terceirizados)
const OPS = 12000; // jurídico, contas, ferramentas, localização
const mkt = { 10000: 15000, 50000: 30000, 100000: 50000, 500000: 150000, 1000000: 250000 };
const f = (n) => Math.round(n).toLocaleString('en-US');
const rows = [];
for (const [name, k] of Object.entries(scen)) {
  for (const units of [10000, 50000, 100000, 500000, 1000000]) {
    const gross = units * LIST * k * (1 - REFUND);
    const steam = gross * 0.3; // 30% até US$10M (nenhum cenário abaixo passa disso)
    const afterSteam = gross - steam;
    const tax = afterSteam * TAX;
    const post = units >= 100000 ? 0.1 * DEV : 0.04 * DEV; // suporte/patches pós-lançamento
    const cost = DEV + OPS + mkt[units] + post;
    rows.push({ name, units, gross, steam, tax, cost, net: afterSteam - tax - cost });
  }
}
console.log(`Preço de lista: US$${LIST} | reembolso ${REFUND * 100}% | imposto efetivo ${TAX * 100}% | Valve 30%\n`);
console.log('| Cenário | Cópias | Receita bruta | Taxa Steam | Impostos | Custos totais | **Resultado líquido** |');
console.log('|---|---:|---:|---:|---:|---:|---:|');
for (const r of rows) console.log(`| ${r.name} | ${f(r.units)} | $${f(r.gross)} | $${f(r.steam)} | $${f(r.tax)} | $${f(r.cost)} | **$${f(r.net)}** |`);
const fixed = DEV + OPS + 15000 + 0.04 * DEV;
const be = Object.entries(scen).map(([n, k]) => `${n}: ${f(fixed / (LIST * k * (1 - REFUND) * 0.7 * (1 - TAX)))} cópias`);
console.log('\nPonto de equilíbrio (custo ~US$100k): ' + be.join(' | '));
