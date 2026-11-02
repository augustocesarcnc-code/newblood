# Arquitetura ECLIPSE

A nova especificação é aplicada sobre os sistemas funcionais existentes, com
migração do armazenamento e separação em monorepo. O renderer Canvas é mantido
nesta etapa para preservar o rig de equipamentos, recortes e desempenho já
validados. Vite e TypeScript organizam a entrada; Prisma/SQLite fornece o banco;
Express e Socket.IO fornecem HTTP e sincronização autoritativa. A migração integral
dos módulos de gameplay JavaScript para TypeScript e a troca por Phaser não são
necessárias para executar esta versão e não são apresentadas como concluídas.

O backend é a única fonte de recompensas e posição. Os mesmos comandos validados
atendem HTTP (compatibilidade/testes) e Socket.IO (cliente). O estado é enviado a
cada 150 ms, somente com jogadores do mesmo mapa, e o cliente interpola posições.
Dados privados ficam separados do estado público. Prisma executa transações no
salvamento; contas, personagens, itens, clãs e mercado têm tabelas próprias.
Sessões, pagamentos e extensões de mundo usam registros internos persistentes.

SQLite serve ao desenvolvimento. PostgreSQL requer trocar o provider Prisma,
gerar uma migração apropriada e validar o adaptador; não basta apontar uma URL
PostgreSQL para migrations SQLite. Esse passo continua separado da entrega local.

O banco faz uma transação com snapshot imutável serializada na fila de salvamento.
A chave primária de cada InventoryItem também impede salvar duas posses com o mesmo
ID; a transação anterior permanece íntegra quando há erro. A versão local regrava
as tabelas normalizadas a cada save, devendo evoluir para escrita incremental antes
de uma operação grande. O cliente recebe snapshots de 150 ms por mapa, não por frame.

Os seis JSONs Tiled são consumidos no servidor e no cliente: terreno, colisão,
spawn, NPCs, portais e monstros compartilham a mesma fonte. O reader trata tilesets
semânticos embutidos; o renderer mapeia os tipos para as texturas do projeto.
Socket.IO usa sessão HttpOnly e os mesmos comandos de inventário/combat/economia
da API de compatibilidade. Os eventos de transporte ficam em packages/shared.

DEV usa dados separados e bind loopback. O seed administrativo exige ECLIPSE_DEV=1;
a função de cadastro ignora privilégios enviados pelo cliente. A resolução de
comandos administrativos verifica a conta proprietária do personagem.
