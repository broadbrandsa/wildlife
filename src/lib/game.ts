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

/**
 * The set of clue ids a player can currently read: time-released free clues,
 * plus any unlocked via equipment purchases or redeemed sponsor codes.
 */
export function availableClueIds(unlocked: string[], day: number): Set<string> {
    const ids = new Set<string>(unlocked);
    for (const clue of CLUES) {
        if (isFreeClueReleased(clue, day)) ids.add(clue.id);
    }
    return ids;
}

/** Days until the next free clue lands. Returns null once every timed clue is out. */
export function nextClueDays(day: number): number | null {
    const upcoming = CLUES.filter((c) => c.releaseDay != null && c.releaseDay > day && c.source === "free").map(
        (c) => c.releaseDay as number,
    );
    if (upcoming.length === 0) return null;
    return Math.min(...upcoming) - day;
}

/** Mono countdown copy for the next clue. */
export function nextClueLabel(day: number): string {
    const days = nextClueDays(day);
    if (days == null) return "ALL FIELD CLUES RELEASED";
    if (days <= 1) return "NEW CLUE TOMORROW";
    return `NEXT CLUE IN ${days} DAYS`;
}

/** The round day the next free clue releases, or null once all are out. */
export function nextClueReleaseDay(day: number): number | null {
    const days = nextClueDays(day);
    return days == null ? null : day + days;
}

/** Whole hours until the next free clue releases, or null if all out. */
export function hoursUntilNextClue(day: number): number | null {
    const releaseDay = nextClueReleaseDay(day);
    if (releaseDay == null) return null;
    const start = new Date(ROUND.startsAt).getTime();
    const realDay = Math.floor((Date.now() - start) / 86_400_000) + 1;
    // Trust the wall clock only when the day we are showing is the real one.
    // Under a demo/override day the clock is out of step, so estimate from days.
    if (realDay === day) {
        const releaseAt = start + (releaseDay - 1) * 86_400_000;
        return Math.max(1, Math.ceil((releaseAt - Date.now()) / 3_600_000));
    }
    return (releaseDay - day) * 24;
}

/** How many timed free clues have not released yet. */
export function freeCluesToCome(day: number): number {
    return CLUES.filter((c) => c.source === "free" && c.releaseDay != null && (c.releaseDay as number) > day).length;
}

/**
 * Distance from a normalised map point to a normalised target. The map is a
 * real linear projection of Kruger (see map-geometry.ts): the frame spans
 * about 130 km east-west and 366 km north-south, so distances are close to
 * true kilometres.
 */
export function distanceKm(a: MapPoint, b: MapPoint): number {
    const dxKm = (a.x - b.x) * 130;
    const dyKm = (a.y - b.y) * 366;
    return Math.hypot(dxKm, dyKm);
}

// ---------------------------------------------------------------------------
// Zones on the map (real geography; edges follow the bounding rivers)

/** Horizontal band each zone occupies in normalised map space (from KrugerMap). */
const ZONE_BANDS: { id: ZoneId; y0: number; y1: number }[] = [
    { id: "far-north", y0: 0, y1: 0.097 }, // to just south of the Luvuvhu
    { id: "punda-sandveld", y0: 0.097, y1: 0.218 },
    { id: "mopane-shingwedzi", y0: 0.218, y1: 0.474 }, // to the Letaba
    { id: "letaba-olifants", y0: 0.474, y1: 0.54 }, // between the two rivers
    { id: "central-basalt", y0: 0.54, y1: 0.749 }, // to the Tshokwane line
];
/** South of the Tshokwane line the park splits east/west at this x. */
const SOUTH_Y = 0.749;
const SOUTH_SPLIT_X = 0.52;

/** Which zone a normalised map point falls in (Lebombo overlays the east). */
export function zoneAtPoint(p: MapPoint): ZoneId {
    if (p.x > 0.86 && p.y > 0.5 && p.y < 0.86) return "lebombo";
    if (p.y >= SOUTH_Y) return p.x < SOUTH_SPLIT_X ? "sw-granite" : "southern-sabie";
    const band = ZONE_BANDS.find((b) => p.y >= b.y0 && p.y < b.y1);
    return band?.id ?? "far-north";
}

// ---------------------------------------------------------------------------
// The park in thirds

export type Third = "north" | "central" | "south";

/** Which latitude third a normalised point falls in (y: 0 north to 1 south). */
export function thirdOf(p: MapPoint): Third {
    if (p.y < 1 / 3) return "north";
    if (p.y < 2 / 3) return "central";
    return "south";
}

