# Caminhada v4 — correção de orientação em NE/NW

[GIF atual: oito direções](walk-v4-8-directions.gif)

Foram refeitas somente as folhas NE e NW com image_gen, usando a Master aprovada e as folhas anteriores como referência. Cabeça, ombros e painel das costas permanecem de costas em 3/4 nas oito poses. As seis outras folhas e a Master foram preservadas, com checksums conferidos. A v3 original permanece em `walk-v3-8-directions.gif`; não foi sobrescrita.

**Teste específico da correção: PASS_TARGETED_ORIENTATION_REPAIR.** Foram inspecionados os 16 frames decodificados de NE/NW e verificada a reprodução do novo GIF no Chromium. O teste técnico de arquivo/loop/tamanho e a regressão de troca dos pés em S passaram. Nenhum frame foi redimensionado individualmente.

- [NE — oito frames](v4-frames-NE.png)
- [NW — oito frames](v4-frames-NW.png)
- [NW — comparação dos frames 1 e 5](v4-NW-frames-1-5.png)
- [Resultado da correção](orientation-test-v4.json)
- [Observações visuais vinculadas ao checksum](orientation-review-v4.json)

A identificação visual da orientação é uma inspeção do autor/assistente, não um classificador automático de anatomia. **Aprovação visual completa continua pendente.** O teste específico não certifica toda a anatomia, consistência fina de acessórios, fluidez perfeita ou passada no mapa. A animação não foi integrada ao gameplay.

Reprodução dos testes:

1. `python scripts/audit-hunter-motion.py` — seleciona as duas folhas v4 quando ambas existem e mantém as outras seis da v3.
2. `python tools/qa/export-hunter-motion.py` — exporta e reproduz o GIF, preservando a versão v3.
3. `python tools/qa/test-hunter-walk-gif.py` — testes técnicos e situação da avaliação visual completa; atualmente retorna 1 porque a revisão completa do novo checksum ainda está pendente. `technicalResult` é PASS; isso não deve ser anunciado como aprovação visual total.
4. `python tools/qa/test-hunter-orientation.py` — teste da correção solicitada, com resultado e checksum em `orientation-test-v4.json`.

---

## Histórico da v3 — falha corrigida na v4

> **Reteste atual: REPROVADO VISUALMENTE.** O arquivo, os tempos, o loop e a regressão do pé em S passam. A reprodução real do arquivo existente no Chromium também passa, sem regeneração. Porém NE/NW apresentam deriva da orientação de costas em 3/4 para perfil. O parecer anterior marcado PASS era limitado e não certificava consistência visual completa. Evidência: [NW, frames 1 e 5](retest-NW-frames-1-5.png). Resultados separados em `walk-test.json` (`technicalResult: PASS`, `visualResult: FAIL`) e `retest-playback.json`. A revisão anterior foi preservada em `gait-review-limited-superseded.json`.

# Caçador — caminhada v3 em auditoria

A caminhada foi refeita para corrigir a ausência de alternância de pernas da v2. A Master aprovada continua intacta e é a referência. As versões reprovadas estão em `rejected-v1/` e `rejected-v2/`.

[GIF corrigido — oito direções](walk-v3-8-directions.gif)

## O que mudou

- Oito frames por direção, com contato, apoio e passagem de cada perna, em vez de repetir a mesma metade da passada.
- Fontes separadas por direção em `assets/characters/hunter/animation-review/walk-v3/`, produzidas com image_gen usando a Master e guias originais de articulação. Nenhum rig antigo foi reutilizado.
- Escala fixa para todos os frames de cada folha. Não há redimensionamento individual para igualar a altura da silhueta. A conversão de escala de cada folha para o preview fica registrada no relatório.
- Pivô horizontal medido no tronco e linha de contato compartilhada por direção. A sequência de N foi ordenada pelas poses efetivamente desenhadas, sem espelhar ou inventar frames.
- NE/NW foram refeitas novamente quando o primeiro teste detectou encurtamento da perna de apoio. Não se aumentou a tolerância para aprovar essas exportações.

## Testes executados

- Pillow e FFmpeg decodificam o GIF sem erros: oito frames distintos, loop infinito, aproximadamente oito frames por segundo.
- O próprio arquivo GIF foi aberto no Chromium. Oito capturas ao longo da reprodução confirmaram mudança de frames, não apenas carregamento de um PNG.
- Cada direção usa uma escala constante. A altura da silhueta escura varia de 0 a 7 px conforme a posição das botas; essa medição não é prova de anatomia constante.
- A regressão do mesmo pé à frente foi testada diretamente nos pixels de S: frame 1, extremidades esquerda/direita em y=281/261; frame 5 em y=260/281. O pé em primeiro plano realmente troca de lado.
- Diferenças entre frames, inclusive último→primeiro, foram medidas; nenhum fechamento excede o limite documentado no teste.
- As oito tiras de frames do GIF foram inspecionadas. Observações por direção, vinculadas ao checksum exato, estão em `gait-review.json`.
- Checksum e oito vistas da Master continuam válidos; nenhuma mudança no gameplay.

Resultado original (superado pelo reteste acima): testes técnicos e revisão limitada da passada passaram. O reteste visual encontrou falhas de orientação; esta versão não está aprovada. Não significa aprovação artística final. Detalhes de roupa/acessórios, pequenas rotações da cabeça/ombros e tecido continuam sujeitos à avaliação visual. Deslizamento no mundo, velocidade de deslocamento e camadas de equipamento não foram testados nesta auditoria estacionária.

## Evidências

| Direção | Frames decodificados |
|---|---|
| N | [Tira N](frames-N.png) |
| NE | [Tira NE](frames-NE.png) |
| E | [Tira E](frames-E.png) |
| SE | [Tira SE](frames-SE.png) |
| S | [Tira S](frames-S.png) |
| SW | [Tira SW](frames-SW.png) |
| W | [Tira W](frames-W.png) |
| NW | [Tira NW](frames-NW.png) |

`walk-test.json`: teste do arquivo final. `render-check.json`: escala e geometria. `walk-pixel-check.json`: altura da silhueta no GIF. `browser-playback.json`: reprodução real no navegador. `audit.json`: hashes, recortes e medidas das fontes.

## Reproduzir

1. `python scripts/audit-hunter-motion.py`: mede todos os ciclos e aplica automaticamente a medição v3 quando as oito folhas estão presentes. Também pode executar diretamente `python scripts/audit-hunter-walk-v3.py`.
2. `python tools/qa/export-hunter-motion.py`: serve a raiz temporariamente, renderiza no Chromium, exporta via FFmpeg, reproduz o GIF e grava as evidências técnicas. Requer Pillow, Playwright, Chromium em `/usr/bin/chromium` e FFmpeg.
3. `python tools/qa/test-hunter-walk-gif.py`: testa o GIF sem regenerar ou alterar seus pixels. Falha se os testes técnicos falharem ou se a revisão visual não corresponder ao checksum atual. As observações visuais são revisão interna humana/assistente, não um classificador automático de anatomia.
4. Servir a raiz e abrir `/hunter-motion.html` para selecionar ciclo, reproduzir, pausar e examinar frames.

## Escopo preservado

A caminhada v3 é **material de auditoria**, não está integrada no gameplay. O jogo mantém a Master aprovada. Idle e Run são os candidatos anteriores e não foram refeitos nesta correção da caminhada; continuam com as pendências anteriormente registradas. Não avançar para Fase C nem promover novas animações como arte final antes da aprovação da etapa.
