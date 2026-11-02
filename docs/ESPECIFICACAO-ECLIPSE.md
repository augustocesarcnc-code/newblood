# ECLIPSE — BLOOD & MOON
## MMORPG 2D DARK FANTASY PARA BROWSER

Quero que você desenvolva este projeto DO ZERO como um jogo funcional, executável e organizado.

Não quero apenas protótipos visuais, mockups, documentação ou exemplos isolados.

Quero um projeto jogável completo, com CLIENTE + SERVIDOR + BANCO DE DADOS, preparado para evolução contínua.

Você deve atuar como:
- Game Designer
- Desenvolvedor Front-end
- Desenvolvedor Back-end
- Desenvolvedor Multiplayer
- Arquiteto de Software
- Desenvolvedor de Sistemas de RPG
- Desenvolvedor de UI/HUD
- QA/Testes

Quando houver uma decisão técnica pequena que não esteja especificada, escolha a solução mais adequada e continue o desenvolvimento.

Não fique interrompendo o desenvolvimento para me perguntar detalhes que podem ser decididos tecnicamente.

---

# 1. NOME DO JOGO

ECLIPSE — Blood & Moon

Tema:
MMORPG 2D dark fantasy gótico envolvendo vampiros, lobisomens, caçadores, sangue, lua, maldições, florestas sombrias, vilas medievais e castelos.

Referências estruturais:
- Tibia
- Ultima Online
- Helbreath

IMPORTANTE:
Usar essas referências apenas como inspiração de funcionamento e estrutura.

Não copiar:
- mapas
- personagens
- nomes
- sprites
- interfaces
- textos
- monstros proprietários
- código
- marcas

O jogo deve ter identidade própria.

---

# 2. OBJETIVO DA PRIMEIRA VERSÃO

Entregar um MMORPG 2D para navegador realmente jogável.

Fluxo mínimo:

LOGIN
↓
CADASTRO
↓
SELEÇÃO/CRIAÇÃO DE PERSONAGEM
↓
ENTRAR NO MUNDO
↓
MOVIMENTAR
↓
ENCONTRAR OUTROS PLAYERS
↓
MATAR MONSTROS
↓
GANHAR EXP
↓
SUBIR DE LEVEL
↓
PEGAR LOOT
↓
USAR INVENTÁRIO
↓
EQUIPAR ITENS
↓
USAR HABILIDADES
↓
COMPRAR/VENDER COM NPC
↓
CONVERSAR NO CHAT
↓
SALVAR O PERSONAGEM
↓
SAIR
↓
ENTRAR NOVAMENTE COM O PROGRESSO SALVO

Essa experiência precisa funcionar.

---

# 3. TECNOLOGIAS

Preferência:

CLIENTE:
- TypeScript
- Phaser 3
- HTML5 Canvas/WebGL
- Vite

SERVIDOR:
- Node.js
- TypeScript
- Express

MULTIPLAYER:
- Socket.IO ou Colyseus
- servidor autoritativo

BANCO:
- Prisma
- SQLite para desenvolvimento
- arquitetura preparada para PostgreSQL em produção

ESTRUTURA:
Monorepo.

Sugestão:

/apps
    /client
    /server

/packages
    /shared

/assets

/docs

/scripts

Usar código modular.

Evitar colocar tudo em um único arquivo.

---

# 4. COMANDO PARA RODAR

O projeto precisa funcionar preferencialmente com:

npm install
npm run dev

E iniciar:

CLIENTE
http://localhost:5173

SERVIDOR
http://localhost:3000

Se forem necessários comandos adicionais, criar README explicando exatamente.

---

# 5. MULTIPLAYER

O jogo precisa ser multiplayer real.

Cada jogador deve conseguir ver:

- outros jogadores entrando
- outros jogadores saindo
- movimentação dos outros jogadores
- animações
- ataques
- dano
- mortes
- transformações
- mensagens no chat
- itens no chão

O servidor deve ser autoritativo.

Não confiar no cliente para:

- EXP
- dano
- dinheiro
- level
- inventário
- loot
- atributos
- posição impossível
- cooldowns

Implementar validações básicas contra cheats.

---

# 6. MOVIMENTO

O jogo será 2D top-down/isométrico leve.

Movimento em 8 direções:

↓ baixo
↘ baixo-direita
→ direita
↗ cima-direita
↑ cima
↖ cima-esquerda
← esquerda
↙ baixo-esquerda

Teclas:

WASD

e opcionalmente:

setas.

Também implementar:

SHIFT = correr.

