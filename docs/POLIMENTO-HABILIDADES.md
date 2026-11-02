# Polimento, habilidades e lua

## Renderização

O chão é desenhado uma vez por mapa/tamanho e reaproveitado. Árvores e construções
estáticas são sprites em cache. Os humanos têm cache de quadros completos,
com limite de memória. Filtros de cor deixam de ser executados em cada desenho.
O jogo pausa o desenho quando a aba está oculta e limita a resolução interna a
1,5 vez o tamanho CSS em telas de alta densidade. A câmera e os movimentos continuam
interpolados. O carregamento inicial de todos os assets ainda pode levar tempo.

No Chromium deste ambiente, com viewport 1440×1050, mesma conta/cena e amostras de
3,5 segundos após aquecimento, o tempo mediano do callback de desenho caiu de
6,7 ms para 0,5 ms; o percentil 95 caiu de 10,2 ms para 0,8 ms. Isso mede apenas o
trabalho JavaScript/desenho nesse ambiente, não garante FPS ou latência em outros
aparelhos nem representa um teste de carga multiplayer.

Cinzavéu passou de 92 para 30 árvores; o bosque passou de aproximadamente 17% para
9% das células elegíveis. A grade de colisão usa a mesma vegetação do cliente.
O colar ficou pequeno, acompanha a posição animada do torso e fica oculto de
costas/perfil. Camadas repetidas de equipamento foram eliminadas.

## Habilidades

Há dez habilidades por classe, desbloqueadas nos níveis 1, 3, 6, 10, 15, 20, 30,
45, 60 e 80. São ataques diretos, ataques em área, dreno de vida, cura, defesa e
fúria. O servidor valida alvo, linha de visão, alcance, PvP, zona segura, nível,
mana, recarga individual e intervalo global de 600 ms.

O grimório mostra efeitos, custo e recarga. Quatro atalhos configuráveis usam
Q, E, 1 e 2. Preferências e recargas são preservadas pela migração. Os bots
selecionam habilidades ofensivas desbloqueadas e renovam defesa/fúria.

Os efeitos têm 8 quadros por habilidade: 240 quadros, em três folhas PNG com
metadados em `assets/skills`. As poses corporais do rig Flare para espada, arco, conjuração e defesa foram
conectadas ao combate na reformulação imersiva. Os efeitos continuam separados
do personagem; veja `INTERFACE-IMERSIVA.md`.

## Bênçãos lunares

| Fase | Caçador | Vampiro | Lobisomem |
| --- | --- | --- | --- |
| Nova | +0% | +20% | +0% |
| Crescente | +8% | +12% | +4% |
| Quarto crescente | +15% | +6% | +8% |
| Gibosa crescente | +6% | +3% | +15% |
| Cheia | +0% | +0% | +25% |
| Gibosa minguante | +6% | +3% | +15% |
| Quarto minguante | +15% | +6% | +8% |
| Minguante | +8% | +12% | +4% |

Os bônus entram no dano de ataques e habilidades, em PvE e PvP. Fúria é um buff
separado de +20%, temporário, multiplicado depois do bônus lunar. O HUD mostra a
fase atual e o grimório inclui a tabela completa.
