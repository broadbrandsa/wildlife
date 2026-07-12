import { FIVES, SPECIES, SPECIES_BY_ID, spottableAt } from "@/data";
import type { Species, SpotRegion } from "@/data";

/**
 * The spotting roll. Every ranger move turns up exactly one species from the
 * region the ranger is standing in: usually common, sometimes rare, and on
 * the rarest of rolls a once-in-a-lifetime sighting, which only ever occurs
 * inside its own region and is linked to round prizes.
 *
 * Odds per move: common 85%, rare 15%. Randomness happens at action time
 * (never during render).
 *
 * Spotting follows the clock: `night` restricts the pool to the species out at
 * that hour (nocturnal after dark, diurnal by day, cathemeral either way).
 */
const RARE_CHANCE = 0.15;

export function rollSpot(region: SpotRegion, night: boolean, rng: () => number = Math.random): Species {
    const pool = SPECIES.filter((s) => s.region === region && spottableAt(s.id, night));
    const roll = rng();
    const tier = roll < RARE_CHANCE ? "rare" : "common";
    const tierPool = pool.filter((s) => s.rarity === tier);
    return tierPool[Math.floor(rng() * tierPool.length)] ?? pool[Math.floor(rng() * pool.length)] ?? pool[0];
}

/**
 * Pepper's detection nose is always working, so species markers appear more
 * often around her ranger. The field binoculars help a different way: they
 * widen the ground markers can appear across (see lib/markers.ts).
 */
export const SPOTTER_DOGS = new Set(["pepper"]);

/**
 * The very first spot of the game always comes from the Big, Ugly or Small
 * Five in the ranger's region, so the collection opens with a name the player
 * knows and the bingo lists start working immediately.
 */
export function rollFirstSpot(region: SpotRegion, night: boolean, rng: () => number = Math.random): Species {
    const members = FIVES.flatMap((f) => f.members)
        .map((id) => SPECIES_BY_ID[id])
        .filter((s) => s && s.region === region && spottableAt(s.id, night));
    if (members.length === 0) return rollSpot(region, night, rng);
    return members[Math.floor(rng() * members.length)];
}

/** Display metadata for the rarity tiers. */
export const RARITY_META = {
    common: { label: "Common", tone: "neutral" as const, icon: "binoculars" },
    rare: { label: "Rare", tone: "ochre" as const, icon: "star" },
};
