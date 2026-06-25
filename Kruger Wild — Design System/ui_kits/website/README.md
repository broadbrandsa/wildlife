# Kruger Wild — Website UI Kit

A high-fidelity recreation of the Kruger Wild marketing/field-guide website. Demonstrates the brand's editorial layout system on a real product surface.

## Screens / flow
`index.html` is an interactive click-through:
- **Homepage** — full-bleed hero (overlay + protection gradient), park-fact stat strip, the Big Five grid, regions (overlay cards), and a split "Plan your visit" CTA.
- **Explore** — species directory with filter chips (Big Five / Predators / Herbivores / Birds) and live search.
- **Species drawer** — slides in from the right on any species card; vitals, habitat, "where to see", checklist actions.

Navigate via the header ("Explore"), the hero / section CTAs, and species cards.

## Files
- `index.html` — loads React + Babel + Phosphor + the DS bundle, then the screens.
- `data.js` — fictional demo content (`window.KW_DATA`). Copy is invented; species facts are illustrative.
- `Header.jsx`, `Home.jsx`, `Explore.jsx`, `SpeciesDetail.jsx`, `Footer.jsx`, `app.jsx`.

## Components used
`Button`, `IconButton`, `Eyebrow`, `Tag`, `Badge`, `StatBlock`, `Card`, `PhotoPlate`, `Field` — all from `window.KrugerWildDesignSystem_6ab219`. Each screen file registers itself on `window` (e.g. `window.KW_Home`) so the Babel scripts can compose without shared scope.

## Imagery
All photography is represented by `PhotoPlate` (duotone wash + glyph). Swap in real golden-hour wildlife photography by passing `src` to each `PhotoPlate`.
