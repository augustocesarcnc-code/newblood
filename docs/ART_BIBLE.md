> Atualização: usuário aprovou explicitamente esta Sprite Master. Fase B autorizada: Idle, Walk, Run e GIFs em oito direções. Aprovação das animações ainda pendente. As anotações abaixo documentam a revisão original da Fase A.

# ECLIPSE — direção definitiva · Fase A em revisão

A direção em [DIRECAO-DEFINITIVA.md](DIRECAO-DEFINITIVA.md) substitui as anteriores
nos pontos em conflito. O padrão de miniaturas humanas anterior está REPROVADO.
A Art Bible anterior foi preservada em archive/ART_BIBLE-before-rejection.md.

## Padrão proposto, ainda NÃO aprovado

Pixel art 2D detalhada, personagem adulto, alvo aproximado de 6–7 cabeças anatômicas
(excluindo o chapéu). Pescoço, cintura e pernas longas; sobretudo aberto na frente,
couro gasto, botas, luvas, colete, fivelas discretas de prata e silhueta estreita.
Paleta carvão/grafite/couro dessaturado com vinho contido. Sem corpo chibi, forma
arredondada de boneco, shader plástico ou geometria low-poly como linguagem final.

O Caçador foi desenhado novamente por image_gen, sem usar os corpos, rigs ou PNGs
anteriores como referência de entrada. A segunda revisão do mesmo candidato refinou
a leitura em pixel art. Somente a versão selecionada é um asset de jogo. Não foram
criadas animações, Vampiros, Lobisomens ou NPCs novos.

## Contrato da Sprite Master

- Um PNG original preservado byte a byte, 2172 × 724, com oito vistas estáticas.
- Ordem de autoria: N, NE, E, SE, S, SW, W, NW. Nenhuma rotação de bitmap em runtime.
- Uma pose por direção; **zero quadros de animação novos**.
- Retângulos e pivôs medidos em master.json, separados por transparência.
- Célula lógica proposta: 96 × 128; pivô lógico (48,112); corpo lógico de 88 px.
- Escala no renderer existente: altura de 54 px × escala recebida. Na captura da
  Vila, tile de 52 px e altura corporal de cerca de 77,6 px, aproximadamente 1,49 tiles.
- Escala/perspectiva/anatomia/identidade ainda dependem da aprovação visual do usuário.
- Camadas de equipamento e animações não foram aprovadas nem produzidas para este
  novo corpo. A aparência da Master é fixa nesta fase; itens e atributos lógicos
  existentes permanecem preservados.

O renderer usa o mesmo PNG na auditoria neutra e no mapa. As vistas não são
apresentadas como walk/run/attack: os laboratórios sinalizam MASTER DEV e desativam
animação/timeline para este Caçador. NPCs/ambiente/HUD da imagem de escala são legados
inalterados, apenas contexto; não constituem uma nova aprovação desses elementos.

## Gate obrigatório

**PARAR na Fase A e aguardar aprovação explícita.** Não inferir aprovação de silêncio.
Somente depois: Fase B (Idle/Walk/Run e GIFs de auditoria), com nova pausa de aprovação.
Não expandir para outras classes, NPCs, mapas ou UI nesta etapa.

## Rollback e GONKEN

O acervo anterior do Caçador está em assets/deprecated/hunter e mantém os mesmos hashes.
Há um checkpoint anterior à substituição na branch art/hunter-master-review.
O candidato não deve ser publicado como arte final nem entrar em um novo pacote
jogável antes de aprovado.

O usuário anexou GONKEN_Fantasy_RPG_UI_Pro.zip. O download excedeu o limite de 32 MiB
da ferramenta; seu conteúdo ainda não foi inspecionado ou importado. Isso é pendência
da futura fase de UI e não bloqueia a revisão do Caçador. Nenhuma UI foi alterada agora.
