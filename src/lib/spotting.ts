import { FIVES, SPECIES, SPECIES_BY_ID } from "@/data";
import type { Species, SpotRegion } from "@/data";

/**
 * The spotting roll. Every ranger move turns up exactly one species from the
 * region the ranger is standing in: usually common, sometimes rare, and on
 * the rarest of rolls a once-in-a-lifetime sighting, which only ever occurs
 * inside its own region and is linked to round prizes.
 *
 * Odds per move: common 85%, rare 14.6%, once in a lifetime 0.4%. Randomness
 * happens at action time (never during render). Production note: for prize
 * integrity the OIALT roll must move server-side with the poacher position.
 */
const OIALT_CHANCE = 0.004;
const RARE_CHANCE = 0.146;

export function rollSpot(region: SpotRegion, rng: () => number = Math.random): Species {
    const pool = SPECIES.filter((s) => s.region === region);
    const roll = rng();
    const tier = roll < OIALT_CHANCE ? "oialt" : roll < OIALT_CHANCE + RARE_CHANCE ? "rare" : "common";
    const tierPool = pool.filter((s) => s.rarity === tier);
    return tierPool[Math.floor(rng() * tierPool.length)] ?? pool[0];
}

/**
 * Pepper's detection nose finds what others miss: every third move she turns
 * up a bonus species card. The field binoculars grant the same; having both
 * never stacks beyond the one bonus card.
 */
export const SPOTTER_DOGS = new Set(["pepper"]);

/** A bonus card lands on every third move for a spotter dog or binoculars. */
export function bonusSpotDue(totalMoves: number, hasSpotterDog: boolean, hasBinoculars: boolean): boolean {
    return (hasSpotterDog || hasBinoculars) && totalMoves > 0 && totalMoves % 3 === 0;
}

/**
 * The very first spot of the game always comes from the Big, Ugly or Small
 * Five in the ranger's region, so the collection opens with a name the player
 * knows and the bingo lists start working immediately.
 */
export function rollFirstSpot(region: SpotRegion, rng: () => number = Math.random): Species {
    const members = FIVES.flatMap((f) => f.members)
        .map((id) => SPECIES_BY_ID[id])
        .filter((s) => s && s.region === region);
    if (members.length === 0) return rollSpot(region, rng);
    return members[Math.floor(rng() * members.length)];
}

/** Display metadata for the rarity tiers. */
export const RARITY_META = {
    common: { label: "Common", tone: "neutral" as const, icon: "binoculars" },
    rare: { label: "Rare", tone: "ochre" as const, icon: "star" },
    oialt: { label: "Once in a lifetime", tone: "clay" as const, icon: "sparkle" },
};
