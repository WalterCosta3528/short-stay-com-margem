# PRISMORA — protótipo jogável

*Dobre a luz. Acenda tudo.* Roguelite de puzzle: posicione espelhos, prismas, lentes e filtros, acenda cristais, escolha relíquias que quebram as regras.

## Jogar
Sem build, sem dependências. Sirva a pasta e abra no navegador:
```bash
cd prismora && python3 -m http.server 8765   # http://localhost:8765
```
(ES modules exigem HTTP; abrir o arquivo direto via `file://` não funciona.)

## Estrutura
```
index.html  css/style.css
src/data.js     números de balanceamento, relíquias, pacotes
src/engine.js   motor puro (trace do feixe, geração de fases, run, draft) — sem DOM
src/solver.js   busca hill-climbing: valida viabilidade, calcula "Par", alimenta simulações
src/render.js   desenho Canvas (peças, feixes, partículas)
src/audio.js    áudio sintetizado WebAudio (sem arquivos)
src/i18n.js     PT-BR / EN
src/save.js     localStorage
src/main.js     fluxo do jogo, UI, tutorial, conquistas, diário
tests/          engine.test.mjs  sim.mjs  calib.mjs  e2e.mjs  viewports.mjs  finance.mjs  matrix.mjs
docs/           ESTUDO_ESTRATEGICO.md  GDD.md
```

## Testes (o que foi realmente executado)
```bash
node --test tests/engine.test.mjs   # 11 testes de unidade do motor: PASS
node tests/sim.mjs 60 low|mid|high  # simulação de balanceamento com bot
node tests/e2e.mjs                  # Chromium: menu→tutorial→rodada→draft→salvar/continuar + mobile (requer playwright global e servidor na :8765)
node tests/viewports.mjs            # 6 resoluções (1920×1080 … 360×640): PASS
```
**Resultados (data do estudo):**
- Unidade: 11/11. E2E: sem erros de console; progresso persiste e é retomado após recarregar.
- Resoluções 1920×1080, 1366×768, 1024×768, 768×1024, 412×915, 360×640: sem overflow horizontal; botão de disparo e bandeja visíveis.
- Desempenho: preparar uma rodada (geração + solver) ≈ 35 ms em média, 77 ms no pior de 80 chamadas (Node).
- **Balanceamento por bot** (60 runs, drafts *aleatórios*, 8 rodadas): bot fraco vence ≈ 8%, médio ≈ 42%, forte ≈ 62%; rodada 9+ afunila (Infinito). Humanos draftando com critério devem ir melhor que o bot — **ainda não validado com pessoas.**

## O que NÃO está feito (honestidade)
- **Nenhum playtest com jogadores reais** — todos os indicadores de retenção/diversão são metas, não medições.
- Arte procedural de protótipo (boa, mas não é "arte final"); áudio sintetizado simples (sem trilha composta).
- Sem empacotamento Steam/mobile, sem conquistas Steam, sem ranking online, só 10 relíquias, sem chefes com regras únicas.
- Nome "PRISMORA" sem clearance formal de marca.
- Calibração de dificuldade usa um solver como proxy de jogador; precisa de dados humanos.
