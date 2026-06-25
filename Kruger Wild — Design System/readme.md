# Kruger Wild — Design System

A warm, editorial brand system for **Kruger Wild**, a living field guide and trip planner for South Africa's Kruger National Park — spanning a marketing website and a visitor field-companion app.

> **Status: starter brand.** This system was built from a brief + reference sites (no existing brand assets were supplied). The logo, palette, type pairing, and copy are a coherent first proposal — see **Caveats** at the bottom for what needs your input.

---

## 1. Context

**Product:** Kruger Wild helps people *discover, plan, and protect*. Two surfaces:
- **Website** — marketing + field guide: hero storytelling, the Big Five, regions, "plan your visit", species directory with a detail drawer.
- **Mobile app** — an in-park companion: today's sightings feed, a searchable field guide, a game-drive map, and a personal sightings checklist.

**Audience:** prospective and in-park visitors (families, self-drivers, birders, photographers) plus conservation-minded supporters. Tone is that of a knowledgeable, unshowy ranger.

**Reference inspiration** (provided by the client — recreations, not assets):
- https://www.jeffcogreenways.org/ — conservation org, illustration + photography, calm editorial nav
- https://harvestgroove.webflow.io/ — warm organic palette, generous type
- https://arborea.webflow.io/ — immersive full-bleed nature imagery, refined serif
- https://www.playinthewoods.com/ — outdoorsy, grounded, tactile

No codebase or Figma was attached; if one exists, re-share it and this system will be reconciled against it.

---

## 2. Content fundamentals (voice & tone)

**Voice:** a seasoned field ranger — knowledgeable, calm, never breathless. Reverent about the wild, precise about facts, lightly poetic in headlines only.

- **Person:** address the reader as **you** ("Plan your visit", "Where to see them"). The organisation is **we**, used sparingly.
- **Casing:** Sentence case for headings and buttons ("Plan your visit", not "Plan Your Visit" — nav labels are the one Title Case exception). Mono eyebrows are UPPERCASE with wide tracking.
- **Headlines:** short, evocative, serif. *"Where the wild still runs." "Five animals that define the bushveld."* Never clickbait.
- **Body:** plain, concrete, factual. Lead with the animal/place, then the detail. Favour specifics ("prides of up to a dozen", "507 bird species") over adjectives.
- **Data voice:** coordinates, distances, times, and counts are set in mono and treated as field-guide data: `-24.9945° S, 31.5547° E`, `12.4 km`, `GATES 05:30—18:00`.
- **Emoji:** never. Iconography carries that role.
- **Numerals:** numerals for stats and measurements; spell out only in flowing prose where it reads better.
- **Restraint:** no exclamation marks, no hype, no "amazing/incredible". Let the subject be impressive on its own.

**Examples**
- Eyebrow: `FIELD GUIDE · NO. 04`
- CTA: "Explore the wildlife" · "Book a safari" · "Log this sighting"
- Microcopy: "Location withheld for protection." (rhino) — conservation honesty over completeness.

---

## 3. Visual foundations

**Palette — the bushveld.** Warm and earthen, drawn from the lowveld itself.
- **Bushveld green** (`--green-*`) — primary brand + dark surfaces. Deep, slightly desaturated.
- **Savanna ochre** (`--ochre-500`) — the signature accent: golden-hour light, high-emphasis CTAs, eyebrows.
- **Clay / terracotta** (`--clay-500`) — secondary accent: soil, sunset, links, "danger".
- **Weathered teal** (`--teal-500`) — cool accent for water, dawn, birds.
- **Sand neutrals** (`--sand-*`) — bone page (`--sand-50`), warm greys, ironwood ink (`--sand-900`). There is **no pure grey or black** anywhere — every neutral is warm.

**Typography**
- **Spectral** (serif) — all display + editorial headings, pull quotes, species Latin names (italic). Semibold, tight tracking (−0.02em) at large sizes.
- **Hanken Grotesk** (humanist grotesque) — body, UI, labels. 400–700.
- **Space Mono** — eyebrows, coordinates, counts, metadata, timestamps. UPPERCASE + 0.14em tracking for labels.
- Scale is a fluid 1.25 major third on a 16px base (`--text-display` → `--text-xs`). Body never below 16px.

**Backgrounds & imagery.** Photography-led: full-bleed, golden-hour, warm. All imagery passes through `PhotoPlate`, which keeps photos on-palette with a subtle warm multiply overlay and, when no photo is present, shows a branded duotone wash (`bushveld / savanna / clay / dawn / sand`) with a faint glyph. Overlay text always sits on a **protection gradient** (transparent → `rgba(17,32,26,0.86)`), never raw on the image. No noise/grain by default; no busy patterns.

**Corners.** Soft and organic: cards `--radius-lg` (18px), buttons fully **pill**, inputs `--radius-md`. Phone sheets and feature panels go larger (`--radius-xl/2xl`).

