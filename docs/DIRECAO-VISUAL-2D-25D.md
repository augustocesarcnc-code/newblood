# ECLIPSE — BLOOD & MOON
## PROMPT MESTRE DE DIREÇÃO VISUAL E IMPLEMENTAÇÃO 2D / 2.5D

Quero continuar trabalhando EM CIMA DO PROJETO ATUAL.

NÃO recrie o jogo do zero.

NÃO destrua sistemas que já funcionam.

NÃO altere novamente a direção principal do projeto.

A partir de agora, a direção oficial do ECLIPSE será:

# MMORPG 2D COM SENSAÇÃO 2.5D / VISÃO 3/4 / DARK FANTASY GÓTICO

Quero manter:

- sprites 2D;
- mapas 2D;
- tiles;
- animações frame a frame;

mas utilizar:

- profundidade;
- perspectiva;
- iluminação;
- sombras;
- partículas;
- camadas;
- Y-sort;
- construções com volume;
- árvores e objetos altos;
- efeitos;

para produzir sensação visual 2.5D.

O objetivo NÃO é transformar o jogo em 3D.

---

# 1. REFERÊNCIAS DE ATMOSFERA

Use apenas como referência conceitual e de qualidade:

- Sirius the Jaeger
- Vampire Hunter D
- Castlevania
- Hellsing
- Lineage
- Ragnarok Online
- Tree of Savior
- Diablo

NÃO copie diretamente:

- personagens;
- sprites;
- monstros;
- mapas;
- interfaces;
- logos;
- ícones;
- efeitos;
- código.

Toda arte final deve ser ORIGINAL e reconhecível como:

ECLIPSE — BLOOD & MOON.

---

# 2. IDENTIDADE VISUAL

Tema principal:

DARK FANTASY GÓTICO.

Elementos recorrentes:

- lua;
- sangue;
- névoa;
- castelos;
- florestas;
- ruínas;
- cemitérios;
- igrejas;
- pedra;
- ferro;
- madeira;
- prata;
- fogo;
- magia sombria.

Paleta principal:

- preto carvão;
- grafite;
- cinza pedra;
- vinho;
- vermelho sangue;
- prata;
- dourado envelhecido;
- azul lunar;
- verde musgo.

Não transformar tudo em preto/vermelho.

Criar contraste.

---

# 3. REGRA PRINCIPAL DE ARTE

A prioridade NÃO é quantidade.

A prioridade é:

CONSISTÊNCIA.

Toda sprite, monstro, mapa, tile, UI e efeito deve parecer ter sido criado pelo MESMO time artístico.

Não quero:

- personagem realista com monstro cartoon;
- tile pixel art simples com HUD realista;
- ícones em estilos completamente diferentes;
- personagens com proporções diferentes sem motivo.

---

# 4. PRIMEIRA PRIORIDADE — PERSONAGENS

Comece pelos personagens principais.

Ordem:

1. Caçador
2. Vampiro Humano
3. Vampiro Transformado
4. Lobisomem Humano
5. Lobisomem Transformado

Antes de expandir monstros e mapas, estabeleça o padrão oficial desses personagens.

---

# 5. ESCALA OFICIAL

Defina uma escala única.

Todos os personagens humanos devem possuir:

- proporção semelhante;
- altura consistente;
- linha dos pés consistente;
- pivot consistente;
- perspectiva idêntica.

Formas transformadas podem ser maiores.

Bosses podem ser muito maiores.

Documentar em:

docs/ART_BIBLE.md

---

# 6. CAÇADOR

Visual:

caçador sobrenatural gótico.

Características:

- casaco/sobretudo;
- couro;
- botas;
- cintos;
- luvas;
- detalhes de prata;
- arma visível;
- postura disciplinada.

Armas possíveis:

- espada;
- besta;
- arco;
- facas;
- armas especiais de prata.

Não fazer cavaleiro genérico.

---

# 7. VAMPIRO HUMANO

Visual:

aristocrático.

Características:

- pele pálida;
- roupa preta/vinho;
- casaco elegante;
- detalhes metálicos;
- capa opcional;
- postura segura.

Movimentos:

mais suaves e controlados.

---

# 8. VAMPIRO TRANSFORMADO

