# PRISMORA — Estudo Estratégico (Primeira Entrega)

> **Leitura obrigatória antes de qualquer número:** a meta de 1 milhão de cópias é **aspiracional**, não previsão. Jogos independentes que chegam lá são uma cauda extremamente fina da distribuição; a regra é vender pouco. Este documento separa **[V] verificado nesta sessão** (com fonte), **[C] conhecimento prévio, não reverificado agora** e **[E] estimativa/premissa minha**. Nada aqui garante resultado.

---

## A. Mercado mundial de games em 2026

**[V] Steam está em alta de receita, e indies pesam.** Alinea Analytics aponta que indie e "triple-I" responderam por mais de 25% da receita da Steam em 2025, e que a Steam teve a maior receita de sua história no 1º semestre de 2026 ([Alinea 2025](https://gamedevreports.substack.com/p/alinea-analytics-2025-year-in-review), [Alinea H1'26](https://gamedevreports.substack.com/p/alinea-analytics-steam-reached-highest) — este último é conteúdo patrocinado; metodologia não clara).

**[V] Preço baixo + boca a boca vencem gráficos.** Um jogo a US$ 6 foi o mais vendido em cópias no 1º semestre de 2026 (mesma fonte H1'26). Nas listas semanais, títulos mais baratos disputam o topo com superproduções ([SteamData](https://steamdata.ai/en-US/blog/steam-weekly-pulse-may-08-15)).

**[V] Demanda por gêneros.** Em Next Fest de junho/2026 dominaram *action RPG* e *indie horror* ([análise](https://tech-insider.org/steam-next-fest-june-2026/)); "job sims" estranhos viraram nicho estabelecido (análise GEM Capital citada em [80.lv](https://80.lv/articles/steam-wishlists-by-the-numbers-what-actually-gets-wishlisted)).

**[V] Lista de desejos é o motor de lançamento, mas a conversão é incerta.** Fontes divergem (mediana ~27% no primeiro mês em [DEV Community](https://dev.to/linou518/steams-algorithm-isnt-magic-a-complete-breakdown-for-indie-games-in-2026-4hh4); ~40% em conteúdo patrocinado; Alinea diz que está *caindo*). Benchmarks de [How To Market A Game](https://howtomarketagame.com/2026/06/25/archive-how-many-wishlists-should-i-have-when-i-launch-my-game/) e [Presskit](https://presskit.gg/field-guides/how-many-wishlists-to-launch): ~7k wishlists para entrar em "Popular Upcoming"; ~30–50k para um lançamento "ouro"; ~100k+ para destaque de front-page (valores aproximados, fontes se autodeclaram desatualizáveis).

**[V] Caso-âncora: Balatro.** Dev praticamente solo; 250 mil cópias em 3 dias, 500 mil em 10 dias, 1 milhão em ~1 mês, 3,5 milhões em dez/2024, 5 milhões depois ([GameSpark](https://www.gamespark.jp/article/2024/03/18/139517.html), [80.lv](https://80.lv/articles/balatro-has-sold-3-5-million-copies/), [FullCleared](https://fullcleared.com/news/over-5m-people-have-now-enjoyed-balatro/)). Preço ~US$ 14,99 (não oficial).

**[C] Outros fenômenos citados na missão** (Minecraft, Vampire Survivors, Stardew Valley, Among Us, Terraria, Hades, Slay the Spire, Lethal Company): não pesquisei números novos nesta sessão. O padrão que extraio do conhecimento geral: **loop central compreensível em 10 segundos, run curta, ciclo "só mais uma", conteúdo que se compartilha sozinho (clipes), preço baixo, equipe pequena, atualizações pós-lançamento.**

**Custos de entrada na Steam [V]:** taxa de US$ 100 por jogo (reembolsável após US$ 1.000 em vendas) e split 70/30, caindo para 75/25 acima de US$ 10 mi e 80/20 acima de US$ 50 mi de receita do título ([Neowin](https://www.neowin.net/news/valve-introduces-new-revenue-share-tiers-for-steam-promising-bigger-cuts-for-studios/), [Bit-tech](https://www.bit-tech.net/news/gaming/pc/valve-steam-direct-fee/1)). Fontes de 2018; não encontrei mudança posterior.

## B. Oportunidades comerciais

1. **"Pontuação encadeada + build de run" (herança do Balatro)**: a mecânica *"construa um motor que explode números"* tem público comprovado ([V] Balatro) e o gênero ainda tem poucos títulos fora de cartas/dados. A lacuna: **quase todos os imitadores usam cartas/dados/poker**. Espaço aberto: outras *fantasias de motor* com identidade própria.
2. **Puzzle espacial com rejogabilidade roguelite.** Puzzles clássicos são "resolvidos uma vez". Roguelites de puzzle são raros. **Não encontrei nenhum título lançado combinando feixes de luz/espelhos com pontuação multiplicativa e relíquias** ([busca](https://store.steampowered.com/app/5381870): o mais próximo, *Lumenkeep*, é tower defense, previsto para 03/2027; *Umbra Lumen* é deckbuilder+puzzle, sem detalhes confirmados). **Ressalva:** busca limitada, sem cobertura de mobile/itch; pode existir algo que não vi.
3. **Preço baixo + sessão curta (10–20 min/run)**: encaixa com o comportamento de descoberta por clipes e com Steam Deck.
4. **Conteúdo gerado pelo próprio jogo** (seed diária, "grandes números", resultado compartilhável em emoji).

**Reclamações recorrentes dos jogadores [C]:** progressão inflada com grind, monetização agressiva, jogos *live service* desnecessários, tutoriais longos, sessões que não respeitam o tempo. → Prismora: compra única, sem loja interna, run de ~15 min, tutorial de 1 rodada.

## C. Os 10 conceitos

| # | Conceito | Ideia em uma linha |
|---|---|---|
| 1 | **PRISMORA** | Roguelite de puzzle: espelhos, prismas, lentes e filtros dobram a luz para acender cristais; relíquias quebram as regras e fazem os números explodir. |
| 2 | Tidebound Tavern | Gerenciar um bar de maré em ilha, automatizando receitas com criaturas marinhas. |
| 3 | Pocket Kingdoms | Auto-battler minúsculo com reinos em hexágonos e partidas de 8 min. |
| 4 | Heist Loop | Assalto em loop temporal de 3 minutos; cada loop deixa o "eu" anterior ajudar. |
| 5 | Fungal Frontier | Ecossistema de fungos que colonizam um mapa, roguelite de expansão. |
| 6 | Cargo Cult | Co-op para 4: dirigir um caminhão de carga absurda em estradas instáveis (física + caos). |
| 7 | Span Rogue | Roguelite de pontes/estruturas com simulação de esforços (liga com sua marca de engenharia). |
| 8 | Deepwatch | Horror co-op de trabalho em plataforma submarina. |
| 9 | Lexicon Forge | Roguelite de formação de palavras com multiplicadores. |
| 10 | Gravity Garden | Sandbox de física zen para jardinagem em gravidade variável. |

## D. Matriz comparativa (notas 0–10)

> **Atenção:** as notas são **julgamento meu**, não dado de mercado. Em "Facilidade dev", "Baixo custo" e "Pouca concorrência", 10 = melhor (mais fácil/barato/menos concorrido). Calculada por `tests/matrix.mjs`.

| Conceito | Originalidade | Potencial comercial | Público | Clareza | Viralização | Rejogabilidade | Facilidade dev | Baixo custo | Pouca concorrência | Monetização | Expansão | **Nota ponderada** |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 1. PRISMORA — roguelite de puzzle de luz | 8 | 7 | 7 | 9 | 8 | 9 | 8 | 9 | 7 | 7 | 8 | **7.91** |
| 2. Tidebound Tavern — bar cozy com automação | 6 | 6 | 7 | 8 | 6 | 6 | 6 | 6 | 6 | 7 | 7 | **6.39** |
| 3. Pocket Kingdoms — auto-battler de bolso | 5 | 6 | 7 | 7 | 6 | 8 | 6 | 6 | 3 | 6 | 8 | **6.17** |
| 4. Heist Loop — roubo em loop temporal | 8 | 6 | 6 | 6 | 7 | 6 | 4 | 4 | 7 | 5 | 6 | **5.91** |
| 5. Fungal Frontier — ecossistema roguelite | 7 | 5 | 6 | 5 | 5 | 7 | 5 | 5 | 6 | 6 | 7 | **5.75** |
| 6. Cargo Cult — co-op de física/caos (4 jog.) | 7 | 8 | 8 | 9 | 10 | 7 | 3 | 3 | 5 | 6 | 6 | **6.63** |
| 7. Span Rogue — pontes/estruturas roguelite | 6 | 5 | 6 | 7 | 6 | 7 | 5 | 6 | 3 | 5 | 6 | **5.63** |
| 8. Deepwatch — horror co-op de trabalho | 6 | 7 | 7 | 8 | 9 | 6 | 3 | 3 | 2 | 6 | 6 | **5.79** |
| 9. Lexicon Forge — roguelite de palavras | 5 | 6 | 8 | 9 | 6 | 8 | 8 | 9 | 5 | 6 | 6 | **6.92** |
| 10. Gravity Garden — sandbox de física | 7 | 4 | 5 | 6 | 6 | 5 | 6 | 6 | 6 | 4 | 5 | **5.44** |

Pesos: Originalidade ×1, Potencial comercial ×1.5, Público ×1, Clareza ×1, Viralização ×1.2, Rejogabilidade ×1.2, Facilidade dev ×1.2, Baixo custo ×1, Pouca concorrência ×1, Monetização ×0.8, Expansão ×0.8
Ranking: 1. PRISMORA (7.91) > 9. Lexicon Forge (6.92) > 6. Cargo Cult (6.63) > 2. Tidebound Tavern (6.39)

## E. Os três melhores e por quê

1. **PRISMORA (7,91)** — Única com *combinação alta* de clareza, rejogabilidade e viabilidade para equipe mínima. Risco: originalidade depende de execução e de "sentir" bem.
2. **Lexicon Forge (6,92)** — Público enorme, dev fácil. Risco fatal: *concorrência de apps de palavras* e baixa singularidade; a atenção de streamers é pequena.
3. **Cargo Cult (6,63)** — Maior teto viral (co-op caótico rende clipes), porém **dev caro e arriscado** (rede, física estável, servidores/matchmaking) e jogos de co-op dependem de massa crítica para amigos jogarem. Seria o conceito "alto risco / alto teto". **Recomendo como segundo projeto, após Prismora financiar o estúdio.**

*(Span Rogue ficou fora: ótima sinergia com sua construtora, mas mercado de "bridge builders" é maduro e a nota comercial é baixa. Vale como **peça de branding** para a empresa, não como aposta de 1 milhão.)*

## F. Vencedor: PRISMORA

- **Nome provisório:** PRISMORA. Busca preliminar por "Prismora" não retornou jogo/marca idêntica, apenas nomes parecidos (ex.: "Prism" na App Store e marcas "PRISM" em classes de jogos de cartas). **Isto não é clearance:** antes de gastar com arte/marca, fazer busca formal no INPI (Brasil), USPTO/EUIPO e nas lojas.
- **Identidade:** cristais facetados neon sobre tabuleiro escuro; luz como "personagem"; títulos em espectro arco-íris; sons de sino/pentatônica (sempre harmônico).
- **Proposta de valor (1 frase):** *"Dobre a luz, acenda tudo — e quebre as regras até os números ficarem absurdos."*

## G. Experiência de jogo

Run de 8 rodadas (≈ 15–20 min) + modo Infinito. Em cada rodada: tabuleiro 7×7 com emissores, cristais e paredes; você recebe 5 peças do seu baralho. Você vê **em tempo real** a prévia do feixe e da pontuação enquanto posiciona. Aperta DISPARAR: o feixe percorre o caminho, cristais acendem em notas musicais ascendentes, números sobem. Passou a meta → draft de relíquia/peça; falhou → perde 1 de 3 "fissuras". Ao fim, resultado compartilhável. **Seed diária** igual para todos.

## H. Mecânica principal e diferenciais

- **Núcleo:** posicionar peças que alteram um feixe: *Espelho* (desvia 90°), *Prisma* (divide em dois), *Lente* (poder ×2), *Filtro* (colore; cristal de cor igual ×3). Pontos = Σ valor × poder × bônus de cor. Acender **todos** os cristais ×1,5.
- **Fácil de aprender:** a prévia ao vivo ensina por tentativa. **Difícil de dominar:** prisma + lente + filtro em cadeia gera crescimento exponencial; os melhores arranjos exigem raciocínio espacial.
- **Meta-sistema:** 10 relíquias que reescrevem regras; draft entre peças e relíquias; estrelas por rodada (meta / "Par" do solver / 125% do Par).
- **Diferenciais:** (1) fantasia de motor aplicada a **puzzle espacial**, não cartas; (2) **prévia ao vivo** = pensamento, não sorte; (3) validação por solver: nenhuma fase é impossível, e o "Par" é um parâmetro honesto de maestria; (4) 100% *determinístico por seed* → desafio diário, replays, compartilhamento.
- **Anti-manipulação:** sem loja, sem energia, sem loot box, sem FOMO artificial. "Só mais uma" vem de maestria e builds.

## I. Público e plataformas

- **Público primário:** fãs de roguelite/deckbuilder e puzzle (18–40), público de Balatro/Slay the Spire/Tetris-likes, Steam Deck.
- **Secundário:** jogadores casuais de mobile (porte posterior).
- **Plataforma inicial recomendada: Steam (PC, Windows/Linux/macOS + Steam Deck).** Motivos: (a) onde roguelites premium vendem ([V] indies >25% da receita da Steam); (b) wishlists e Next Fest como alavanca de descoberta; (c) compra única é natural; (d) demo gratuita é padrão. **Web (itch.io/navegador)** como *funil gratuito* de validação (o protótipo atual já roda no navegador). **Mobile (iOS/Android)** em 2ª fase: toque já funciona, mas CPI e descoberta na App Store/Play são caros e o modelo premium é mais difícil.
- **Tecnologia:** o protótipo está em **JavaScript puro + Canvas 2D + WebAudio**, sem dependências. Para Steam: empacotar com **Electron** ou **Tauri** (rápido, mesma base) ou portar para **Godot 4** se surgir necessidade de console/performance. Unity/Unreal seriam exagero (custo, tamanho, licenciamento) para um jogo 2D de grade.

## J. Monetização

| Modelo | Conversão/receita | Risco | Veredito |
|---|---|---|---|
| **Compra única (US$ 12,99; regionalizado)** | previsível | exige visibilidade inicial | **ESCOLHIDO** |
| Free-to-play + compras | alto volume, baixa conversão | percepção de manipulação; precisa servidor/economia | Rejeitado (contraria o princípio de respeitar o jogador) |
| DLC / expansões (pacotes de relíquias, tabuleiros) | receita longa cauda | só se o base vender | **Fase 2** (US$ 4,99–6,99) |
| Assinatura | — | não se justifica | Rejeitado |
| Licenciamento / portes (Switch, mobile) | receita adicional | custo de porte | Fase 3 |

**Demo gratuita** (rodadas 1–3) + **Next Fest** como principal funil de conversão.

## K. Investimento e prazo

[E] Equipe mínima: 1 dev/designer (você + eu como par de desenvolvimento) + freelancers pontuais (arte 2D/UI, áudio, QA, localização).

| Item | US$ |
|---|---:|
| Desenvolvimento (12 meses, custo de oportunidade/equipe) | 70.000 |
| Jurídico, contas, ferramentas, localização, certificações | 12.000 |
| Marketing (pré-lançamento + lançamento; cresce com o sucesso) | 15.000–250.000 |
| Suporte pós-lançamento (4–10% do dev) | 2.800–7.000 |

**Prazo [E]:** protótipo jogável (feito); *vertical slice* polido 2–3 meses; Steam page + trailer no mês 3–4; demo no Next Fest mês 7–9; lançamento 1.0 entre mês 10–12.

## L. Projeção financeira

Premissas [E]: preço de lista US$ 12,99; preço médio realizado = 62% / 72% / 82% da lista (descontos e preço regional); 6% reembolso; Valve 30% (US$ 10 mi de receita só é superado no extremo otimista de 1 mi, onde 25% sobre o excedente muda ~US$ 3 mil, irrelevante); imposto efetivo 15% **(a validar com contador — a tributação de royalties do exterior no Brasil exige análise específica)**. Faturamento ≠ lucro: tabela mostra o **resultado líquido** após todos os custos.

Preço de lista: US$12.99 | reembolso 6% | imposto efetivo 15% | Valve 30%

| Cenário | Cópias | Receita bruta | Taxa Steam | Impostos | Custos totais | **Resultado líquido** |
|---|---:|---:|---:|---:|---:|---:|
| Conservador | 10,000 | $75,706 | $22,712 | $7,949 | $99,800 | **$-54,755** |
| Conservador | 50,000 | $378,529 | $113,559 | $39,746 | $114,800 | **$110,425** |
| Conservador | 100,000 | $757,057 | $227,117 | $79,491 | $139,000 | **$311,449** |
| Conservador | 500,000 | $3,785,286 | $1,135,586 | $397,455 | $239,000 | **$2,013,245** |
| Conservador | 1,000,000 | $7,570,572 | $2,271,172 | $794,910 | $339,000 | **$4,165,490** |
| Intermediário | 10,000 | $87,916 | $26,375 | $9,231 | $99,800 | **$-47,490** |
| Intermediário | 50,000 | $439,582 | $131,874 | $46,156 | $114,800 | **$146,751** |
| Intermediário | 100,000 | $879,163 | $263,749 | $92,312 | $139,000 | **$384,102** |
| Intermediário | 500,000 | $4,395,816 | $1,318,745 | $461,561 | $239,000 | **$2,376,511** |
| Intermediário | 1,000,000 | $8,791,632 | $2,637,490 | $923,121 | $339,000 | **$4,892,021** |
| Otimista | 10,000 | $100,127 | $30,038 | $10,513 | $99,800 | **$-40,224** |
| Otimista | 50,000 | $500,635 | $150,190 | $52,567 | $114,800 | **$183,078** |
| Otimista | 100,000 | $1,001,269 | $300,381 | $105,133 | $139,000 | **$456,755** |
| Otimista | 500,000 | $5,006,346 | $1,501,904 | $525,666 | $239,000 | **$2,739,776** |
| Otimista | 1,000,000 | $10,012,692 | $3,003,808 | $1,051,333 | $339,000 | **$5,618,552** |

Ponto de equilíbrio (custo ~US$100k): Conservador: 22,156 cópias | Intermediário: 19,078 cópias | Otimista: 16,752 cópias

**Leitura honesta:** o ponto de equilíbrio (~17–22 mil cópias) é *alcançável* com wishlists na faixa de 30–50 mil [V benchmarks acima]. O cenário "1 milhão" exige acontecer um evento viral e boca a boca fora do controle. **Plano de negócios sensato: otimizar para atingir 20–50 mil cópias com custo contido, tratar o 1 milhão como opcionalidade.**

## M. Estratégia de lançamento internacional

- **Fase 0 (agora–mês 2):** página Steam com *capsule* forte e GIFs de feixes; meta: 7k wishlists antes do Next Fest [V benchmark]. Build web gratuita na itch.io para feedback e métricas reais de retenção.
- **Fase 1 (mês 3–6):** conteúdo curto diário — TikTok/Shorts/Reels com *"olha esse arranjo"* (satisfação visual: feixes + notas musicais = ASMR). Reddit (r/roguelites, r/puzzlegames, r/IndieGaming), Discord próprio com **seed diária e ranking**. Contato com 100–200 criadores pequenos/médios de roguelite e puzzle (chave grátis, sem exigir conteúdo).
- **Fase 2 (mês 7–9):** demo no **Next Fest**; metas: 10k seguidores da página; ~25% de conversão demo→wishlist [E].
- **Fase 3 (lançamento):** 7 dias de *launch discount* modesto (10–15%); evento de "Seed da Semana"; atualizações semanais pequenas.
- **Mercados:** EUA/Reino Unido (maior receita, inglês), Alemanha/França/Polônia (puzzle forte), Brasil (comunidade, localização PT-BR nativa, preço regional), Japão/Coreia/China (localização + preços; *puzzle* tem forte tradição). O jogo já tem **PT-BR/EN**; adicionar ES, DE, FR, JA, ZH-CN, KO antes do 1.0 (texto curto, custo baixo).
- **Conteúdo auto-gerado compartilhável:** resultado em emojis (🟦🟨🟪) estilo *daily*, *replay GIF* automático dos disparos, "maior pontuação da seed do dia".

## N. Plano de desenvolvimento até a publicação

| Marco | Entrega | Critério de saída |
|---|---|---|
| M0 ✅ | Protótipo jogável (este repositório) | Núcleo + progressão + tutorial + PT/EN + save + áudio + testes |
| M1 | *Vertical slice*: arte final, 30+ relíquias, 4 "biomas" de regras, 3 chefes | Playtest com 30 pessoas: ≥60% terminam a rodada 3 |
| M2 | Steam page + trailer + demo web | 1.000 wishlists nos primeiros 30 dias |
| M3 | Conquistas Steam, nuvem, controle, Steam Deck, ranking de seed diária | Nenhum bug crítico em 500 h de teste |
| M4 | Next Fest | 7–10k wishlists |
| M5 | Lançamento 1.0 | ver metas abaixo |
| M6 | Expansões e portes | conforme receita |

### Recomendação executiva

Construa **Prismora**. É a única das 10 ideias que combina **loop comprovado** (motor de pontuação + runs curtas, [V] Balatro), **espaço competitivo aparentemente aberto** (puzzle de luz roguelite — com a ressalva da busca limitada), **dev viável para uma pessoa** (já provei com um protótipo funcional) e **conteúdo naturalmente visual para vídeos curtos**. O conceito *Cargo Cult* tem teto viral maior, mas custo/risco muito acima do que cabe agora; mantenha-o como segunda aposta. **Condição de continuidade:** se, após o playtest M1, <40% dos jogadores concluírem a rodada 3 ou o tempo médio de sessão for <10 min, **mudar o design antes de investir em marketing**.

---

## Metas e indicadores (seção 12)

| Meta | Gatilho de "vai bem" | Se não acontecer |
|---|---|---|
| Protótipo funcional | ✅ feito | — |
| 100 jogadores | 100 partidas na build web em 2 semanas | revisar onboarding |
| 1.000 jogadores | 1.000 na web/demo | revisar gancho de vídeo |
| 10.000 vendas | ≥7k wishlists no lançamento | adiar lançamento |
| 100.000 vendas | boca a boca: ≥85% de avaliações positivas na Steam, streamers espontâneos | focar em DLC/portes |
| 1 milhão (aspiracional) | evento viral | não planejar caixa em cima disso |

**Indicadores de qualidade/retenção alvo [E]:** D1 ≥ 35% (web/demo), tempo médio da 1ª sessão ≥ 12 min, ≥ 60% concluem a rodada 3, ≥ 15% completam as 8 rodadas, ≥ 40% iniciam uma 2ª run na mesma sessão, reembolso < 8%, avaliações ≥ 85% positivas.
