# ECLIPSE — Blood & Moon

MMORPG 2D dark fantasy para navegador. Três classes humanas equipáveis, transformações,
combate em tempo real e multiplayer autoritativo. Esta versão evolui o projeto
Bloodmoon com a [especificação atual](docs/ESPECIFICACAO-ECLIPSE.md): **nível máximo 400,
transformação no nível 10 e três personagens por conta**.

**[Baixar o projeto jogável (ZIP)](https://github.com/augustocesarcnc-code/bloodmoon/blob/visual/eclipse-redesign/dist/Eclipse-Blood-Moon.zip)**

## Arte e interface integradas

A nova versão usa [sprites, monstros, cenários e login originais integrados](docs/ARTE-INTEGRADA.md).
Há cinco modelos de jogador, 306 atlas em oito direções, camadas equipáveis,
criaturas/elite/Carrasco, 32 cenários e 12 terrenos. As capturas e o relatório de
validação estão no documento. O jogo continua 2D: as miniaturas são pré-renderizadas,
não modelos 3D desenhados ao vivo no navegador.

## Instalar e executar

Requisitos: **Node.js 24.19+ da linha 24 LTS**, npm, navegador atual e internet na primeira instalação.
O driver SQLite usa um módulo nativo; plataformas sem binário pré-compilado precisam
das ferramentas de compilação indicadas pelo instalador do `better-sqlite3`.

```bash
npm install
npm run dev
```

Abra **http://localhost:5173**. A API e o Socket.IO ficam em **http://localhost:3000**,
acessíveis pelo proxy do Vite. Use `localhost` no navegador: a origem precisa
coincidir com a configuração do servidor. Mantenha o terminal aberto; Ctrl+C encerra
os dois processos e salva o mundo. Migrações e seed DEV são aplicados automaticamente.

**DEV:** login `admin`, senha `admin123`. O personagem Augusto é um caçador nível 10,
com equipamentos, ouro e VIP de desenvolvimento. Esse seed só é habilitado pelo
modo DEV, cujo servidor aceita conexões locais. Você também pode cadastrar uma
conta comum, criar personagens e testar dois jogadores usando perfis de navegador
separados ou janela anônima.

No ZIP, extraia tudo antes de executar. `JOGAR-WINDOWS.bat` ou `bash jogar.sh`
iniciam o servidor local e instalam dependências na primeira execução. Se você usa o Node portátil, mantenha a pasta `node-v24...-win-x64` dentro de
Eclipse: os iniciadores Windows a selecionam automaticamente. Esse modo
usa cadastro normal, sem conceder administrador. Para o seed acima, use `npm run dev`.
`npm run demo` preserva as três contas antigas de demonstração, em dados separados;
veja [automação VIP](docs/AUTOMACAO-VIP.md).

## Sistemas disponíveis

- Cadastro, login com scrypt, sessões HttpOnly, seleção/criação de até três personagens.
- Movimentação em oito direções, corrida com stamina, colisão, câmera suave e interpolação.
- Vila de Eclipse, Floresta Amaldiçoada, Cemitério, Caverna, Ruínas e Castelo,
  conectados por portais; JSONs editáveis no Tiled.
- Dez criaturas solicitadas, criaturas adicionais, elite, Necromante e Carrasco da Lua.
  IA de patrulha/perseguição/retorno, morte, respawn e especial de área sinalizado.
- Ataque básico, 30 habilidades com efeitos, arma exigida para caçadores, dano,
  armadura, resistência mágica, crítico, esquiva, evolução e heranças até nível 400.
- Vampiro/lobisomem humanos no início; R transforma a partir do nível 10. A forma
  altera arte/dano e libera habilidades específicas. Lobisomem transformado pode saltar.
- Loot físico persistente, proteção inicial de dono/grupo, coleta, stacks, divisão,
  uso, drop, drag and drop, 40 posições e dez slots de equipamento com atributos reais.
- Mercadora, ferreiro, curandeira, alquimista, guarda, mestre e guardiã dos portais;
  proximidade validada, compra/venda, refino e reciclagem.
- Mercado entre jogadores, trocas com revisão de oferta e confirmação dos dois lados,
  PvP por consentimento fora da zona segura e penalidade de 5% da EXP atual ao morrer.
- Chat GLOBAL/LOCAL/PARTY/CLAN/PRIVATE, grupos de até cinco com EXP próxima compartilhada,
  clãs com líder/oficial/membro e quatro missões de matar/coletar/entregar/conversar.
- Interface gótica dentro do mundo, minimapa, janelas arrastáveis, chat recolhível,
  tela cheia, dia/noite, clima, fases lunares com bônus por classe e efeitos sonoros
  sintéticos opcionais. Áudio começa silenciado; ative em SOM.
- Bot VIP validado pelo servidor: poção, alvo, ataque, skills, buff, hunt, lure e PvP
  consentido. O personagem DEV tem VIP para teste; contas comuns precisam de VIP.
- Prisma/SQLite, migração de saves antigos com backup, autosave a cada cinco segundos,
  salvamento no logout/desconexão e encerramento normal.

## Controles

| Tecla | Ação |
| --- | --- |
| WASD / setas | Andar em oito direções |
| Shift | Correr, consumindo stamina |
| Clique / Tab | Selecionar / alternar alvo; ataque básico ao alcance |
| 1–9 | Atalhos de habilidades ou consumíveis arrastados para a barra |
| Q / H | Primeiro atalho / poção de vida |
| R / Espaço | Transformar / pular (lobisomem transformado salta duas casas) |
| Z | Coletar loot próximo; também pode clicar no item no chão |
| E ou F | Conversar com NPC próximo |
| I / C / K | Inventário / personagem / habilidades |
| M / G / P / J | Mapa / clã / grupo / missões |
| Enter / Escape | Chat / fechar janela |
| Alt+Enter | Alternar tela cheia |
| F8 | Painel DEV, apenas administrador em modo DEV |

Arraste equipamentos para o slot correspondente. No inventário, selecione um item
para dividir, usar ou dropar. Novos personagens começam com roupa simples e três
poções; vá aos arredores da vila para enfrentar ratos e morcegos. Armas de caçador
podem ser adquiridas com Mara. Missões indicam o NPC com quem falar/recolher recompensa.

## Organização

```text
apps/client       entrada TypeScript e configuração Vite
apps/server       Express, Socket.IO, banco Prisma e seed
packages/shared   eventos, interfaces e leitor de Tiled
mmo               módulos de combate, economia, autenticação, UI e renderer Canvas
prisma            schema e migrations SQLite
assets            sprites, efeitos, texturas, mapas e manifesto de áudio
tests             regras e integrações reais com servidores e bancos temporários
scripts           desenvolvimento, geração Prisma, banco e empacotamento
docs              especificação, arquitetura, critérios e documentação dos sistemas
```

O servidor decide posição, dano, cooldowns, dinheiro, inventário e recompensas.
Cliente e Socket.IO passam pelo mesmo pipeline de comandos. Snapshots são enviados
por mapa a cada 150 ms, com dados privados apenas para o próprio jogador.
Leia [arquitetura](docs/ARQUITETURA-ECLIPSE.md) e [AGENTS.md](AGENTS.md).

## Banco e configuração

DEV usa `.data-dev/eclipse.sqlite`; `npm start` usa `.data/eclipse.sqlite`;
a demonstração usa `.data-demo`. `BLOODMOON_DATA_DIR` substitui o diretório.
As migrations têm checksum e são registradas em `_prisma_migrations`. O primeiro
carregamento de um `world.json` antigo cria `world.pre-eclipse.json` antes da
importação; os limites antigos são ajustados para a regra atual sem apagar itens
ou ouro. Faça backup do diretório inteiro com o servidor parado antes de atualizar.

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

`db:seed` persiste o catálogo de itens, monstros, skills, NPCs e quests. Para criar
também a conta de teste por esse comando, defina `ECLIPSE_DEV=1`.
O runtime usa o adaptador SQLite JS do Prisma; `db:generate` não exige baixar
engines Rust. Instale também as dependências de desenvolvimento.

`.env` não é carregado automaticamente por `npm run dev`. Para configurações locais
externas use `node --env-file=.env apps/server/src/main.ts`; veja `.env.example`.
Recuperação por e-mail exige remetente Resend e URL HTTPS. Checkout Mercado Pago de
VIP de 30 dias por R$ 15 exige credenciais, webhook e HTTPS. Fica indisponível sem
configuração. Nunca inclua dados ou credenciais no ZIP/Git.

## Build e verificações

```bash
npm run check
npm test
npm run build
npm start
```

`npm start` serve o cliente modular na porta 3000. Para servir o bundle de `dist/web`,
rode o build e inicie com `NODE_ENV=production` no ambiente. Em produção mantenha
`ECLIPSE_DEV=0`, configure origem/HTTPS e não use a conta de desenvolvimento.
O Vite é para desenvolvimento; uma hospedagem pública exige configuração própria.

## Expandir conteúdo

- **Item:** adicione ao catálogo `mmo/items.js`, informe slot/classe/nível/atributos,
  adicione à loja em `mmo/village.js` ou ao loot. A UI lê esse catálogo.
- **Monstro:** defina stats em `mmo/bestiary.js`, arte em `mmo/monster-sprites.js` e
  pontos com propriedade `species` na camada `monsters` do mapa Tiled.
- **Mapa:** edite os JSONs em `assets/maps` no Tiled. Mantenha as dimensões 40×30,
  camadas `terrain`, `collision`, `spawn`, `npcs`, `teleports`, `monsters` e tipos
  semânticos dos tiles. Para nova região registre JSON em `mmo/map-data.js`, metadados
  em `mmo/world.js` e conecte portais (`to`, `tx`, `ty`). Reinicie o servidor.
- **Habilidade:** adicione definição em `mmo/skillbook.js`, mantendo ID único e tipo
  suportado por `mmo/combat-skills.js`. Adicione efeito em `mmo/skill-effects.js`;
  atualize atlas/manifesto se fornecer arte final e verifique os testes de metadados.
- **Arte/áudio:** troque recursos e metadados em `assets`. O rig alinha equipamento
  e corpo pelo mesmo frame/pivô; o áudio aceita URLs no manifesto e falha sem derrubar o jogo.

## Limites desta entrega

O núcleo é jogável, mas o projeto continua em desenvolvimento. O renderer existente
é Canvas, sem migração para Phaser; gameplay ainda tem módulos JavaScript junto às
entradas TypeScript. SQLite salva transações de snapshots do mundo, adequado à base
local e ainda sem arquitetura de persistência incremental para um servidor grande.
Não foi validado para produção nem para centenas de conexões simultâneas.

Tiled suporta o subconjunto descrito acima: mapas finitos, tilesets embutidos e
camadas semânticas; TSX externo, mapas infinitos e imagens arbitrárias de tileset
não são renderizados genericamente. A arte ativa usa rigs estilizados originais,
com atlas de ações completos e camadas equipáveis; o processo de criação e a
validação frame a frame estão em [Arte integrada](docs/ARTE-INTEGRADA.md).
Não há trilha musical final nem certificação de capacidade de produção.

Artes históricas humanas/monstros Flare mantêm créditos e CC BY-SA 3.0 nos diretórios de origem.
Transformações originais do projeto são separadas. Nenhum asset proprietário de
Tibia, Lineage ou Ragnarok foi incluído. Documentos antigos descrevem etapas anteriores;
a especificação ECLIPSE e este README definem as regras atuais.
