import type { CouponCode, InKindPartner, Sponsor } from "./types";

/** Five demo sponsors for the pitch build. Listed plainly on Our Allies. */
export const SPONSORS: Sponsor[] = [
    {
        id: "5fm",
        name: "5FM",
        fundedAmountZar: 18000,
        fundedDescription: "Three months of food for the free-running pack",
    },
    {
        id: "birding",
        name: "Bushveld Birding Club",
        fundedAmountZar: 6000,
        fundedDescription: "A field ranger's binocular and birding kit",
    },
    {
        id: "school",
        name: "Lowveld Primary School",
        fundedAmountZar: 4000,
        fundedDescription: "A week of healthcare for two of the dogs",
    },
    {
        id: "totalenergies",
        name: "TotalEnergies South Africa",
        fundedAmountZar: 30000,
        fundedDescription: "A month of aerial patrol fuel",
    },
    {
        id: "capeunion",
        name: "Cape Union Mart",
        fundedAmountZar: 12000,
        fundedDescription: "Field boots and packs for a ranger team",
    },
];

export const SPONSOR_BY_ID: Record<string, Sponsor> = Object.fromEntries(
    SPONSORS.map((s) => [s.id, s]),
);

/** In-kind partners, listed factually with no logos. */
export const IN_KIND_PARTNERS: InKindPartner[] = [
    { name: "Pack Leader Pet Products", contribution: "Working-hound nutrition" },
    { name: "Rogz", contribution: "Collars and leashes" },
    { name: "Hill's Pet Nutrition", contribution: "Dog food" },
    { name: "Garmin", contribution: "Tracking collars and GPS" },
];

/** Founding donors named in a grateful paragraph. */
export const FOUNDING_DONORS = [
    "WWF Nedbank Green Trust",
    "IFAW",
    "International Rhino Foundation",
    "Ivan Carter Wildlife Conservation Alliance",
];

/**
 * Three demo coupon codes. Format: [SPONSOR]-[ZONE]-[NUMBER].
 * Codes are shared by sponsors on their own channels; the player enters them
 * in-app to unlock that sponsor's clue or a free piece of equipment.
 */
export const COUPON_CODES: CouponCode[] = [
    {
        code: "5FM-RHINO-06",
        sponsorId: "5fm",
        unlockType: "clue",
        payloadId: "s06",
        creditLine: "Funded by 5FM. Their support funded 3 months of food for the pack.",
        validUntil: "2026-12-31",
    },
    {
        code: "BIRD-MARULA-07",
        sponsorId: "birding",
        unlockType: "clue",
        payloadId: "s07",
        creditLine: "Funded by the Bushveld Birding Club. Their support funded a ranger's binoculars.",
    },
    {
        code: "SCHOOL-WARDEN-04",
        sponsorId: "school",
        unlockType: "clue",
        payloadId: "s04",
        creditLine: "Funded by Lowveld Primary School. Their support funded a week of dog healthcare.",
    },
    {
        code: "TOTAL-FROST-09",
        sponsorId: "totalenergies",
        unlockType: "clue",
        payloadId: "s09",
        creditLine: "Funded by TotalEnergies South Africa. Their support funded a month of aerial patrol fuel.",
    },
    {
        code: "UNION-CROSS-01",
        sponsorId: "capeunion",
        unlockType: "clue",
        payloadId: "s01",
        creditLine: "Funded by Cape Union Mart. Their support funded boots and packs for a ranger team.",
    },
];

export const CODE_BY_VALUE: Record<string, CouponCode> = Object.fromEntries(
    COUPON_CODES.map((c) => [c.code.toUpperCase(), c]),
);