Não fazer apenas recolor.

Criar forma realmente sobrenatural.

Elementos possíveis:

- garras;
- presas;
- anatomia alterada;
- braços alongados;
- olhos sobrenaturais;
- energia sanguínea;
- sombra;
- elementos de morcego.

Ainda deve ser possível perceber que veio do Vampiro Humano.

---

# 9. LOBISOMEM HUMANO

Visual:

mais robusto que o Caçador.

Características:

- couro;
- roupas resistentes;
- cicatrizes;
- postura pesada;
- detalhes lunares discretos.

---

# 10. LOBISOMEM TRANSFORMADO

Características:

- corpo grande;
- musculoso;
- cabeça lupina;
- garras;
- pernas fortes;
- cauda;
- pelagem;
- postura agressiva.

Evitar aparência simpática/cartoon.

---

# 11. DIREÇÕES OBRIGATÓRIAS

Todos os personagens principais devem possuir:

1. BAIXO
2. BAIXO-DIREITA
3. DIREITA
4. CIMA-DIREITA
5. CIMA
6. CIMA-ESQUERDA
7. ESQUERDA
8. BAIXO-ESQUERDA

REGRA:

BAIXO = frente verdadeira.

CIMA = costas verdadeiras.

Não copiar lateral para cima/baixo.

Não girar sprite.

Não distorcer sprite.

Criar cada direção corretamente.

---

# 12. ANIMAÇÕES FRAME A FRAME

Criar:

IDLE

WALK

RUN

ATTACK_1

ATTACK_2

HIT

DEATH

SKILL_CAST

TRANSFORM quando necessário.

JUMP somente se realmente fizer sentido no gameplay.

---

# 13. WALK

Não deslizar sprite estática.

Criar:

- movimento de pernas;
- movimento de braços;
- oscilação corporal;
- movimento de arma;
- movimento de capa/roupa.

Ideal:

6–8 frames.

---

# 14. RUN

Não acelerar WALK.

Criar frames próprios.

Características:

- passada maior;
- inclinação corporal;
- braços mais ativos;
- roupa reagindo ao movimento.

---

# 15. IDLE

Criar movimento discreto.

Exemplos:

- respiração;
- capa;
- cabelo;
- arma;
- peito;
- cauda;
- asas.

---

# 16. ATTACK

Ataque precisa possuir:

1. preparação;
2. execução;
3. impacto;
4. recuperação.

Arma deve realmente mover.

---

# 17. HIT

Criar reação corporal.

Não apenas flash.

---

# 18. DEATH

Criar queda ou sequência própria.

Não simplesmente desaparecer.

---

# 19. TRANSFORMAÇÃO

Vampiro e Lobisomem devem possuir transformação visual.

Vampiro:

sombra + sangue + transformação corporal.

Lobisomem:

aumento corporal + garras + cabeça + energia lunar.

Não trocar sprite instantaneamente sem feedback.

---

# 20. EQUIPAMENTOS VISUAIS

Criar sistema modular por layers.

Estrutura:

BODY

HAIR

HEAD

ARMOR

GLOVES

BOOTS

CAPE

WEAPON

OFFHAND

EFFECT.

---

# 21. EQUIPAR / DESEQUIPAR

Ao equipar:

item deve aparecer visualmente.

Ao desequipar:

item deve desaparecer.

Isso precisa sincronizar também no multiplayer.

---

# 22. EQUIPAMENTO EM TODAS AS DIREÇÕES

Uma espada equipada precisa funcionar em:

frente;

costas;

laterais;

diagonais;

idle;

walk;

run;

attack.

O mesmo vale para:

- capacete;
- capa;
- escudo;
- arco;
- besta;
- armadura.

---

# 23. MONSTROS

Após finalizar o padrão dos personagens, criar monstros.

Primeira leva:

- Lobo Sombrio
- Morcego Sangrento
- Fantasma
- Esqueleto
- Ghoul
- Bruxa
- Troll
- Minotauro

---

# 24. FANTASMA

Visual:

- translúcido;
- espectral;
- iluminação fria;
- movimento flutuante.

Pode atravessar alguns obstáculos específicos, mas NÃO limites de mapa.

---

