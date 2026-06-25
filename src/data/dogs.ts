import type { Dog } from "./types";

/** Five selectable dogs, each tied to a real SAWC K9 role. */
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
        photo: "/Dogs/Storm.png",
    },
    {
        id: "scout",
        name: "Scout",
        breed: "Bloodhound (guest dog, cross-trains with SAWC)",
        role: "On-leash cold-spoor tracker",
        effect: "Reveals a zone-level direction hint earlier in the round",
        personality: "Patient, methodical, a world-class nose.",
        didYouKnow:
            "Bloodhounds follow scent trails days old. They are used by the SANParks Kruger unit, so Scout joins you as a guest dog cross-training with SAWC.",
        icon: "paw-print",
        photo: "/Dogs/Scout.png",
    },
    {
        id: "banjo",
        name: "Banjo",
        breed: "English Foxhound × American Bluetick Coonhound cross",
        role: "Free-running pack hound, off-leash sprinter",
        effect: "Slightly larger pin radius (more forgiving scoring)",
        personality: "Off-leash, fearless, runs at 40 km/h.",
        didYouKnow:
            "SAWC's free-running pack was donated by Texan houndsman Joe Braman in 2018, with the relocation funded by the Ivan Carter Wildlife Conservation Alliance. They track off-leash at up to 40 km/h.",
        icon: "dog",
        photo: "/Dogs/Banjo.png",
    },
    {
        id: "dotty",
        name: "Dotty",
        breed: "American (Black and Tan) Coonhound",
        role: "Senior pack matriarch, top off-leash hound",
        effect: "Unlocks a pack-formation clue at day 30",
        personality: "Experienced, calm, the heart of the pack.",
        didYouKnow:
            "Dotty is a real SAWC dog: a four-year-old Coonhound and one of the unit's top off-leash hounds, who had a litter of 10 puppies in March 2026.",
        icon: "paw-print",
        photo: "/Dogs/Dotty.png",
    },
    {
        id: "pepper",
        name: "Pepper",
        breed: "English Springer Spaniel (guest dog, cross-trains with SAWC)",
        role: "Detection: rhino horn, ivory, ammunition",
        effect: "Unlocks a contraband-intercept bonus clue",
        personality: "Small, focused, finds what others miss.",
        didYouKnow:
            "Springer Spaniels sniff out horn, ivory and ammunition at park gates. Pepper joins you as a guest detection dog cross-training with SAWC.",
        icon: "paw-print",
        photo: "/Dogs/Pepper.png",
    },
];

export const DOG_BY_ID: Record<string, Dog> = Object.fromEntries(DOGS.map((d) => [d.id, d]));
