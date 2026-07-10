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

/** The ops-room report counts rangers inside this ring around the suspect. */
export const NEAR_TARGET_KM = 15;

/**
 * Ops-room pressure line: how many rangers are within NEAR_TARGET_KM of the
 * suspect, and how many of those have locked in. One shared, day-seeded number:
 * every player sees exactly the same report on the same day, and the player's
 * own pin never feeds into it, so nothing shown is ever tailored or misleading.
 *
 * Production: replace with a real server aggregate over live player pins
 * (count pins within NEAR_TARGET_KM of the target, and their locked flags).
 */
export function rangersNearTarget(day: number): { count: number; locked: number } {
    const t = clamp01((day - 1) / (ROUND.durationDays - 1));
    // A thin sliver of the hunting field has worked its way inside the ring:
    // about one ranger on day 1, a couple of dozen mid-round, a crowd late.
    const frac = 0.0002 + (0.005 - 0.0002) * Math.pow(t, 1.5);
    const wobble = 1 + (dayNoise(day * 7 + 1) - 0.5) * 0.2;
    const count = Math.max(1, Math.round(rangersHunting(day) * frac * wobble));
    // Of those, the locked share grows as the tiebreak clock starts to matter.
    const lockedFrac = 0.25 + 0.6 * easeOut(t);
    const locked = Math.min(count, Math.round(count * lockedFrac));
    return { count, locked };
}
