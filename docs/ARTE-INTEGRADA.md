# ECLIPSE — arte de produção integrada

Esta entrega substitui a apresentação dos atores e cenários em uso. Os relatos de
Fase 1 e da primeira UI são históricos; este documento descreve a integração atual.
O pedido original desta etapa está em PEDIDO-ARTE-INTEGRADA.md.

## Implementado

- Cinco modelos de jogador: caçador, vampiro humano/transformado e lobisomem humano/transformado.
- Cada modelo tem idle, walk, run, jump, attack, shoot, hit, death, cast, transform e
  special, com oito frames em oito direções. As ações que pertencem a uma classe
  continuam limitadas pelo servidor: possuir um atlas não concede uma habilidade.
- Monstros: rato, morcego sangrento, lobo sombrio, lobo corrompido, aranha de cripta,
  esqueleto, ghoul, cultista, bandido, vampiro selvagem, lobisomem selvagem e necromante;
  além de elite armado, Carrasco e criaturas adicionais do catálogo anterior.
- Cada criatura tem idle/walk/attack/hit/death. Carrasco tem também especial próprio,
  armadura, chifres, halo rubro, arma pesada, escala maior e barra de HP de boss.
- 306 atlas: 9.024 frames de corpos e 10.560 frames de camadas equipáveis. Total de
  19.584 frames exportados. Os equipamentos usam margem extra para armas, com o
  mesmo tamanho projetado e pivô dos corpos.
- 32 modelos de cenografia e 12 terrenos originais, com castelo, templo, casas,
  mausoléu, arcos, ruínas, pilares, escadas, grades, vitrais, cercas, lâmpadas, fontes,
  vegetação, raízes, água, ponte, ossos, cristais e altares.
- Seis mapas polidos com objetos e landmarks nos JSONs Tiled, colisões de objetos
  sólidos, travessia de água na floresta, Y-sort e luzes; Castelo Carmesim nomeado.
- Login com pintura original de castelo/lua/névoa, controles reais, estados hover e
  pressionado e partículas com suporte a redução de movimento.
- Seleção real com sprite animada, nome, classe, nível e localização.
- Animações de transformação/salto/combate também para as formas; dano crítico
  identificado, efeito de level up e auras de buffs. Não há troca de atlas para o
  antigo renderer humano/monstro quando uma ação é executada.

## Como a arte foi criada

Os atores são **miniaturas estilizadas pré-renderizadas**, criadas em modelos
articulados originais. `tools/art/rigs.js` contém geometria, figurino, anatomia,
armas e poses. Há rotação do modelo tridimensional antes da renderização; não há
rotação de um bitmap lateral para fingir costas. A oclusão natural esconde o rosto
na vista norte, e equipamentos assimétricos mantêm o lado correto.

Cada PNG contém oito linhas de direções (S, SW, W, NW, N, NE, E, SE) e oito colunas
de frames. Andar e correr alteram passadas, joelhos, braços e inclinação. O salto
inclui agachamento, impulso, subida, ápice, descida e pouso. Morte altera a pose do
corpo; ataque altera braços e tronco. Não são apenas retratos deslocados na tela.

As camadas de equipamento são exportadas com o próprio corpo servindo de máscara
de profundidade. Isso mantém a arma oculta quando passa por trás do corpo e evita
sobrepor equipamentos frontais nas costas. Formas monstruosas escondem equipamento.

A geometria dos cenários está em tools/art/props.js; os terrenos SVG são padrões
originais determinísticos. A pintura de login foi criada para ECLIPSE com image_gen.
Não foram importados assets proprietários dos jogos/animes usados como referência.

## Integrado no jogo

- mmo/sprites.js e mmo/eclipse-sprites.js: renderer ativo, cache limitado, atlas e equipamento.
- mmo/monster-sprites.js: criatura, morte, hit, golpe e especial conforme timestamps do servidor.
- mmo/picking.js: clique no corpo real, usando os limites alfa do frame renderizado.
- mmo/client.js, backend.js, world.js e monster-ai.js: apresentação sincronizada, boss e eventos.
- mmo/scenery.js, terrain.js, map-renderer.js: cenários/terrenos/iluminação em uso.
- assets/maps/*.json: composição de cada região e colisões de objetos sólidos.
- mmo/auth-ui.js, index.html e immersive.css: login e seleção reais.
- /art: inspeção dos 22 modelos de produção, ações, direções, timeline e equipamentos.
- /sprites: laboratório usando os mesmos atlas, com seleção de direção/frame/ação,
  equipamento e exportação PNG. Ele não substitui a validação do jogo.

Os PNGs históricos Flare/transformações anteriores permanecem no repositório para
histórico/licenças, mas não são carregados pelo renderer de produção. O ZIP jogável
exclui esses bitmaps desativados para evitar duplicar o download. O código e os testes
atuais usam o novo conjunto; créditos antigos permanecem preservados.

## Reproduzir a criação

Com as dependências instaladas e o Vite ativo (`npm run dev`):

```bash
python scripts/export-eclipse-art.py --force
python scripts/export-eclipse-props.py
node scripts/create-eclipse-tiles.mjs
node scripts/polish-eclipse-maps.mjs
python scripts/audit-eclipse-art.py
```

Exportação necessita Python com Playwright/Pillow e Chromium; isso é ferramenta de
arte e não requisito para jogar. O jogo distribuído usa PNG/SVG prontos, sem Three.js
na renderização ao vivo. Os scripts editáveis permitem evoluir os modelos depois.
A auditoria verifica células, limites alfa, poses repetidas por linha e checksums
para ligar o relatório aos PNGs testados. A câmera de cenário mantém a mesma orientação/elevação dos atores.
Frames de equipamento inteiramente
ocultos pelo corpo em determinada vista podem ser transparentes legitimamente.

## Testado

- 110 testes de regras e integração, incluindo os novos atlas e alinhamento de equipamento.
- Login/seleção reais, os cinco visuais, WASD, pulo e transformações em Chromium.
- Inventário/equipamentos, visita às seis regiões, criaturas, ataque real, morte,
  loot físico e pickup; batalha contra Carrasco, especial, HP e drop lendário.
- Nenhum erro JavaScript ou asset faltando no percurso validado.
- Servidor local e bundle Vite de produção, com autenticação/Socket.IO e arte real.
- Auditoria frame a frame automatizada e inspeção de pranchas/capturas; não houve
  pintura manual individual de cada um dos 19.584 frames.

O percurso automatizado pode ser repetido com `python tools/qa/visual-smoke.py`
(com Playwright/Chromium instalado). O teste usa banco temporário, verifica o clique no corpo do boss, a carga
e o impacto do especial antes de derrotar o Carrasco e checa erros de console/assets.
Capturas reais ficam em docs/previews/eclipse-*.png.

## Limites verificáveis

O ambiente de validação é Linux/Chromium; não tenho uma sessão Windows real para
executar o instalador no computador do usuário. Node foi limitado à linha 24.19+
porque a falha nativa com Node 26 já foi observada. Servidor público, pagamentos
reais e teste de carga com dezenas de navegadores renderizando simultaneamente
não fazem parte desta validação visual. Não há alegação de certificação de produção.
