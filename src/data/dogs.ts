import type { Dog } from "./types";

/** Five selectable dogs, each tied to a real SAWC K9 role. */
export const DOGS: Dog[] = [
    {
        id: "storm",
        name: "Storm",
        breed: "Belgian Malinois",
        role: "Apprehension & detection all-rounder",
        effect: "Superpower: relentless drive. Malinois stamina sets a hard pace, so your ranger walks each leg in half the time",
        personality: "Brave, fast, will protect you.",
        didYouKnow:
            "Malinois are the SAWC unit's apprehension specialists, fearless under pressure and quick to follow a handler's command.",
        icon: "dog",
        photo: "/Dogs/Storm.png",
        cutout: "/Dogs/cutout/storm.png",
    },
    {
        id: "scout",
        name: "Scout",
        breed: "Bloodhound (guest dog, cross-trains with SAWC)",
        role: "On-leash cold-spoor tracker",
        effect: "Superpower: the long nose. A bloodhound reads scent from much further out",
        personality: "Patient, methodical, a world-class nose.",
        didYouKnow:
            "Bloodhounds follow scent trails days old. They are used by the SANParks Kruger unit, so Scout joins you as a guest dog cross-training with SAWC.",
        icon: "paw-print",
        photo: "/Dogs/Scout.png",
        cutout: "/Dogs/cutout/scout.png",
    },
    {
        id: "banjo",
        name: "Banjo",
        breed: "English Foxhound × American Bluetick Coonhound cross",
        role: "Free-running pack hound, off-leash sprinter",
        effect: "Superpower: born to run. Your ranger covers half again as much ground each day",
        personality: "Off-leash, fearless, runs at 40 km/h.",
        didYouKnow:
            "SAWC's free-running pack was donated by Texan houndsman Joe Braman in 2018, with the relocation funded by the Ivan Carter Wildlife Conservation Alliance. They track off-leash at up to 40 km/h.",
        icon: "dog",
        photo: "/Dogs/Banjo.png",
        cutout: "/Dogs/cutout/banjo.png",
    },
    {
        id: "dotty",
        name: "Dotty",
        breed: "American (Black and Tan) Coonhound",
        role: "Senior pack matriarch, top off-leash hound",
        effect: "Superpower: bush wisdom. The matriarch knows this ground, so you pick a second field guide free",
        personality: "Experienced, calm, the heart of the pack.",
        didYouKnow:
            "Dotty is a real SAWC dog: a four-year-old Coonhound and one of the unit's top off-leash hounds, who had a litter of 10 puppies in March 2026.",
        icon: "paw-print",
        photo: "/Dogs/Dotty.png",
        cutout: "/Dogs/cutout/dotty.png",
    },
    {
        id: "pepper",
        name: "Pepper",
        breed: "English Springer Spaniel (guest dog, cross-trains with SAWC)",
        role: "Detection: rhino horn, ivory, ammunition",
        effect: "Superpower: finds what others miss. Every read carries an exact bearing, and her nose keeps working, so species markers appear more often around you",
        personality: "Small, focused, finds what others miss.",
        didYouKnow:
            "Springer Spaniels sniff out horn, ivory and ammunition at park gates. Pepper joins you as a guest detection dog cross-training with SAWC.",
        icon: "paw-print",
        photo: "/Dogs/Pepper.png",
        cutout: "/Dogs/cutout/pepper.png",
    },
];

export const DOG_BY_ID: Record<string, Dog> = Object.fromEntries(DOGS.map((d) => [d.id, d]));
