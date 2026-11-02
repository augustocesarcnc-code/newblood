# Guias originais de articulação

Fontes vetoriais de orientação para a caminhada do Caçador aprovado. `build.py` produz oito folhas SVG/PNG com oito poses articuladas cada: contato direito, apoio direito, passagem esquerda, avanço esquerdo, contato esquerdo, apoio esquerdo, passagem direita, avanço direito. Vermelho identifica o lado anatômico direito, azul o esquerdo. A projeção muda conforme a direção.

São **guias técnicos**, sem roupa, sem uso no jogo. Não são sprites finais nem usam pixels do personagem. Nenhum rig humano reprovado foi reutilizado. As sprites finais são produzidas por image_gen usando a Master aprovada e, quando necessário, estes guias como referências. O guia não é prova de que a imagem gerada obedeceu às poses: inspecionar o GIF e as tiras de frames.

Para rasterizar os SVGs é necessário Inkscape: `python tools/art/hunter-walk-guides/build.py`.
