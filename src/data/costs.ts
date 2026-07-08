/**
 * Real-world SAWC K9 Unit costs, used to translate money raised into concrete
 * impact. Figures verified against SAWC's published K9 unit page (July 2026):
 * 35 dogs, R5,000 average annual medical care per dog (R175,000 covers all),
 * R500/month healthcare sponsorship, R2,400 handheld GPS, R500 compass,
 * R7,300 T5 GPS dog collar, R1,850 per aerial patrol hour.
 * Food figures remain sector benchmarks pending SAWC confirmation.
 */
export const UNIT_COSTS = {
    dogsInPack: 35, // SAWC published: "we have 35 dogs"
    foodPerDogYear: 7800, // ~R150/week of premium hound food x 52 (benchmark)
    healthcarePerDogYear: 5000, // SAWC published average annual medical care per dog
    healthcareSponsorMonth: 500, // SAWC's published monthly healthcare sponsorship
    rangerGps: 2400, // SAWC published
    rangerCompass: 500, // SAWC published
    gpsDogCollar: 7300, // SAWC published (T5 collar + handheld need)
    aerialPatrolHour: 1850, // SAWC published (Savannah fuel per patrol hour)
    rangerTraining: 52000, // 6-week anti-poaching field-ranger course
    packFoodPerMonth: 22750, // 35 dogs x R7,800 / 12 (benchmark)
    packFoodPerYear: 273000, // 35 dogs x R7,800 (benchmark)
    annualHealthcareGoal: 175000, // SAWC's published goal: all 35 dogs cared for
};

/**
 * Campaign total raised to date by the whole community. The impact ladder runs
 * off THIS total (everyone's donations), not a single player's. In v1 it is a
 * seeded baseline plus this device's simulated donations; in v2 it is replaced
 * by the real aggregate from the backend.
 */
export const CAMPAIGN_BASE_ZAR = 168000;

export interface CostLine {
    label: string;
    amount: number;
    icon: string;
    note?: string;
}

/** The unit's real running costs, shown as supporting detail on the impact page. */
export const COST_LINES: CostLine[] = [
    { label: "A ranger's field compass", amount: 500, icon: "compass-rose" },
    { label: "A month of one dog's healthcare", amount: 500, icon: "first-aid-kit", note: "Parasite control, vaccinations, check-ups" },
    { label: "One hour of aerial patrol", amount: 1850, icon: "airplane-tilt", note: "Savannah fuel, 500,000 ha to cover" },
    { label: "A ranger's handheld GPS", amount: 2400, icon: "compass" },
    { label: "Medical care for one dog, a year", amount: 5000, icon: "heartbeat", note: "R175,000 covers all 35 dogs" },
    { label: "A T5 GPS collar for a hound", amount: 7300, icon: "map-pin-area", note: "Tracked from the chopper on operations" },
    { label: "Food for one dog, a year", amount: 7800, icon: "bowl-food", note: "~R150 a week" },
    { label: "Training one anti-poaching ranger", amount: 52000, icon: "graduation-cap", note: "6-week course" },
    { label: "The unit's healthcare, a full year", amount: 175000, icon: "heartbeat", note: "All 35 dogs" },
];

export interface Milestone {
    /** Cumulative rand raised at which this outcome is funded. */
    threshold: number;
    title: string;
    detail: string;
    icon: string;
}

/**
 * The impact ladder, ascending. As the running total climbs, each rung is
 * funded in turn: from a single dog's care up to upgraded kennels and new
 * tracking dogs. Thresholds are cumulative, not additive per rung.
 */
export const MILESTONES: Milestone[] = [
    {
        threshold: 200,
        title: "Two dogs vaccinated",
        detail: "A full course of vaccinations to keep the pack healthy.",
        icon: "syringe",
    },
    {
        threshold: 2400,
        title: "A ranger kitted with a GPS",
        detail: "A handheld GPS for a ranger on foot patrol.",
        icon: "compass",
    },
    {
        threshold: 5000,
        title: "A year of medical care for one dog",
        detail: "Vet visits, vaccinations and parasite control for twelve months.",
        icon: "first-aid-kit",
    },
    {
        threshold: 7300,
        title: "A T5 GPS collar for a hound",
        detail: "Live tracking for a free-running hound on deployment.",
        icon: "map-pin-area",
    },
    {
        threshold: 7800,
        title: "One dog fed for a year",
        detail: "Premium working-hound nutrition, fifty-two weeks.",
        icon: "bowl-food",
    },
    {
        threshold: 15600,
        title: "Two dogs fed for a year",
        detail: "A full year of food for a pair of working dogs.",
        icon: "bowl-food",
    },
    {
        threshold: 39000,
        title: "Five dogs fed for a year",
        detail: "A working line of the pack, fed for twelve months.",
        icon: "bowl-food",
    },
    {
        threshold: 52000,
        title: "A new anti-poaching ranger trained",
        detail: "The full six-week field-ranger course, start to finish.",
        icon: "graduation-cap",
    },
    {
        threshold: 175000,
        title: "The unit's annual healthcare funded",
        detail: "A full year of medical care for every one of the 35 dogs.",
        icon: "heartbeat",
    },
    {
        threshold: 273000,
        title: "The whole pack fed for a year",
        detail: "All thirty-five working dogs, fed for twelve months.",
        icon: "paw-print",
    },
    {
        threshold: 500000,
        title: "The dog shelters upgraded",
        detail: "New kennels and runs to house the pack properly.",
        icon: "house-line",
    },
    {
        threshold: 1500000,
        title: "Kennels upgraded, plus two new tracking dogs",
        detail: "A full Comrades-scale year: new kennels and two trained hounds.",
        icon: "trophy",
    },
];
