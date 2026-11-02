# ASSET STATUS — Fase A do novo Caçador

**O padrão humano anterior está REPROVADO.** Os relatórios anteriores não equivalem
à aprovação deste novo candidato. Foram preservados em docs/archive para histórico.
Direção vigente: DIRECAO-DEFINITIVA.md. Estado: **DEV · AGUARDANDO APROVAÇÃO DO USUÁRIO**.

| ASSET | CRIADO | INTEGRADO | TESTADO | STATUS |
| --- | --- | --- | --- | --- |
| Novo Caçador Sprite Master | Sim, desenho independente | Player/preview de escala | PNG carregado, pivô e dimensões | CANDIDATO, NÃO APROVADO |
| Norte / Nordeste / Leste / Sudeste | Sim, uma vista de cada | Renderer 2D | Auditoria de limites e imagem neutra | AGUARDANDO APROVAÇÃO |
| Sul / Sudoeste / Oeste / Noroeste | Sim, uma vista de cada | Renderer 2D | Auditoria de limites e imagem neutra | AGUARDANDO APROVAÇÃO |
| Caçador na Vila atual | Sim, mesma Master | Conta comum, mundo real | Login/Socket.IO/render da nova Master | ESCALA EM REVISÃO |
| Idle/Walk/Run/Attack/Hit/Death novos | Não | Não | Não | BLOQUEADOS ATÉ APROVAÇÃO |
| GIFs de animação novos | Não | Não | Não | FASE B OU POSTERIOR |
| Camadas novas de equipamento | Não | Não | Dados lógicos antigos preservados | FASE POSTERIOR |
| Vampiro / Lobisomem / NPCs novos | Não | Não | Não | NÃO PRODUZIDOS |
| Mapas / HUD / UI novos | Não | Não | Arquivos preservados | NÃO MODIFICADOS |
| Caçador antigo | Arquivado, 12 pranchas idênticas ao checkpoint | Somente NPC legado por flag; não Player | Hashes de rollback conferidos | REPROVADO, NÃO É REFERÊNCIA |
| GONKEN UI Pro | Anexado pelo usuário | Não | Download bloqueado por tamanho >32 MiB | INSPEÇÃO PENDENTE PARA FASE J |

A auditoria técnica mede oito recortes distintos, corpos dentro dos retângulos e pivôs
nos pés. Ela não aprova anatomia ou direção artística automaticamente. O PNG original
não foi repintado, recortado ou regravado por scripts; o renderer usa metadados de atlas.

Evidência atual: reviews/hunter-master/eight-directions.png, village-scale.png,
audit.json e integration.json. Os NPCs, casas, árvores e HUD vistos na captura da Vila
continuam sendo o material anterior: **somente o novo Caçador está sob avaliação**.

Após a apresentação dessas duas imagens, parar. Nenhuma aprovação artística foi
registrada nesta fase, e não se deve avançar para animação ou publicação final.
