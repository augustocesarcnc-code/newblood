# ECLIPSE — Blood & Moon

Read docs/ESPECIFICACAO-ECLIPSE.md for the current user specification. It supersedes
older Bloodmoon limits: level cap 400 and transformation from level 10. Preserve
existing saved progress when migrating; never commit .data, .data-demo or .env.

Monorepo: apps/client (TypeScript/Vite entry + existing modular Canvas renderer),
apps/server (TypeScript database/network layers + Express entry), packages/shared
(protocol constants/types), mmo (shared gameplay and presentation modules), prisma
(schema/migrations), assets (replaceable public artwork), tests (critical rules).

The server owns movement, combat, XP, gold, items, loot, cooldowns and VIP. Never
accept client rewards or inventory snapshots. Keep authentication secrets and
inventory details out of public player broadcasts. Use salted scrypt passwords.
Real payment/email credentials remain external. Development admin seed is enabled
only with ECLIPSE_DEV=1. Do not add public privilege-granting routes.

Use npm install, npm run dev, npm run check, npm test and npm run build. Use
BLOODMOON_DATA_DIR for isolated integration fixtures. SQLite is accessed through
Prisma and migrations; legacy JSON files are backed up before database import.
Keep rule changes in modules with meaningful critical-path tests. Artwork copied
from Flare retains its license and credits. Do not replace actual gameplay with
mockups. The source specification includes features still tracked as pending;
report them accurately and do not claim production readiness without load tests.

Legacy creature/scenery artwork is under assets/eclipse. Active shared human art is
assets/characters/human/manifest.json, rendered by mmo/human-sprites.js. Never
regenerate the approved humans with the rejected rigs.
Read docs/ARTE-INTEGRADA.md and docs/PEDIDO-ARTE-INTEGRADA.md. mmo/sprites.js
re-exports eclipse-sprites.js; Flare PNGs are historical, not the active rig.
Authoring sources are tools/art/rigs.js and props.js. Do not hand-edit manifest
coordinates without regenerating and auditing. Run scripts/audit-eclipse-art.py
after modifying PNGs; tests verify its checksums and zero clipping. Overlays can
have a wider cell than bodies while sharing projected scale and foot alignment.
Preserve Node 24 LTS restriction: Windows/Node 26 native SQLite failures were observed.

## Current MVP direction

Historical visual direction is in docs/DIRECAO-DEFINITIVA.md; apply it only where
consistent with the latest MVP brief below.
The previous human miniatures/rig are REJECTED. Do not refine them or use that body
as the base for new art. Preserve gameplay systems, maps and HUD.

Read docs/MVP-PRODUCAO-RAPIDA.md: latest explicit user request, overrides the older
WALK-only approval gate and separate-human-body directions. Current scope is a
playable MVP: approved Hunter shared human base for all three classes, class skins,
synchronized equipment, separate full transformed werewolf, 6–10 licensed/reused
monsters, existing village/forest/cemetery/dungeon, and real gameplay-loop tests.
Do not redesign the Hunter, anatomy, hat or palette. Do not rewrite stable gameplay.
TEMP procedural animation/gear and licensed placeholders are allowed, identify them
honestly. Prioritize integration over further art generation. User explicitly now
authorizes gameplay integration; do not ask for the superseded WALK approval.
Keep frozen design checksums and old assets for rollback. Commit small MVP stages.
