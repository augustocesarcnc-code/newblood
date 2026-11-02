# Asset status — Caçador / Fase B

| ASSET | CRIADO | INTEGRADO | USADO ONDE | STATUS |
|---|---|---|---|---|
| Hunter Sprite Master, oito direções | Sim | Sim | Player e auditoria neutra | APROVADO pelo usuário; commit 69a8bf8 |
| Hunter Walk v4, 8 frames × 8 direções | Sim, candidato | Apenas auditoria | GIF v4 e hunter-motion.html | Correção de orientação NE/NW passou no teste específico; aprovação visual completa pendente |
| Hunter Walk v3 | Histórico | Não no gameplay | GIF v3 preservado | Reprovado por deriva NE/NW; substituído na auditoria pela v4 |
| GIF Walk v4 | Sim | Auditoria | docs/reviews/hunter-motion/walk-v4-8-directions.gif | Reprodução, arquivo e teste específico NE/NW passam; sem aprovação artística completa |
| Walk v1/v2 | Histórico | Não no gameplay | Pastas rejected-v1/rejected-v2 | REPROVADOS; não usar como ciclo aprovado |
| Hunter Idle, 4 frames × 8 direções | Candidato anterior | Apenas auditoria | GIF Idle | DEV; margem inferior insuficiente, não corrigido nesta etapa |
| Hunter Run, 6 frames × 8 direções | Candidato anterior | Apenas auditoria | GIF Run | DEV; revisar perspectiva, passada e recorte, não corrigido nesta etapa |
| Guias de articulação | Sim | Não são assets do jogo | tools/art/hunter-walk-guides | Somente autoria e referência de poses |
| Hunter Attack/Hit/Death novos | Não | Não | Nenhum | Fase C ainda não autorizada |
| Camadas de equipamento do novo Hunter | Não | Não | Nenhum | Aguardando etapa própria |
| Hunter antigo | Sim, histórico | Somente NPCs legados existentes | assets/deprecated/hunter | REPROVADO para novo Player; rollback preservado |
| Outros personagens, NPCs, mapas e HUD | Legado preservado | Integração anterior | Jogo existente | Sem alterações nesta etapa |

Um GIF salvo não constitui animação integrada no jogo. O Player continua com uma pose estática por direção da Master aprovada. Aprovação visual do usuário, revisão final de detalhes e teste da passada no mapa ainda pendentes.

Detalhes: [auditoria de movimento](reviews/hunter-motion/README.md). Histórico anterior: docs/archive/ASSET_STATUS-before-rejection.md.
