# ECLIPSE — MODO PRODUÇÃO RÁPIDA / MVP

A partir de agora, o objetivo é acelerar o desenvolvimento do ECLIPSE e chegar a uma versão jogável funcional o mais rápido possível.

NÃO voltar a redesenhar o Caçador.

NÃO recomeçar a direção visual.

NÃO tentar produzir todos os assets finais antes do jogo funcionar.

A prioridade agora é:

REAPROVEITAR
INTEGRAR
TESTAR
TORNAR JOGÁVEL

e depois refinar.

---

# 1. BASE HUMANA ÚNICA

Utilizar a sprite humana já aprovada como BASE MASTER para as 3 classes humanas:

- Caçador
- Vampiro
- Lobisomem humano

Não criar três corpos humanos completamente diferentes neste momento.

Reaproveitar:

- anatomia
- proporção
- altura
- pivô
- estrutura das 8 direções
- caminhada
- idle
- base de corrida
- base de ataque quando possível

---

# 2. CAÇADOR

Manter a versão atual.

Visual:

- sobretudo
- chapéu
- couro
- botas
- cinto
- coldres
- armas
- acessórios de caça

O Caçador passa a ser a BASE TÉCNICA do sistema humano.

---

# 3. VAMPIRO HUMANO

Criar o Vampiro usando a MESMA base corporal e animações.

Alterar somente o necessário para criar identidade própria:

- roupa
- paleta
- capa ou sobretudo
- gola
- colete
- acessórios
- arma
- detalhes aristocráticos

Paleta sugerida:

- preto
- vinho
- vermelho escuro
- prata
- dourado envelhecido

Não alterar a anatomia base.

Objetivo:

parecer outra classe usando o mesmo esqueleto técnico.

---

# 4. LOBISOMEM HUMANO

Utilizar a MESMA base humana.

Alterar:

- roupas
- acessórios
- botas
- luvas
- visual mais bruto
- paleta terrosa/cinza/couro

Não criar outro corpo humano neste momento.

---

# 5. LOBISOMEM TRANSFORMADO

Esse personagem NÃO reutiliza a sprite humana.

Criar sprite separada.

Precisa ser maior que humano.

Características:

- postura agressiva
- braços longos
- garras
- cabeça lupina
- musculatura
- pernas fortes
- silhueta monstruosa

Prioridade de animações:

- idle
- walk
- attack
- hit
- death

Deixar animações adicionais para depois.

---

# 6. SISTEMA EM CAMADAS

Para os humanos, organizar visualmente:

BODY

HAIR

HEAD

CHEST

COAT

LEGS

BOOTS

GLOVES

WEAPON_MAIN

WEAPON_SECONDARY

ACCESSORY

Todas as camadas devem compartilhar:

- mesmo frame
- mesmo pivô
- mesma direção
- mesma escala

Assim será possível criar rapidamente:

- classes
- skins
- equipamentos
- NPCs

sem redesenhar tudo.

---

# 7. ANIMAÇÕES MÍNIMAS PARA O MVP

Para humanos:

- idle
- walk
- attack
- hit
- death

RUN pode ser adicionado depois se necessário.

Não criar dezenas de animações agora.

Para monstros:

- idle
- walk
- attack
- death

É suficiente para a primeira versão jogável.

---

# 8. 8 DIREÇÕES

Jogadores humanos continuam usando 8 direções.

Não reduzir isso.

Para monstros placeholders, caso algum asset disponível possua menos direções, ele pode ser utilizado temporariamente no MVP desde que:

- seja claramente marcado como placeholder
- não quebre o jogo
- seja substituível depois

---

# 9. MONSTROS — PRODUÇÃO RÁPIDA

Não gastar tempo criando todos os monstros do zero agora.

Utilizar assets licenciados para uso comercial ou livre.

Fontes aceitáveis:

- OpenGameArt
- itch.io
- Kenney
- packs comprados
- CC0
- royalty-free
- assets com licença comercial clara

NÃO usar sprites extraídas de jogos comerciais sem autorização.

NÃO ripar sprites de:

- Diablo
- Ragnarok
- Ultima Online
- Tibia
- Castlevania
- outros jogos comerciais

Esses jogos servem apenas como referência visual.

---

# 10. MONSTROS INICIAIS DO MVP

Integrar inicialmente de 6 a 10 monstros.

Sugestão:

- lobo
- morcego
- esqueleto
- zumbi
- ghoul
- aranha
- demônio menor
- fera da floresta

E 1 ou 2 bosses.

Não criar dezenas de inimigos agora.

---

# 11. PLACEHOLDERS

Assets temporários são permitidos.

Mas devem ser marcados claramente como:

TEMP
PLACEHOLDER
DEV

Nunca misturar placeholder com asset final sem identificação.

---

# 12. MAPAS INICIAIS

Não construir o mundo inteiro agora.

Criar somente os mapas necessários para o loop inicial.

Prioridade:

1. Vila principal
2. Floresta
3. Cemitério
4. Dungeon/Catacumba

Esses quatro mapas já são suficientes para um MVP funcional.

---

# 13. CONTEÚDO DO MVP

A versão inicial precisa permitir:

- login
- seleção de personagem/classe
- entrar no mapa
- andar
- atacar
- receber dano
- matar monstro
- ganhar XP
- receber drop
- abrir inventário
- equipar item
- falar com NPC
- aceitar uma quest
- completar quest
- trocar de mapa

