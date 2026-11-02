# ECLIPSE — Art Bible · revisão 1

## Direção oficial

MMORPG de sprites 2D, visão 3/4 fixa, dark fantasy gótico. O jogo renderiza Canvas
2D e atlas; não carrega modelos 3D nem permite câmera orbital. A profundidade vem
de volumes desenhados, ordenação pelo pé, sombra no chão, luz, névoa e oclusão.
Referências são atmosféricas; personagens, símbolos e composições são originais.
O pedido atual está em DIRECAO-VISUAL-2D-25D.md.

## Escala, câmera e contrato dos atlas

- Corpos: célula **128 × 192 px**, atlas **1024 × 1536 px**.
- Equipamento: célula **192 × 192 px**, atlas **1536 × 1536 px**, com margem de arma.
- Oito quadros por ação; oito linhas **S, SW, W, NW, N, NE, E, SE**. A ordem de
  apresentação ao jogador pode ser S, SE, E, NE, N, NW, W, SW; nunca remapear na mão.
- Pivô do corpo e do equipamento é a projeção do mesmo ponto de chão. Coordenadas
  exatas ficam em manifest.json e são calculadas pelo exportador. Nunca alinhar pela
  borda da célula nem redesenhar o pivô na mão.
- Humanos compartilham esqueleto, altura dos pés e escala projetada; a cabeça usa
  82% da escala anterior para reduzir a leitura de boneco. Lobisomem humano ganha
  largura moderada, não outro comprimento de membros. Formas têm anatomia distinta.
- Autoria usa miniaturas articuladas pré-renderizadas com câmera ortográfica fixa
  em (0, 5.35, 8), olhando para (0, 1.35, 0): aproximadamente 26.6° acima do chão.
  Isso é ferramenta offline, não mudança do runtime para 3D.
- Cada direção é renderizada a partir da pose espacial correta; nenhum PNG é
  girado/espelhado para simular costas. Norte mostra nuca/costas; sul mostra rosto.

## Paleta e materiais

| Função | Cor |
| --- | --- |
| Carvão / contorno | #20272f |
| Grafite / sobretudo | #282e35 |
| Pedra fria | #646f7d |
| Couro gasto | #6f5845 |
| Vinho | #542c3c |
| Sangue, uso pontual | #a64058 |
| Prata | #bdc4c2 |
| Dourado envelhecido | #a99472 |
| Luz lunar | #789dbf |
| Musgo | #303c39 |

Separar corpo, roupa e cenário por valores de luminosidade. Prata é detalhe legível,
não armadura inteira brilhante. Carne e couro são foscos. Sangue/vinho não substituem
verde, azul lunar e pedra em todo o mapa. Não misturar emoji com ícone final de item.

## Silhuetas de personagem

- **Caçador:** duster dividido, chapéu de campo baixo, lapelas angulares, botas e
  luvas escuras, fivelas/prata e cinturão de ferramentas. Arma vem do equipamento
  real; roupa-base não concede arma ou defesa. Evitar ombreiras de cavaleiro.
- **Vampiro humano:** cabeça pálida de proporção adulta, casaco vinho/grafite,
  gola alta angular e capa longa. Movimento contido, cintura e peito legíveis.
- **Vampiro transformado:** asas membranosas, dedos alongados, caixa torácica e
  marcas carmesins; preserva contraste do humano sem ser recolor.
- **Lobisomem humano:** tronco robusto, couro/musgo, gola irregular e cicatriz.
- **Lobisomem transformado:** focinho alongado, orelhas lupinas, garras, cauda,
  dorso irregular e pelagem escura. Nenhum rosto simpático/cartoon.

## Ações e roupa

Idle respira; walk articula pernas/braços; run tem passada e inclinação próprias.
As abas do casaco/capa se articulam com o ciclo, não deslizam com o corpo inteiro.
Attack 1 é corte com preparação/impacto/recuperação; Attack 2 é avanço/estocada com
pose própria. O servidor alterna apresentação de golpes corpo a corpo sem conceder
ataques extras ou mudar dano/cooldown. Shoot permanece específico de arco/besta.
Hit reage com tronco/cabeça; death cai; cast abre gesto; transform tem crescimento
e feedback de classe. Jump é preservado porque existe no gameplay.

