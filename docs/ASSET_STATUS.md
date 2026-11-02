# ASSET STATUS — ECLIPSE · Blood & Moon

## Regra vigente

Geração de artes suspensa. Nenhum PNG novo nesta etapa. Não executar exportadores de arte nem ampliar bestiário, equipamentos ou mapas. Foco: **Vila de Eclipse + Floresta Amaldiçoada**, **Caçador**, **Lobo Sombrio / Morcego Sangrento / Esqueleto**.

“Criado” significa arquivo existente e identificado; “integrado” significa ligado ao renderer/sistema. O status distingue validação nesta etapa de integração apenas identificada no código. Atlas salvo não equivale a gameplay concluído.

## Recuperação da base

O commit `8330419200fe3f55c333370065504ac1d14e6e20` de newblood recebeu somente arquivos da raiz: faltavam 576 dos 592 caminhos do inventário `ARQUIVOS-SHA256.json`. Foram recuperados **576/576** da origem indicada no próprio README, commit `60f5a6e4f27e414bc9baf4b29f26b852037b82c8` de `bloodmoon`, branch `visual/eclipse-redesign`. **Todos os 576 SHA-256 coincidiram antes das alterações desta etapa**. Os arquivos recuperados foram restaurados neste checkout para publicação junto da vertical slice no repositório newblood.

## Personagens e animações

Renderer ativo: `mmo/sprites.js` → `mmo/eclipse-sprites.js`. Cada ação abaixo tem oito direções e oito quadros. A auditoria lê pixels e bounds: 9.024 quadros de corpos e 10.560 de equipamentos; zero recortes detectados, zero linhas de poses repetidas detectadas. Isso não é aprovação artística humana.

| ASSET | CRIADO | INTEGRADO | USADO ONDE | STATUS |
| --- | --- | --- | --- | --- |
| hunter · idle | Sim | Sim, renderer | Caçador / NPCs | Integrado na slice; atlas auditado |
| hunter · walk | Sim | Sim, renderer | Caçador / NPCs | Integrado na slice; atlas auditado |
| hunter · run | Sim | Sim, renderer | Caçador / NPCs | Integrado na slice; atlas auditado |
| hunter · jump | Sim | Sim, renderer | Caçador / NPCs | Preservado; expansão PARADA |
| hunter · attack | Sim | Sim, renderer | Caçador / NPCs | Integrado na slice; atlas auditado |
| hunter · shoot | Sim | Sim, renderer | Caçador / NPCs | Integrado na slice; atlas auditado |
| hunter · hit | Sim | Sim, renderer | Caçador / NPCs | Integrado na slice; atlas auditado |
| hunter · death | Sim | Sim, renderer | Caçador / NPCs | Integrado na slice; atlas auditado |
| hunter · cast | Sim | Sim, renderer | Caçador / NPCs | Integrado na slice; atlas auditado |
| hunter · transform | Sim | Sim, renderer | Caçador / NPCs | Preservado; expansão PARADA |
| hunter · special | Sim | Sim, renderer | Caçador / NPCs | Preservado; expansão PARADA |
| vampire-human · idle | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-human · walk | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-human · run | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-human · jump | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-human · attack | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-human · shoot | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-human · hit | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-human · death | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-human · cast | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-human · transform | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-human · special | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-form · idle | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-form · walk | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-form · run | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-form · jump | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-form · attack | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-form · shoot | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-form · hit | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-form · death | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-form · cast | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-form · transform | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| vampire-form · special | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| wolf-human · idle | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| wolf-human · walk | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| wolf-human · run | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| wolf-human · jump | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| wolf-human · attack | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| wolf-human · shoot | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| wolf-human · hit | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| wolf-human · death | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| wolf-human · cast | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| wolf-human · transform | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| wolf-human · special | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| werewolf · idle | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| werewolf · walk | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| werewolf · run | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| werewolf · jump | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| werewolf · attack | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| werewolf · shoot | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| werewolf · hit | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| werewolf · death | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| werewolf · cast | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| werewolf · transform | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |
| werewolf · special | Sim | Sim, renderer | Outras classes / NPCs | Preservado; expansão PARADA |

## Monstros

