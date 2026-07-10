import type { Equipment } from "./types";
import { ZONES } from "./zones";

/**
 * The kit room. Every purchasable item both funds the real SAWC K9 unit AND
 * gives a genuine advantage in the hunt. Prices anchor to SAWC's published
 * donation values where they exist. Each item carries a `realWorldNote`
 * explaining how the real unit uses it, surfaced behind a "What is this really?"
 * disclosure in the shop with a link to the in-app K9 Unit page.
 *
 * Hunt mechanics, one per item:
 *   - ranger-boots      : move your ranger a second time each day
 *   - pro-binoculars    : deeper map zoom for a more precise pin
 *   - field-radio       : call HQ to reveal which third the scent is in
 *   - ranger-compass    : a fine eight-point bearing on the scent
 *   - monthly-healthcare: a fit dog's nose reaches further (wider scent radius)
 *   - five kit items with `unlocksClueId` reveal a paid intel clue
 */
export const EQUIPMENT: Equipment[] = [
    {
        id: "standard-collar",
        kitCategory: "dog",
        name: "Standard collar",
        tier: "free",
        priceZar: 0,
        description: "Your dog's everyday leather collar. Your team is on the board.",
        effect: "Standard issue for every dog on the roster. It does not change the hunt on its own; the paid kit below does.",
        fundedEquivalent: "Included",
        icon: "circle",
        realWorldNote: "Every SAWC dog wears a plain collar around the kennels. The working collar, out on a deployment, is the GPS one.",
    },
    {
        id: "pro-binoculars",
        kitCategory: "ranger",
        name: "Field binoculars",
        tier: "hunt",
        priceZar: 100,
        description: "High-power optics for reading distant ground.",
        effect: "Doubles how far you can zoom into the map, so you can read the terrain and place your pin far more precisely.",
        fundedEquivalent: "A field ranger's binocular kit",
        icon: "binoculars",
        realWorldNote: "Rangers glass the bush for movement, dust and circling vultures before and during a follow-up.",
    },
    {
        id: "topo-map",
        kitCategory: "ranger",
        name: "Topographic overlay",
        tier: "hunt",
        priceZar: 200,
        description: "A geologist's read of the park's rock.",
        effect: "Reveals a paid geology intel clue. One of your tools for reading the terrain clues.",
        fundedEquivalent: "Field-map printing for a ranger section",
        icon: "stack",
        unlocksClueId: "s02",
        realWorldNote: "The unit reads terrain and geology to predict where a suspect will move, cross water and rest up.",
    },
    {
        id: "gps-collar",
        kitCategory: "dog",
        name: "GPS tracking collar",
        tier: "hunt",
        priceZar: 250,
        description: "A T5 live-tracking collar for a free-running hound.",
        effect: "Reveals a paid tracking intel clue on where the pack has worked.",
        fundedEquivalent: "Toward SAWC's R7,300 T5 tracking collar for the pack",
        icon: "map-pin-area",
        unlocksClueId: "s08",
        realWorldNote: "SAWC's free-running hounds wear T5 GPS collars so handlers can follow them from the vehicle or the helicopter.",
    },
    {
        id: "field-radio",
        kitCategory: "ranger",
        name: "Field radio",
        tier: "hunt",
        priceZar: 300,
        description: "A two-way VHF radio to reach the K9 operations room.",
        effect: "Call HQ to hear where other ranger teams have picked up a scent, revealing which third of the park to head for.",
        fundedEquivalent: "A handheld radio for a field team",
        icon: "broadcast",
        realWorldNote: "Two-way radios keep foot teams, the operations room and the airwing in constant contact during a follow-up. Coordination is everything.",
    },
    {
        id: "ranger-boots",
        kitCategory: "ranger",
        name: "Ranger patrol boots",
        tier: "hunt",
        priceZar: 350,
        description: "Tough boots for a handler covering ground on foot all day.",
        effect: "Fresh legs cover more ground, so you can move your ranger a second time in the same day.",
        fundedEquivalent: "A pair of field boots for a ranger",
        icon: "boot",
        realWorldNote: "Field rangers patrol on foot for days at a time. Sound boots are basic, vital kit for the people behind the dogs.",
    },
    {
        id: "ranger-compass",
        kitCategory: "ranger",
        name: "Ranger's compass",
        tier: "hunt",
        priceZar: 500,
        description: "A field compass for navigating deep bush and reporting an exact position.",
        effect: "Adds the compass pull to your dog's scent reads, showing which direction the trail is drawing toward.",
        fundedEquivalent: "A field compass for a ranger",
        icon: "compass-rose",
        realWorldNote: "A map and compass are a ranger's fallback when GPS batteries die or signal is lost deep in the bush.",
    },
    {
        id: "monthly-healthcare",
        kitCategory: "dog",
        name: "Monthly K9 healthcare",
        tier: "care",
        priceZar: 500,
        description: "Vet visits, vaccinations and parasite control for a month.",
        effect: "A fit, well-conditioned dog works a wider nose: warm and fresh scent reaches you from further out.",
        fundedEquivalent: "One dog's healthcare for a month",
        icon: "first-aid-kit",
        realWorldNote: "SAWC budgets vet care, vaccinations, parasite control and supplements for every dog, every month, at about R500 a dog.",
    },
    {
        id: "plane-flyover",
        kitCategory: "air",
        name: "Aerial patrol hour",
        tier: "big-ticket",
        priceZar: 1850,
        description: "One hour of a Savannah light sport aircraft over the hunt, low and slow.",
        effect: "Reveals a paid intel clue from the air, narrowing the hunt from a whole zone down to a single feature.",
        fundedEquivalent: "One hour of Savannah patrol fuel",
        icon: "airplane-tilt",
        unlocksClueId: "s10",
        realWorldNote: "The College airwing flies Savannah light aircraft low and slow over some 500,000 hectares, disrupting incursions and spotting orphaned rhino calves.",
    },
    {
        id: "ranger-gps",
        kitCategory: "ranger",
        name: "Handheld GPS",
        tier: "big-ticket",
        priceZar: 2400,
        description: "Rugged handheld navigation for the field team.",
        effect: "Reveals a precise paid intel clue from the field team, one of the sharpest reads.",
        fundedEquivalent: "A handheld GPS for a ranger",
        icon: "compass",
        unlocksClueId: "s05",
        realWorldNote: "A rugged handheld GPS lets a ranger fix and radio an exact position, essential for coordinating a follow-up team.",
    },
    {
        id: "helicopter-recon",
        kitCategory: "air",
        name: "Helicopter recon",
        tier: "big-ticket",
        priceZar: 15000,
        description: "A helicopter sweep of the lowveld with the K9 team aboard.",
        effect: "Reveals a paid intel clue from a wide aerial sweep that rules ground out.",
        fundedEquivalent: "About one hour of helicopter operations",
        icon: "helicopter",
        unlocksClueId: "s03",
        realWorldNote: "Helicopter time supports live operations and rhino work. It is expensive, so aerial hours are reserved for when they count most.",
    },
    {
        id: "truck-fuel",
        kitCategory: "ranger",
        name: "Patrol bakkie fuel",
        tier: "hunt",
        priceZar: 150,
        description: "A tank of fuel for the unit's patrol bakkie.",
        effect: "One more bakkie ride. The bakkie carries your ranger and dog to any point on the map, but the drive takes the rest of the day. You start the round with two free rides.",
        fundedEquivalent: "About a day of patrol-vehicle fuel",
        icon: "truck",
        realWorldNote: "K9 teams deploy by vehicle. Handlers and dogs are trucked to where the trail starts, and the tracking begins where the wheels stop.",
        consumable: true,
    },
    {
        id: "extra-lockin",
        kitCategory: "ranger",
        name: "Second lock-in",
        tier: "hunt",
        priceZar: 30,
        description: "A fresh lock-in for a ranger who has changed their mind.",
        effect: "Reopens your locked pin so you can move it and lock in once more. Your first lock-in is always free.",
        fundedEquivalent: "About two days of food for one working dog",
        icon: "lock-key-open",
        realWorldNote: "In the field, a fresh radio call can move a whole team. Your donation feeds a dog while you get one more read on the ground.",
        consumable: true,
    },
];

