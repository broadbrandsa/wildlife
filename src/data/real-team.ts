/**
 * The REAL Southern African Wildlife College K9 Unit: its people, its dogs and
 * its operational record. Distinct from the game's selectable avatars.
 *
 * Names, roles and stats are drawn from public SAWC and International Rhino
 * Foundation sources (see /Information and the citations in the team page).
 * We do not hold photographs of the real people or dogs, so the profiles use
 * branded placeholder plates until SAWC supplies imagery. Treat bios as
 * factual-but-light, pending the unit's confirmation.
 */

export interface UnitStat {
    value: string;
    label: string;
    sub?: string;
}

/** Headline operational stats. Period and caveats noted on the page. */
export const UNIT_STATS: UnitStat[] = [
    { value: "120", label: "Deployments", sub: "Feb 2018 to Dec 2019" },
    { value: "134", label: "Poachers arrested", sub: "Same period" },
    { value: "55", label: "Weapons seized", sub: "Same period" },
    { value: "60%+", label: "Apprehension rate", sub: "vs under 10% without a dog team" },
    { value: "2015", label: "Unit established", sub: "In the Greater Kruger" },
    { value: "~21", label: "Working dogs", sub: "Line dogs and a free-running pack" },
];

export type TeamWash = "bushveld" | "dawn" | "clay" | "savanna";

export interface RealProfile {
    name: string;
    role: string;
    note: string;
    /** Breed (dogs only). */
    breed?: string;
    icon: string;
    wash: TeamWash;
}

/** The people behind the unit. */
export const REAL_HANDLERS: RealProfile[] = [
    {
        name: "Theresa Sowry",
        role: "Chief Executive Officer",
        note: "Leads the Southern African Wildlife College, which has trained more than 18,000 students from 56 countries since 1996.",
        icon: "user",
        wash: "bushveld",
    },
    {
        name: "Johan van Straaten",
        role: "Dog Master & master trainer",
        note: "Built and runs the unit's line dogs and free-running pack, and introduced the Texan tracking hounds in 2018.",
        icon: "user",
        wash: "dawn",
    },
    {
        name: "Precious Malapane",
        role: "Deployment manager & trainer",
        note: "One of the trainers who runs the free-running hound pack on deployment in the field.",
        icon: "user",
        wash: "clay",
    },
    {
        name: "Kirah Blake",
        role: "Deployment manager & trainer",
        note: "Trains and deploys the unit's dogs across the Greater Kruger.",
        icon: "user",
        wash: "bushveld",
    },
    {
        name: "Dian Kobus Louw",
        role: "Deployment manager & trainer",
        note: "Works the line dogs and free-running pack on anti-poaching operations.",
        icon: "user",
        wash: "dawn",
    },
    {
        name: "Jason Dean",
        role: "Deployment manager & trainer",
        note: "Trains and handles the unit's working dogs in the field.",
        icon: "user",
        wash: "clay",
    },
    {
        name: "Simon Mnisi",
        role: "K9 Unit coordinator",
        note: "Keeps the unit running day to day, from kennels to deployments.",
        icon: "user",
        wash: "bushveld",
    },
];

/** The real dogs of the unit. */
export const REAL_DOGS: RealProfile[] = [
    {
        name: "V",
        role: "Pack tracker, founding mother",
        breed: "English foxhound × bluetick × beagle cross",
        note: "A pack tracker and the mother of the unit's first home-bred litter in 2018.",
        icon: "paw-print",
        wash: "savanna",
    },
    {
        name: "Rhino",
        role: "Pack sire",
        breed: "Cross-breed hound",
        note: "Father of the home-bred pack and a steady tracker in his own right.",
        icon: "paw-print",
        wash: "clay",
    },
    {
        name: "Hassi",
        role: "Apprehension & detection",
        breed: "Belgian Malinois",
        note: "An all-rounder who can apprehend a suspect, protect a handler and sniff out horn, ivory and contraband. Came to the unit from Eswatini.",
        icon: "dog",
        wash: "dawn",
    },
    {
        name: "Dotty",
        role: "Senior off-leash hound",
        breed: "American (Black and Tan) Coonhound",
        note: "One of the unit's top free-running hounds, who had a litter of ten puppies in March 2026.",
        icon: "paw-print",
        wash: "savanna",
    },
    {
        name: "Willow",
        role: "Pack hound",
        breed: "Home-bred cross-breed hound",
        note: "Born into the unit's home-bred pack and trained for free-running tracking.",
        icon: "paw-print",
        wash: "clay",
    },
    {
        name: "Pepper",
        role: "Pack hound",
        breed: "Home-bred cross-breed hound",
        note: "One of the unit's home-bred pups, raised and socialised at the College kennels.",
        icon: "paw-print",
        wash: "dawn",
    },
];
