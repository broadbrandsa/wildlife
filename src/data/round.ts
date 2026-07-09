import type { Round } from "./types";

/**
 * The hunt is a SINGLE round with one winner (closest locked pin at the close).
 *
 * The poacher hides at a bald granite lookout koppie in FAR-SOUTHERN Kruger,
 * anchored on Mathekenyane (Granokop), about 12 km south of Skukuza. This sits
 * in the general southern region that carries the heaviest real rhino-poaching
 * pressure, but the spot itself is a public tourist viewpoint. No clue ever
 * names Mathekenyane or Granokop; the debrief may reveal it.
 *
 * Full clue and location design: Information/SAWC_K9_Clue_Bank.xlsx
 */
export const ROUND: Round = {
    number: 1,
    name: "The Southern Koppie",
    startsAt: "2026-06-01T00:00:00+02:00",
    endsAt: "2026-08-30T00:00:00+02:00",
    durationDays: 90,
    // Production note: poacher coords are server-only and never shipped to the
    // client. Held here for the offline v1 prototype only.
    // x: 0 (west) to 1 (east); y: 0 (north) to 1 (south). This is the real
    // projected position of Mathekenyane (-25.1128, 31.5306) on the map
    // built in components/game/map-geometry.ts. Falls in Zone 7.
    poacher: { x: 0.555, y: 0.859 },
    poacherZoneId: "southern-sabie",
    poacherFeature: "a lone granite lookout dome south of Skukuza",
};

/**
 * Demo state is "Day 1" per the pitch spec. Set to a number to pin the round
 * day deterministically; set to null to compute from the real date.
 *
 * Production: this MUST be set to null so the day is derived from the real
 * calendar, and the poacher coordinates above MUST move server-side (never
 * shipped to the client) so a determined player cannot read them from the
 * bundle. This whole file is a v1 offline prototype convenience.
 */
export const DEMO_DAY_OVERRIDE: number | null = 1;
