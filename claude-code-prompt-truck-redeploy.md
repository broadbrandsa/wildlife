# Claude Code prompt: patrol truck redeploy

Copy everything below the line into Claude Code, run from the project root.

---

Read `CLAUDE.md` and `README.md` first and obey the project rules throughout: Kruger Wild design system only (CSS variable tokens + inline styles, no Tailwind, no hard-coded colours), fonts via `var(--font-serif)` / `var(--font-sans)` / `var(--font-mono)`, Phosphor icons as `<i className="ph ph-..." />`, calm field-ranger voice in sentence case, no emoji, no exclamation marks, and never use em dashes in any copy. Reuse the components in `src/components/ds`. Game state lives in the Zustand store at `src/store/game.ts` (persisted to localStorage); seed content lives in `src/data/*`. Run `npm run build` when finished; it must pass clean.

## Why this feature exists (design intent)

The ranger walks about 8 km a day (`BASE_DAILY_KM` in `src/lib/game.ts`). A player whose first pin lands in the far north is roughly 225 km from the poacher's third and would face up to four weeks of cold scent reads with no way out. That kills retention.

The fix is the patrol truck. In real life K9 teams deploy by vehicle: handlers and dogs are trucked to where the trail starts, and the tracking begins where the wheels stop. In game terms:

- Every player gets **2 free truck rides** for the round. This never changes and is never paywalled, so the free path stays fair (CPA section 36 rationale, same as prizes).
- A ride moves the ranger to **any point on the map**, ignoring the daily walking clamp.
- **The drive takes the rest of the day.** After a ride, no further ranger moves until the next round day. Storm's second move and the ranger boots' second move do not apply on a ride day.
- The scent read works as normal at the new position. The dog reads the ground where the wheels stop.
- More rides are purchasable: a new **consumable** kit item, patrol truck fuel, R150, grants one ride per purchase, repeatable (same pattern as `extra-lockin`).
- A locked pin cannot ride. The round being over disables the truck.

## 1. Store changes (`src/store/game.ts`)

- Add `truckRidesLeft: number` to state, initial value 2. Add it to the `initial` object so `reset()` restores it. Zustand persist will merge it in for existing saves.
- Add action `rideTruck(x: number, y: number, day: number)`:
  - No-op if there is no pin, the pin is locked, or `truckRidesLeft <= 0`.
  - Sets the pin exactly to the target (do NOT pass through `clampWalk`), stamps `updatedAt`, keeps `locked: false`.
  - Decrements `truckRidesLeft`.
  - Spends the rest of the day: set `pinMovesToday = { day, count: 99 }` so the existing daily-move gate treats the day as used up. If the move gate lives in the map page rather than the store, use whatever mechanism that gate reads.
- In `purchase`, special-case `truck-fuel` the way `extra-lockin` is special-cased: it is consumable (never enters inventory) and increments `truckRidesLeft` by 1 per purchase.

## 2. Data changes (`src/data/equipment.ts`)

Add one item to `EQUIPMENT`, near `extra-lockin`:

```
id: "truck-fuel",
kitCategory: "ranger",
name: "Patrol truck fuel",
tier: "hunt",
priceZar: 150,
description: "A tank of fuel for the unit's patrol truck.",
effect: "One more truck ride. The truck carries your ranger and dog to any point on the map, but the drive takes the rest of the day. You start the round with two rides.",
fundedEquivalent: "About a day of patrol-vehicle fuel",
icon: "truck",
realWorldNote: "K9 teams deploy by vehicle. Handlers and dogs are trucked to where the trail starts, and the tracking begins where the wheels stop.",
consumable: true,
```

Notes: verify `ph-truck` exists in the Phosphor web font (fall back to `ph-van` if not). The funded equivalent is an estimate, consistent with other estimated lines; do not present it as a SAWC-published figure.

## 3. Map page (`src/app/(game)/map/page.tsx`) and `KrugerMap`

- **Rides counter:** add a mono line to the pin status area: `TRUCK RIDES LEFT: 2` (uppercase, wide tracking, `var(--font-mono)`, like the other data lines).
- **Call the truck:** a secondary action on the pin status card, visible when a pin exists, the pin is not locked, and the round is not over.
  - With rides remaining, label it "Call the patrol truck". Tapping it enters truck mode.
  - With 0 rides, label it "Fuel the patrol truck" and route to the kit room (`/shop`, the `truck-fuel` item).
- **Truck mode:** the player picks a destination anywhere on the map. Reuse the existing drag-tether and live distance chip, but without the walking clamp. Two-step confirm, matching the lock-in confirmation pattern: "Ride the truck here? The drive takes the rest of the day." with a mono line `RIDES LEFT AFTER THIS: 1`. Confirm calls `rideTruck`; cancel exits truck mode with no change. Note the walking clamp currently lives inside the store's `moveRanger`, so truck mode must call `rideTruck` instead, not `moveRanger`.
- **Cold-read nudge:** when today's scent read is cold and `truckRidesLeft > 0`, add one calm sentence under the read: "Fresh ground is a drive away. The truck has 2 rides left." (number live from the store, no pressure copy). When rides are 0 and the read is cold, the sentence becomes: "The truck is out of fuel. The kit room can fill the tank."
- If `KrugerMap` draws any max-walking-range ring or clamps the drag preview, add a prop to bypass it in truck mode.

## 4. Shop

No structural change; the item appears in Ranger kit via `EQUIPMENT`. Verify the purchase toast and the item detail read correctly for a repeatable consumable (follow whatever `extra-lockin` does). The "What is this really?" disclosure must show the `realWorldNote` like every other item.

## 5. Docs

Update the hunt-loop section of `README.md`: two free truck rides per round, a ride goes anywhere but ends the day's movement, extra rides via patrol truck fuel (R150, consumable), free rides keep the free path fair.

## Edge cases to honour

- First pin placement is already unrestricted; the truck only appears once a pin exists.
- A ride day blocks walking moves for that day only; the next round day moves normally.
- Buying `extra-lockin` to reopen a locked pin makes the truck available again. That is fine.
- The profile page demo reset (`reset()`) must restore rides to 2.
- The demo day scrubber changes the day but never refreshes or consumes rides.

## Out of scope for this pass

No auto-offered rides after cold streaks, no changes to scent logic, the thirds mechanic, clue content, the field radio, or checkout. Do not touch `fundedEquivalent` values on existing items.

## Verify before finishing

- `npm run build` passes clean.
- Manual walkthrough: drop the first pin in the far north, confirm the cold read and nudge, call the truck, ride to the south, confirm the read updates and rides show 1, confirm walking is blocked for the rest of that day, buy patrol truck fuel and confirm rides show 2, lock the pin and confirm the truck action disappears, reset from the profile page and confirm rides return to 2.
- Sweep all new copy for em dashes and exclamation marks; there must be none.
