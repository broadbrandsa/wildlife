export * from "./types";
export { ZONES, ZONE_BY_ID } from "./zones";
export { DOGS, DOG_BY_ID } from "./dogs";
export { RANGERS, RANGER_BY_ID } from "./rangers";
export { EQUIPMENT, EQUIPMENT_BY_ID } from "./equipment";
export { CLUES, CLUE_BY_ID, FREE_CLUES, DOG_CLUES } from "./clues";
export { PATROL_NOTES, patrolNoteForDay } from "./patrol";
export type { PatrolNote } from "./patrol";
export {
    PRIZE_TIERS,
    EVERY_PLAYER_LINE,
    WIN_STEPS,
    FUNDRAISING_GOAL_ZAR,
    GOAL_LINE,
    FAIR_PLAY_LINE,
} from "./prizes";
export type { PrizeTier } from "./prizes";
export {
    SPONSORS,
    SPONSOR_BY_ID,
    IN_KIND_PARTNERS,
    FOUNDING_DONORS,
    COUPON_CODES,
    CODE_BY_VALUE,
} from "./sponsors";
export { ROUND, DEMO_DAY_OVERRIDE } from "./round";
export { UNIT_COSTS, MILESTONES, CAMPAIGN_BASE_ZAR, COST_LINES } from "./costs";
export type { Milestone, CostLine } from "./costs";
export {
    UNIT_STATS,
    AIRWING_STATS,
    AIRWING_BLURB,
    REAL_HANDLERS,
    REAL_DOGS,
    UNIT_VIDEO,
    UNIT_URL,
} from "./real-team";
export type { UnitStat, RealProfile } from "./real-team";
