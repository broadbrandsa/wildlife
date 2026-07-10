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
    /** Ground the zone covers, in km², for the case board's search area. */
    areaKm2: number;
}

export type DogId = "storm" | "scout" | "banjo" | "dotty" | "pepper";

export interface Dog {
    id: DogId;
    name: string;
    breed: string;
    role: string;
    effect: string;
    personality: string;
    didYouKnow: string;
    icon: string;
    photo: string;
}

export type RangerId = "grace" | "sabata" | "vince" | "rubaina" | "shakier";

export interface Ranger {
    id: RangerId;
    name: string;
    /** Short who-they-are line (demographic). */
    who: string;
    heritage: string;
    personality: string;
    /** Background silhouette motif behind the avatar. */
    background: string;
    photo: string;
}

export type EquipmentTier = "free" | "care" | "hunt" | "big-ticket";

/** Who or what a kit item equips, for the kit room's chooser. */
export type KitCategory = "ranger" | "dog" | "air";

export interface Equipment {
    id: string;
    name: string;
    tier: EquipmentTier;
    /** Which side of the team this equips (kit room section). Field guides omit it. */
    kitCategory?: KitCategory;
    priceZar: number;
    description: string;
    effect: string;
    fundedEquivalent: string;
    icon: string;
    /** If set, buying this item unlocks the clue with this id. */
    unlocksClueId?: string;
    /** If set, buying this item unlocks the field guide for this zone. */
    unlocksFieldGuideZoneId?: ZoneId;
    /** Short factual note on how the real SAWC K9 unit uses this item. */
    realWorldNote?: string;
    /** Consumable: not kept in inventory, can be bought repeatedly (e.g. a second lock-in). */
    consumable?: boolean;
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
    | "seasonal"
    | "topographic"
    | "astronomical"
    | "synthesis";

export type ClueSource = "free" | "equipment" | "sponsor";
export type ClueDifficulty = "region" | "zone" | "feature" | "landmark" | "pinpoint";
/** Trail clues point toward the poacher. Elimination clues rule ground out. */
export type ClueKind = "trail" | "elimination";

export interface Clue {
    id: string;
    source: ClueSource;
    category: ClueCategory;
    difficulty: ClueDifficulty;
    kind?: ClueKind;
    /** Difficulty tier 1 (entry) to 5 (pinpoint). See the clue bank spreadsheet. */
    tier?: number;
    /** Day in the round this free clue releases. */
    releaseDay?: number;
    /** Zone this clue is about (the target zone, or the zone it rules out). */
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
