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

## Definitive visual direction — approval gate

Read docs/DIRECAO-DEFINITIVA.md. It supersedes conflicting visual instructions.
The previous human miniatures/rig are REJECTED. Do not refine them or use that body
as the base for new art. Preserve gameplay systems, maps and HUD.

The current Hunter DESIGN is explicitly approved and FROZEN by the user.
Current scope is WALK ONLY: correct 8 frames in all 8 directions, fixed perspective,
normal low foot lift, stable body axis, same coat and anatomically attached gear.
Do not redesign, change outfit/hat/palette or create another character. Preserve
N/S readability; E/W remain profile and all four diagonals keep fixed 3/4.
No RUN, ATTACK, additional IDLE, other classes, NPCs, map or HUD changes.
Deliver 8 individual GIFs, simultaneous 8-direction GIF, complete WALK spritesheet,
and preview screenshots in existing village at real gameplay scale: HUD off/on,
door, NPC, tree. No permanent gameplay integration; STOP for WALK approval.
Frozen references/checksums: docs/reviews/hunter-walk-final/design-lock.json.
Never reuse rejected rigs. Preserve the approved source artwork and gameplay.
