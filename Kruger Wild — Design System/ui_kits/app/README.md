# Kruger Wild — Mobile App UI Kit

A high-fidelity recreation of the Kruger Wild **field-companion app** — the tool a visitor uses inside the park. Rendered in a phone frame on a bushveld backdrop.

## Tabs / flow
`index.html` is an interactive click-through with a bottom tab bar:
- **Today** — location header (rest camp, sunrise), quick actions (log / map / emergency), and a live "recent sightings near you" feed.
- **Guide** — searchable, filterable species list (compact rows).
- **Map** — game-drive map with sighting pins, a "you are here" dot, and a nearby-activity bottom sheet.
- **Checklist** — the visitor's trip log with Big Five progress; tap any species to review.

Tapping a species (feed, list, map pin, or checklist) opens a **full-screen species detail** with a sticky "Log this sighting" button that toggles checklist state live.

## Files
- `index.html` — loads React + Babel + Phosphor + the DS bundle, then the screens.
- `data.js` — shared demo content (`window.KW_DATA`, copied from the website kit).
- `Today.jsx`, `AppExplore.jsx`, `Map.jsx`, `Log.jsx`, `AppSpecies.jsx`, `app.jsx` (frame + tab bar + state).

## Components used
`Button`, `IconButton`, `Tag`, `Badge`, `StatBlock`, `Field`, `PhotoPlate` from `window.KrugerWildDesignSystem_6ab219`. Screen files register on `window` (e.g. `window.KWA_Today`).

## Notes
Imagery uses `PhotoPlate` placeholders. The map is a stylized vector stand-in — replace with a real tiled map (e.g. Mapbox) in production.
