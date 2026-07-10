import { ROUND } from "@/data";

/**
 * v1 COMMUNITY SIMULATION.
 *
 * A solo player should feel part of a national event, so these functions model
 * a believable, growing field of fellow rangers. The numbers are deterministic:
 * seeded off the round day only, with no randomness between renders, so the HUD
 * never jitters. Replace this whole module with real aggregates from the backend
 * once donations and pins are recorded server-side.
 */

/** Deterministic 0..1 value for a day (stable pseudo-noise, not Math.random). */
function dayNoise(day: number): number {
    const x = Math.sin(day * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

function clamp01(n: number): number {
    return Math.min(Math.max(n, 0), 1);
}

/** Ease-out so growth is fast early and settles toward the round end. */
function easeOut(t: number): number {
    return 1 - Math.pow(1 - t, 2.2);
}

/**
 * Rangers hunting on a given day: ~4,000 on day 1 growing toward ~28,000 by
 * the round close, on an ease-out curve with a small deterministic wobble.
 */
export function rangersHunting(day: number): number {
    const span = ROUND.durationDays - 1;
    const t = clamp01((day - 1) / span);
    const base = 4000 + (28000 - 4000) * easeOut(t);
    const wobble = (dayNoise(day) - 0.5) * 0.03; // roughly +/- 1.5%
    return Math.round((base * (1 + wobble)) / 10) * 10;
}

/**
 * Pins locked on a given day: a growing fraction of the rangers hunting, from
 * about 5% early to about 60% by the closing days of the round.
 */
export function pinsLocked(day: number): number {
    const t = clamp01((day - 1) / (ROUND.durationDays - 3));
    const frac = 0.05 + (0.6 - 0.05) * easeOut(t);
    return Math.round(rangersHunting(day) * frac);
}

/**
 * Ops-room pressure line: how close the nearest ranger in the whole game is to
 * the suspect. Anonymous by design, and it never confirms a leader: when the
 * player's own pin is closer than the simulated field, the report shows a
 * phantom rival a stride ahead of them instead, so the closest player can
 * never tell from this line that they are the closest.
 */
export function closestRival(day: number, playerKm: number | null): { km: number; locked: boolean } {
    // The field tightens through the round: roughly 160 km out on day 1,
    // closing toward 10 km in the final week, with a daily wobble so some days
    // the gap holds and other days it jumps.
    const t = clamp01((day - 1) / (ROUND.durationDays - 1));
    const base = 10 + 150 * Math.pow(1 - t, 1.8);
    const wobble = 1 + (dayNoise(day * 7 + 1) - 0.5) * 0.24;
    let km = base * wobble;
    // Never confirm the leader: someone always breathes down the leader's neck.
    if (playerKm != null && playerKm < km + 2) {
        km = Math.max(2, playerKm - (1 + dayNoise(day * 3 + 5) * 2));
    }
    // In the final week the front-runner has locked, so the tiebreak clock is real.
    const locked = day >= ROUND.durationDays - 7;
    return { km: Math.max(2, Math.round(km)), locked };
}