# 25. BRUXA

Visual:

- humanoide;
- roupas ritualísticas;
- cajado;
- efeitos mágicos;
- silhueta clara.

Ataques:

- projétil;
- maldição;
- teleporte curto.

---

# 26. TROLL

Visual:

- grande;
- pesado;
- pele grossa;
- arma bruta.

Gameplay:

- HP alto;
- regeneração;
- ataques lentos.

---

# 27. MINOTAURO

Visual:

- grande;
- musculoso;
- chifres;
- machado/martelo;
- armadura pesada.

Gameplay:

- charge;
- stun;
- ataques pesados.

---

# 28. ANIMAÇÕES DOS MONSTROS

No mínimo:

Idle

Walk

Attack

Hit

Death.

Monstros importantes:

Attack 2

Skill

Cast.

---

# 29. BOSSES

Criar bosses com sprites próprias.

Nunca pegar monstro comum e apenas aumentar tamanho.

Boss precisa ter:

- silhueta exclusiva;
- animações exclusivas;
- efeitos;
- aura;
- ataques especiais.

---

# 30. PRIMEIRO BOSS

Criar:

O CARRASCO DA LUA.

Visual:

- armadura gótica;
- máscara;
- arma pesada;
- correntes;
- energia lunar;
- detalhes vermelhos.

---

# 31. TILES

Depois dos personagens/monstros, criar tiles.

Criar sistema modular de tilesets.

Categorias:

NATUREZA

CIDADE

CEMITÉRIO

CASTELO

CAVERNA

RUÍNAS

PÂNTANO

DUNGEON.

---

# 32. NATUREZA

Criar:

- grama;
- terra;
- lama;
- folhas;
- musgo;
- pedras;
- raízes;
- árvores;
- arbustos;
- flores;
- cogumelos.

---

# 33. CIDADE

Criar:

- rua de pedra;
- casas;
- telhados;
- portas;
- janelas;
- paredes;
- postes;
- fontes;
- cercas;
- barris;
- caixas;
- carroças.

---

# 34. CEMITÉRIO

Criar:

- lápides;
- mausoléus;
- túmulos;
- estátuas;
- cruzes;
- portões;
- velas;
- árvores mortas.

---

# 35. CASTELO

Criar:

- pedra;
- corredores;
- pilares;
- escadas;
- vitrais;
- grades;
- tronos;
- portões.

---

# 36. CAVERNA

Criar:

- chão;
- paredes;
- pedras;
- cristais;
- água;
- ossos;
- rachaduras.

---

# 37. EFEITO 2.5D

O jogo continua 2D.

A sensação 2.5D virá de:

- Y-sort;
- sombras;
- iluminação;
- objetos altos;
- perspectiva;
- oclusão;
- partículas;
- neblina;
- layers;
- paralaxe discreto.

---

# 38. Y-SORT

Personagem deve:

passar atrás de árvore.

passar na frente de tronco.

passar atrás de objetos altos.

Isso é essencial para o 2.5D.

---

# 39. SOMBRA

Todos os personagens e monstros precisam possuir sombra no chão.

Sombra:

- discreta;
- consistente;
- alinhada.

---

# 40. ILUMINAÇÃO

Usar:

- lua;
- tochas;
- velas;
- postes;
- janelas;
- magia;
- fogueiras.

Contraste:

luz fria lunar

X

luz quente das tochas.

---

# 41. PARTÍCULAS

Usar com moderação:

- névoa;
- chuva;
- brasas;
- poeira;
- folhas;
- sangue;
- magia.

---

# 42. MAPAS

Não crie muitos mapas antes de finalizar dois mapas padrão.

Primeiro:

VILA DE ECLIPSE

FLORESTA AMALDIÇOADA.

---

# 43. VILA DE ECLIPSE

Precisa conter:

- praça;
- fonte;
- templo;
- taverna;
- ferreiro;
- mercador;
- alquimista;
- banco;
- armazém;
- guild hall;
- casas;
- portões;
- mural de quests.

---

# 44. FLORESTA AMALDIÇOADA

Criar:

- trilhas;
- árvores densas;
- clareiras;
- ruínas;
- pedras;
- riachos;
- pontes;
- neblina;
- spawns.

