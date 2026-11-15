# PRISMORA — Game Design Document (v0.1)

## 1. Pilares
1. **Clareza instantânea** — qualquer um entende "dobre a luz, acenda os cristais" em 10 s.
2. **Pensamento, não sorte** — prévia ao vivo do feixe e da pontuação; aleatoriedade só no que você recebe, nunca na resolução.
3. **Explosão de números** — relíquias que reescrevem regras criam combos "quebrados" memoráveis.
4. **Respeito ao tempo** — run de ~15 min, sem loja, sem energia, sem grind.

## 2. Loop
`Mão (5 peças) → posicionar com prévia → DISPARAR → pontuar → meta? → draft (relíquia/peças) → próxima rodada`
Run = 8 rodadas (rodadas 4 e 8 são "chefes": mais paredes, 3 emissores). Depois: modo **Infinito**.
Falhar uma rodada custa 1 de 3 **fissuras**; 0 = fim de run. O mapa e a mão se mantêm ao tentar de novo (puzzle justo).

## 3. Regras do tabuleiro (7×7)
| Elemento | Regra |
|---|---|
| Emissor | Fixo na borda; dispara feixe (branco ou colorido) para dentro. Bloqueia feixes. |
| Parede | Bloqueia feixe. |
| Cristal | Absorve o feixe. Pontos = (valor + bônus) × poder × (×3 se cor igual) × (×2 se Ressonância e já atingido). Cor neutra (branco) nunca combina. |
| Espelho `/` `\` | Desvia 90°. Rotaciona ao tocar. |
| Prisma | Feixe sai em dois, perpendiculares; o central para (a menos que *Prisma Triplo*). |
| Lente | Poder ×2 (×3 com *Lente Polida*). |
| Filtro R/G/B | Feixe passa a ter essa cor. |
| **Prisma Total** | Todos os cristais atingidos: pontuação total ×1,5 (×2 com *Constelação*). |
Anti-loop: um feixe que repete (casa, direção) termina; ciclos com lentes não geram crescimento infinito.

## 4. Progressão
- **Baralho:** 9 peças iniciais (4 espelhos, 1 prisma, 1 lente, 3 filtros). Mão = 5 (garantidos ≥2 espelhos — anti-frustração).
- **Draft** após cada rodada: 3 ofertas entre relíquias (até 5 ativas) e pacotes de peças.
- **Estrelas:** ★ meta · ★★ ≥ "Par" (melhor arranjo que o solver achou) · ★★★ ≥ 125% do Par.
- **Metas:** `40 × 1,55^(rodada−1)`. Calibradas por simulação (ver README).
- **Geração:** determinística por seed; o solver recusa mapas onde a meta × 1,25 não seja alcançável com a mão dada (até 12 tentativas).

## 5. Relíquias (10 no protótipo)
Lente Polida · Espelho Limpo · Cristal Vivo · Prisma Triplo · Mão Cheia · Foco Cromático · Luz Dourada · Constelação · Reciclagem · Ressonância. (Alvo 1.0: 40+, com sinergias e raridades.)

## 6. Modos
Normal (seed aleatória) · **Desafio Diário** (seed = data UTC; todos jogam o mesmo; melhor placar local salvo; resultado em emojis para compartilhar) · Infinito.

## 7. UX e acessibilidade
Mouse, toque e teclado (1–9 selecionam, R gira, Espaço dispara, Esc menu, botão direito/Shift remove). Cores sempre acompanhadas de **formas** (triângulo/hexágono/losango/círculo) + opção de rótulos de cor. Tremor de tela e partículas desligáveis. Volumes separados. PT-BR/EN com detecção automática.

## 8. Áudio e arte
Áudio sintetizado em tempo real (WebAudio): cada cristal tocado soa uma nota da pentatônica, subindo na cadeia → qualquer combo vira "melodia". Música ambiente generativa. Arte 100% procedural (Canvas): sem ativos de terceiros ⇒ **zero risco de licença** no protótipo.

## 9. Persistência
`localStorage`: configurações, estatísticas, conquistas, tutorial, e **run em andamento** (retomável — tabuleiro e mão são regenerados da seed).

## 10. Fora de escopo do protótipo (roadmap)
Arte final/animações de personagem, 30+ relíquias, biomas com regras próprias, chefes com mecânicas, conquistas Steam, ranking online, controle/gamepad, mais idiomas, port Steam/Electron, mobile.