| ASSET | CRIADO | INTEGRADO | USADO ONDE | STATUS |
| --- | --- | --- | --- | --- |
| rat · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: não | Nenhum spawn ativo identificado | PARADO — fora da slice, sem expansão |
| bat · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: sim | cinzaveu, floresta | Foco da slice; estados idle/walk/attack/hit/death |
| wolf · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: sim | cinzaveu, floresta | Foco da slice; estados idle/walk/attack/hit/death |
| corrupted-wolf · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: não | Nenhum spawn ativo identificado | PARADO — fora da slice, sem expansão |
| spider · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: sim | caverna | PARADO — fora da slice, sem expansão |
| skeleton · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: sim | cripta, floresta | Foco da slice; estados idle/walk/attack/hit/death |
| ghoul · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: sim | caverna, cripta | PARADO — fora da slice, sem expansão |
| cultist · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: sim | cripta, ruinas | PARADO — fora da slice, sem expansão |
| bandit · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: sim | ruinas | PARADO — fora da slice, sem expansão |
| wild-vampire · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: sim | castelo, ruinas | PARADO — fora da slice, sem expansão |
| wild-werewolf · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: sim | castelo | PARADO — fora da slice, sem expansão |
| necromancer · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: sim | cripta | PARADO — fora da slice, sem expansão |
| elite · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: sim | castelo, caverna, cripta, ruinas | PARADO — fora da slice, sem expansão |
| executioner · idle, walk, attack, hit, death, special | Sim | Sim, renderer; spawn: sim | castelo | PARADO — fora da slice, sem expansão |
| goblin · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: não | Nenhum spawn ativo identificado | PARADO — fora da slice, sem expansão |
| antlion · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: sim | caverna | PARADO — fora da slice, sem expansão |
| zombie · idle, walk, attack, hit, death | Sim | Sim, renderer; spawn: não | Nenhum spawn ativo identificado | PARADO — fora da slice, sem expansão |

## Equipamentos visuais

As camadas usam o mesmo frame/direção/pivô do corpo. Anel e cinto têm atributos e slots lógicos, mas não possuem overlays visuais: **não são contabilizados como equipamento visual concluído**.

| ASSET | CRIADO | INTEGRADO | USADO ONDE | STATUS |
| --- | --- | --- | --- | --- |
| couro · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Foco: couro/arco/espada |
| cota · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Preservado; sem expansão |
| placas · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Preservado; sem expansão |
| manto · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Preservado; sem expansão |
| botas · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Preservado; sem expansão |
| calcas · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Preservado; sem expansão |
| luvas · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Preservado; sem expansão |
| espada · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Foco: couro/arco/espada |
| arco · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Foco: couro/arco/espada |
| besta · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Preservado; sem expansão |
| cetro · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Preservado; sem expansão |
| garra · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Preservado; sem expansão |
| capuz · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Preservado; sem expansão |
| amuleto · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Preservado; sem expansão |
| escudo · 11 ações | Sim | Sim, appearance/equipment | Player e inventário | Preservado; sem expansão |
| Anel/cinto: overlay visual | Não | Não | Slots lógicos apenas | NÃO INTEGRADO visualmente |

## Tiles e cenografia

