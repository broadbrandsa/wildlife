# Claude Code prompt: engagement pass (7 changes)

Copy everything below the line into Claude Code, run from the project root.

---

Read `CLAUDE.md` and `README.md` first and obey the project rules throughout: Kruger Wild design system only (CSS variable tokens + inline styles, no Tailwind, no hard-coded colours), fonts via `var(--font-serif)` / `var(--font-sans)` / `var(--font-mono)`, Phosphor icons as `<i className="ph ph-..." />`, calm field-ranger voice in sentence case, no emoji, no exclamation marks, and never use em dashes in any copy. Reuse the components in `src/components/ds`. Game state lives in the Zustand store at `src/store/game.ts` (persisted to localStorage); seed content lives in `src/data/*`. Motion must be calm and ease-out and respect `prefers-reduced-motion`. Run `npm run build` when finished; it must pass clean.

The patrol truck feature (`truckRidesLeft`, `rideTruck`, the `truck-fuel` item) is already implemented; integrate with it where noted.

Design intent for this whole pass: the daily loop (move, read, learn) needs anticipation, felt progress and a reason to return tomorrow. Everything below is progress feedback and ritual. Nothing may become punitive, anxious or pushy: no expiring rewards, no streak shaming, no pressure copy.

## 1. The scent read becomes a reveal

The scent read card on the map page currently renders its verdict instantly. Turn it into a short reveal that plays when there is a NEW read to show.

- A read is "new" when the pin position changes (a walk via `moveRanger`, a truck ride via `rideTruck`, or the first pin) or when the round day advances. Persist a key in the store, `lastRevealKey: string | null`, set to `` `${day}:${pin.updatedAt}` `` once a reveal has played. If the current key matches, render the verdict instantly with no animation, so navigating between tabs or reopening the app never replays it.
- Reveal sequence, about 2.2 seconds total: the card first shows a mono line `{DOGNAME} IS CASTING...` (uppercase, wide tracking) with the paw-print icon using the existing `kw-spin` class, then the tier Tag and the serif verdict text fade and rise in (reuse `kw-rise`). No bounce, no typewriter clicks.
- Under `prefers-reduced-motion`, skip the delay entirely and render the final state at once. Still set `lastRevealKey`.
- Haptics: at the moment the verdict lands, call `navigator.vibrate(30)` for a warm read and `navigator.vibrate([40, 60, 40])` for a hot read, guarded with `typeof navigator !== "undefined" && "vibrate" in navigator`. Nothing for cold or faint.

## 2. Warmer or colder, day over day

Give the player a truthful sense of progress without leaking distance.

- Store: add `prevRead: { day: number; tier: ScentTier } | null`. At the moment a reveal completes (same trigger as `lastRevealKey`), compare the new tier to `prevRead.tier`, display the delta, then overwrite `prevRead` with the new read. Add a `tierRank` helper in `src/lib/game.ts` (cold 0, faint 1, warm 2, hot 3).
- Render the delta as a mono footer line inside the scent card (uppercase, wide tracking, `var(--text-muted)`):
  - Tier improved: `WARMER THAN YOUR LAST READ`
  - Tier dropped: `COLDER THAN YOUR LAST READ`
  - Same tier, not cold: `NO CHANGE. THE TRAIL IS PATIENT.`
  - Same tier, cold: `STILL COLD. FRESH GROUND IS A DRIVE AWAY.` (only if `truckRidesLeft > 0`, otherwise `STILL COLD.`)
- No delta line on the first ever read.
- The delta only ever compares the player's own tiers. Never show km, bearings or anything beyond the existing read.

## 3. Case board and the shrinking search area

The detective mid-game. Zones can be marked suspect or ruled out, and a headline number falls as ground is eliminated.

