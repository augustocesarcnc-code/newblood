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

Current artwork is original ECLIPSE production atlases under assets/eclipse.
Read docs/ARTE-INTEGRADA.md and docs/PEDIDO-ARTE-INTEGRADA.md. mmo/sprites.js
re-exports eclipse-sprites.js; Flare PNGs are historical, not the active rig.
Authoring sources are tools/art/rigs.js and props.js. Do not hand-edit manifest
coordinates without regenerating and auditing. Run scripts/audit-eclipse-art.py
after modifying PNGs; tests verify its checksums and zero clipping. Overlays can
have a wider cell than bodies while sharing projected scale and foot alignment.
Preserve Node 24 LTS restriction: Windows/Node 26 native SQLite failures were observed.

## Current visual direction

Read docs/DIRECAO-VISUAL-2D-25D.md and docs/ART_BIBLE.md. The latest user direction
supersedes the older art freeze only for targeted, integrated improvements. Keep
runtime 2D Canvas sprites, fixed three-quarter perspective, authoritative gameplay,
and existing systems. Start with the five player forms, Hunter first. Never bulk
create unused assets. Reuse the source rigs for reproducible frame exports, audit
all changed PNGs, integrate and run the actual game before expanding content.
Vila de Eclipse and Floresta Amaldiçoada remain the reference regions. Do not
expand maps or publish artwork merely because files exist. Maintain
ASSET_STATUS.md with created/integrated/tested status and real screenshots.