---

# 45. TAMANHO DOS MAPAS

Mapas devem parecer regiões.

Não salas pequenas.

Criar:

- caminhos;
- áreas secretas;
- landmarks;
- rotas secundárias;
- locais de grind;
- boss entrances.

---

# 46. COLISÃO

Colisão é prioridade.

Player não pode atravessar:

- parede;
- árvore;
- pedra;
- casa;
- água;
- objeto sólido.

Monstros também precisam respeitar.

---

# 47. LAYERS DE MAPA

Criar:

GROUND

GROUND_DETAIL

DECORATION

OBJECTS

ROOF

FOREGROUND

COLLISION

NPC

MONSTER

TELEPORT

QUEST

BOSS.

---

# 48. UI / HUD

Após estabelecer personagens e mundo, padronizar toda UI.

Não quero aparência de dashboard web.

Quero interface de MMORPG.

---

# 49. HUD PRINCIPAL

Mostrar:

- portrait;
- nome;
- level;
- raça;
- HP;
- mana;
- stamina;
- XP;
- buffs;
- target.

---

# 50. HOTBAR

Inferior central.

Slots compactos.

Mostrar:

- ícone;
- tecla;
- cooldown;
- quantidade.

---

# 51. INVENTÁRIO

Visual:

- ferro envelhecido;
- madeira;
- couro;
- pedra escura.

Criar:

- grid;
- raridades;
- tooltip;
- drag/drop;
- compare;
- sort.

---

# 52. EQUIPMENT UI

Mostrar personagem no centro.

Slots em volta.

---

# 53. MINIMAPA

Canto superior direito.

Moldura gótica discreta.

Mostrar:

- player;
- party;
- NPC;
- quest;
- boss;
- portal.

---

# 54. CHAT

Discreto.

Fundo translúcido.

Canais:

Local

Global

Party

Clan

Whisper

System.

---

# 55. QUEST TRACKER

Compacto.

Minimizável.

---

# 56. JANELAS

Quando apropriado:

- drag;
- minimize;
- maximize;
- close.

Salvar posição.

---

# 57. ÍCONES

Não usar emoji como arte final.

Criar ícones consistentes para:

- skills;
- itens;
- armas;
- poções;
- materiais;
- quests.

---

# 58. RARIDADES

Criar padrão visual:

COMUM

INCOMUM

RARO

ÉPICO

LENDÁRIO

MÍTICO.

Aplicar:

- cor;
- border;
- glow;
- tooltip;
- loot no chão.

---

# 59. LOGIN

Criar posteriormente uma tela coerente com a mesma Art Bible.

Cena:

- castelo;
- lua;
- névoa;
- floresta;
- ruínas;
- morcegos;
- partículas.

---

# 60. EFEITOS DAS RAÇAS

CAÇADOR:

- prata;
- faíscas;
- projéteis;
- armadilhas.

VAMPIRO:

- sangue;
- sombra;
- morcegos;
- névoa.

LOBISOMEM:

- garras;
- poeira;
- impacto;
- energia lunar.

---

# 61. SISTEMA LUNAR VISUAL

Criar lua visível no mundo.

Fases:

Lua Nova

Crescente

Cheia

Minguante

Lua de Sangue

Eclipse.

---

# 62. LUA ANIMADA

A lua deve se deslocar no céu/background.

Não apenas ícone.

Quando estiver descendo:

ativar Lunar Power.

---

# 63. EVENTOS VISUAIS

Lua de Sangue:

- céu vermelho;
- iluminação diferente;
- névoa;
- monstros especiais.

Eclipse:

- mapa escurece;
- luz muda;
- efeitos especiais.

---

# 64. ÁUDIO

Associar identidade sonora ao visual.

Cada mapa deve possuir:

- ambiente;
- música;
- monstros;
- skills;
- UI.

---

# 65. REGRA DE IMPLEMENTAÇÃO

Não quero uma pasta cheia de PNG.

Fluxo obrigatório:

CRIAR ASSET

→ INTEGRAR NO JOGO

→ EXECUTAR

→ TESTAR

→ CORRIGIR

→ APROVAR

→ EXPANDIR.

---

# 66. NÃO GERAR ASSETS EM MASSA

