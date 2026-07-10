/**
 * Round 1 prize structure and fundraising goal.
 *
 * Prize partners here are illustrative for the pitch: South African corporates
 * and lodges of the kind likely to back a conservation prize round. Final
 * partners, values and written rules are confirmed before a live round runs
 * (see the legal page for the CPA section 36 note).
 */

export interface PrizeTier {
    /** "1st", "2nd", "3rd" */
    place: string;
    /** How many players win at this tier. */
    count: number;
    title: string;
    prize: string;
    sponsor: string;
    valueZar: number;
    icon: string;
}

export const PRIZE_TIERS: PrizeTier[] = [
    {
        place: "1st",
        count: 1,
        title: "The Ranger's Prize",
        prize: "A three night, all inclusive safari for a family of four at Jock Safari Lodge in the Kruger, plus a private morning at the Southern African Wildlife College meeting the K9 pack and their handlers. Return flights included.",
        sponsor: "Jock Safari Lodge · Airlink",
        valueZar: 120000,
        icon: "trophy",
    },
    {
        place: "2nd",
        count: 5,
        title: "The Handler's Prize",
        prize: "A two night Kruger rest camp getaway for two, plus a SANParks Wild Card giving a full year of entry to South Africa's national parks.",
        sponsor: "TotalEnergies South Africa · SANParks",
        valueZar: 15000,
        icon: "medal",
    },
    {
        place: "3rd",
        count: 20,
        title: "The Tracker's Prize",
        prize: "A R1,500 Cape Union Mart gear voucher and the official SAWC K9 unit field cap.",
        sponsor: "Cape Union Mart",
        valueZar: 2000,
        icon: "certificate",
    },
];

/** Everyone who finishes the round gets something to keep. */
export const EVERY_PLAYER_LINE =
    "Every ranger who locks a pin receives a personalised tracker certificate for the round, and every donor is named on the Allies wall.";

/** How you win, in three steps. */
export const WIN_STEPS: { icon: string; title: string; body: string }[] = [
    {
        icon: "notebook",
        title: "Work the clues",
        body: "Clues release across the 90 days. Read them against your field guides to narrow eight zones down to one river bend.",
    },
    {
        icon: "map-pin",
        title: "Lock your pin",
        body: "Drop your pin where you believe the camp is and lock it before the round ends. A pin that is never locked cannot win.",
    },
    {
        icon: "trophy",
        title: "Closest pin wins",
        body: "When the round closes, the camp is revealed and the closest locked pins take the prizes. Ties go to the pin that locked earliest, so conviction pays.",
    },
];

/** Round 1 fundraising goal. */
export const FUNDRAISING_GOAL_ZAR = 500000;

export const GOAL_LINE =
    "Round 1 aims to raise R500,000 for the SAWC K9 Anti-Poaching Unit: a full year of food, veterinary care and field kit for the pack that does this work for real.";

/** Entry is free and never tied to a donation (CPA section 36). */
export const FAIR_PLAY_LINE =
    "Playing is free and winning never requires a donation. Buying kit funds the dogs and unlocks extra intel, but the prize goes to the best tracker, not the biggest spender.";
