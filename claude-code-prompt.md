# Claude Code prompt: SAWC K9 Pin-Drop Hunt, remaining improvements

Copy everything below the line into Claude Code, run from the project root.

---

Read `CLAUDE.md` and `README.md` first and obey the project rules throughout: Kruger Wild design system only (CSS variable tokens + inline styles, no Tailwind, no hard-coded colours), fonts via `var(--font-serif)` / `var(--font-sans)` / `var(--font-mono)`, Phosphor icons as `<i className="ph ph-..." />`, calm field-ranger voice in sentence case, no emoji, no exclamation marks, and never use em dashes in any copy. Reuse the components in `src/components/ds`. Game state lives in the Zustand store at `src/store/game.ts` (persisted to localStorage); seed content lives in `src/data/*`. Run `npm run build` when finished; it must pass clean.

Context on what already exists: the map page (`src/app/(game)/map/page.tsx`) has a HUD header, scent reads (daily dog verdict on the pin via `scentRead` in `src/lib/game.ts`), a morning patrol card with streak, field guide chips opening `ZoneSheet`, a two-step lock button, and a round-over banner. The journal has a case board (zone marks in the store). `/prizes` explains the tiered prizes and win rules (closest locked pin, ties to earliest lock). `/debrief` reveals the poacher and awards a tracker rating via `trackerRating`. The profile page has demo controls (day scrubber writing `demoDay` to the store, read via `useCurrentDay`). The team page embeds the unit's YouTube film and has verified stats.

Make the following changes:

## 1. Simulated community presence (make the hunt feel alive)

Add a deterministic, believable community simulation so a solo player feels part of a national event. Create `src/lib/community.ts` with functions seeded off the round day (use `useCurrentDay`), no randomness between renders: `rangersHunting(day)` growing from ~4,000 on day 1 toward ~28,000 by day 90 on an ease-out curve with minor day-to-day wobble (deterministic hash of day), and `pinsLocked(day)` as a growing fraction of rangers (5% early, 60% by day 88). Surface on the map HUD as a third mono stat line: `12,482 RANGERS HUNTING` (format with a thin-space or comma), and on the debrief as context ("You placed ahead of most of the pack" style copy is NOT allowed since we cannot know rank; instead show "X rangers hunted this round"). Mark the module clearly as a v1 simulation to be replaced by real aggregates.

## 2. Next-clue countdown (the return hook)

On the map page, under the Latest intel section header (or as a small row above the clue card), show when the next free or dog clue lands: compute from `CLUES` release days versus the current day, respecting the player's dog for dog-instinct clues (see `availableClueIds` / `isDogClueReleased` in `src/lib/game.ts`). Copy in mono, e.g. `NEXT CLUE IN 3 DAYS` or `NEW CLUE TOMORROW`; if none remain, `ALL FIELD CLUES RELEASED`. Also show it in the journal header line.

## 3. Lock-in nudge (explain why locking early matters)

The pin status card's helper text currently explains moving the pin. When a pin exists and is unlocked, add one calm sentence: "Ties go to the earliest locked pin, so lock in when you are sure." Keep the two-step confirm behaviour.

## 4. Fair-play line in the shop

At the top of the shop page (`src/app/(game)/shop/page.tsx`), under the page title, add the fair-play sentence exported as `FAIR_PLAY_LINE` from `src/data/prizes.ts`, styled as small secondary text. Players must understand kit funds the dogs and unlocks intel but never buys the win.

## 5. Make the remaining equipment effects real

Three items promise effects that do nothing yet (`src/data/equipment.ts`):
- `pro-binoculars` ("doubles zoom"): pass a `maxScale` prop into `KrugerMap` (currently hard-coded 4 in `TransformWrapper`); use 8 when the inventory contains `pro-binoculars`. Wire inventory from the store in the map page.
- `reinforced-leash` ("an extra pin change each week"): pins are currently unlimited, so instead reword the item's `effect` to something true and useful, e.g. granting a second scent read per day. Implement: if inventory has `reinforced-leash`, allow two scent reads per day (track reads-per-day count in the store instead of the single `lastScentRead`; keep the most recent read displayed, show `READS TODAY: 1 OF 2` in the mono footer).
- `week-dog-food` ("covers more ground"): reword `effect` honestly to a real mechanic or flavour. Simplest: it upgrades the morning patrol note with a bonus "did you know" fact for 7 days after purchase, or just reword to flavour with no mechanical claim. Choose one and make copy match behaviour.
Keep all `fundedEquivalent` values unchanged (they are verified against SAWC's published donation asks).

## 6. Shareable debrief result

On `/debrief`, add a "Share your result" button (primary placement under the rating card). Generate a share card client-side on a `<canvas>` (1080x1350): dark green radial background (#21392C to #16110A), the Kruger Wild mark from `/logo/kruger-wild-mark.svg`, the player's ranger name and dog name, distance ("12 km from the camp"), rating title in Spectral-style serif (use the loaded font families), round name, and the line "SAWC K9 Pin-Drop Hunt". Use the Web Share API with file support when available (`navigator.canShare({ files })`), falling back to downloading the PNG. No external libraries.

## 7. Real unit photography slots

`src/data/real-team.ts` profiles support an optional `photo` field rendered by the team page. When SAWC supplies portraits, images go in `public/Unit/`. Add a short note to `README.md` documenting this (filename convention `public/Unit/<first-name-lowercase>.jpg`, then set `photo: "/Unit/precious.jpg"` on the profile). Do not add placeholder images.

## 8. Housekeeping

- `DEMO_DAY_OVERRIDE` in `src/data/round.ts` stays `1` for the pitch build; add a comment that production must set it to `null` and move poacher coordinates server-side.
- Check every piece of new copy for em dashes and exclamation marks; there must be none.
- Run `npm run build` and fix any type errors before finishing.

Out of scope for this pass (do not build): real payments, accounts, real leaderboards, push notifications, class/team challenge modes, admin portal.
