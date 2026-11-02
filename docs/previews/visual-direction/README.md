# Direção visual — screenshots reais da build

Todas as imagens desta pasta foram capturadas no Chromium executando o jogo real.
Não são concept art ou renders apresentados como gameplay. Os relatórios JSON
registram a validação correspondente e eventuais erros.

| Conteúdo | Captura |
| --- | --- |
| Caçador — frente | [Abrir](01-hunter-front.png) |
| Caçador — costas | [Abrir](02-hunter-back.png) |
| Caçador — corrida | [Abrir](03-hunter-run.png) |
| Inventário, capa e equipamento | [Abrir](04-hunter-equipment.png) |
| Segundo golpe em combate | [Abrir](05-hunter-attack2.png) |
| Vampiro humano | [Abrir](vampire-human.png) |
| Transformação vampírica | [Abrir](vampire-transforming.png) |
| Vampiro transformado | [Abrir](vampire-form.png) |
| Lobisomem humano | [Abrir](wolf-human.png) |
| Transformação lupina | [Abrir](wolf-transforming.png) |
| Lobisomem transformado | [Abrir](wolf-form.png) |
| Fantasma | [Abrir](ghost-encounter.png) |
| Bruxa | [Abrir](witch-encounter.png) |
| Troll | [Abrir](troll-encounter.png) |
| Minotauro | [Abrir](minotaur-encounter.png) |
| Ghoul | [Abrir](ghoul-encounter.png) |
| Banco / armazém | [Abrir](village-bank.png) |
| Conta comum no bundle de produção | [Abrir](production-new-hunter.png) |
| Inventário móvel | [Abrir](mobile-inventory.png) |

A jornada completa com Vila, Floresta, combate, inventário, quest, minimapa e mapa
está em [vertical-slice](../vertical-slice/README.md).

Reprodução, a partir da raiz:

```sh
python3 tools/qa/character-direction.py
python3 tools/qa/creature-direction.py --species ghost
python3 tools/qa/creature-direction.py --species witch
python3 tools/qa/creature-direction.py --species troll
python3 tools/qa/creature-direction.py --species minotaur
python3 tools/qa/creature-direction.py --species ghoul
python3 tools/qa/village-services.py
python3 tools/qa/production-smoke.py
python3 tools/qa/vertical-slice.py
```

Requer Playwright e Chromium. Cada script usa servidor/SQLite temporários, sem
alterar o save normal. A fixture DEV prepara posição/nível/encontros; os comandos de
combate, loja, inventário, banco, quest e loot usam o servidor autoritativo normal.
O teste de personagens inclui uma segunda conta comum para verificar a aparência
pública sem exposição do inventário. O de serviços reinicia o SQLite e valida a
custódia e identidade dos itens. Nenhum pagamento real foi realizado.

Essas evidências não equivalem a aprovação artística humana ou teste de carga.
