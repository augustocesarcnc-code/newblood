# ECLIPSE — Blood & Moon · MVP

MVP jogável sobre os sistemas existentes. O Caçador aprovado é a base humana compartilhada de Caçador, Vampiro e Lobisomem humano: mesma anatomia, oito direções, pivô, escala e caminhada. O Lobisomem transformado usa outra sprite completa.

## Jogar localmente

Use **Node.js 24.19+ da linha 24 LTS**. Extraia o ZIP antes de executar.

- Windows: abra `JOGAR-WINDOWS.bat`.
- Linux/macOS: execute `./jogar.sh` ou `node jogar.mjs`.
- O iniciador instala as dependências, abre o navegador e informa a porta escolhida. Crie uma conta na tela e mantenha o terminal aberto.

Alternativa pelo terminal:

```sh
npm ci
npm start
```

Abra `http://localhost:3000`. Desenvolvimento com Vite: `npm run dev`, em `http://localhost:5173`; esse modo usa banco separado `.data-dev` e habilita a conta administrativa de testes. Não confundir esse fixture com uma conta normal.

## Loop do MVP

Login e seleção de personagem → Vila → Floresta → combate → XP e loot → inventário/equipamento → NPC/quest → Cemitério → Dungeon existente (Caverna das Presas).

Controles: WASD/setas para mover, Shift para deslocamento rápido, clique para selecionar alvo/loot, 1–9 para habilidades disponíveis, E para NPC, I para inventário, J para quests, M para mapa e R para transformação a partir do nível 10 nas classes compatíveis.

Os quatro mapas prioritários usam **oito espécies normais e um encontro de boss**. Ruínas/Castelo e sistemas avançados legados foram preservados, sem expansão nesta etapa. Não houve reescrita de login, servidor, banco, inventário, quests, combate ou multiplayer.

## O que é TEMP / DEV

- Skins humanas de Vampiro e Lobisomem derivam da mesma base; usam paleta/ornamentos simples.
- A roupa pintada ainda está composta no BODY. Slots visuais adicionais são overlays procedurais sincronizados; camadas pintadas independentes ficam para refinamento.
- Idle usa a pose Master; attack/hit/death têm feedback procedural TEMP. Não são novas spritesheets finais desenhadas quadro a quadro. Deslocamento rápido reutiliza a WALK.
- A criatura transformada existente é uma sprite completa independente, marcada como arte DEV; equipamentos humanos são ocultados.
- Os quatro monstros Flare são placeholders licenciados e substituíveis. Os demais inimigos reaproveitam os assets originais do projeto.
- HUD atual preservada. O pacote GONKEN não foi integrado nesta etapa.

## Validação e evidências

`npm run check`, `npm test`, `npm run build`.

129 testes automatizados passaram. A validação Chromium cobriu movimento em oito direções, colisões, NPC/loja, quest e level-up, inventário drag/equip/unequip, combate/XP/drop/coleta, skill com custo real de mana, três contas comuns de classes diferentes, transformação, quatro mapas e persistência. Fixtures DEV apenas organizaram encontros/posições e o nível de teste da transformação; isso não é teste de balanceamento nem de carga.

[Relatório do MVP](docs/mvp/README.md) · [Checks executados](docs/mvp/validation.json) · [Screenshots reais](docs/mvp/screenshots/) · [Status dos assets](docs/ASSET_STATUS.md).

Os dados locais `.data*`, bancos SQLite, `.env` e `node_modules` ficam fora do pacote. Progresso existente é preservado.

## Pacote de entrega

`python scripts/package-local-game.py` gera `dist/Eclipse-Blood-Moon.zip`, com verificação de integridade e sem dados privados. O ZIP é um artefato de entrega local/release e não é versionado como arquivo Git; os assets ativos e o código estão no repositório.

## Licenças

Goblin, Esqueleto, Zumbi e Formiga-leão: pack oficial **Flare**, CC BY-SA 3.0, com PNGs originais e revisão/checksums fixados. [Atribuição](assets/monsters/ATTRIBUTION.txt), [licença](assets/flare/LICENSE.txt), [contribuidores](assets/flare/CREDITS.txt), [fontes](assets/monsters/LICENSED_PACK.json). Os créditos também estão acessíveis em `/credits` no jogo. Os demais assets originais conservam seus próprios créditos; a licença Flare não relicencia o código independente.

Direção atual: [produção rápida/MVP](docs/MVP-PRODUCAO-RAPIDA.md), que substitui o antigo bloqueio de aprovação da WALK e a exigência de corpos humanos separados.