**Elevation.** Low, warm, sand-tinted shadows (`rgba(33,28,20,…)`) — never grey/black haze. Cards rest on `--shadow-sm`; on hover they lift `-3px` to `--shadow-lg`. A hairline inset ring (`--ring-hairline`) crisps card edges over photography.

**Borders.** 1px warm sand borders (`--border-subtle/default`) on cards and inputs. Inputs use a **1.5px** border that turns ochre on focus with a soft ochre glow ring.

**Motion.** Calm and settled. `--ease-out` for most things, `--dur-base` (240ms) default. Hover = lift + shadow + gentle color shift; press = 0.5px nudge down. Drawers slide + fade over `--dur-slow`. **No bounce, no spin, no infinite loops.** All durations collapse to 0 under `prefers-reduced-motion`.

**Hover / press states.** Buttons darken to a `-hover` token and nudge on press. Cards lift. Tags/chips fill brand green when selected. Links shift green→clay. Icon buttons swap to a soft sand fill.

**Transparency & blur.** Reserved for floating chrome over content — the sticky site header (`rgba(250,246,236,0.86)` + blur) and the app tab bar / map search bar. Content surfaces stay opaque.

**Layout.** Max content width 1200px, fluid gutters (`--gutter`), section rhythm via `--section-y`. Generous negative space; let single subjects breathe.

---

## 4. Iconography

- **System:** [Phosphor Icons](https://phosphoricons.com/) (`@phosphor-icons/web` via CDN), **regular** weight as default; `-fill` variants for active states (e.g. selected tab bar items). 1.5px stroke matches the warm, light feel.
- **Usage:** `<i class="ph ph-paw-print"></i>`. Common glyphs: `paw-print, bird, tree, leaf, binoculars, mountains, sun-horizon, footprints, map-trifold, map-pin, compass, tent, drop, list-checks`.
- **Why Phosphor:** broad nature coverage, a friendly-but-precise tone, and both stroke + fill weights — a good fit until/if a bespoke wildlife icon set is commissioned. **(Substitution flag: Phosphor stands in for a custom set; swap if you have one.)**
- **Emoji:** never used. **Unicode:** only typographic marks (·, —, °, ★) as accents, never as icons.
- **Logo:** the acacia (umbrella-thorn) emblem in `assets/logo/` — `kruger-wild-mark.svg` (full colour) and `kruger-wild-mark-mono.svg` (`currentColor`, for dark/photographic backgrounds). The wordmark lockup is composed in markup (Spectral 600 + a Space Mono tagline), shown on the **Logo & Wordmark** card.

---

## 5. Index / manifest

**Root**
- `styles.css` — the single entry point consumers link. `@import`s only.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill front-matter for use in Claude Code.

**Tokens** (`tokens/`, all reached from `styles.css`)
- `fonts.css` (Google Fonts @import) · `colors.css` · `typography.css` · `spacing.css` · `elevation.css` (radii/shadow/motion) · `base.css` (resets).

**Components** (`window.KrugerWildDesignSystem_6ab219`)
- `actions/` — **Button**, **IconButton**
- `content/` — **Eyebrow**, **Tag**, **Badge** (IUCN status), **StatBlock**, **Card**, **PhotoPlate**
- `forms/` — **Field**
- Each ships `.jsx` + `.d.ts` + `.prompt.md`; demos live in the per-folder `*.card.html`.

**UI kits**
- `ui_kits/website/` — marketing site (Home, Explore, species drawer, footer). Entry `index.html`.
- `ui_kits/app/` — visitor field-companion app (Today, Guide, Map, Checklist, species detail). Entry `index.html`.

**Foundations specimen cards** (`guidelines/`) — Colors, Type, Spacing, Brand cards shown in the Design System tab.

**Assets** (`assets/logo/`) — acacia emblem (colour + mono).

---

## Caveats & how to make this perfect

1. **Fonts load from Google Fonts** (Spectral / Hanken Grotesk / Space Mono) via `@import`, so the static analyzer lists 0 self-hosted fonts. They render everywhere online. **If you want these exact fonts or need offline/self-hosting, upload the `.woff2` files** and I'll wire `@font-face`. If you already have brand fonts, share them and I'll substitute.
2. **Logo is a starter mark** (acacia + rising sun). If you have an official Kruger Wild / SANParks-style logo, share it and I'll replace the emblem and rebuild the lockups.
3. **Iconography is Phosphor** as a stand-in. Confirm, or point me at a custom set.
4. **All imagery is placeholder** (`PhotoPlate` duotone washes). Drop in real golden-hour wildlife photography and I'll wire `src`s throughout both kits.
5. **Copy & species facts are illustrative**, written to demonstrate voice — not verified park data.

**Tell me:** (a) is the bushveld palette + Spectral/Hanken/Space Mono direction right, or should I explore alternatives? (b) Do you have a logo, fonts, photography, or an existing codebase to align to? (c) Any third surface (e.g. donation portal, ranger admin) to add as a UI kit?