Movimentação precisa ser suave.

Colisão com:

- árvores
- paredes
- casas
- rochas
- água
- objetos bloqueadores

---

# 7. ANIMAÇÕES DOS PERSONAGENS

Cada personagem deve suportar:

IDLE
ANDAR
CORRER
PULAR
ATACAR
RECEBER DANO
MORRER

Em 8 direções quando houver sprites disponíveis.

Criar sistema genérico de animação que permita trocar os sprites posteriormente sem modificar a lógica do jogo.

Estrutura sugerida:

character/
    hunter/
        idle/
        walk/
        run/
        jump/
        attack/

O sistema NÃO deve depender de uma sprite específica.

---

# 8. CLASSES

Existirão inicialmente 3 classes.

## CAÇADOR

Humano especializado em combate contra criaturas sobrenaturais.

Características:

- espada
- besta/arco
- armas de prata
- armadilhas
- dano físico
- crítico

Atributos fortes:

DEX
STR

---

## VAMPIRO

Começa em forma humana.

No LEVEL 10 libera:

TRANSFORMAÇÃO VAMPÍRICA.

Forma transformada deve alterar:

- sprite
- atributos
- habilidades
- efeitos

Habilidades sugeridas:

Mordida
Dreno de Sangue
Passo Sombrio
Névoa
Frenesi
Morcegos

---

## LOBISOMEM

Começa humano.

No LEVEL 10 libera:

TRANSFORMAÇÃO EM LOBISOMEM.

Forma transformada:

- troca completamente a sprite
- esconde equipamentos visuais
- aumenta atributos

Habilidades:

Garras
Mordida
Uivo
Investida
Regeneração
Fúria Lunar

---

# 9. LEVEL

Level máximo:

400.

Criar curva progressiva de EXP.

Marcos especiais:

LEVEL 10
primeira transformação.

LEVEL 50
primeira evolução importante.

LEVEL 100
Herança I.

LEVEL 200
Herança II.

LEVEL 300
Herança III.

LEVEL 400
Herança IV.

---

# 10. ATRIBUTOS

Criar:

HP
MANA
STAMINA

STR
DEX
INT
VIT

ARMOR
MAGIC RESIST
CRITICAL
DODGE
ATTACK SPEED
MOVEMENT SPEED

Atributos devem influenciar combate de verdade.

---

# 11. COMBATE

Combate em tempo real.

Implementar:

ataque básico
habilidades
cooldowns
alcance
dano
defesa
crítico
esquiva
morte
respawn

Monstros devem ter:

HP
dano
defesa
AI
range de perseguição
range de retorno
loot
EXP

---

# 12. MONSTROS

Criar inicialmente pelo menos:

Rato Sombrio
Morcego
Lobo
Esqueleto
Bandido
Ghoul
Cultista
Aranha Gigante
Vampiro Selvagem
Lobisomem Selvagem

Adicionar:

Elite
Mini Boss
Boss.

---

# 13. IA DOS MONSTROS

Estados:

IDLE
PATROL
CHASE
ATTACK
RETURN
DEAD

Não deixar monstros atravessarem paredes.

Quando jogador sair da área de perseguição:

monstro retorna ao spawn.

Respawn automático.

---

# 14. LOOT

Monstros devem deixar itens fisicamente no chão.

Jogador pode pegar.

Loot deve ter:

nome
raridade
quantidade
valor
ícone

Raridades:

COMUM
INCOMUM
RARO
ÉPICO
LENDÁRIO
MÍTICO

Cores visuais diferentes.

---

# 15. INVENTÁRIO

40 slots.

Permitir:

pegar item
mover item
empilhar item
dividir stack
usar item
dropar item
vender item
equipar item

Drag and drop.

---

# 16. EQUIPAMENTOS

Slots:

HEAD
CHEST
LEGS
BOOTS
GLOVES
WEAPON
OFFHAND
AMULET
RING
BELT

Itens devem alterar atributos.

Alguns equipamentos podem ter:

nível mínimo
classe exigida.

---

# 17. SISTEMA DE ITENS

Cada item deve possuir estrutura de dados.

Exemplo:

id
name
description
type
rarity
value
stackable
maxStack
requiredLevel
requiredClass

attributes:
attack
defense
strength
dexterity
intelligence
vitality

Nunca codificar dezenas de itens diretamente na UI.

Criar catálogo/data-driven.

---

# 18. NPCS

Criar NPCs inicialmente:

Ferreiro
Mercador
Curandeira
Alquimista
Guarda
Mestre de Classe