/**
 * Field guides. The FIRST guide is free: it unlocks automatically for the zone
 * where the player drops their first pin (see the map page). Every other zone's
 * guide can be unlocked here for R25. Each guide opens a zone's full field guide
 * (rock, plants, animals, named places), the deduction toolkit that turns clues
 * into a place you can point to.
 */
export const GUIDES: Equipment[] = ZONES.map((z) => ({
    id: `guide-${z.id}`,
    name: `Field guide: ${z.name}`,
    tier: "care" as const,
    priceZar: 25,
    description: `${z.subtitle}. Its rock, plants, animals and named places.`,
    effect: `Opens the full field guide for ${z.name}, so you can read its terrain and rule it in or out with confidence.`,
    fundedEquivalent: "Field-ranger training materials",
    icon: "book-open",
    unlocksFieldGuideZoneId: z.id,
    realWorldNote:
        "Ranger training at SAWC is exactly this skill: reading the land, its plants and its animals to know where you are and where a suspect will head.",
}));

/** Everything that can be donated for (kit + field guides), for checkout lookup. */
export const PURCHASABLES: Equipment[] = [...EQUIPMENT, ...GUIDES];

export const EQUIPMENT_BY_ID: Record<string, Equipment> = Object.fromEntries(
    PURCHASABLES.map((e) => [e.id, e]),
);