- Data: add `areaKm2: number` to the `Zone` interface in `src/data/types.ts` and to every zone in `src/data/zones.ts`. Use these values (they sum to 19,485): far-north 975, punda-sandveld 1950, mopane-shingwedzi 4870, letaba-olifants 1365, central-basalt 3900, lebombo 1560, southern-sabie 2925, sw-granite 1940.
- Store: add `zoneMarks: Partial<Record<ZoneId, "suspect" | "ruled-out">>` (initial `{}`) and an action `cycleZoneMark(zoneId)` cycling open, suspect, ruled-out, open. Include in `initial` so `reset()` clears it.
- Lib: add `searchAreaKm2(marks)` to `src/lib/game.ts`: 19,485 minus the sum of ruled-out zones' areas.
- Journal (`src/app/(game)/journal/page.tsx`): rework the existing field-guides grid into a single case board grid so there are not two competing zone grids. Each zone card keeps its guide behaviour (the Read / R25 / Free pick affordance opens or unlocks the guide exactly as now) and gains a mark state:
  - Tapping the card body cycles the mark. Tapping the guide affordance opens or unlocks the guide as before. Keep both touch targets comfortably large and visually distinct.
  - Mark rendering: suspect shows a small filled `ph-fill ph-detective` (or `ph-fill ph-eye`) tag in `var(--ochre-700)` reading "Suspect"; ruled out shows `ph-prohibit` in `var(--text-muted)` with the card content struck through or dimmed and a "Ruled out" tag. Open shows nothing.
  - Retitle the section eyebrow to "Case board" and update the helper copy: "Tap a zone to mark it suspect or rule it out. The book opens its field guide. Your first guide is free with your first pin; any other zone unlocks for R25."
- Headline stat: above the case board grid, a mono line `SEARCH AREA: 12,190 KM² OF 19,485` computed from `searchAreaKm2`, with a smaller secondary line "Rule ground out to shrink the search." Format numbers with `toLocaleString("en-ZA")`.
- Elimination clue nudge: `ClueCard` (`src/components/game/ClueCard.tsx`) accepts an optional `action?: React.ReactNode` slot rendered as a footer row. In the journal and on the map's latest-intel card, pass a "Rule it out on your case board" button for clues with `kind === "elimination"` whose zone is not yet marked ruled-out; tapping it sets the mark (use `cycleZoneMark` logic or a direct setter) and the button is replaced by a quiet confirmation line "Marked on your case board." Keep `ClueCard` itself presentational; the store wiring lives in the pages.

## 4. Breadcrumb trail on the map

- Store: add `trail: { x: number; y: number; day: number; via: "walk" | "truck" }[]` (initial `[]`). Append the new position in `moveRanger` (via "walk", including the first pin) and in `rideTruck` (via "truck"). Include in `initial` for reset. It is capped naturally by the round length; no pruning needed.
- `KrugerMap` (`src/components/game/KrugerMap.tsx`): accept a `trail` prop and render a polyline through the trail points ending at the current pin, beneath the pin marker. Walk legs: dashed stroke, about 1.5px, `var(--clay-500)` at 0.55 opacity. Truck legs (a segment whose `via` on the destination point is "truck"): longer, sparser dashes at 0.35 opacity, so a drive reads differently from a walk. Scale stroke width against zoom the same way other map overlays do. Do not add markers at old points; the line alone is enough.
- Map page passes the trail from the store. When the trail has fewer than 2 points, render nothing.
- Stretch, only if quick: draw the trail polyline onto the debrief share card canvas (`src/lib/share-card.ts`) as a small map-less flourish behind the stats. Skip if it takes more than modest effort.

## 5. End the day with a hook

When the player is out of moves (and not locked, round not over), the pin status card currently says "You have walked as far as you can today. Fresh legs tomorrow." Replace that state with a small camp summary inside the same card:

- Bold line: "Camped for the night."
- Secondary line: "{dogName} settles by the fire. Fresh legs at dawn."
- Mono footer, built from real state: `TODAY: 8 KM · WARM TRAIL · NEXT CLUE IN 2 DAYS`
  - Km today: sum of `distanceKm` over today's trail segments, rounded (a truck day shows `BY TRUCK` instead of a km figure).
  - Tier: today's revealed tier label, uppercase.
  - Countdown: reuse `nextClueLabel(day)`.
