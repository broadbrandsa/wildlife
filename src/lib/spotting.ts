import { SPECIES } from "@/data";
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

/** Display metadata for the rarity tiers. */
export const RARITY_META = {
    common: { label: "Common", tone: "neutral" as const, icon: "binoculars" },
    rare: { label: "Rare", tone: "ochre" as const, icon: "star" },
    oialt: { label: "Once in a lifetime", tone: "clay" as const, icon: "sparkle" },
};
