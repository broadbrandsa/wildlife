import { CLUES, DEMO_DAY_OVERRIDE, ROUND, ZONES } from "@/data";
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

/**
 * A compact live countdown to the next free clue, for the map dock chip:
 * "5h 12m" or "2h 03m" close to release, "2d 4h" further out, null once every
 * clue is out. Under a demo/override day the wall clock is out of step, so it
 * falls back to a whole-day estimate.
 */
export function nextClueCountdown(day: number, now: number): string | null {
    const releaseDay = nextClueReleaseDay(day);
    if (releaseDay == null) return null;
    const start = new Date(ROUND.startsAt).getTime();
    const realDay = Math.floor((now - start) / 86_400_000) + 1;
    if (realDay === day) {
        const releaseAt = start + (releaseDay - 1) * 86_400_000;
        const totalMin = Math.max(0, Math.ceil((releaseAt - now) / 60_000));
        const d = Math.floor(totalMin / 1440);
        const h = Math.floor((totalMin % 1440) / 60);
        const m = totalMin % 60;
        if (d > 0) return `${d}d ${h}h`;
        if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
        return `${m}m`;
    }
    return `${releaseDay - day}d`;
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
// Ranger movement (a ranger can only walk so far in a day)

/**
 * Days of walking in the round: the pin drops on day 1, and a ranger starting
 * at the very worst spot must still reach the suspect two days before the
 * close (by day 43 of 45), walking flat out in the right direction.
 */
const WALKING_DAYS = ROUND.durationDays - 3;

/** Worst-case start: the map corner furthest from the suspect. */
const FURTHEST_KM = Math.max(
    ...[
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
    ].map((c) => distanceKm(c, ROUND.poacher)),
);

/** Base walking pace per day, tuned so the far corner arrives in time. */
export const BASE_DAILY_KM = Math.ceil(FURTHEST_KM / WALKING_DAYS);

/** Banjo is a free-running hound bred to run: his ranger covers more ground. */
const LONG_WALK_DOGS = new Set(["banjo"]);

/** How far this player's ranger can walk in one day, in km. */
export function dailyWalkKm(dogId?: string | null): number {
    return dogId && LONG_WALK_DOGS.has(dogId) ? Math.round(BASE_DAILY_KM * 1.5) : BASE_DAILY_KM;
}

/** Storm's Malinois drive earns the ranger a second move every day. */
export const EXTRA_MOVE_DOGS = new Set(["storm"]);

/** Dotty, the pack matriarch, knows the bush: one extra field guide, free. */
export const BUSH_WISE_DOGS = new Set(["dotty"]);

/**
 * After a move the ranger is walking to the new location, and cannot move
 * again until they arrive: the walk time is set by the distance (a full 8 km
 * leg takes 4 hours, so half the distance is half the time). After a track the
 * dog rests for a fixed spell. A dog ration refuels the dog right away, and the
 * ranger's boots and a driven dog make the ranger walk faster. Real time, so
 * the bars fill while you play.
 */
export const WALK_SPEED_KMH = 2; // 8 km leg takes 4 hours
export const TRACK_COOLDOWN_MS = 12 * 60 * 60 * 1000; // dog: 12 hours
/** A bakkie ride takes a fixed chunk of the day before the ranger sets off again. */
export const RIDE_TRAVEL_MS = 4 * 60 * 60 * 1000;

/** Whether enough of the cooldown has passed to be rested and ready. */
export function isRested(lastAt: number | null, now: number, cooldownMs: number): boolean {
    return lastAt == null || now - lastAt >= cooldownMs;
}

/** 0..1 recovery progress since the last action (1 when fully rested). */
export function restProgress(lastAt: number | null, now: number, cooldownMs: number): number {
    if (lastAt == null) return 1;
    return Math.min(1, Math.max(0, (now - lastAt) / cooldownMs));
}

/** A short "5h 12m" read of the rest time remaining. */
export function restRemainingLabel(lastAt: number | null, now: number, cooldownMs: number): string {
    if (lastAt == null) return "ready";
    const ms = Math.max(0, lastAt + cooldownMs - now);
    const total = Math.ceil(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return `${s}s`;
}

/**
 * How long the ranger walks to cover a leg, from its distance. Boots and a
 * driven dog (Storm) each double the walking pace, so a well-kitted ranger
 * arrives sooner.
 */
export function walkTravelMs(distanceKm: number, dogId?: string | null, hasBoots?: boolean): number {
    let speed = WALK_SPEED_KMH;
    if (hasBoots) speed *= 2;
    if (dogId && EXTRA_MOVE_DOGS.has(dogId)) speed *= 2;
    return Math.round((Math.max(0, distanceKm) / speed) * 3_600_000);
}

/**
 * Clamp a tap to walking range: past the limit, the ranger walks as far as
 * they can along the same bearing and stops there.
 */
export function clampWalk(from: MapPoint, to: MapPoint, maxKm: number): MapPoint {
    const dist = distanceKm(from, to);
    if (dist <= maxKm) return to;
    const f = maxKm / dist;
    return { x: from.x + (to.x - from.x) * f, y: from.y + (to.y - from.y) * f };
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

/** Scout the bloodhound reads scent from much further out (wider tier radius). */
const WIDE_RANGE_DOGS = new Set(["scout"]);
/** Pepper the detection specialist finds what others miss: an exact bearing. */
const DIRECTION_DOGS = new Set(["pepper"]);

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

/** Orders tiers for warmer / colder comparisons across days. */
export function tierRank(tier: ScentTier): number {
    return { cold: 0, faint: 1, warm: 2, hot: 3 }[tier];
}

/** The whole park, in km², for the case board headline. */
export const PARK_AREA_KM2 = ZONES.reduce((sum, z) => sum + z.areaKm2, 0);

/** Ground still in play: the park minus every ruled-out zone. */
export function searchAreaKm2(marks: Partial<Record<ZoneId, "suspect" | "ruled-out">>): number {
    return ZONES.reduce((sum, z) => (marks[z.id] === "ruled-out" ? sum : sum + z.areaKm2), 0);
}

/** Field-ranger voice for each tier. `{dog}` is replaced with the dog's name. */
export const SCENT_TEXT: Record<ScentTier, string> = {
    cold: "{dog} casts wide, circles twice and lies down. Nothing here.",
    faint: "{dog} lifts a nose to the wind and holds it a moment. There is a trail here, but old and far off.",
    warm: "{dog} works the ground in tightening loops, tail up. The trail has been through here.",
    hot: "{dog} freezes, then pulls hard against the lead. Fresh sign. You are close.",
};

/**
 * Sky-based direction cues the player has to read for themselves. East and
 * west come from the sun's day arc; north and south come from the Southern
 * Cross, which hangs in the southern night sky over the lowveld (real ranger
 * navigation). The base read never names a compass point; a compass or a
 * line-reading dog upgrades to the exact bearing.
 */
const SUN_CUE: Record<RoughDirection, string> = {
    north: "away from the Southern Cross",
    east: "toward the sunrise",
    south: "toward the Southern Cross",
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
