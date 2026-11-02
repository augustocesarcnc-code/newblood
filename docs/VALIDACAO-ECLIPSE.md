# Escopo e validação — ECLIPSE v1

A especificação de 67 seções está preservada em ESPECIFICACAO-ECLIPSE.md.
Esta entrega amplia o projeto existente com sistemas reais; não representa uma
certificação de produção nem a conclusão das artes finais.

## Correspondência com a especificação

| Seções | Implementação / limite |
| --- | --- |
| 1–5 | Identidade Eclipse, fluxo jogável, monorepo, Express, Prisma/SQLite e Socket.IO real. Vite/TS nas entradas; Canvas existente em vez de Phaser. |
| 6–8 | Oito direções, colisão, corrida, três bases humanas e duas formas. Ataques humanos, hit e morte; formas ainda reutilizam animação de movimento/idle para algumas ações. Salto exclusivo do lobisomem. |
| 9–11 | Nível 400, curva de EXP, transformação 10, bônus de evolução 50/heranças 100–400, atributos, stamina e cálculos reais de combate. |
| 12–14 | Dez tipos pedidos, extras, elite, miniboss e boss; seis estados de IA, retorno e respawn, loot físico de seis raridades. Alguns monstros usam placeholders originais. |
| 15–17 | Quarenta slots, stacks, split/move/use/drop, drag and drop, dez equipamentos, catálogo com classe/nível/atributos/valor. Algumas peças ainda sem camada visual própria. |
| 18–19 | Sete NPCs, proximidade, compra/venda, cura, forja e teleporte. Guarda/mestre oferecem informação e missões. |
| 20–24 | Cinco canais com isolamento de mensagens e limite de spam, party cinco/EXP próxima, clãs com oficiais, troca revisada e PvP consentido fora da cidade. |
| 25–28 | Tela de morte, perda de 5% da EXP atual, retorno à cidade, seis regiões conectadas, minimapa e leitor Tiled com camadas efetivas. Subconjunto finito 40×30 e tilesets semânticos embutidos. |
| 29–32 | HUD gótica no mundo, janelas arrastáveis, chat recolhível, nove atalhos, 30 skills, transformação e habilidades exclusivas da forma. |
| 33–37 | Dia/noite, oito fases de lua/bônus, quatro climas, bot VIP limitado e quatro tipos de missão com recompensa única. |
| 38–43 | Persistência real, autosave/logout/encerramento, scrypt, até três personagens, validação autoritativa, comandos admin e painel DEV/F8 com FPS/ping/posição/contagens. |
| 44–48 | Manifesto e diretórios de áudio com efeitos sintéticos opcionais, fallback visual, módulos por domínio, tipos compartilhados e eventos Socket.IO centralizados. Gameplay JS ainda não integralmente tipado. |
| 49–55 | Tick 150 ms, snapshots por mapa, interpolação e câmera suave; desktop/tela cheia; cidade/floresta/cemitério e Carrasco com ataque de área sinalizado e loot raro. Capacidade de produção não certificada. |
| 56–62 | Migration SQL com checksum, catálogo seed, testes críticos, tratamento de assets ausentes, README/AGENTS e admin/Augusto somente DEV. |
| 63–67 | Instalação e fluxo executados no navegador, testes reais de multiplayer/combate/economia/SQLite e pacote público sem saves/credenciais. Limites remanescentes registrados abaixo. |

## Verificação reproduzível

**Resultado local: 107 testes aprovados, zero falhas.**

`npm run check` verifica sintaxe dos módulos e TypeScript. `npm test` inclui
integrações que sobem servidores com portas e diretórios temporários.

Os testes cobrem:

- hash/sessão/login/logout/reset, propriedade de personagens e limite de três;
- Socket.IO real, entrada de dois jogadores, estado público sem inventário/ouro alheio;
- origem de requisição, movimento impossível, classe de equipamentos e cooldowns;
- combate real até morte de cinco criaturas, EXP/level up, loot físico e coleta;
- inventário cheio, stacks, split/merge, compras atômicas, coleta única e dono do loot;
- troca com revisão, itens equipados protegidos, conservação de ouro e proteção de ofertas;
- mercado, venda para NPC, refino e persistência de itens após restart;
- party, distância para EXP, sucessão, chat privado/local/grupo, clãs e missões sem prêmio repetido;
- transformações nível 10, habilidades da forma, pulo e recortes/metadados de sprites;
- rotas dos seis mapas Tiled, IA retornando ao spawn, respawn e telegráfico do boss;
- SQLite migrando JSON com backup, transação rejeitando item duplicado sem perder save;
- autorização administrativa, cap 400, ciclos ambientais e automação VIP.

Também foi aberto o Vite/Chromium em 1280×720 com login DEV, seleção/criação,
inventário 40/10, missões, dois jogadores simultâneos e ausência de erros JavaScript.
A instalação limpa foi feita em diretório separado com `npm ci`, incluindo
postinstall Prisma em modo JavaScript/WASM, sem reutilizar node_modules do projeto.
O ZIP foi extraído em outra pasta e `npm install` executado sem node_modules prévios.
Nessa cópia foram abertos no Chromium o Vite DEV, o servidor local com módulos-fonte
e o bundle de produção, com login, inventário, debug e áudio sem erros JavaScript.
`npm run build` gera o bundle de produção em dist/web.

`node scripts/smoke-load.mjs` conectou 24 clientes Socket.IO locais no mesmo mapa:
553 snapshots em 3,5 segundos; intervalo entre snapshots no percentil 95 de 159 ms.
São conexões paradas, sem renderização em 24 navegadores, e não um teste de estresse
distribuído. O comando cria e remove um banco temporário próprio.

## Limitações que permanecem

- PostgreSQL exige migração específica e adaptador apropriado; não está habilitado.
- Persistência transacional de snapshots regrava tabelas: é uma base local, não um
  sistema otimizado de escrita incremental para população grande. Snapshots de rede
  são filtrados por mapa, mas ainda incluem o estado privado completo do próprio jogador.
- Sem teste de estresse distribuído, proteção DDoS, telemetria ou operação pública contínua.
- Arte de rato/morcego/aranha/lobo é placeholder próprio; bandidos/cultistas e formas
  reutilizam rigs. Cabeça/escudo/cinto/anel têm stats e ícones, mas faltam camadas finais.
- Movimento e corrida das formas têm oito direções; ataque/hit/morte próprios das
  formas, novos modelos e evolução visual de heranças ainda não são arte final.
- Tiled não suporta TSX externo, mapas infinitos nem rendering genérico de imagens
  arbitrárias de tileset; o renderer aplica texturas por tipo semântico.
- Música/ambiente finais não incluídos. Efeitos usam síntese original, silenciados por padrão.
- Checkout Mercado Pago e e-mail são integrações configuráveis; nenhuma cobrança ou
  entrega de e-mail real foi executada sem credenciais externas.
