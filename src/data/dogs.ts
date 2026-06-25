import type { Dog } from "./types";

/** Four selectable dogs, each tied to a real SAWC K9 role. */
export const DOGS: Dog[] = [
    {
        id: "storm",
        name: "Storm",
        breed: "Belgian Malinois",
        role: "Apprehension & detection all-rounder",
        effect: "+1 free clue at the round midpoint",
        personality: "Brave, fast, will protect you.",
        didYouKnow:
            "Malinois are the SAWC unit's apprehension specialists, fearless under pressure and quick to follow a handler's command.",
        icon: "dog",
    },
    {
        id: "scout",
        name: "Scout",
        breed: "Bloodhound",
        role: "On-leash cold-spoor tracker",
        effect: "Reveals a zone-level direction hint earlier",
        personality: "Patient, methodical, a world-class nose.",
        didYouKnow:
            "A bloodhound can follow a scent trail that is days old, which is why they are the unit's cold-spoor trackers.",
        icon: "paw-print",
    },
    {
        id: "banjo",
        name: "Banjo",
        breed: "Texan coonhound cross",
        role: "Free-running pack hound",
        effect: "Slightly larger pin radius (more forgiving scoring)",
        personality: "Off-leash, fearless, runs at 40 km/h.",
        didYouKnow:
            "SAWC's free-running hounds were introduced in 2018 thanks to Texan houndsman Joe Braman. They track off-leash at up to 40 km/h.",
        icon: "dog",
    },
    {
        id: "pepper",
        name: "Pepper",
        breed: "Springer Spaniel",
        role: "Detection: ammunition, horn, pangolin scales",
        effect: "Unlocks a contraband-intercept bonus clue",
        personality: "Small, focused, finds what others miss.",
        didYouKnow:
            "Springer spaniels sniff out ammunition, rhino horn and pangolin scales at roadblocks and camps.",
        icon: "paw-print",
    },
];

export const DOG_BY_ID: Record<string, Dog> = Object.fromEntries(DOGS.map((d) => [d.id, d]));
