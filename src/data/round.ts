import type { Round } from "./types";

/** Round 1 metadata. Poacher hidden at Red Rocks on the Shingwedzi (Zone 3). */
export const ROUND: Round = {
    number: 1,
    name: "The Shingwedzi Incursion",
    startsAt: "2026-06-01T00:00:00+02:00",
    endsAt: "2026-08-30T00:00:00+02:00",
    durationDays: 90,
    // Production note: poacher coords are server-only and never shipped to the
    // client. Held here for the offline v1 prototype only.
    poacher: { x: 0.555, y: 0.295 },
    poacherZoneId: "mopane-shingwedzi",
    poacherFeature: "Red Rocks viewpoint, Shingwedzi",
};

/**
 * Demo state is "Day 1 of Round 1" per the pitch spec. Set to a number to pin
 * the round day deterministically; set to null to compute from the real date.
 *
 * Production: this MUST be set to null so the day is derived from the real
 * calendar, and the poacher coordinates above MUST move server-side (never
 * shipped to the client) so a determined player cannot read them from the
 * bundle. This whole file is a v1 offline prototype convenience.
 */
export const DEMO_DAY_OVERRIDE: number | null = 1;
