---
name: kruger-wild-design
description: Use this skill to generate well-branded interfaces and assets for Kruger Wild (a wildlife field-guide website + visitor app for Kruger National Park), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference
- **Global CSS:** link `styles.css` (it `@import`s tokens + fonts + base). Components read CSS custom properties — never hard-code hex; use `var(--…)`.
- **Fonts:** Spectral (serif display/editorial), Hanken Grotesk (sans body/UI), Space Mono (data/eyebrows). Loaded via Google Fonts in `tokens/fonts.css`.
- **Icons:** Phosphor — `<script src="https://unpkg.com/@phosphor-icons/web"></script>`, then `<i class="ph ph-paw-print"></i>`. Use `-fill` for active states.
- **Components:** built React bundle at `_ds_bundle.js`, exposed on `window.KrugerWildDesignSystem_6ab219` (e.g. `const { Button, Card, Badge } = window.KrugerWildDesignSystem_6ab219`). Per-component usage is in each `*.prompt.md`. Do not `<script src>` the `.jsx` directly.
- **Imagery:** use the `PhotoPlate` component (duotone wash placeholder, or pass `src` for real photos). Always put overlay text on a protection gradient.
- **Voice:** calm field-ranger tone, sentence case, "you" for the reader, mono for data, no emoji. See README §2.

## Files
- `readme.md` — full design guide (context, voice, visual foundations, iconography, manifest).
- `styles.css` + `tokens/` — design tokens and base styles.
- `components/` — Button, IconButton, Eyebrow, Tag, Badge, StatBlock, Card, PhotoPlate, Field (`.jsx` + `.d.ts` + `.prompt.md`).
- `ui_kits/website/` and `ui_kits/app/` — full interactive product recreations to copy patterns from.
- `guidelines/` — foundation specimen cards.
- `assets/logo/` — acacia emblem (colour + mono).
