# Preparação para integrar o Eclipse

Status: **a fusão ainda não foi feita**. O anexo `ECLIPSE_CODEX_FULL_PROJECT_01.zip`
ultrapassa o limite de transferência de 32 MiB e seu código não foi aberto.
O Eclipse não está disponível em um repositório GitHub.

## Alterações independentes no Bloodmoon

- As três bases humanas e os equipamentos em camadas foram preservados.
- A convenção de direções foi centralizada: X positivo aponta para leste e Y
  positivo para sul. A correspondência com as oito linhas Flare é explícita.
- Goblins, esqueletos, zumbis e formigas-leão usam sprites Flare com repouso,
  movimento e ataque em oito direções. Os mapas têm populações distintas.
- O terreno utiliza texturas Flare. Árvores e construções foram redesenhadas no Canvas, com profundidade
  compartilhada com personagens. A vila ganhou barraca, forja e arco lunar;
  isto não representa uma substituição completa dos mapas.
- As imagens originais foram copiadas sem alteração. Licença, origem e créditos
  estão em `assets/monsters/ATTRIBUTION.txt`, `assets/terrain/ATTRIBUTION.txt` e
  `assets/flare`. Não foram importados sprites oficiais do Tibia.

## Arquivos necessários para continuar

Enviar uma cópia compactada do código do Eclipse com menos de 32 MiB por anexo,
excluindo `node_modules`, `.git`, caches e builds/exports gerados. Preservar os
arquivos originais no computador. As artes podem ser enviadas em ZIPs separados,
cada um abaixo de 32 MiB. Incluir manifestos, configurações, código e metadados
das animações para investigar a inversão de cima/baixo no projeto original.

## Validação

`npm run check` e os 59 testes de `npm test` passaram. O teste de servidor precisa
de permissão para abrir uma porta local. Os testes de arte conferem os limites
dos recortes PNG, oito direções e as populações dos mapas. A validação visual e
o ajuste artístico final continuam necessários.
