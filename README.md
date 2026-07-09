# SAWC K9 Pin-Drop Hunt

A mobile-first conservation fundraising game for the Southern African Wildlife College (SAWC) K9 Anti-Poaching Unit. You play a K9 ranger with a dog companion, reading clues to track a fictional poacher hidden on a stylised map of Kruger, dropping a pin to guess the location. Donations fund the real K9 unit.

Built on the **Kruger Wild** design system. This is the v1 prototype: a real, working app with a fake (Ozow-mimic) checkout, ready to play on a phone in a pitch.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Kruger Wild design system**: CSS-variable tokens + ported React components (`src/components/ds`)
- Fonts: **Spectral** (serif), **Hanken Grotesk** (UI), **Space Mono** (data) via Google Fonts
- Icons: **Phosphor** (web font, loaded in `layout.tsx`)
- State: **Zustand** + `persist` (localStorage = the v1 mock backend)
- Map: stylised SVG + `react-zoom-pan-pinch`
- Hosting: **Vercel**

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Where things live

```
src/
├── app/
│   ├── page.tsx            # splash
│   ├── welcome/            # how-it-works intro
│   ├── onboarding/         # age → parent gate → name → origin → ranger → dog (one stepper)
│   └── (game)/             # the app shell (bottom tab bar) wraps these:
│       ├── map/            # the hunt: HUD + SVG map + pin drop
│       ├── journal/        # clue journal (unlocked + locked)
│       ├── shop/           # equipment / donation catalogue
│       ├── checkout/[id]/  # fake Ozow checkout (amount → bank → auth → success)
│       ├── codes/          # Intel Intercept (sponsor coupon codes)
│       ├── allies/         # Our Allies (plain, no logos)
│       ├── profile/        # ranger profile, donation history, demo reset
│       └── legal/          # rules & privacy
├── components/
│   ├── ds/                 # Kruger Wild components (Button, Card, Tag, Field, …)
│   └── game/               # GameShell, KrugerMap, ClueCard, Logo
├── data/                   # seed content: zones, dogs, equipment, clues, sponsors, codes, round
├── lib/                    # game logic (day/clue release, distance scoring), formatting
├── store/                  # Zustand game store
└── styles/tokens/          # Kruger Wild design tokens (colors, type, spacing, elevation)
```

## Round setup

Single round, one winner (closest locked pin, ties to the earliest lock). The poacher hides at a **bald granite lookout koppie in far-southern Kruger**, anchored on **Mathekenyane (Granokop)** south of Skukuza (Zone 7). This sits in the general southern region of heaviest real rhino-poaching pressure, but the spot itself is a public tourist landmark, and no clue ever names it. Full design and sources: `Information/SAWC_K9_Clue_Bank.xlsx`.

The clue bank holds **30 clues across five difficulty tiers**, built backwards from the koppie: **20 free time-released** clues (Tier 1 north-vs-south down to Tier 5 triangulation) plus **10 paid clues** (5 revealed by kit purchases, 5 by sponsor codes). Two are elimination clues that rule zones out. Early clues are riddles solved with the in-game field guide and case board; the trail never names the hill. Target: under 15 percent of players land a perfect pin.

The demo is pinned to **Day 1** (`DEMO_DAY_OVERRIDE` in `src/data/round.ts`); set it to `null` to use real dates. The profile page has **demo controls**: a day scrubber to show the 90-day arc and a debrief preview.

Demo coupon codes (Intel Intercept): `5FM-RHINO-06`, `BIRD-MARULA-07`, `SCHOOL-WARDEN-04`, `TOTAL-FROST-09`, `UNION-CROSS-01`.

## Kit room

Every purchasable item funds the real SAWC K9 unit and gives a real hunt advantage: `reinforced-leash` (a second scent read a day), `pro-binoculars` (deeper map zoom), `ranger-boots` (reads reach further), `ranger-compass` (reads show the trail's compass direction), `monthly-healthcare` (a fit dog never draws a blank, cold reads come back faint), and five kit items that reveal a paid intel clue (`topo-map`, `gps-collar`, `ranger-gps`, `plane-flyover`, `helicopter-recon`). Dog choice shapes the scent read too: Scout and Dotty show direction; Banjo, Storm and Pepper widen the range. Logic in `src/lib/game.ts` (`scentRead`, `readShowsDirection`).

## Gameplay systems

- **Scent reads** (`map`): once per round day, your dog checks the ground at your pin and answers in one of four tiers (cold / faint / warm / fresh). Scout adds a compass pull; Banjo widens the tiers. Uses `distanceKm` + `scentRead` in `src/lib/game.ts`.
- **Dog effects**: each dog's advertised effect is real. Storm, Dotty and Pepper surface dog-instinct clues on set days; Scout and Banjo modify scent reads.
- **Case board** (`journal`): tap a zone to cycle open → suspect → ruled out. The book icon opens the field guide.
- **Field guide**: every zone's geology, vegetation, species and named places (from `src/data/zones.ts`), the toolkit that makes clue riddles solvable. Reachable from the map chips and case board.
- **Morning patrol** (`map`): a daily log-in ritual with a rotating field note (`src/data/patrol.ts`) and a streak counter.
- **Debrief** (`/debrief`): shown when the round ends (or via profile preview). Reveals the camp, scores your pin distance and awards a tracker rating.
- **Prizes** (`/prizes`): how the round is won (closest locked pin, ties to the earliest lock) and the tiered prize table from `src/data/prizes.ts`: 1 grand safari prize, 5 getaway prizes, 20 gear prizes, with illustrative SA prize partners. Also carries the R500,000 round fundraising goal, echoed on the impact page. Entry is free and never tied to a donation (CPA section 36 note on the legal page).
- **Community presence** (`src/lib/community.ts`): a deterministic v1 simulation of the national field of players, seeded off the round day (rangers hunting, pins locked). Shown on the map HUD and as debrief context. Replace with real aggregates once pins and donations are recorded server-side.
- **Next-clue countdown** (`map` and `journal`): a mono line counting down to the next free or dog-instinct clue (`nextClueLabel` in `src/lib/game.ts`).
- **Share card** (`/debrief`): a 1080x1350 result card drawn client-side on a canvas (`src/lib/share-card.ts`), shared via the Web Share API where available, otherwise downloaded as a PNG.

## Real unit photography

The team page (`/team`) shows the real SAWC handlers and dogs. Until the College supplies portraits, each profile renders a branded placeholder plate. To drop in a real photo, add the image under `public/Unit/` using the convention `public/Unit/<first-name-lowercase>.jpg` (for example `public/Unit/precious.jpg`), then set `photo: "/Unit/precious.jpg"` on that profile in `src/data/real-team.ts`. The team page renders the photo automatically when `photo` is set. Do not commit placeholder images.

## Out of scope for v1 (see `Information/` for the full handover)

Real payments, SAWC admin portal, leaderboard backend, accounts/auth, multi-language. All player state lives in localStorage. The `Information/` folder holds the research and decision history; `Kruger Wild — Design System/` is the source design kit.
