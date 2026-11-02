# Efeitos de habilidades Bloodmoon

Arte vetorial/procedural original do projeto, sem sprites de Lineage ou Ragnarok.

- `icons.svg`: 30 ícones em grade de 10 colunas × 3 linhas, células de 64 px.
- `*-effects.png`: uma folha por classe; 10 linhas × 8 quadros, células de
  128×128 px, com transparência. Cada linha corresponde a uma habilidade.
- `manifest.json`: nomes, ordem das linhas, dimensões e duração dos quadros.
- `mmo/skill-effects.js`: desenho dos efeitos, cache e reprodução no mundo.

Os PNGs foram exportados pelo próprio renderizador. O jogo utiliza os atlas
pré-renderizados e mantém o desenho procedural como fallback. O grimório também
exporta a folha da classe. São efeitos visuais de conjuração/impacto; não são
novas poses corporais ou novos desenhos de ataque dos humanos.
