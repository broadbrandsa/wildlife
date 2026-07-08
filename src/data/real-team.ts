/**
 * The REAL Southern African Wildlife College K9 Unit: its people, its dogs and
 * its operational record. Distinct from the game's selectable avatars.
 *
 * Names, roles and stats verified July 2026 against SAWC's own pages
 * (wildlifecollege.org.za/k9-unit and annual reviews) and International Rhino
 * Foundation reporting. Profiles use branded plates until SAWC supplies
 * photography; set `photo` on a profile (e.g. "/Unit/precious.jpg") and the
 * team page will render the image automatically.
 */

/** The unit's page on the SAWC site. */
export const UNIT_URL = "https://wildlifecollege.org.za/k9-unit/";

/** The unit's film. Embedded on the team page. */
export const UNIT_VIDEO = {
    youtubeId: "4VxxhOkGsWk",
    title: "The SAWC K9 Unit in the field",
    blurb: "Three minutes with the handlers and hounds your hunt supports, at work in the Greater Kruger.",
};

export interface UnitStat {
    value: string;
    label: string;
    sub?: string;
}

/** Headline operational stats, from SAWC's published K9 unit page. */
export const UNIT_STATS: UnitStat[] = [
    { value: "2015", label: "Unit established", sub: "With the support of the WWF Nedbank Green Trust" },
    { value: "35", label: "Working dogs", sub: "On-leash and free-running, kept at peak condition" },
    { value: "60%+", label: "Apprehension rate", sub: "vs under 10% without a dog team" },
    { value: "706", label: "Deployments", sub: "By 7 SAWC-trained partner units, Jan 2023 to Nov 2024" },
    { value: "172", label: "Arrests made", sub: "Same partner units and period" },
    { value: "91", label: "Weapons removed", sub: "Same partner units and period" },
];

/** The College's airwing, the aerial tier of the four-tier counter-poaching approach. */
export const AIRWING_STATS: UnitStat[] = [
    { value: "5,099", label: "Hours flown", sub: "Feb 2019 to Nov 2024" },
    { value: "1,043", label: "Anti-poaching hours", sub: "Within that total" },
    { value: "500,000", label: "Hectares covered", sub: "Patrolled by Savannah light sport aircraft" },
    { value: "80 to 100", label: "Hours a month", sub: "Patrols, monitoring and rhino calf rescues" },
];

export const AIRWING_BLURB =
    "The K9 unit is one tier of the College's four-tier approach to countering poaching, alongside well-trained field rangers, aerial support and community engagement. The airwing's Savannah aircraft fly low and slow over half a million hectares, disrupting incursions and spotting orphaned rhino calves before it is too late.";

export type TeamWash = "bushveld" | "dawn" | "clay" | "savanna";

export interface RealProfile {
    name: string;
    role: string;
    note: string;
    /** Breed (dogs only). */
    breed?: string;
    icon: string;
    wash: TeamWash;
    /** Path under /public. When set, the team page shows the photo instead of the plate. */
    photo?: string;
}

/** The people behind the unit (per SAWC's published team listing). */
export const REAL_HANDLERS: RealProfile[] = [
    {
        name: "Theresa Sowry",
        role: "Chief Executive Officer",
        note: "Has led the Southern African Wildlife College since 2011. The College has trained more than 23,000 people from some 60 countries.",
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
        name: "Annetjie Mkansi",
        role: "K9 Unit response officer & trainer",
        note: "Works the unit's dogs in training and on operational response.",
        icon: "user",
        wash: "dawn",
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
        note: "Born into the home-bred pack in 2022, trained off-leash and operational since 2023.",
        icon: "paw-print",
        wash: "clay",
    },
    {
        name: "Pepper",
        role: "Pack hound",
        breed: "Home-bred cross-breed hound",
        note: "Willow's litter-mate, raised and socialised at the College kennels and now running with the pack.",
        icon: "paw-print",
        wash: "dawn",
    },
    {
        name: "Hassi",
        role: "Trained here, serving in Eswatini",
        breed: "Belgian Malinois",
        note: "Trained by the unit in bitework, apprehension and tracking, then sent home to Eswatini to become operational. Proof the College's work travels.",
        icon: "dog",
        wash: "dawn",
    },
];