/** The third the poacher is hiding in this round. */
export function poacherThird(): Third {
    return thirdOf(ROUND.poacher);
}

// Broad region wording for the field radio only. The "thirds" gating is a
// hidden mechanic, so this never uses the word "third".
export const THIRD_LABEL: Record<Third, string> = {
    north: "the north",
    central: "the centre",
    south: "the south",
};

// ---------------------------------------------------------------------------
// Scent reads (the dog reads the ground where your ranger stands)

export type ScentTier = "cold" | "faint" | "warm" | "hot";

export type Direction = "north" | "north-east" | "east" | "south-east" | "south" | "south-west" | "west" | "north-west";
export type RoughDirection = "north" | "east" | "south" | "west";

export interface ScentReadResult {
    /** Is the ranger standing in the poacher's third? Outside it, the dog finds nothing. */
    inThird: boolean;
    tier: ScentTier;
    /** Eight-point pull toward the poacher (only meaningful when inThird). */
    direction: Direction;
    /** Four-point pull, shown to rangers without a compass or a line-reading dog. */
    rough: RoughDirection;
    /** Whether the fine eight-point bearing should be shown (compass or dog). */
    fine: boolean;
}

/** Distance thresholds inside the poacher's third. Base tuning; kit/dog widen them. */
const TIER_KM = { hot: 15, warm: 45 };

/** Dogs whose nose widens the scent range (warm and fresh reach further). */
const WIDE_RANGE_DOGS = new Set(["banjo", "storm", "pepper"]);
/** Dogs that read the line, so the read shows a fine compass bearing. */
const DIRECTION_DOGS = new Set(["scout", "dotty"]);

export interface ScentReadOptions {
    dogId?: string | null;
    /** Monthly healthcare: a fit dog's nose reaches further (wider tier radius). */
    range?: boolean;
    /** Ranger's compass: show the fine eight-point bearing. */
    compass?: boolean;
}

export function scentRead(pin: MapPoint, opts: ScentReadOptions = {}): ScentReadResult {
    const { dogId, range, compass } = opts;
    const inThird = thirdOf(pin) === poacherThird();

    const dx = (ROUND.poacher.x - pin.x) * 130;
    const dy = (ROUND.poacher.y - pin.y) * 366;
    const angle = (Math.atan2(dx, -dy) * 180) / Math.PI; // 0 = north, clockwise
    const dirs: Direction[] = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];
    const roughs: RoughDirection[] = ["north", "east", "south", "west"];
    const direction = dirs[Math.round(((angle + 360) % 360) / 45) % 8];
    const rough = roughs[Math.round(((angle + 360) % 360) / 90) % 4];
    const fine = Boolean(compass || (dogId && DIRECTION_DOGS.has(dogId)));

    if (!inThird) {
        // Wrong third: the dog finds nothing.
        return { inThird: false, tier: "cold", direction, rough, fine };
    }

    let bonus = 1;
    if (dogId && WIDE_RANGE_DOGS.has(dogId)) bonus *= 1.25;
    if (range) bonus *= 1.25;

    const dist = distanceKm(pin, ROUND.poacher);
    // Inside the right third the dog always has something: floor at faint.
    let tier: ScentTier = "faint";
    if (dist <= TIER_KM.hot * bonus) tier = "hot";
    else if (dist <= TIER_KM.warm * bonus) tier = "warm";

    return { inThird: true, tier, direction, rough, fine };
}

/** Field-ranger voice for each tier. `{dog}` is replaced with the dog's name. */
export const SCENT_TEXT: Record<ScentTier, string> = {
    cold: "{dog} casts wide, circles twice and lies down. Nothing here.",
    faint: "{dog} lifts a nose to the wind and holds it a moment. There is a trail here, but old and far off.",
    warm: "{dog} works the ground in tightening loops, tail up. The trail has been through here.",
    hot: "{dog} freezes, then pulls hard against the lead. Fresh sign. You are close.",
};

/**
 * Sun-based direction cues (southern hemisphere: the midday sun sits to the
 * north). The base read never names a compass point, so the player reads the
 * sky and decides which way to go. A compass or a line-reading dog upgrades to
 * the exact bearing.
 */
const SUN_CUE: Record<RoughDirection, string> = {
    north: "toward the midday sun",
    east: "toward the sunrise",
    south: "away from the midday sun",
    west: "toward the evening sunset",
};

/** A direction line for every scent read, so the player always has a way to go. */
export function scentDirectionText(read: ScentReadResult, dogName: string): string {
    if (read.fine) return `The pull runs ${read.direction}.`;
    return `${dogName}'s nose swings ${SUN_CUE[read.rough]}.`;
}

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