Interação por proximidade.

Tecla:

E

Abrir janela correspondente.

---

# 19. LOJA NPC

Permitir:

COMPRAR
VENDER

Itens como:

poções
armas
armaduras
comida
materiais

Moeda inicial:

OURO.

---

# 20. CHAT

Chat multiplayer.

Canais:

LOCAL
GLOBAL
PARTY
CLAN
PRIVATE

Comandos:

/w player mensagem
/party
/clan

Implementar rate limiting simples para spam.

---

# 21. PARTY

Jogadores podem criar grupo.

Funções:

convidar
aceitar
sair
expulsar

Compartilhar EXP quando próximos.

Mostrar:

nome
level
HP

dos membros.

---

# 22. CLAN / GUILD

Sistema inicial:

criar clan
convidar
aceitar
sair
expulsar
promover

Hierarquia:

Líder
Oficial
Membro

Chat de clan.

---

# 23. TRADE

Jogador com jogador.

Fluxo:

solicitar trade
aceitar
colocar item
colocar ouro
confirmar
segunda confirmação
concluir troca

O servidor deve validar tudo.

Não permitir duplicação de itens.

---

# 24. PvP

Sistema PvP.

Jogadores podem atacar jogadores em áreas permitidas.

Criar:

Safe Zone
PvP Zone

Não permitir ataque dentro da cidade inicial.

---

# 25. MORTE

Quando morrer:

mostrar tela de morte.

Respawn em templo/cidade.

Aplicar pequena penalidade de EXP.

Nunca apagar personagem.

---

# 26. MAPA

Criar um mapa inicial jogável.

Regiões:

VILA DE ECLIPSE
FLORESTA AMALDIÇOADA
CEMITÉRIO
CAVERNA
RUÍNAS
CASTELO

Mapa inicial precisa possuir caminhos ligando essas áreas.

---

# 27. MAPAS E TILEMAPS

Criar sistema compatível com:

Tiled Map Editor.

Suportar:

JSON maps
tilesets
collision layer
spawn layer
NPC layer
teleport layer
monster spawn layer.

---

# 28. MINIMAPA

HUD deve possuir minimapa.

Mostrar:

jogador
party
NPC importante
pontos de interesse.

---

# 29. HUD

Visual:

dark fantasy
preto
cinza
vermelho sangue
dourado envelhecido.

Elementos:

HP
Mana
Stamina
Level
EXP
Hotbar
Minimapa
Chat
Inventário
Equipamentos
Menu

Janelas devem poder:

abrir
fechar
arrastar

Algumas devem poder minimizar.

---

# 30. HOTBAR

Teclas:

1
2
3
4
5
6
7
8
9

Permitir arrastar:

habilidades
poções
itens utilizáveis.

---

# 31. HABILIDADES

Sistema genérico de skills.

Cada habilidade:

id
nome
ícone
manaCost
cooldown
damage
range
levelRequirement
classRequirement

Servidor valida uso.

---

# 32. TRANSFORMAÇÃO

Vampiro e Lobisomem:

LEVEL 10.

Criar botão/habilidade de transformação.

Ao transformar:

trocar sprite
alterar atributos
habilidades disponíveis
efeitos visuais

Ao voltar:

restaurar forma humana.

Equipamentos continuam no inventário, mas não precisam aparecer visualmente durante forma monstruosa.

---

# 33. CICLO DIA E NOITE

Criar ciclo visual.

Estados:

DIA
ENTARDECER
NOITE
AMANHECER.

---

# 34. LUA

Sistema lunar:

Lua Nova
Crescente
Cheia
Minguante.

Lua cheia pode oferecer bônus ao Lobisomem.

No futuro poderá afetar Vampiros.

---

# 35. CLIMA

Criar sistema básico:

Normal
Chuva
Névoa
Tempestade

Com efeitos visuais simples.

---

# 36. AUTO HUNT

Criar sistema opcional:

AUTO HUNT.

Jogador escolhe:

monstro alvo
usar poção abaixo de X% HP
usar habilidade
distância máxima de movimentação

O servidor precisa limitar para evitar comportamento impossível.

Criar interruptor:

AUTO HUNT ON/OFF.

---

# 37. MISSÕES

Criar sistema genérico de quests.

Tipos:

MATAR
COLETAR
ENTREGAR
CONVERSAR

Quest inicial:

"O Sangue na Floresta"

Objetivo:

matar 10 criaturas.

Recompensa:

EXP
ouro
item.

---

# 38. PERSISTÊNCIA

Salvar no banco:

conta
personagens
classe
level
EXP
posição
mapa
ouro
atributos
inventário
equipamentos
skills
quests
guild
configurações.

Autosave periódico.

Salvar também no logout.

---

# 39. AUTENTICAÇÃO

Criar:

CADASTRO
LOGIN
LOGOUT

Senha deve usar hash seguro.

Usar:

bcrypt ou equivalente.

Nunca salvar senha em texto puro.

---

# 40. CHARACTER SELECT

Após login:

lista de personagens.

Permitir:

CRIAR PERSONAGEM
SELECIONAR
ENTRAR NO JOGO

Campos:

Nome
Classe

Limite inicial:

3 personagens por conta.

---

# 41. SEGURANÇA

Servidor deve validar:

velocidade máxima
teleporte ilegal
cooldown
dano
inventário
ouro
trade
loot
EXP.

Cliente nunca define recompensas sozinho.

---

# 42. ADMIN

Criar sistema simples de administrador.

Comandos:

/kick
/teleport
/giveitem
/givegold
/spawn
/setlevel
/heal

Apenas usuários admin.

---

# 43. DEBUG

Criar painel de desenvolvimento acessível apenas em modo DEV.

Mostrar:

FPS
ping
posição
mapa
quantidade de players
quantidade de monstros.

---

# 44. ÁUDIO

Preparar estrutura:

music/
sfx/
ambient/

Eventos:

attack
hit
death
loot
levelup
transform
UI click.

Se não houver arquivos de áudio, usar placeholders sem quebrar o jogo.

---

# 45. ASSETS

Não bloquear o desenvolvimento pela falta de artes finais.

Quando não existir uma arte:

usar placeholder visual organizado.

MAS:

todos os assets devem ficar separados da lógica.

Exemplo:

assets/
characters/
monsters/
items/
maps/
ui/
effects/
audio/

Assim depois poderei substituir facilmente.

---

# 46. ARQUITETURA DE CÓDIGO

Evitar arquivos gigantes.

Separar:

Player
Monster
Combat
Inventory
Item
Quest
Skill
NPC
Trade
Party
Guild
Chat
World
Map
Database
Network.

Criar código reutilizável.

---

# 47. SHARED TYPES

Cliente e servidor devem compartilhar interfaces/types.

Exemplo:

PlayerState
MonsterState
ItemDefinition
InventoryItem
SkillDefinition
NetworkEvents.

Colocar em:

packages/shared.

---

# 48. NETWORK EVENTS

Centralizar eventos.

Exemplo:

player:move
player:attack
player:skill
player:transform

monster:update
monster:death

inventory:update

loot:spawn
loot:pickup

chat:message

trade:request

party:update

guild:update

Evitar strings espalhadas pelo projeto.

---

# 49. PERFORMANCE

Não enviar estado completo de todos os jogadores a cada frame.

Criar sistema de atualização eficiente.

Usar:

tick rate razoável
interpolação
interest management quando necessário.

Objetivo inicial:

suportar dezenas de jogadores no mesmo mapa em desenvolvimento.

---

# 50. RESOLUÇÃO

Jogo responsivo.

Desktop prioritário.

Resolução recomendada:

1280×720

Permitir fullscreen.

---

# 51. CAMERA

Câmera acompanha jogador.

Adicionar:

smooth follow.

Limitar câmera aos limites do mapa.

---

# 52. PRIMEIRA CIDADE

Criar Vila de Eclipse contendo:

Templo
Ferreiro
Mercador
Alquimista
Guarda
Mestre de Classe
Praça Central
Saída Norte
Saída Sul.

Safe Zone.

---

# 53. FLORESTA

Floresta Amaldiçoada.

Monstros:

Lobo
Morcego
Aranha
Bandido.

Adicionar:

árvores
pedras
ruínas
trilhas.

---

# 54. CEMITÉRIO

Monstros:

Esqueleto
Ghoul
Cultista.

Mini Boss:

Necromante.

---

# 55. BOSS

Criar primeiro boss:

O CARRASCO DA LUA.

Possuir:

HP alto
ataque especial
área de dano
loot raro
respawn longo.

---

# 56. BANCO DE DADOS

Criar migrations.

Criar seed.

Seed deve criar:

itens
monstros
skills
NPCs
quests.

Não depender de inserir tudo manualmente.

---

# 57. TESTES

Criar testes para partes críticas:

inventário
loot
EXP
level
trade
combate
login.

Principalmente impedir:

duplicação de item
ouro negativo
EXP inválida
equipamento incompatível.

