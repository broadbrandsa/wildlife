import { CLUES, DEMO_DAY_OVERRIDE, ROUND } from "@/data";
import type { Clue, MapPoint, ZoneId } from "@/data";

/**
 * Current day within the round (1-based).
 * Pass a demo day (from the store's demo controls) to override; otherwise the
 * build-time DEMO_DAY_OVERRIDE applies, and failing that the real date.
 */
export function currentDay(demoDay?: number | null): number {
    if (demoDay != null) return Math.min(Math.max(demoDay, 1), ROUND.durationDays);
    if (DEMO_DAY_OVERRIDE != null) return DEMO_DAY_OVERRIDE;
    const start = new Date(ROUND.startsAt).getTime();
    const now = Date.now();
    const day = Math.floor((now - start) / 86_400_000) + 1;
    return Math.min(Math.max(day, 1), ROUND.durationDays);
}

export function daysRemaining(day: number): number {
    return Math.max(ROUND.durationDays - day, 0);
}

export function isRoundOver(day: number): boolean {
    return day >= ROUND.durationDays;
}

/** A free clue is available once its release day has arrived. */
export function isFreeClueReleased(clue: Clue, day: number): boolean {
    return clue.source === "free" && clue.releaseDay != null && clue.releaseDay <= day;
}

/** A dog clue is available if it belongs to your dog and its day has arrived. */
export function isDogClueReleased(clue: Clue, day: number, dogId?: string | null): boolean {
    return (
        clue.source === "dog" &&
        clue.dogId != null &&
        clue.dogId === dogId &&
        clue.releaseDay != null &&
        clue.releaseDay <= day
    );
}

/**
 * The set of clue ids a player can currently read: time-released free clues,
 * the chosen dog's instinct clues, plus any unlocked via equipment purchases
 * or redeemed sponsor codes.
 */
export function availableClueIds(unlocked: string[], day: number, dogId?: string | null): Set<string> {
    const ids = new Set<string>(unlocked);
    for (const clue of CLUES) {
        if (isFreeClueReleased(clue, day)) ids.add(clue.id);
        if (isDogClueReleased(clue, day, dogId)) ids.add(clue.id);
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

// ---------------------------------------------------------------------------
// Zones on the stylised map

/** Horizontal band each zone occupies in normalised map space (from KrugerMap). */
const ZONE_BANDS: { id: ZoneId; y0: number; y1: number }[] = [
    { id: "far-north", y0: 0, y1: 0.147 },
    { id: "punda-sandveld", y0: 0.147, y1: 0.242 },
    { id: "mopane-shingwedzi", y0: 0.242, y1: 0.395 },
    { id: "letaba-olifants", y0: 0.395, y1: 0.55 },
    { id: "central-basalt", y0: 0.55, y1: 0.718 },
    { id: "southern-sabie", y0: 0.718, y1: 0.874 },
    { id: "sw-granite", y0: 0.874, y1: 1 },
];

/** Which zone a normalised map point falls in (Lebombo overlays the east). */
export function zoneAtPoint(p: MapPoint): ZoneId {
    if (p.x > 0.74 && p.y > 0.395 && p.y < 0.83) return "lebombo";
    const band = ZONE_BANDS.find((b) => p.y >= b.y0 && p.y < b.y1);
    return band?.id ?? "sw-granite";
}

// ---------------------------------------------------------------------------
// Scent reads (the dog's daily verdict on your pin)

export type ScentTier = "cold" | "faint" | "warm" | "hot";

export type Direction = "north" | "north-east" | "east" | "south-east" | "south" | "south-west" | "west" | "north-west";

export interface ScentReadResult {
    tier: ScentTier;
    /** Compass pull toward the target. Only shown to Scout handlers. */
    direction: Direction;
}

/** Banjo's free-running range makes every read a little more generous. */
const TIER_KM: Record<ScentTier, number> = { hot: 20, warm: 50, faint: 110, cold: Infinity };

export function scentRead(pin: MapPoint, dogId?: string | null): ScentReadResult {
    const dist = distanceKm(pin, ROUND.poacher);
    const bonus = dogId === "banjo" ? 1.3 : 1;
    let tier: ScentTier = "cold";
    if (dist <= TIER_KM.hot * bonus) tier = "hot";
    else if (dist <= TIER_KM.warm * bonus) tier = "warm";
    else if (dist <= TIER_KM.faint * bonus) tier = "faint";

    const dx = (ROUND.poacher.x - pin.x) * 90;
    const dy = (ROUND.poacher.y - pin.y) * 360;
    const angle = (Math.atan2(dx, -dy) * 180) / Math.PI; // 0 = north, clockwise
    const dirs: Direction[] = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];
    const direction = dirs[Math.round(((angle + 360) % 360) / 45) % 8];

    return { tier, direction };
}

/** Field-ranger voice for each tier. `{dog}` is replaced with the dog's name. */
export const SCENT_TEXT: Record<ScentTier, string> = {
    cold: "{dog} casts wide, circles twice and lies down. Nothing here. This ground is cold.",
    faint: "{dog} lifts a nose to the wind and holds it a moment. Something, but old and far away.",
    warm: "{dog} works the ground in tightening loops, tail up. The trail has been through here.",
    hot: "{dog} freezes, then pulls hard against the lead. Fresh sign. You are close.",
};

// ---------------------------------------------------------------------------
// Round-end reckoning

export interface TrackerRating {
    title: string;
    line: string;
}

export function trackerRating(distKm: number): TrackerRating {
    if (distKm <= 15) return { title: "Master tracker", line: "You read the bushveld like the dogs do. The unit would take you on patrol tomorrow." };
    if (distKm <= 40) return { title: "Tracker, first class", line: "Within a morning's drive of the camp. The pack would have closed the rest." };
    if (distKm <= 90) return { title: "Field tracker", line: "Right region, wrong river bend. A season with the unit and you will have it." };
    if (distKm <= 180) return { title: "Apprentice tracker", line: "You followed some signs and missed others. Every ranger starts here." };
    return { title: "Cadet", line: "The bushveld kept its secret this time. The dogs still got their dinner." };
}
