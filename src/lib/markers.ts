import type { Species, SpeciesRarity, SpeciesType } from "@/data";
import { MAP_H, MAP_W } from "@/components/game/map-geometry";
import { thirdOf } from "@/lib/game";
import { rollFirstSpot, rollSpot } from "@/lib/spotting";

/**
 * Live spotting: instead of a species turning up automatically on every move,
 * markers fade onto the map near the ranger at random intervals. The player
 * taps one to spot that species. Each marker only lives for a short window and
 * then fades out, so the ground feels alive and spotting takes attention.
 *
 * Markers are ephemeral session state (never persisted): only the sighting
 * a tap produces is saved. Positions are rolled near the current pin, so a
 * ranger in the south never sees a marker up in the far north.
 */
export interface SpotMarker {
    id: string;
    /** Fraction of the map artwork, matching the pin coordinate space. */
    x: number;
    y: number;
    speciesId: string;
    /** Family, so the marker can show a generic family icon before the reveal. */
    type: SpeciesType;
    rarity: SpeciesRarity;
    /** Epoch ms the marker appeared; drives the fade and the prune. */
    spawnAt: number;
    /** How long the marker stays before it fades out. Rarer means shorter. */
    ttlMs: number;
}

/** How near the ranger a marker can appear, in viewBox px (a circular reach). */
const REACH_PX = 66;
/** Field binoculars widen the reach, so more ground is in play at once. */
const REACH_PX_BINOCULARS = 120;

/** Only one marker shows on the map at a time. */
export const MARKER_CAP = 1;

/**
 * How long a marker shows for, by rarity: the rarer the sighting, the smaller
 * the window to catch it. A common lingers about a minute, a rare is a quick
 * twenty seconds.
 */
export function markerTtlMs(rarity: SpeciesRarity): number {
    if (rarity === "rare") return 20_000;
    return 60_000;
}

/**
 * The gap before each new marker appears, counting from the last move. The
 * wait grows every time a marker is shown: the first lands 10 s after you
 * move, the next 20 s later, then a minute, and so on, capping at the last
 * value. A spotter dog shortens every wait.
 */
export const MARKER_DELAYS_SEC = [10, 20, 60, 120, 240];

export function spawnDelayMs(shownSinceMove: number, hasSpotterDog: boolean): number {
    const base = MARKER_DELAYS_SEC[Math.min(shownSinceMove, MARKER_DELAYS_SEC.length - 1)];
    return Math.round(base * 1000 * (hasSpotterDog ? 0.6 : 1));
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/**
 * Roll one marker near the pin. The species is drawn from the region the
 * marker actually lands in, so a wide binocular reach that straddles two
 * regions still spots the right ground. Until the first ever sighting, every
 * marker is a Big, Ugly or Small Five member so the bingo lists open early.
 */
export function makeMarker(
    pin: { x: number; y: number },
    hasBinoculars: boolean,
    firstEver: boolean,
    night: boolean,
    rng: () => number = Math.random,
): Omit<SpotMarker, "id" | "spawnAt"> {
    const reach = hasBinoculars ? REACH_PX_BINOCULARS : REACH_PX;
    const theta = rng() * Math.PI * 2;
    const dist = reach * Math.sqrt(rng()); // uniform over the disc, not clustered at the centre
    const x = clamp(pin.x + (dist * Math.cos(theta)) / MAP_W, 0.08, 0.92);
    const y = clamp(pin.y + (dist * Math.sin(theta)) / MAP_H, 0.05, 0.95);
    const region = thirdOf({ x, y });
    const species: Species = firstEver ? rollFirstSpot(region, night, rng) : rollSpot(region, night, rng);
    return { x, y, speciesId: species.id, type: species.type, rarity: species.rarity, ttlMs: markerTtlMs(species.rarity) };
}

/**
 * Marker glyphs by family, shown before the reveal so the icon hints at the
 * family without giving the species away. A rare marker ignores this and
 * shows a gold star instead (see the map), because spotting one is special
 * whatever family it belongs to.
 */
export const FAMILY_ICON: Record<SpeciesType, string> = {
    mammal: "paw-print",
    bird: "bird",
    tree: "tree",
    reptile: "shield-checkered",
    insect: "bug",
    fish: "fish",
};

/** Human label for a family, for captions on the reveal card. */
export const FAMILY_LABEL: Record<SpeciesType, string> = {
    mammal: "Mammal",
    bird: "Bird",
    tree: "Tree",
    reptile: "Reptile",
    insect: "Insect",
    fish: "Fish",
};
