# Caçador anterior — REPROVADO / legado

Estas doze pranchas pertencem ao padrão humano expressamente reprovado pelo usuário.
Foram movidas de assets/eclipse sem alterar seus bytes. O arquivo legacy-manifest.json
registra os metadados de rollback do commit c34e847fa5bded886b9e70c2a35d3d41263d123f.

Não são a base do novo Caçador, não são referência aprovada e não devem ser usadas
para produzir suas próximas animações. O Player Caçador usa agora a Sprite Master
independente em assets/characters/hunter. Não há fallback do Player para este corpo.

Somente NPCs legados existentes podem continuar usando estas imagens, por flag
explícita legacyNPC, enquanto a fase de NPCs permanece bloqueada pela aprovação.
Eles não foram recriados nem aprovados nesta etapa. Preservar o acervo para rollback.
