import type { Clue } from "./types";

/**
 * Round 1 clue bank. The poacher is hidden at Red Rocks on the Shingwedzi
 * (Zone 3, mopane-shingwedzi). Every clue is a genuine signal toward that
 * location, narrowing from zone level to landmark level across the round.
 *
 * 9 free time-released clues + 5 equipment-locked + 3 sponsor-coupon clues.
 */
export const CLUES: Clue[] = [
    // ---- Free, time-released (the difficulty curve) ----------
    {
        id: "free-d1",
        source: "free",
        category: "botanical",
        difficulty: "zone",
        releaseDay: 1,
        zoneId: "mopane-shingwedzi",
        body: "Dispatch radios in: the campfire ash was mixed with butterfly-shaped leaves, turning orange. This is big elephant country, north of the Olifants.",
        didYouKnow:
            "Mopane leaves fold like a butterfly's wings and blush orange in autumn. The tree dominates Kruger's northern half.",
    },
    {
        id: "free-d7",
        source: "free",
        category: "cultural",
        difficulty: "zone",
        releaseDay: 7,
        zoneId: "mopane-shingwedzi",
        body: "An elder told the ranger the suspect was seen near the river whose Tsonga name means 'place of ironstone'.",
        didYouKnow:
            "Shingwedzi means 'place of ironstone' in Tsonga, a nod to the iron-rich rock that stains the area red.",
    },
    {
        id: "free-d14",
        source: "free",
        category: "mammal",
        difficulty: "zone",
        releaseDay: 14,
        zoneId: "mopane-shingwedzi",
        body: "A herd of tsessebe watched from the open ground, and roan moved beyond them. Few tourists reach this northern country.",
        didYouKnow:
            "Tsessebe and roan antelope favour the lightly wooded northern plains and are rare elsewhere in the park.",
    },
    {
        id: "free-d21",
        source: "free",
        category: "bird",
        difficulty: "zone",
        releaseDay: 21,
        zoneId: "mopane-shingwedzi",
        body: "A bateleur tipped its wings overhead and a Meves's starling chattered in the mopane. The dogs pressed on toward the river.",
        didYouKnow:
            "The bateleur eagle's name is French for 'tightrope walker', after the rocking way it banks in flight.",
    },
    {
        id: "free-d30",
        source: "free",
        category: "geological",
        difficulty: "feature",
        releaseDay: 30,
        zoneId: "mopane-shingwedzi",
        body: "The scent led to iron-red boulders rising above the river, where elephants cooled in the water below.",
        didYouKnow:
            "Red Rocks gets its colour from iron oxide in ancient Soutpansberg sandstone, weathered into deep red domes.",
    },
    {
        id: "free-d45",
        source: "free",
        category: "mammal",
        difficulty: "feature",
        releaseDay: 45,
        zoneId: "mopane-shingwedzi",
        body: "Klipspringers bounced across the red stone and a rock hyrax watched from a ledge. Water sat still in a dam just downstream.",
        didYouKnow:
            "Klipspringers walk on the very tips of their hooves and can stand on a rock ledge the size of a coin.",
    },
    {
        id: "free-d60",
        source: "free",
        category: "hydrological",
        difficulty: "feature",
        releaseDay: 60,
        zoneId: "mopane-shingwedzi",
        body: "The dogs worked a bend in the Shingwedzi, upstream of Kanniedood Dam, where the banks turn to bare red rock.",
        didYouKnow:
            "Kanniedood ('cannot die') Dam was named for the hardy fever trees that survive its seasonal floods.",
    },
    {
        id: "free-d75",
        source: "free",
        category: "geological",
        difficulty: "landmark",
        releaseDay: 75,
        zoneId: "mopane-shingwedzi",
        body: "A cold campfire sat on iron-red boulders smoothed by centuries of Shingwedzi floods, just off the loop road from the camp.",
        didYouKnow:
            "The Red Rocks loop is one of the few places in the mopane north where you leave the trees for open sandstone.",
    },
    {
        id: "free-d88",
        source: "free",
        category: "geological",
        difficulty: "landmark",
        releaseDay: 88,
        zoneId: "mopane-shingwedzi",
        body: "Synthesis: stand at the Red Rocks viewpoint on the Shingwedzi. The suspect's camp was within sight of the largest red dome.",
        didYouKnow:
            "Red Rocks viewpoint is the signature stop on the Shingwedzi loop and the answer this whole hunt has pointed toward.",
    },

    // ---- Equipment-locked (operational / visual) -------------
    {
        id: "eq-topo",
        source: "equipment",
        category: "geological",
        difficulty: "feature",
        zoneId: "mopane-shingwedzi",
        body: "Your topographic overlay lights up a band of sandstone cutting through the mopane on the Shingwedzi, the only red rock for miles.",
        didYouKnow:
            "Granite dominates Kruger's west, basalt the east, rhyolite the Lebombo ridge, and sandstone the far north.",
    },
    {
        id: "eq-gps",
        source: "equipment",
        category: "operational",
        difficulty: "feature",
        zoneId: "mopane-shingwedzi",
        body: "The GPS collar pings a tight patrol radius around the Shingwedzi camp. The scent never leaves the river's red-rock bend.",
        didYouKnow:
            "GPS collars let handlers see exactly where a free-running hound has tracked, even out of sight.",
    },
    {
        id: "eq-plane",
        source: "equipment",
        category: "operational",
        difficulty: "landmark",
        zoneId: "mopane-shingwedzi",
        body: "The Bat Hawk's aerial photo shows a thread of smoke beside a cluster of bald red boulders on the north bank.",
        didYouKnow:
            "The Bat Hawk is a light microlight used for low, slow anti-poaching sweeps over the bush.",
    },
    {
        id: "eq-ranger-gps",
        source: "equipment",
        category: "operational",
        difficulty: "landmark",
        zoneId: "mopane-shingwedzi",
        body: "Field-team GPS confirms it: the waypoint sits between the Red Rocks viewpoint and the river, north bank.",
        didYouKnow:
            "A handheld GPS costs SAWC about R2,400 and is standard kit for a field ranger on patrol.",
    },
    {
        id: "eq-heli",
        source: "equipment",
        category: "operational",
        difficulty: "landmark",
        zoneId: "mopane-shingwedzi",
        body: "The Squirrel sweeps two zones and finds nothing in the central plains. The only fresh sign is at Red Rocks on the Shingwedzi.",
        didYouKnow:
            "A helicopter hour for SANParks costs roughly R15,000, which is why aerial time is reserved for live operations.",
    },

    // ---- Sponsor-coupon clues (character-led + educational) ---
    {
        id: "sp-5fm",
        source: "sponsor",
        category: "geological",
        difficulty: "feature",
        zoneId: "mopane-shingwedzi",
        body: "Ranger Precious, on air: 'The suspect was last seen where the river runs over red stone. That stone is ancient sandstone, stained by iron, in the mopane north.'",
        didYouKnow:
            "The Red Rocks sandstone was laid down long before the dinosaurs, then lifted and weathered into the domes you see today.",
    },
    {
        id: "sp-radio2",
        source: "sponsor",
        category: "bird",
        difficulty: "feature",
        zoneId: "mopane-shingwedzi",
        body: "A guest birder calls it in: 'Listen for the racket-tailed roller. South of Shingwedzi you won't hear it. Your suspect is in roller country, near the red rock.'",
        didYouKnow:
            "The racket-tailed roller is a far-north special, almost never recorded south of the Shingwedzi.",
    },
    {
        id: "sp-school",
        source: "sponsor",
        category: "hydrological",
        difficulty: "landmark",
        zoneId: "mopane-shingwedzi",
        body: "A school's class submits the answer together: 'The red boulders are on the Shingwedzi, just up from Kanniedood Dam. That's where the camp was.'",
        didYouKnow:
            "Every perennial river in Kruger flows east toward Mozambique. The Shingwedzi crosses the border below Kanniedood.",
    },
];

export const CLUE_BY_ID: Record<string, Clue> = Object.fromEntries(CLUES.map((c) => [c.id, c]));

export const FREE_CLUES = CLUES.filter((c) => c.source === "free");
