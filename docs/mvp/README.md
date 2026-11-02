# Entrega MVP — integração sobre a base existente

A direção atual está em `docs/MVP-PRODUCAO-RAPIDA.md`. Ela substitui o processo anterior de aprovação isolada da WALK. A geração de revisão foi encerrada; as folhas de caminhada já disponíveis foram reaproveitadas, sem redesenhar a anatomia.

## Integrado na mesma build

- Três classes humanas usam `hunter-approved-shared-v1`, mesmo frame, pivô e escala, com oito direções. Skins por paleta/capa/gola e ornamentos; nenhum novo corpo humano.
- Equipamento usa dados reais do servidor e altera os slots visuais correspondentes. Overlays TEMP compartilham o contexto de transformação da base.
- Idle/Walk/Attack/Hit/Death são estados do renderer. WALK tem oito quadros de origem por direção; Idle é a Master estática; Attack/Hit/Death têm feedback procedural TEMP. RUN não recebeu arte nova.
- Forma completa do Lobisomem é independente, maior, com equipamentos humanos ocultados. Reutilizada do projeto, sem gerar outra criatura.
- Oito inimigos normais nos quatro mapas prioritários: lobo, morcego, esqueleto, zumbi, ghoul, aranha, goblin e formiga-leão; um boss Necromante no Cemitério.
- Pack Flare oficial recuperado: quatro PNGs ausentes e metadados existentes, fontes fixadas em `LICENSED_PACK.json`, CC BY-SA 3.0 e créditos preservados. Sem sprites ripadas de jogos comerciais.
- Posições de encounters e sua variedade foram ajustadas nos mapas existentes. Terreno, colisões, decoração, NPCs e portais foram comparados ao checkpoint e preservados.

## Verificações

- 129 testes Node passaram, incluindo novo teste de base comum, conteúdo MVP e PNGs licenciados/checksums/recortes.
- Sintaxe de 69 módulos JavaScript e TypeScript: passou. Build Vite: passou.
- `tools/qa/mvp-playable.py`: banco temporário, navegador Chromium real. Resultado em `validation.json`; sem erros JavaScript ou requests de assets ausentes.
- Três contas comuns de nível 1 entraram no mundo; renderer verificado em cinco estados × oito direções por classe. Não recebem poderes administrativos.
- Os testes controlados usam a conta DEV para posicionar o testador, organizar encontros e colocar a conta de transformação no nível 10. Ataques, dano, recompensa, loot, compra, equip/unequip, quest e transformação passam pelas ações normais e autoritativas.
- A automação respeita o bloqueio existente de 10 segundos para cruzar portais após combate; não removeu essa regra.
- Teste adicional de conta comum: dano real, morte e respawn na Vila, com HP restaurado. Evidência em `death-respawn.json`. Após esse teste de nível 1, um fixture separado de nível 10/espada verificou a habilidade do Vampiro, mantendo a mesma base humana e arma visível.
- O estado sobrenatural do Vampiro reutiliza a mesma base humana; somente a forma completa do Lobisomem troca de criatura.
- Não houve teste de carga, balanceamento completo, serviços pagos ou e-mail real.

## Prova visual

| Situação | Screenshot |
|---|---|
| Vila e HUD atual | [Vila](screenshots/01-vila.png) |
| Floresta | [Floresta](screenshots/02-floresta.png) |
| Combate | [Combate](screenshots/03-combate.png) |
| Inventário e equipamento | [Inventário](screenshots/04-inventario.png) |
| Quest | [Quest](screenshots/06-quest.png) |
| Cemitério | [Cemitério](screenshots/09-cemiterio.png) |
| Dungeon existente | [Dungeon](screenshots/10-dungeon.png) |
| Vampiro humano, conta comum | [Skin Vampiro](screenshots/class-vampiro-inventory.png) |
| Lobisomem humano, conta comum | [Skin humana](screenshots/class-lobisomem-inventory.png) |
| Lobisomem transformado | [Transformação](screenshots/werewolf-transformed.png) |

## Limites honestos

A arte não está toda finalizada. As roupas pintadas ainda estão no BODY composto; a lista BODY/HAIR/HEAD/CHEST/COAT/LEGS/BOOTS/GLOVES/WEAPON_MAIN/WEAPON_SECONDARY/ACCESSORY organiza os slots, mas não representa extração completa de cada peça pintada. Os overlays temporários são substituíveis sem alterar a anatomia ou regras de equipamento.

A WALK conserva limitações de refinamento de tecido, acessórios e contato de pés. Ela está integrada como DEV; não foi declarada uma animação final perfeita. Não existe certificação de foot locking a 60 fps. O foco é o loop jogável pedido no novo briefing.

O pacote GONKEN enviado continua sem inspeção porque a transferência disponível tem limite de 32 MiB. A HUD existente cobre os sistemas do MVP, então essa pendência não bloqueia o jogo.
