# SAWC K9 Pin-Drop Hunt: working notes

Mobile-first Next.js conservation game for the SAWC K9 Unit, built on the **Kruger Wild** design system. See `README.md` for structure and `Information/` for the full project handover and research.

## Design system (important)

Use the **Kruger Wild** system, NOT generic Tailwind/Untitled UI. There is **no Tailwind** in this project — styling is CSS-variable tokens + inline styles, matching the design kit in `Kruger Wild — Design System/`.

- **Never hard-code colours.** Use the token variables: `var(--green-800)`, `var(--ochre-500)`, `var(--clay-500)`, `var(--sand-50)`, semantic aliases like `var(--text-primary)`, `var(--surface-card)`, `var(--brand)`, `var(--accent)`. Tokens live in `src/styles/tokens/`.
- **Fonts:** `var(--font-serif)` (Spectral) for display/headings and clue text; `var(--font-sans)` (Hanken Grotesk) for UI/body; `var(--font-mono)` (Space Mono) for eyebrows, data, counts, codes, set UPPERCASE with wide tracking.
- **Components:** reuse `src/components/ds` (`Button`, `IconButton`, `Eyebrow`, `Tag`, `Badge`, `StatBlock`, `Card`, `PhotoPlate`, `Field`). They are the ported design-system components (`.jsx` + `.d.ts`).
- **Icons:** Phosphor web font, `<i className="ph ph-paw-print" />`, with `-fill` variants for active states.
- **Voice:** calm field-ranger tone, sentence case, "you" for the player, no emoji, no exclamation marks. Data in mono.
- **Motion:** calm, ease-out, no bounce/spin loops (except the radio dial + loaders). Respect `prefers-reduced-motion`.
- **Standing instruction from Mike: never use em dashes** in any written content (copy, clues, UI text).

## Conventions

- Files kebab-case. Game state in the Zustand store (`src/store/game.ts`), persisted to localStorage.
- Pages that read persisted state are client components and rely on `useHydrated()` / the `GameShell` guard (redirects to `/welcome` if no player).
- Seed content is in `src/data/*` (typed). Add clues/equipment/zones there, not inline.
- The `(game)` route group gets the bottom tab bar via `GameShell`. Splash, welcome and onboarding sit outside it.
- `useSearchParams` must be wrapped in `<Suspense>` (see `map/page.tsx`).

## After changes

Run `npm run build` before committing; it type-checks the whole app.
