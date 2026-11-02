# Revisão de ocorrências visuais provisórias

Busca executada por placeholder, dummy, temporary, todo, mock, sample e test-art,
com revisão dos resultados em código, HTML, assets e documentos. node_modules,
Git, saves privados e ZIPs não são fontes de arte editável e foram excluídos.

- index.html, auth-ui.js, clan-ui.js, style.css e immersive.css: placeholder é
  atributo/estilo dos campos de texto, não imagem provisória. Os campos permanecem.
- art.html e LEIA-ME-PRIMEIRO.txt: “Todos/TODO” significa todos os quadros/arquivos;
  não é comentário de funcionalidade ausente.
- tests/clans-jump.test.js e eclipse-systems.test.js: IDs/targets de fixture,
  executados em testes; não são personagens ou artes apresentados no jogo.
- scripts/smoke-load.mjs: banco e conexões temporários de teste isolado.
- .env.example: exemplos de configuração; nenhum asset visual.
- AGENTS.md e documentos antigos: regras, pedido original e histórico de etapas.
  A entrega corrente é descrita por docs/ARTE-INTEGRADA.md.

Os renderers ativos de humano, formas, monstros, terreno e cenografia não usam
as antigas silhuetas primitivas de monstro nem os antigos atlas Flare/transformação.
Os arquivos históricos são preservados no Git e não são carregados pelo jogo.
Fallback de carregamento usa idle do próprio modelo enquanto outra ação chega;
isso não é apresentado como um atlas novo nem como substituto de uma ação ausente.
