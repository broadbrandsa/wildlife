/** Shared content types for the SAWC K9 Pin-Drop Hunt v1 seed data. */

export type ZoneId =
    | "far-north"
    | "punda-sandveld"
    | "mopane-shingwedzi"
    | "letaba-olifants"
    | "central-basalt"
    | "lebombo"
    | "southern-sabie"
    | "sw-granite";

/** Normalised map coordinate. x: 0 (west) → 1 (east). y: 0 (north) → 1 (south). */
export interface MapPoint {
    x: number;
    y: number;
}

export interface Zone {
    id: ZoneId;
    number: number;
    name: string;
    subtitle: string;
    geology: string;
    vegetation: string;
    signatureSpecies: string;
    namedFeatures: string;
    signatureClue: string;
    /** Centroid for labels / pin snapping, in normalised map space. */
    centroid: MapPoint;
    /** Wash colour key for the PhotoPlate / map fill. */
    wash: "bushveld" | "savanna" | "clay" | "dawn" | "sand";
}

export type DogId = "storm" | "scout" | "banjo" | "pepper";

export interface Dog {
    id: DogId;
    name: string;
    breed: string;
    role: string;
    effect: string;
    personality: string;
    didYouKnow: string;
    icon: string;
}

export type EquipmentTier = "free" | "care" | "hunt" | "big-ticket";

export interface Equipment {
    id: string;
    name: string;
    tier: EquipmentTier;
    priceZar: number;
    description: string;
    effect: string;
    fundedEquivalent: string;
    icon: string;
    /** If set, buying this item unlocks the clue with this id. */
    unlocksClueId?: string;
}

export type ClueCategory =
    | "geological"
    | "hydrological"
    | "botanical"
    | "bird"
    | "mammal"
    | "historical"
    | "cultural"
    | "operational"
    | "seasonal";

export type ClueSource = "free" | "equipment" | "sponsor";
export type ClueDifficulty = "zone" | "feature" | "landmark";

export interface Clue {
    id: string;
    source: ClueSource;
    category: ClueCategory;
    difficulty: ClueDifficulty;
    /** Day in the 90-day round this free clue releases (free clues only). */
    releaseDay?: number;
    /** Zone this clue points to. */
    zoneId: ZoneId;
    body: string;
    didYouKnow: string;
}

export interface Sponsor {
    id: string;
    name: string;
    fundedAmountZar: number;
    fundedDescription: string;
}

export interface InKindPartner {
    name: string;
    contribution: string;
}

export type CodeUnlockType = "clue" | "equipment" | "zone";

export interface CouponCode {
    code: string;
    sponsorId: string;
    unlockType: CodeUnlockType;
    /** Clue revealed (clue unlock) or item granted free (equipment unlock). */
    payloadId: string;
    creditLine: string;
    validUntil?: string;
}

export interface Round {
    number: number;
    name: string;
    startsAt: string;
    endsAt: string;
    durationDays: number;
    /** Hidden in production; server-only. Kept client-side for the v1 prototype. */
    poacher: MapPoint;
    poacherZoneId: ZoneId;
    poacherFeature: string;
}