## Equipamento modular

Body/roupa-base, cabeça/cabelo, armadura, pernas, botas, luvas, capa, arma, offhand e amuleto
seguem o mesmo esqueleto. A roupa/capa-base não ocupa slot e não concede atributos. A **Capa da Vigília** é
um item separado no slot cape, vendido por Mara; aparece e some ao equipar/remover.
Equipar/desequipar usa appearance do servidor e é transmitido aos outros jogadores.
A oclusão do corpo é aplicada na exportação das camadas, inclusive nas costas.
Anel/cinto continuam lógicos e não devem ser contados como overlays visuais.

## Mundo e profundidade

Vila e Floresta continuam regiões de referência; preservar colisões existentes.
Y-sort usa a posição dos pés, não topo do sprite. Árvores/prédios altos desenham
na frente ou atrás conforme Y; ficam translúcidos quando ocultam o próprio jogador.
Sombra elíptica discreta em todas as unidades. Luz lunar fria e luz quente de
postes/forja/altar; névoa e chuva são parcimoniosas e respeitam redução de movimento.
Não usar escurecimento que torne o jogador ilegível nem paralaxe que mova colisões.

## UI, efeitos e áudio

HUD sobre o mundo, hotbar inferior central, minimapa no alto à direita e janelas
existentes. Ferro/grafite, couro e prata discreta; raridade por borda/cor e texto.
Não refazer um dashboard independente. Todo número deve vir do estado real.
Prata/faíscas no Caçador, vinho/sombra no Vampiro, impacto/lua no Lobisomem.
Áudio atual é sintetizado, opt-in; não chamar de trilha gravada final.

## Pipeline e aceite

Alterar fonte → exportar somente modelo/ação necessários → integrar → executar →
auditar pixels/pivôs → testar gameplay e multiplayer → capturar → revisar → expandir.
Use filtros --models/--states do exportador para evitar lotes sem uso.
Não classificar qualidade artística como aprovada só porque checksums passam.
Antes de expandir monstros/mapas, mostrar os cinco personagens dentro do jogo,
comparar escala e verificar costas/frente, walk/run/attack/hit/death e equipamento.
ASSET_STATUS.md separa CRIADO, INTEGRADO e TESTADO, inclusive pendências explícitas.

## Integrações desta revisão

Oito famílias na Floresta: lobo, morcego, esqueleto, fantasma, ghoul, bruxa, troll e
minotauro. Fantasma é translúcido; Bruxa usa cajado/hex/blink; Troll tem clava e
regeneração; Minotauro tem chifres/arma e investida sinalizada. Nenhum dos quatro
novos é um recolor de outro atlas. O Troll é enquadrado com escala .64 na autoria e
compensação ×2 no renderer, preservando seu tamanho no mundo sem cortar a clava.

A lua é uma camada de fundo antes das unidades. Sua órbita vem do relógio do servidor;
a metade descendente ativa Lunar Power (+5% de dano). Há lua cheia normal e Lua de
Sangue distintas; a Lua de Sangue ocorre uma vez a cada quatro ciclos lunares e
Eclipse uma vez a cada oito ciclos. Não foram adicionados bosses/loot exclusivos
a esses eventos nesta etapa. A música/ambiente é uma composição procedural curta,
original e por região; não é gravação final de estúdio.

Banco/armazém, taverna, salão dos clãs e mural usam os mesmos ícones, janelas e materiais
existentes. A custódia bancária não aparece no broadcast público. Novas casas usam
artes existentes com footprint sólido; o mural é vetor Canvas integrado e interativo.
Personagem do inventário carrega a aparência antes de desenhar, enquadra o corpo inteiro
e fica entre os slots. A posição das janelas é persistida localmente por painel.
