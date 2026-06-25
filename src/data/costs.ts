/**
 * Real-world SAWC K9 Unit costs, used to translate money raised into concrete
 * impact. Figures are drawn from the research in /Information (SAWC published
 * donation pages plus sector benchmarks) and are estimates pending SAWC's own
 * confirmation. Keep them here so the impact ladder stays honest and editable.
 */
export const UNIT_COSTS = {
    dogsInPack: 21, // approximate working pack size
    foodPerDogYear: 7800, // ~R150/week of premium hound food x 52
    healthcarePerDogYear: 6000, // R500/dog/month x 12 (SAWC published)
    rangerGps: 2400, // SAWC published
    rangerTraining: 52000, // 6-week anti-poaching field-ranger course
    packFoodPerMonth: 20000, // ~R20,000/month for the whole pack
    packFoodPerYear: 240000, // x 12
    annualHealthcareGoal: 175000, // SAWC's published 2025 healthcare fund goal
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
    { label: "Food for one dog, a year", amount: 7800, icon: "bowl-food", note: "~R150 a week" },
    { label: "Vet care for one dog, a year", amount: 6000, icon: "first-aid-kit", note: "R500 a month" },
    { label: "Feeding the whole pack, a month", amount: 20000, icon: "paw-print", note: "~21 dogs" },
    { label: "A ranger's handheld GPS", amount: 2400, icon: "compass" },
    { label: "Training one anti-poaching ranger", amount: 52000, icon: "graduation-cap", note: "6-week course" },
    { label: "The unit's healthcare, a full year", amount: 175000, icon: "heartbeat" },
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
        threshold: 6000,
        title: "A year of vet care for one dog",
        detail: "Vet visits, vaccinations and parasite control for twelve months.",
        icon: "first-aid-kit",
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
        detail: "A quarter of the pack, fed for twelve months.",
        icon: "bowl-food",
    },
    {
        threshold: 52000,
        title: "A new anti-poaching ranger trained",
        detail: "The full six-week field-ranger course, start to finish.",
        icon: "graduation-cap",
    },
    {
        threshold: 164000,
        title: "The whole pack fed for a year",
        detail: "All twenty-one working dogs, fed for twelve months.",
        icon: "paw-print",
    },
    {
        threshold: 175000,
        title: "The unit's annual healthcare funded",
        detail: "A full year of vet care for every dog in the unit.",
        icon: "heartbeat",
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
