Você mesmo informou que ainda faltam:

- novos sprites;
- animações frame por frame;
- monstros;
- tiles;
- arte de login.

Então NÃO considero esta entrega finalizada.

Quero que você continue agora exatamente nesses pontos, trabalhando sobre o projeto atual e preservando tudo que já foi implementado.

NÃO faça apenas planejamento.

NÃO me entregue somente documentação.

NÃO pare novamente dizendo que ficará para fases futuras.

Implemente as próximas fases diretamente no projeto.

# FASE 2 — NOVOS SPRITES DOS PERSONAGENS

Quero substituir os sprites atuais por sprites visualmente melhores e coerentes com a direção artística dark fantasy/gótica de ECLIPSE — Blood & Moon.

Personagens:

1. Caçador
2. Vampiro Humano
3. Vampiro Transformado
4. Lobisomem Humano
5. Lobisomem Transformado

Cada personagem precisa ter identidade visual própria.

## Direções obrigatórias

Criar sprites para:

- baixo
- baixo-direita
- direita
- cima-direita
- cima
- cima-esquerda
- esquerda
- baixo-esquerda

IMPORTANTE:

CIMA deve mostrar realmente as COSTAS do personagem.

BAIXO deve mostrar realmente a FRENTE.

Não copie sprite lateral para cima/baixo.

Não rotacione a mesma arte para fingir outra direção.

As diagonais devem possuir leitura correta.

# FASE 3 — ANIMAÇÕES FRAME POR FRAME

Para cada personagem criar:

- Idle
- Walk
- Run
- Jump
- Attack
- Hit
- Death
- Cast/Skill quando aplicável
- Transform para Vampiro e Lobisomem

Não faça animação falsa movendo apenas uma imagem estática.

Quero frames realmente diferentes.

Exemplo de caminhada:

- contato
- passagem
- extensão
- passagem oposta

Corrida deve parecer mais rápida e agressiva.

Pulo deve possuir:

1. preparação
2. impulso
3. subida
4. ápice
5. queda
6. pouso

Ataques devem demonstrar peso.

Mantenha:

- mesma escala;
- mesma linha dos pés;
- mesmo personagem;
- mesmo equipamento;
- mesma roupa;
- mesma paleta;
- proporções consistentes.

Organize corretamente os spritesheets e as animações no código.

# FASE 4 — MONSTROS

Agora quero substituir placeholders de monstros por monstros visualmente coerentes com o universo.

Criar pelo menos:

- Rato Sombrio
- Morcego Sangrento
- Lobo Sombrio
- Lobo Corrompido
- Aranha de Cripta
- Esqueleto
- Ghoul
- Cultista
- Bandido
- Vampiro Selvagem
- Lobisomem Selvagem
- Necromante

Cada monstro precisa de pelo menos:

- idle;
- walk;
- attack;
- hit;
- death.

Criar também elites visualmente distintas.

Não faça apenas recolor simples.

Adicionar diferenças de:

- tamanho;
- armadura;
- chifres;
- cicatrizes;
- aura;
- armas;
- detalhes corporais.

# FASE 5 — BOSSES

Criar pelo menos um boss realmente diferenciado:

O CARRASCO DA LUA

Características:

- grande;
- ameaçador;
- armadura gótica;
- arma pesada;
- aura lunar/vermelha;
- sprite maior;
- animações próprias.

Criar:

- idle;
- walk;
- attack;
- special attack;
- hit;
- death.

Integrar ao sistema de boss existente ou criar o sistema necessário.

Adicionar boss HP bar.

# FASE 6 — TILESETS

Quero tiles originais e coerentes com o jogo.

Criar tilesets para:

## Vila
- pedra;
- madeira;
- casas;
- telhados;
- ruas;
- muros;
- cercas;
- postes;
- fontes.

## Floresta
- grama;
- terra;
- árvores;
- arbustos;
- raízes;
- pedras;
- folhas;
- água;
- ponte.

## Cemitério
- lápides;
- mausoléus;
- túmulos;
- cruzes;
- árvores mortas;
- velas;
- cercas.