Não faça:

100 monstros antes de integrar 5.

20 mapas antes de finalizar 2.

500 itens antes do inventário funcionar.

A prioridade é qualidade.

---

# 67. ORDEM DE EXECUÇÃO

FASE 1

Definir Art Bible.

Escala.

Perspectiva.

Paleta.

---

FASE 2

Criar e integrar:

Caçador.

---

FASE 3

Criar e integrar:

Vampiro Humano.

Vampiro Transformado.

---

FASE 4

Criar e integrar:

Lobisomem Humano.

Lobisomem Transformado.

---

FASE 5

Finalizar animações e 8 direções.

---

FASE 6

Implementar equipamentos visuais.

---

FASE 7

Criar:

Lobo.

Fantasma.

Bruxa.

Troll.

Minotauro.

---

FASE 8

Finalizar:

Vila de Eclipse.

Floresta Amaldiçoada.

---

FASE 9

Refazer:

HUD.

Inventário.

Hotbar.

Minimapa.

---

FASE 10

Adicionar:

efeitos.

iluminação.

lua.

áudio.

---

# 68. VERTICAL SLICE

Antes de expandir o jogo inteiro, quero uma versão contendo:

Caçador

Vampiro

Lobisomem

Lobo

Fantasma

Bruxa

Troll

Minotauro

Vila

Floresta

HUD

Inventário

Skills

Loot

Equipamento.

Tudo no MESMO padrão visual.

---

# 69. CRITÉRIO VISUAL

Quando olhar uma screenshot, quero identificar imediatamente:

- MMORPG;
- dark fantasy;
- mundo gótico;
- profundidade;
- identidade própria.

Não quero:

- página web;
- jogo mobile genérico;
- sprites aleatórias;
- mapa de teste.

---

# 70. TESTE VISUAL

Antes de finalizar cada fase:

abra o jogo.

Verifique:

- escala;
- sprite;
- contraste;
- colisão;
- animação;
- HUD;
- iluminação;
- posição.

Corrija o que estiver estranho.

---

# 71. NÃO ALTERAR PERSPECTIVA

A perspectiva 2D/2.5D atual deve permanecer consistente.

Não mudar novamente para:

- top-down totalmente vertical;
- sidescroller;
- 3D real.

---

# 72. ART BIBLE

Criar:

docs/ART_BIBLE.md

Documentar:

- perspectiva;
- dimensões;
- paleta;
- iluminação;
- sprites;
- frames;
- tiles;
- UI;
- efeitos;
- regras.

Todo asset futuro deve seguir isso.

---

# 73. ASSET STATUS

Criar:

docs/ASSET_STATUS.md

Colunas:

ASSET

CRIADO

INTEGRADO

TESTADO

STATUS.

---

# 74. DEFINITION OF DONE DA FASE VISUAL

A fase visual inicial só estará concluída quando:

[ ] Caçador estiver completo

[ ] Vampiro humano estiver completo

[ ] Vampiro transformado estiver completo

[ ] Lobisomem humano estiver completo

[ ] Lobisomem transformado estiver completo

[ ] 8 direções funcionarem

[ ] animações estiverem corretas

[ ] equipamento visual funcionar

[ ] monstros principais estiverem integrados

[ ] Vila estiver polida

[ ] Floresta estiver polida

[ ] HUD estiver consistente

[ ] inventário estiver consistente

[ ] minimapa estiver consistente

[ ] efeitos 2.5D funcionarem

[ ] nenhuma sprite principal parecer de outro jogo

[ ] nenhum placeholder principal permanecer.

---

# REGRA FINAL

A partir deste momento:

NÃO MEÇA O PROGRESSO PELA QUANTIDADE DE ARQUIVOS CRIADOS.

Meça pelo que realmente está:

CRIADO

+

INTEGRADO

+

FUNCIONANDO

+

VISUALMENTE CONSISTENTE.

Quero um MMORPG 2D com profundidade 2.5D, sprites bonitas, animações frame a frame, monstros consistentes, mapas atmosféricos e HUD profissional.

Preserve o projeto atual.

Comece pelo padrão visual dos PERSONAGENS.

Depois faça o restante do jogo seguir essa linguagem.