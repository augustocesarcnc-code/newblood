> Sprite Master aprovada explicitamente pelo usuário. Fase B autorizada: Idle, Walk, Run e GIFs em oito direções.

# Novo Caçador — Fase A · DEV · aguardando aprovação

O pedido definitivo reprova o corpo anterior e exige uma substituição, não outro
ajuste daquele rig. Foi criada uma nova Sprite Master em pixel art detalhada, sem
entrada das miniaturas antigas. Não há registro de uma versão anterior do Caçador
com aprovação definitiva nos materiais disponíveis; nenhuma delas foi assumida como
referência aprovada.

1. [Oito direções lado a lado, fundo neutro](eight-directions.png).
2. [O mesmo Caçador na Vila atual, para escala](village-scale.png).

Na primeira imagem só existem as oito vistas do Caçador e suas legendas N/NE/E/SE/S/SW/W/NW.
Não há mapa, HUD, sombra de chão ou efeitos. A segunda é uma captura real do cliente
conectado a um servidor e SQLite temporários, com uma conta comum e o novo renderer.
Não é uma composição da sprite sobre uma screenshot.

Os NPCs, cenário e HUD são o material anterior, preservado por instrução expressa.
Eles não foram recriados nem aprovados. O novo Caçador mede aproximadamente 77,6 px
no viewport 1440×900 e usa o mesmo ponto de chão nas oito vistas.

O arquivo-fonte é assets/characters/hunter/sprite-master.png. SHA e retângulos estão
em master.json. A imagem gerada foi copiada sem alterar bytes. Metadados foram
medidos pela transparência do corpo; ruído alfa muito fraco e isolado não é anatomia.
Há exatamente uma pose por direção, sem animação, interpolação corporal ou camadas
de equipamento novas. A aparência da Master é fixa nesta revisão.

Verificações reproduzíveis:

```sh
python3 scripts/audit-hunter-master.py
python3 tools/qa/hunter-master.py
npm run check
npm run build
```

- audit.json: dimensões, integridade, oito vistas distintas, pivôs e ausência de
  sobreposição dos retângulos. Essas verificações não provam aprovação artística.
- integration.json: carregamento, personagem real na Vila e laboratórios sem falsas
  timelines de animação para a Master.
- As doze pranchas reprovadas foram movidas para assets/deprecated/hunter com hashes
  inalterados; somente NPCs existentes ainda podem usar o legado por flag explícita.
- Nenhum arquivo de mapa, HUD, banco, combate, progressão ou autenticação foi alterado.

Checkpoint anterior às mudanças: b4ccca8, branch art/hunter-master-review. O candidato
permanece em revisão local; não foi promovido/publicado como arte final. O ZIP jogável
anterior pertence ao padrão reprovado, não contém este candidato e não é sua prova.

**PARAR AQUI.** A próxima etapa só começa após aprovação explícita do usuário:
Fase B, Idle/Walk/Run e GIFs, seguida de nova pausa. Não criar outras classes ou NPCs.

GONKEN_Fantasy_RPG_UI_Pro.zip foi anexado, mas excedeu o limite de transferência
32 MiB. Nenhum conteúdo foi inspecionado ou integrado; aguardar a fase de UI.
