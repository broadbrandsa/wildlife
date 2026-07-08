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
 * day 90, on an ease-out curve with a small deterministic day-to-day wobble.
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
 * about 5% early to about 60% by day 88 (the lock deadline).
 */
export function pinsLocked(day: number): number {
    const t = clamp01((day - 1) / (88 - 1));
    const frac = 0.05 + (0.6 - 0.05) * easeOut(t);
    return Math.round(rangersHunting(day) * frac);
}
