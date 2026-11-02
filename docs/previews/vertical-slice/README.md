# Vertical slice — capturas reais

Capturas do Chromium executando a mesma build do jogo (1440×900), não concept art.
Reprodução: `python3 tools/qa/vertical-slice.py` a partir da raiz, com Playwright e Chromium.
O script inicia um servidor e SQLite temporários e encerra ambos ao terminar.

| Cena | Captura |
| --- | --- |
| Vila de Eclipse | [Vila](01-vila.png) |
| Floresta Amaldiçoada | [Floresta](02-floresta.png) |
| Combate e skill | [Combate](03-combate.png) |
| Inventário aberto e comparação | [Inventário](04-inventario.png) |
| Equipamento visível no mundo | [Equipamento](05-equipamento-visual.png) |
| Missão recebida e objetivo concluído | [Quest](06-quest.png) |
| Minimap real do HUD | [Minimapa](07-minimapa.png) |
| Mapa ampliado | [Mapa](08-mapa.png) |

Resultados: [validation.json](validation.json). Verifica teclado em oito direções,
corrida e stamina, colisões de casa/árvore/parede/água/pedra/cerca, diálogo,
aceitar/completar/recompensar missão, compra e ouro, inventário 40 slots,
drag-to-equip, comparação, remover/recolocar armadura com appearance real,
stack/split, portais nos dois sentidos, luta e coleta dos três monstros,
ativação de áudio e relogin com nível/ouro/equipamento preservados.

A fixture é o Caçador DEV. Comandos administrativos só posicionam o personagem,
ajustam seu nível inicial e oferecem encontros reproduzíveis. Dano, recompensas,
compras, quests, loot e equipamento seguem o pipeline normal do servidor.
Não são pagamentos reais nem validação humana manual. O áudio ambiente é
sintetizado e opcional; não há trilha gravada final.
