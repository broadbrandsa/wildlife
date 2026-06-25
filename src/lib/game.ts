import { CLUES, DEMO_DAY_OVERRIDE, ROUND } from "@/data";
import type { Clue, MapPoint } from "@/data";

/** Current day within the round (1-based). Pinned for the demo by default. */
export function currentDay(): number {
    if (DEMO_DAY_OVERRIDE != null) return DEMO_DAY_OVERRIDE;
    const start = new Date(ROUND.startsAt).getTime();
    const now = Date.now();
    const day = Math.floor((now - start) / 86_400_000) + 1;
    return Math.min(Math.max(day, 1), ROUND.durationDays);
}

export function daysRemaining(): number {
    return Math.max(ROUND.durationDays - currentDay(), 0);
}

/** A free clue is available once its release day has arrived. */
export function isFreeClueReleased(clue: Clue, day = currentDay()): boolean {
    return clue.source === "free" && clue.releaseDay != null && clue.releaseDay <= day;
}

/**
 * The set of clue ids a player can currently read: time-released free clues,
 * plus any unlocked via equipment purchases or redeemed sponsor codes.
 */
export function availableClueIds(unlocked: string[], day = currentDay()): Set<string> {
    const ids = new Set<string>(unlocked);
    for (const clue of CLUES) {
        if (isFreeClueReleased(clue, day)) ids.add(clue.id);
    }
    return ids;
}

/**
 * Stylised distance from a normalised pin to a normalised target, scaled to
 * Kruger's real dimensions (~90 km wide east-west, ~360 km north-south).
 * Not a true projection; the map is illustration, not a survey.
 */
export function distanceKm(a: MapPoint, b: MapPoint): number {
    const dxKm = (a.x - b.x) * 90;
    const dyKm = (a.y - b.y) * 360;
    return Math.hypot(dxKm, dyKm);
}
