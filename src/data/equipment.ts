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
 *   - reinforced-leash  : a second scent read each day
 *   - pro-binoculars    : deeper map zoom for a more precise pin
 *   - ranger-boots      : your reads reach further (cover more ground)
 *   - ranger-compass    : reads show the compass direction of the trail
 *   - monthly-healthcare: a fit dog never draws a blank (cold reads come back faint)
 *   - five kit items with `unlocksClueId` reveal a paid intel clue
 */
export const EQUIPMENT: Equipment[] = [
    {
        id: "standard-collar",
        name: "Standard collar",
        tier: "free",
        priceZar: 0,
        description: "Your dog's everyday leather collar. Your team is on the board.",
        effect: "Starter kit. Upgrade to the GPS collar to read your dog's track.",
        fundedEquivalent: "Included",
        icon: "circle",
        realWorldNote: "Every SAWC dog wears a plain collar around the kennels. The working collar, out on a deployment, is the GPS one.",
    },
    {
        id: "field-map",
        name: "Field map",
        tier: "free",
        priceZar: 0,
        description: "The base map of the lowveld.",
        effect: "Shows all eight zones. This is your starting view for placing a pin.",
        fundedEquivalent: "Included",
        icon: "map-trifold",
        realWorldNote: "Handlers and rangers plan every deployment off detailed maps of their section of the park.",
    },
    {
        id: "reinforced-leash",
        name: "Tracking leash and harness",
        tier: "hunt",
        priceZar: 50,
        description: "A heavy-duty Rogz leash and tracking harness for rough country.",
        effect: "Lets your dog take a second scent read each day, so you can test two pins before the sun is high.",
        fundedEquivalent: "A tracking leash and harness for a handler",
        icon: "link",
        realWorldNote: "On-leash trackers work a long line and harness. On a cold spoor a good dog can pull a handler along for hours.",
    },
    {
        id: "pro-binoculars",
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
        id: "ranger-boots",
        name: "Ranger patrol boots",
        tier: "hunt",
        priceZar: 350,
        description: "Tough boots for a handler covering ground on foot all day.",
        effect: "Your team covers more ground, so every scent read reaches further: warm and fresh trails show from a wider radius.",
        fundedEquivalent: "A pair of field boots for a ranger",
        icon: "boot",
        realWorldNote: "Field rangers patrol on foot for days at a time. Sound boots are basic, vital kit for the people behind the dogs.",
    },
    {
        id: "ranger-compass",
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
        name: "Monthly K9 healthcare",
        tier: "care",
        priceZar: 500,
        description: "Vet visits, vaccinations and parasite control for a month.",
        effect: "A fit dog is never off the trail: your scent reads never draw a total blank, so a cold read still comes back as at least a faint trail.",
        fundedEquivalent: "One dog's healthcare for a month",
        icon: "first-aid-kit",
        realWorldNote: "SAWC budgets vet care, vaccinations, parasite control and supplements for every dog, every month, at about R500 a dog.",
    },
    {
        id: "plane-flyover",
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
];

/**
 * Field guides. Players pick ONE free at sign-on (their starting area) and can
 * unlock the others here. Each guide opens a zone's full field guide (rock,
 * plants, animals, named places), the deduction toolkit that turns clues into a
 * place you can point to. Marking a zone on the case board stays free for all.
 */
export const GUIDES: Equipment[] = ZONES.map((z) => ({
    id: `guide-${z.id}`,
    name: `Field guide: ${z.name}`,
    tier: "care" as const,
    priceZar: 60,
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
