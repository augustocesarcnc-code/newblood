# Redesign ECLIPSE — Fase 1: auditoria e direção

## Diagnóstico do projeto atual

A base executável está na branch eclipse/v1-core, com Vite/TypeScript na entrada,
Canvas modular e servidor Express/Socket.IO. O banco usa Prisma/SQLite. As regras
já possuem testes de integração e devem continuar separadas da apresentação.

| Área | Evidência / problema | Decisão |
| --- | --- | --- |
| HUD | immersive.css acumula overrides, fontes de 5–9 px e menus sobre a região da lua/quests. A hotbar quebra linha apesar do desktop. | Substituir o layout e organizar uma folha de estilo própria legível, com escalas e posições responsivas. |
| Janelas | Um dialog compartilhado, arrastável, sem minimizar/maximizar. Painéis genéricos repetem cartões. | Preservar abertura/atalhos e acrescentar controles funcionais; criar composição própria para bolsa/status/skills/quests. |
| Inventário | Regras reais de 40/10 slots e drag/drop. Visual é uma grade com símbolos de texto, sem foco no personagem. | Preservar comandos; criar área de equipamentos com retrato e bolsa numerada, raridades e ações legíveis. Ícones finais entram depois. |
| Personagens | Flare em camadas com três perfis que distorcem escala/cabeça; formas usam atlas distintos. | Preservar o contrato de frame/pivô e equipamentos; substituir arte em fase própria, sem afirmar que escalonar/recolorir produz nova sprite. |
| Animações | Oito direções existentes de movimento, mas formas não têm ataques/hit/mortes exclusivos completos. | Novo catálogo de animações por modelo/estado/direção, auditado por contato visual e bounds; não inventar frames ausentes. |
| Monstros | Quatro famílias Flare, formas reutilizadas e quatro silhuetas procedurais provisórias. | Criar famílias de arte coerentes e integrar por species; nenhuma cópia de assets proprietários. |
| Mapas | Seis JSONs Tiled, tiles semânticos, texturas repetidas e cenografia procedural em scenery.js. | Manter colisão/spawns/portais; atualizar tiles e prop atlas por bioma, iluminação e composição em fase 4. |
| Autenticação | Fluxos funcionais, arte decorativa com canvas de personagem e nomes antigos em textos. | Manter endpoints/sessão; reestruturar login e seleção com nova arte original e nomes consistentes. |
| Efeitos | Atlas de skills e números de dano. Clima é overlay de canvas. | Preservar eventos e reduzir trabalho por frame; redesenhar sinalização de raridade, crit, buff e transformação por evento. |
| Multiplayer | Snapshots por mapa a cada 150 ms, interpolação e comandos autoritativos. | Nenhuma mudança de protocolo ou de recompensa por causa do redesign. |
| Distribuição | ZIP e launcher usam Node; Windows com duas versões de Node apresentou falha no SQLite nativo. | Tratar compatibilidade do iniciador separadamente; validar a versão real do runtime ao empacotar. |

## Direção visual aprovada pelo pedido

Identidade: **Catedral da Lua Rubra**. Estruturas em ferro negro/grafite, linhas de
prata oxidada e ouro antigo usado como acento. Vermelho sangue em vitalidade,
combate e seleção; azul lunar em mana e informação. Tipografia serifada nos títulos,
texto de interface legível e sem efeitos que prejudiquem o mapa. Evitar molduras
espessas em todas as superfícies, emoji como arte final e excesso de brilho.

Composição: mundo como área principal; identidade no alto à esquerda, cartografia
à direita, ferramentas agrupadas, chat com leitura clara e barra de combate fixa
em uma linha no desktop. Janelas com título, categoria, minimizar, maximizar e fechar.
Escala desktop prioritária 1280×720/1920×1080; adaptação explícita para telas menores.

## Plano por fases

1. **Auditoria:** este documento, mapa de dependências, problemas e contratos preservados.
2. **UI:** novo layout HUD, bolsa com personagem, painéis, hotbar, chat/minimapa e
   controles reais de minimizar/maximizar. Validar no navegador com jogador conectado.
3. **Personagens:** cinco modelos; planilha de estados/direções/pivôs/equipamento;
   arte e inspeção de cada frame antes de ativação. Jump dos humanos é demanda visual
   adicional: não conceder deslocamento ou habilidade no cliente sem regra do servidor.
4. **Mundo:** monstros/chefes e tiles/props de todos os biomas; manter a geometria
   autoritativa dos JSONs ou atualizar colisão junto com a arte. Nova abertura/login.
5. **Polimento:** screenshots comparáveis, recortes, sobreposição, contraste, teclado,
   animações, carga, multiplayer real, regressões e pacote atualizado.

## Contratos preservados

IDs dos elementos atualizados pelo cliente; nomes de ações Socket.IO; 40 posições,
10 equipamentos, propriedade de itens, servidores de pagamentos/autenticação,
formato de saves e licenças existentes. Assets de produção ficam separados da lógica.
Saves e credenciais não entram em screenshots, documentos ou pacotes.

## Situação desta entrega

Fase 1 concluída. Fase 2 iniciada com implementação de HUD, janelas e bolsa.
Fases 3–5 ainda não estão concluídas. A nova interface não deve ser apresentada
como substituição dos atlas ou como revisão frame por frame já realizada.
