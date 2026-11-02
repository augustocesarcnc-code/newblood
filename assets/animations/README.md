# Bloodmoon transformation animation atlases

Eight original generated PNGs, preserved unchanged, based on the approved creature designs in assets/original/transformation-atlas.png. No third-party Flare art is present in these transformation sheets.

Each source sheet contains eight frame columns and four directional rows. Front: S, SW, W, NW. Back: N, NE, E, SE. Two sheets per movement (walk/run) per creature (werewolf/vampire): 256 separately drawn frames in total.

manifest.json records crop rectangles and common foot pivots for each directional cycle. The manifest is built by scripts/index-animation-atlases.py, which reads image pixels without editing the PNGs. Playback uses these frames, not a vertical bob of the idle image.

These are alpha art assets. Generation can introduce anatomical, lighting or gait continuity differences between frames; use the animation studio to inspect and refine them before final art production. Human bases remain derived from the licensed Flare rig, with original upstream layers and separate attribution.