- After a truck ride (which spends the day), the same card applies with the truck wording.
- Keep the existing "One lock-in for the whole game" line below it.

## 6. Give hot a crescendo

- Visual: when the revealed tier is hot, warm the scent card itself: background `var(--clay-100)`, border `var(--clay-500)` at a subtle width, the Scent read eyebrow in `var(--clay-600)`. All other tiers keep the current neutral card.
- Hot streak: store `hotStreak: number` (initial 0). On each reveal for a NEW day: hot increments it, anything else resets to 0. When `hotStreak >= 2`, append one extra serif sentence to the verdict: day 2 "{dogName} has held this line for two days. The camp is near." and day 3 or more "{dogName} will not leave this ground. Trust the dog."
- GPS collar payoff: if the inventory contains `gps-collar` AND the revealed tier is hot, add a mono line to the scent card: `COLLAR FIX: 12 KM TO THE SUSPECT` using `distanceKm(pin, ROUND.poacher)` rounded. This must render ONLY while hot, so it can never be used to triangulate from far away. Update the `gps-collar` `effect` copy in `src/data/equipment.ts` to: "Reveals a paid tracking intel clue on where the pack has worked, and once the trail is fresh the collar reads the range to the suspect." Do not change its `fundedEquivalent` or `realWorldNote`.

## 7. Copy tweaks

- Progressive disclosure: the explainer paragraph in the scent card ("{dogName} reads the ground wherever your ranger stands...") shows only until the player has had two reveals (track with the existing state added above, for example show it while `prevRead` is null or the trail has fewer than 3 points). After that it disappears; the delta line from point 2 takes its place.
- Cold tag: in the map page's `TIER_META` usage, stop switching the Tag label to "Nothing here" outside the third; always show the tier label, so cold reads "Cold ground". The verdict sentence already carries the story.
- Lock-in modal: add one sentence to the body copy: "Ties go to the earliest locked pin, so lock in when you are sure." Keep everything else as is.
- Codes success (`src/app/(game)/codes/page.tsx`): after a successful redemption, under the credit line, add a quiet line: "Heard it somewhere? Pass it on. Codes are for everyone."
- Sweep every piece of new copy for em dashes and exclamation marks; there must be none. All data lines (km, counts, countdowns) in mono, uppercase, wide tracking.

## Store summary (so it is done once, coherently)

New persisted state: `lastRevealKey: string | null`, `prevRead: { day; tier } | null`, `zoneMarks`, `trail`, `hotStreak`. All added to `initial` so `reset()` clears them, and all tolerated as missing by zustand persist merge for existing saves. New actions: `cycleZoneMark`, plus trail appends inside `moveRanger` and `rideTruck`, plus whatever small setter the reveal needs (for example `recordReveal(key, read)` doing `lastRevealKey`, `prevRead` and `hotStreak` in one update).

## Out of scope for this pass

Push notifications, sound effects, streak counters, the debrief page beyond the optional share-card trail, clue content changes, scent logic or thirds changes, checkout changes.

## Verify before finishing

- `npm run build` passes clean.
- Manual walkthrough on the profile day scrubber: drop first pin (reveal plays once, no delta line), switch tabs and return (no replay), move the ranger (new reveal plus delta), scrub to the next day (new reveal), take a truck ride (reveal, camp card shows BY TRUCK), rule out the far north from the day 10 elimination clue's button (case board updates, search area falls), walk until out of moves (camp summary with km and countdown), reach hot with the gps-collar owned (warm card, collar fix line), reset from profile (trail, marks, streak all clear).
- Toggle `prefers-reduced-motion` and confirm reveals render instantly.
- Confirm the collar fix line never appears on cold, faint or warm reads.