| ASSET | CRIADO | INTEGRADO | USADO ONDE | STATUS |
| --- | --- | --- | --- | --- |
| tile-castle.svg | Sim | Sim, terrain.js | Regiões anteriores fora da slice | PARADO |
| tile-cave.svg | Sim | Sim, terrain.js | Regiões anteriores fora da slice | PARADO |
| tile-cemetery.svg | Sim | Sim, terrain.js | Regiões anteriores fora da slice | PARADO |
| tile-cursed.svg | Sim | Sim, terrain.js | Vila/Floresta | Integrado na slice |
| tile-dirt.svg | Sim | Sim, terrain.js | Vila/Floresta | Integrado na slice |
| tile-forest.svg | Sim | Sim, terrain.js | Vila/Floresta | Integrado na slice |
| tile-grass.svg | Sim | Sim, terrain.js | Vila/Floresta | Integrado na slice |
| tile-road.svg | Sim | Sim, terrain.js | Vila/Floresta | Integrado na slice |
| tile-ruins.svg | Sim | Sim, terrain.js | Regiões anteriores fora da slice | PARADO |
| tile-village.svg | Sim | Sim, terrain.js | Vila/Floresta | Integrado na slice |
| tile-water.svg | Sim | Sim, terrain.js | Vila/Floresta | Integrado na slice |
| tile-wood.svg | Sim | Sim, terrain.js | Vila/Floresta | Integrado na slice |
| Cenário: house | Sim | Sim | cinzaveu | Integrado na slice |
| Cenário: temple | Sim | Sim | cinzaveu | Integrado na slice |
| Cenário: tower | Sim | Sim | castelo | PARADO — fora da slice/sem uso comprovado |
| Cenário: castle-gate | Sim | Sim | castelo | PARADO — fora da slice/sem uso comprovado |
| Cenário: wall | Sim | Sim | cinzaveu, floresta | Integrado na slice |
| Cenário: fence | Sim | Sim | cinzaveu, cripta | Integrado na slice |
| Cenário: lamp | Sim | Sim | cinzaveu, floresta | Integrado na slice |
| Cenário: fountain | Sim | Sim | cinzaveu | Integrado na slice |
| Cenário: stall | Sim | Sim | cinzaveu | Integrado na slice |
| Cenário: forge | Sim | Sim | cinzaveu | Integrado na slice |
| Cenário: oak | Sim | Sim | cinzaveu, floresta | Integrado na slice |
| Cenário: pine | Sim | Sim | cinzaveu, floresta | Integrado na slice |
| Cenário: dead-tree | Sim | Sim | cripta | PARADO — fora da slice/sem uso comprovado |
| Cenário: bush | Sim | Sim | floresta | Integrado na slice |
| Cenário: roots | Sim | Sim | floresta | Integrado na slice |
| Cenário: boulder | Sim | Sim | caverna, floresta, ruinas | Integrado na slice |
| Cenário: bridge | Sim | Sim | floresta | Integrado na slice |
| Cenário: grave | Sim | Sim | cripta | PARADO — fora da slice/sem uso comprovado |
| Cenário: cross | Sim | Sim | cripta | PARADO — fora da slice/sem uso comprovado |
| Cenário: mausoleum | Sim | Sim | cripta | PARADO — fora da slice/sem uso comprovado |
| Cenário: candles | Sim | Sim | castelo, cripta | PARADO — fora da slice/sem uso comprovado |
| Cenário: crystal | Sim | Sim | caverna | PARADO — fora da slice/sem uso comprovado |
| Cenário: bones | Sim | Sim | caverna, cripta, floresta | Integrado na slice |
| Cenário: pillar | Sim | Sim | castelo | PARADO — fora da slice/sem uso comprovado |
| Cenário: stairs | Sim | Sim | castelo, caverna | PARADO — fora da slice/sem uso comprovado |
| Cenário: stained-glass | Sim | Sim | castelo | PARADO — fora da slice/sem uso comprovado |
| Cenário: bars | Sim | Sim | castelo | PARADO — fora da slice/sem uso comprovado |
| Cenário: ruined-arch | Sim | Sim | floresta, ruinas | Integrado na slice |
| Cenário: column | Sim | Sim | ruinas | PARADO — fora da slice/sem uso comprovado |
| Cenário: statue | Sim | Sim | ruinas | PARADO — fora da slice/sem uso comprovado |
| Cenário: altar | Sim | Sim | castelo, caverna, floresta, ruinas | Integrado na slice |
| Cenário: moss | Sim | Sim | ruinas | PARADO — fora da slice/sem uso comprovado |

## Mapas, HUD, ícones, efeitos e áudio

