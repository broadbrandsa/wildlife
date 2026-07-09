import type { Equipment } from "./types";

/**
 * The kit room. Every purchasable item both funds the real SAWC K9 unit AND
 * gives a genuine advantage in the hunt. Prices anchor to SAWC's published
 * donation values where they exist (R500 monthly healthcare, R500 ranger
 * compass, R1,850 aerial patrol hour, R2,400 handheld GPS, toward the R7,300
 * T5 tracking collar).
 *
 * Two starter items are free. The rest map to one clear hunt mechanic each:
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
    },
    {
        id: "topo-map",
        name: "Topographic overlay",
        tier: "hunt",
        priceZar: 200,
        description: "A geologist's read of the park's rock.",
        effect: "Reveals a paid intel clue reading the ground beneath the camp, turning the geology clues into a place you can point to.",
        fundedEquivalent: "Field-map printing for a ranger section",
        icon: "stack",
        unlocksClueId: "s02",
    },
    {
        id: "gps-collar",
        name: "GPS tracking collar",
        tier: "hunt",
        priceZar: 250,
        description: "A T5 live-tracking collar for a free-running hound.",
        effect: "Reveals a paid intel clue on where the pack was worked, tightening the search around the scent.",
        fundedEquivalent: "Toward SAWC's R7,300 T5 tracking collar for the pack",
        icon: "map-pin-area",
        unlocksClueId: "s08",
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
    },
    {
        id: "ranger-compass",
        name: "Ranger's compass",
        tier: "hunt",
        priceZar: 500,
        description: "A field compass for navigating deep bush and reporting an exact position.",
        effect: "Adds the compass pull to your dog's scent reads, showing which direction the trail is drawing toward.",
        fundedEquivalent: "Exact match to SAWC's published donation",
        icon: "compass-rose",
    },
    {
        id: "monthly-healthcare",
        name: "Monthly K9 healthcare",
        tier: "care",
        priceZar: 500,
        description: "Vet visits, vaccinations and parasite control for a month.",
        effect: "A fit dog is never off the trail: your scent reads never draw a total blank, so a cold read still comes back as at least a faint trail.",
        fundedEquivalent: "Exact match to SAWC's published donation",
        icon: "first-aid-kit",
    },
    {
        id: "plane-flyover",
        name: "Aerial patrol hour",
        tier: "big-ticket",
        priceZar: 1850,
        description: "One hour of a Savannah light sport aircraft over the hunt, low and slow.",
        effect: "Reveals a paid intel clue from the air, narrowing the hunt from a whole zone down to a single feature.",
        fundedEquivalent: "Exact match: one hour of Savannah patrol fuel",
        icon: "airplane-tilt",
        unlocksClueId: "s10",
    },
    {
        id: "ranger-gps",
        name: "Handheld GPS",
        tier: "big-ticket",
        priceZar: 2400,
        description: "Rugged handheld navigation for the field team.",
        effect: "Reveals a paid intel clue fixing the camp against the nearest river and road, one of the most precise reads.",
        fundedEquivalent: "Exact match to SAWC's published donation",
        icon: "compass",
        unlocksClueId: "s05",
    },
    {
        id: "helicopter-recon",
        name: "Helicopter recon",
        tier: "big-ticket",
        priceZar: 15000,
        description: "A helicopter sweep of the lowveld with the K9 team aboard.",
        effect: "Reveals a paid intel clue that rules out the eastern ridge, pointing you back to the granite country.",
        fundedEquivalent: "About one hour of SANParks helicopter operations",
        icon: "helicopter",
        unlocksClueId: "s03",
    },
];

export const EQUIPMENT_BY_ID: Record<string, Equipment> = Object.fromEntries(
    EQUIPMENT.map((e) => [e.id, e]),
);