## Caverna
- chão;
- paredes;
- pedras;
- cristais;
- água;
- ossos.

## Castelo
- piso de pedra;
- paredes;
- pilares;
- escadas;
- vitrais;
- portões;
- grades;
- salões.

## Ruínas
- paredes quebradas;
- arcos;
- colunas;
- estátuas;
- altares;
- vegetação.

Todos precisam seguir a mesma escala e perspectiva.

# FASE 7 — MAPAS

Depois de criar os tiles:

POLIR OS MAPAS EXISTENTES.

Não quero apenas trocar a textura do chão.

Adicionar:

- composição;
- caminhos;
- decoração;
- landmarks;
- colisões;
- profundidade;
- Y-sort;
- iluminação;
- áreas seguras;
- áreas de combate;
- entradas;
- saídas;
- atalhos;
- pontos de interesse.

Quero pelo menos:

- Vila de Eclipse;
- Floresta Amaldiçoada;
- Cemitério;
- Caverna;
- Ruínas;
- Castelo Carmesim.

# FASE 8 — ARTE DE LOGIN

Quero uma tela de login realmente artística.

Não quero um formulário normal com fundo escuro.

Criar composição visual dark fantasy com:

- castelo ao fundo;
- lua grande;
- névoa;
- árvores;
- morcegos;
- ruínas;
- iluminação;
- pequenas partículas.

Logo:

ECLIPSE

Subtítulo:

BLOOD & MOON

Campos:

- usuário;
- senha.

Botões:

- Entrar;
- Criar Conta.

Todos os componentes devem seguir o design gótico do jogo.

Adicionar:

- hover;
- pressed state;
- transições;
- partículas discretas.

# FASE 9 — CHARACTER SELECT

Polir também a seleção de personagens.

Mostrar:

- sprite animada;
- nome;
- classe;
- level;
- localização;
- fundo gótico;
- molduras próprias.

# FASE 10 — INTEGRAÇÃO

Não quero apenas imagens salvas em assets.

Integre tudo no jogo real.

Sprites precisam aparecer nos personagens.

Monstros precisam usar as novas animações.

Tiles precisam estar nos mapas.

Login precisa ser a tela real.

Boss precisa funcionar.

Não considere um asset concluído se ele não estiver sendo usado.

# REGRA CONTRA PLACEHOLDERS

Antes de finalizar faça busca no projeto por:

placeholder
dummy
temporary
todo
mock
sample
test-art

Verifique cada ocorrência visual.

Substitua tudo que estiver aparecendo para o jogador.

# REGRA DE QUALIDADE

Use referências gerais de:

- Vampire Hunter D
- Sirius the Jaeger
- Castlevania
- Hellsing
- Lineage
- Ragnarok
- MU
- Diablo

somente como inspiração de:

- atmosfera;
- composição;
- qualidade;
- silhueta;
- organização.

Não copie assets diretamente.

Toda arte precisa pertencer ao universo ECLIPSE.

# VALIDAÇÃO OBRIGATÓRIA

Antes de declarar conclusão:

1. execute o projeto;
2. abra login;
3. entre no jogo;
4. teste cada personagem;
5. teste movimento;
6. teste animações;
7. verifique cima/baixo;
8. visite mapas;
9. veja monstros;
10. mate monstros;
11. veja loot;
12. lute contra boss;
13. verifique console;
14. corrija assets faltando;
15. corrija erros.

Não responda novamente apenas:

"isso ficará para próxima fase".

Essas SÃO as próximas fases.

Execute-as agora no projeto atual.

Ao final me mostre:

## IMPLEMENTADO
Tudo que realmente foi colocado no projeto.

## INTEGRADO
Assets que estão efetivamente sendo usados pelo jogo.

## TESTADO
Fluxos que você executou.

## PENDÊNCIAS
Somente itens que foram tecnicamente impossíveis de concluir, acompanhados do motivo exato.

Comece agora pela criação e integração dos NOVOS SPRITES DOS PERSONAGENS e continue pelas fases seguintes sem interromper após a primeira alteração.