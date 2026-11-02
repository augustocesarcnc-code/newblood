# Bloodmoon: interface imersiva e combate físico

## Referências consultadas na internet

- [Flare: Empyrean Campaign](https://github.com/flareteam/flare-game): ARPG 2D
  de fantasia sombria, leitura do mundo, interface de combate e equipamento.
- [RPGUI](https://github.com/RonenNess/RPGUI), incluindo sua
  [prancha pública](https://raw.githubusercontent.com/RonenNess/RPGUI/master/screenshot.jpg):
  princípios de molduras, barras, ícones e janelas de RPG.
- Diablo e Lineage são as referências de direção solicitadas: globos de recursos,
  molduras em metal envelhecido, fantasia gótica e mundo ocupando a tela.

Não foram importadas interfaces ou imagens desses jogos comerciais, nem código
ou imagens do RPGUI. A HUD é CSS/SVG própria. A arte humana continua Flare,
com a licença e créditos já incluídos no projeto.

## Experiência de jogo

O canvas ocupa a janela inteira. A HUD sobrepõe o mundo: identidade, alvo,
minimapa, ciclo lunar, chat recolhível, contrato, menus e globos de vida/energia.
Há botão de tela cheia e Alt+Enter, conforme suporte do navegador.

I, C, G, M e K abrem inventário, personagem, clã, mapas e grimório. São janelas
internas, arrastáveis pelo título; Escape fecha. O mundo continua atualizando e
é possível movimentar o personagem enquanto uma janela está aberta. Campos de
texto recebem suas teclas normalmente. A rotação/redimensionamento recentraliza
janelas para evitar deixá-las fora da tela. Nenhum fluxo de jogo abre outra aba.
O estúdio `/sprites` é uma ferramenta separada de desenvolvimento.

## Combate e animação

- As poses `swing`, `shoot`, `cast` e `block` do rig Flare foram conectadas às
  ações reais do servidor, com quatro quadros (dois na defesa) em oito direções.
- Espadas usam corte, arcos/bestas usam disparo e cetros usam conjuração.
  As camadas de armadura, arma e cabeça permanecem sincronizadas.
- O caçador tem técnicas físicas de arco/besta e espada, cura de campo e posturas
  defensivas/ofensivas. O servidor exige a arma correta, alcance, alvo e recursos.
- Um arco de guerra pode ser comprado no mercador e aparece no loot.
- Disparos básicos possuem projétil e dano causa números flutuantes. Não são
  números de crítico fictícios: mostram o dano aplicado, limitado à vida restante.
- O estúdio permite inspecionar ataques e exportar células maiores (192 px) para
  acomodar o movimento das armas.

## Lobisomem

Os quadros de movimento passaram a usar limites encontrados pela transparência,
em vez de uma grade uniforme incorreta. Cada quadro possui pivô nos pés. Os
PNGs aprovados não foram modificados. Em duas direções laterais da corrida, o
arquivo original tem figuras sobrepostas: foram usadas as poses laterais limpas
de caminhada na cadência de corrida. As outras seis mantêm os desenhos próprios.

Espaço executa um salto na forma de lobisomem: até duas casas, 15 de energia,
600 ms de duração e 4,5 s de recarga. O servidor valida cada casa e a aterrissagem.
Não permite atravessar paredes, portais, ocupantes, quinas bloqueadas ou santuários.
O salto é desenhado em arco e mantém a sombra no chão; não concede invulnerabilidade.

## Clã

Fundar exige nível 5 e 150 de ouro no santuário. O líder convida jogadores online;
o convite é pessoal e expira em 60 segundos. Há limite de 20 membros, lista de
membros offline, remoção pelo líder e transferência automática de liderança ao
sair. O último membro dissolve o clã. Membros e liderança persistem no arquivo do
mundo; convites pendentes não sobrevivem ao reinício. Guerras, banco e território
de clãs ainda não foram implementados.

## Verificações desta etapa

93 testes automatizados passaram, incluindo transporte HTTP de clãs, sucessão e
persistência após reinício, arco/espada reais e salto com bloqueio durante o voo.
No navegador foram conferidos 1440×1000 e 390×844, os cinco atalhos, troca rápida
de janelas, arraste, criação de clã, transformação/salto e quadros equipados de
ataque nas oito direções. A nova viewport completa mediu 3,4 ms de mediana e
4,7 ms de percentil 95 por callback de desenho no Chromium local; é um cenário
mais amplo que o da medição anterior, sem garantia de FPS em outros aparelhos.