| ASSET | CRIADO | INTEGRADO | USADO ONDE | STATUS |
| --- | --- | --- | --- | --- |
| Mapa: cripta | Sim | Sim, Tiled/servidor/renderer | cripta | PARADO — preservado sem expansão |
| Mapa: ruinas | Sim | Sim, Tiled/servidor/renderer | ruinas | PARADO — preservado sem expansão |
| Mapa: castelo | Sim | Sim, Tiled/servidor/renderer | castelo | PARADO — preservado sem expansão |
| Mapa: cinzaveu | Sim | Sim, Tiled/servidor/renderer | cinzaveu | FOCO — colisão/portais/NPCs/spawns |
| Mapa: floresta | Sim | Sim, Tiled/servidor/renderer | floresta | FOCO — colisão/portais/NPCs/spawns |
| Mapa: caverna | Sim | Sim, Tiled/servidor/renderer | caverna | PARADO — preservado sem expansão |
| HUD HP/Mana/Stamina/XP/Nível/Portrait/Target/Hotbar/Chat | Sim | Sim | index.html + client.js | Dados reais de snapshots e ações |
| Minimapa | Sim | Sim | game-ui.js / HUD | Posição, NPCs, portais e landmarks reais |
| Mapa ampliado | Sim | Sim | Painel M, regionMap | Adicionado à janela existente, sem novo HUD |
| Quest Tracker | Sim | Sim | HUD / quests.js | Missão ativa e progresso do servidor |
| Inventário | Sim | Sim | inventory-ui.js | Drag/drop, equip/unequip, stacks, tooltip e comparação |
| Login/seleção | Sim | Sim | auth-ui.js + login-castle.png | UI integrada; nenhuma nova arte |
| Ícones de itens | Sim | Sim | assets/ui/item-icons.svg | Inventário e equipamento |
| Ícones de skills | Sim | Sim | assets/skills/icons.svg | Hotbar / grimório |
| Efeitos de skills: caçador/vampiro/lobisomem | Sim | Sim | assets/skills/*-effects.png + skill-effects.js | Caçador no foco; demais preservados |
| Dano / crítico / level-up / morte | Sim | Sim | skill-effects.js | Eventos reais do servidor; desenho Canvas |
| Sons de ataque/hit/morte/loot/level/UI | Sim | Sim | audio.js + assets/audio/manifest.json | Síntese Web Audio; não há gravações finais |
| Ambiente Vila / Floresta | Sim | Sim | audio.js | Ambiente tonal sintetizado por região, opt-in SOM ON; sem novos arquivos de áudio |
| Trilha musical gravada final | Não | Não | nenhum arquivo identificado | NÃO CRIADA / NÃO INTEGRADA |

## Históricos e material sem uso

- Metadados e licenças Flare estão preservados; os PNGs históricos Flare/transformações não constam do pacote recuperado. **NÃO INTEGRADOS nesta build ativa**; o renderer atual usa assets/eclipse.
- `assets/terrain` e `assets/monsters` preservam atribuição/metadados históricos; não contar como novos cenários ou criaturas em uso.
- Existir em `/art` ou `/sprites` não valida uso no mundo. Esses laboratórios não substituem as capturas de gameplay.

## Validação desta etapa

- `npm ci`: instalação concluída com lockfile existente.
- Baseline recuperada: 110 testes passaram. Após as mudanças: **114 testes passaram**; sintaxe/TypeScript e build passaram.
- Auditoria dos atlas existentes: 9.024 quadros de corpos, 10.560 de equipamento; sem problemas de bounds ou repetição de poses por linha detectados.
- Nova cobertura: encontros restritos, rotas Vila/Floresta, tentativa de atravessar todas as bordas sólidas/quinas dos dois mapas, IA dos três monstros e sólidos de cerca/pedra.
- Defeitos encontrados no navegador: cercas da Vila atravessáveis e copas ocultando o Caçador. Corrigida a camada collision das cercas; cenografia próxima fica translúcida quando cobre o jogador.
- QA reproduzível: `python3 tools/qa/vertical-slice.py` com Playwright e Chromium. O script inicia servidor/banco temporários e usa fixture DEV para posição/reset/spawn; combate, recompensas, compras, loot e equipamento usam ações normais.
- QA Chromium aprovado: 20 verificações, zero erros JavaScript e zero requests de assets ausentes. Resultados de navegador e capturas atuais: `docs/previews/vertical-slice/validation.json` e PNGs no mesmo diretório. Só considerar essas verificações aprovadas quando o JSON da execução atual existir.
- Testes por teclado são automatizados no Chromium; não alegam uma sessão manual realizada por uma pessoa.

## Limites

Não há aprovação artística final, trilha gravada final ou certificação de produção/carga. A etapa congela expansão e comprova integração do material existente; quantidade de atlas não é medida de progresso. Nunca confundir teste DEV com credenciais/pagamentos reais.