---

# 58. ERROS

Não permitir que erro de um asset derrube o cliente.

Se imagem não existir:

usar placeholder.

Se áudio não existir:

ignorar com segurança.

---

# 59. README

Criar README profissional contendo:

requisitos
instalação
como executar
estrutura
banco
controles
conta de teste
como adicionar item
como adicionar monstro
como adicionar mapa
como adicionar habilidade.

---

# 60. AGENTS.MD

Criar AGENTS.md explicando para futuros agentes/Codex:

arquitetura
regras
arquivos importantes
padrões de código
decisões técnicas.

---

# 61. CONTA DE TESTE

No seed DEV criar:

login:
admin

senha:
admin123

E marcar como admin.

Somente para desenvolvimento.

---

# 62. PERSONAGEM DE TESTE

Criar um personagem de teste opcional:

Nome:
Augusto

Classe:
Hunter

Level:
10.

Para facilitar testes.

---

# 63. CRITÉRIOS DE ACEITAÇÃO

Não considerar a tarefa concluída apenas porque o código compila.

Antes de finalizar, verificar:

[ ] npm install funciona
[ ] npm run dev funciona
[ ] cliente abre
[ ] servidor abre
[ ] cadastro funciona
[ ] login funciona
[ ] criação de personagem funciona
[ ] personagem aparece no mapa
[ ] WASD funciona
[ ] colisão funciona
[ ] multiplayer sincroniza
[ ] monstros aparecem
[ ] monstros perseguem
[ ] combate funciona
[ ] monstros morrem
[ ] EXP funciona
[ ] level up funciona
[ ] loot cai
[ ] loot pode ser coletado
[ ] inventário funciona
[ ] equipamento funciona
[ ] NPC funciona
[ ] comprar funciona
[ ] vender funciona
[ ] chat funciona
[ ] skills funcionam
[ ] transformação funciona
[ ] logout salva
[ ] login restaura personagem

Corrija os problemas encontrados antes de declarar que terminou.

---

# 64. NÃO FAZER

Não quero:

- projeto só visual;
- centenas de arquivos vazios;
- botões sem função;
- páginas falsas;
- mockups no lugar do jogo;
- comentários dizendo "implementar depois" para sistemas essenciais;
- TODOs substituindo funcionalidades fundamentais;
- uma única página HTML fingindo ser MMORPG;
- multiplayer falso;
- inventário somente visual;
- itens falsos que não são persistidos.

---

# 65. PRIORIDADE

Se não for possível implementar absolutamente tudo de uma vez, priorize nesta ordem:

1. arquitetura funcional;
2. multiplayer;
3. login/banco;
4. personagem/movimento;
5. mapas/colisão;
6. monstros;
7. combate;
8. loot;
9. inventário/equipamento;
10. NPC/economia;
11. skills;
12. transformação;
13. chat;
14. party;
15. trade;
16. guild;
17. quests;
18. PvP;
19. sistemas ambientais;
20. polimento.

Mas NÃO abandone a tarefa pela metade.

Continue implementando o máximo possível no projeto existente.

---

# 66. FORMA DE TRABALHO

Antes de codificar:

1. examine o repositório;
2. defina arquitetura;
3. crie plano interno;
4. comece a implementação.

Depois:

implemente
teste
execute
corrija erros
teste novamente.

Não me entregue somente instruções de como eu poderia fazer.

Faça as alterações diretamente no projeto.

---

# 67. RESULTADO FINAL

Ao terminar quero abrir o projeto e conseguir:

npm install
npm run dev

Abrir o navegador.

Criar minha conta.

Criar um Caçador, Vampiro ou Lobisomem.

Entrar no mundo.

Andar pelo mapa.

Encontrar outros jogadores.

Matar criaturas.

Ganhar EXP.

Coletar equipamentos.

Subir de level.

Usar habilidades.

Transformar Vampiro/Lobisomem.

Conversar com jogadores.

Comprar e vender.

Salvar o personagem.

Fechar.

Abrir novamente.

E continuar de onde parei.

O projeto deve ser uma BASE REAL E EVOLUTIVA DE MMORPG, não uma demonstração descartável.

Comece agora pelo projeto completo.

Faça as decisões técnicas necessárias sem interromper constantemente para pedir autorização.

Ao final, execute testes, corrija erros encontrados e apresente:

1. o que foi implementado;
2. estrutura principal do projeto;
3. comandos para executar;
4. credenciais DEV;
5. funcionalidades que foram testadas;
6. eventuais limitações que realmente ainda restarem.