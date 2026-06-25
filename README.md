# SAWC K9 Pin-Drop Hunt

A mobile-first conservation fundraising game for the Southern African Wildlife College (SAWC) K9 Anti-Poaching Unit. You play a K9 ranger with a dog companion, reading clues to track a fictional poacher hidden on a stylised map of Kruger, dropping a pin to guess the location. Donations fund the real K9 unit.

Built on the **Kruger Wild** design system. This is the v1 prototype: a real, working app with a fake (Ozow-mimic) checkout, ready to play on a phone in a pitch.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Kruger Wild design system** — CSS-variable tokens + ported React components (`src/components/ds`)
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
│   ├── onboarding/         # age → parent gate → name → origin → dog (one stepper)
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

## Round 1 setup

The poacher is hidden at **Red Rocks on the Shingwedzi** (Zone 3). All 17 clues are genuine signals toward that spot, narrowing from zone level to landmark level. The demo is pinned to **Day 1** (`DEMO_DAY_OVERRIDE` in `src/data/round.ts`); set it to `null` to use real dates.

Demo coupon codes (Intel Intercept): `5FM-SHINGWEDZI-42`, `BIRD-ROLLER-07`, `SCHOOL-RIVER-15`.

## Out of scope for v1 (see `Information/` for the full handover)

Real payments, SAWC admin portal, leaderboard backend, accounts/auth, multi-language. All player state lives in localStorage. The `Information/` folder holds the research and decision history; `Kruger Wild — Design System/` is the source design kit.