Se isso funcionar, o jogo já tem um loop jogável.

---

# 14. HUD

Não redesenhar a HUD do zero neste momento.

Usar a interface atual e os assets do pacote:

GONKEN_Fantasy_RPG_UI_Pro.zip

apenas onde for necessário.

Prioridade:

- vida
- recurso
- hotbar
- inventário
- quest tracker
- minimapa

Refino estético completo fica para depois.

---

# 15. NPCs

Não criar dezenas de NPCs únicos agora.

Criar inicialmente:

- guarda
- mercador
- mestre de classe
- quest giver
- ferreiro

Eles podem reutilizar a base humana com equipamentos e roupas diferentes.

---

# 16. VARIAÇÕES RÁPIDAS DE NPC

Usar:

- troca de roupa
- cabelo
- chapéu
- arma
- paleta
- acessórios

Não criar uma nova anatomia para cada NPC.

---

# 17. PRIORIDADE DOS SISTEMAS

Ordem de prioridade:

1. movimento
2. colisão
3. combate
4. HP
5. morte
6. respawn
7. XP
8. loot
9. inventário
10. equipamento
11. NPC
12. quest
13. mapa
14. transformação
15. multiplayer/refino

Preservar sistemas que já funcionam.

---

# 18. NÃO REESCREVER SISTEMAS ESTÁVEIS

Não reescrever:

- servidor
- login
- banco
- inventário
- multiplayer
- quest
- combate

a menos que haja bug real ou necessidade técnica.

Integrar visual novo sobre a estrutura existente.

---

# 19. LOBISOMEM — TRANSFORMAÇÃO

Para o MVP:

forma humana
→ animação curta
→ troca para sprite completa do lobisomem

Não precisa criar uma transformação cinematográfica complexa agora.

Durante a transformação:

desativar visualmente equipamentos humanos.

---

# 20. VAMPIRO — HABILIDADES

No MVP, utilizar poucas habilidades.

Sugestão:

Caçador:
- ataque básico
- tiro ou golpe
- habilidade especial

Vampiro:
- ataque básico
- mordida
- habilidade de sangue

Lobisomem:
- ataque básico humano
- transformação
- golpe de garras transformado

Não criar árvore gigantesca de habilidades agora.

---

# 21. EQUIPAMENTOS

Criar poucos itens inicialmente.

Exemplo:

- arma básica
- armadura básica
- bota
- luva
- acessório

O sistema deve funcionar antes da expansão do conteúdo.

---

# 22. RARIDADES

Manter sistema simples inicialmente:

- comum
- incomum
- raro
- épico
- lendário

Outras raridades podem ser adicionadas depois.

---

# 23. TESTES

Após cada integração importante, testar:

- sprite correta
- direção correta
- colisão
- animação
- ataque
- dano
- morte
- drop
- equipamento

Não criar dezenas de assets sem testar no jogo.

---

# 24. GIT

Criar commits menores.

Exemplo:

mvp: freeze hunter base

mvp: derive vampire human skin

mvp: derive werewolf human skin

mvp: integrate werewolf transformed

mvp: add first monster pack

mvp: combat loop playable

---

# 25. REGRA DE TEMPO

Não gastar muito tempo em detalhes cosméticos agora.

Se algo estiver:

- funcional
- visualmente aceitável
- consistente

seguir adiante.

Refino vem depois.

---

# 26. O QUE DEVE FICAR PARA DEPOIS

Adiar:

- dezenas de NPCs únicos
- dezenas de monstros exclusivos
- bosses complexos
- animações avançadas
- efeitos sofisticados
- mapas gigantes
- clima complexo
- customização extrema
- centenas de itens
- dezenas de skills
- cinematics

---

# 27. META DO MVP

A meta é ter um jogador que consiga:

entrar no jogo
→ andar pela Vila
→ sair para a Floresta
→ encontrar monstros
→ lutar
→ ganhar XP
→ receber itens
→ voltar para a Vila
→ vender/equipar
→ pegar uma quest
→ entrar no Cemitério/Dungeon

Isso é prioridade máxima.

---

# 28. PRIMEIRA ORDEM DE EXECUÇÃO

Começar agora por:

1. congelar a sprite do Caçador atual;

2. reutilizar a mesma base humana para criar:
   - Vampiro humano
   - Lobisomem humano;

3. criar apenas diferenças de roupa/equipamento;

4. manter o mesmo rig/pivô/animação;

5. criar o Lobisomem transformado como sprite independente;

6. procurar e integrar um pack LICENCIADO de monstros compatível;

7. integrar de 6 a 10 monstros iniciais;

8. colocar tudo nos mapas existentes;

9. testar combate e progressão;

10. priorizar versão jogável.

---

# REGRA FINAL

O ECLIPSE entrou em MODO MVP.

Não buscar perfeição em cada asset.

Reaproveitar tudo que puder ser reaproveitado.

Criar do zero apenas o que realmente precisar de identidade própria.

A BASE HUMANA é compartilhada.

O LOBISOMEM TRANSFORMADO é separado.

MONSTROS podem usar assets licenciados externos.

O foco agora é:

JOGO FUNCIONANDO.

Depois:

ARTE FINAL.

Depois:

POLIMENTO.