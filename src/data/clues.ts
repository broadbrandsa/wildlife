import type { Clue } from "./types";

/**
 * Round 1 clue bank. The poacher is hidden at Red Rocks on the Shingwedzi
 * (Zone 3, mopane-shingwedzi).
 *
 * Design rules for the arc:
 * - Early clues are riddles. They describe ground, plants, animals and names
 *   without ever spelling out the answer. The field guide makes them solvable.
 * - Elimination clues rule ground out, so all eight zones stay in play.
 * - Place names on the trail (Shingwedzi, Red Rocks) only appear from day 60.
 * - "Did you know" teaches something real without giving the answer away
 *   before the trail clue itself does.
 *
 * 13 free time-released (9 trail + 4 elimination) + 5 equipment-locked
 * + 3 sponsor-coupon + 3 dog-instinct clues.
 */
export const CLUES: Clue[] = [
    // ---- Free, time-released (the difficulty curve) ----------
    {
        id: "free-d1",
        source: "free",
        category: "botanical",
        difficulty: "zone",
        kind: "trail",
        releaseDay: 1,
        zoneId: "mopane-shingwedzi",
        body: "Dispatch radios in: the campfire ash was mixed with butterfly-shaped leaves, and elephant dung lay all around the site. Wherever this man is walking, that tree grows thick.",
        didYouKnow:
            "One Kruger tree has leaves that fold like a butterfly's wings and blush orange in autumn. Check the field guide: it rules out half the park.",
    },
    {
        id: "free-d4",
        source: "free",
        category: "botanical",
        difficulty: "zone",
        kind: "elimination",
        releaseDay: 4,
        zoneId: "far-north",
        body: "The pack swept the fever tree forests where three countries meet. Two days of casting for scent, nothing. The trail does not start this far north.",
        didYouKnow:
            "The Far North around Pafuri holds Kruger's only fever tree forest. Early travellers blamed the yellow-barked trees for malaria, hence the name.",
    },
    {
        id: "free-d7",
        source: "free",
        category: "cultural",
        difficulty: "zone",
        kind: "trail",
        releaseDay: 7,
        zoneId: "mopane-shingwedzi",
        body: "An elder told the ranger the suspect was seen near the river whose Tsonga name means 'place of ironstone'. She would say no more.",
        didYouKnow:
            "Most of Kruger's rivers carry Tsonga names that describe the land they cross. Learn what a name means and the country starts reading like a map.",
    },
    {
        id: "free-d12",
        source: "free",
        category: "mammal",
        difficulty: "zone",
        kind: "elimination",
        releaseDay: 12,
        zoneId: "sw-granite",
        body: "A tip-off sent the dogs to the granite koppies near Pretoriuskop. They found sable bulls grazing in peace and no sign of any man. Cross it off.",
        didYouKnow:
            "The sourveld around Pretoriuskop carries Kruger's best population of sable antelope, a bull's horns can sweep back over a metre.",
    },
    {
        id: "free-d14",
        source: "free",
        category: "mammal",
        difficulty: "zone",
        kind: "trail",
        releaseDay: 14,
        zoneId: "mopane-shingwedzi",
        body: "A herd of tsessebe watched the dogs from open ground, and roan moved beyond them. Few tourists ever reach the country where those two graze together.",
        didYouKnow:
            "Tsessebe and roan antelope favour the lightly wooded plains of Kruger's north and are rare everywhere else in the park.",
    },
    {
        id: "free-d21",
        source: "free",
        category: "bird",
        difficulty: "zone",
        kind: "trail",
        releaseDay: 21,
        zoneId: "mopane-shingwedzi",
        body: "A bateleur tipped its wings overhead and a Meves's starling chattered in the shrubveld. The dogs pressed on toward a river line.",
        didYouKnow:
            "The Meves's starling, with its long wedge tail, is a northern bird in Kruger. Birders say you seldom meet one south of the Olifants.",
    },
    {
        id: "free-d26",
        source: "free",
        category: "mammal",
        difficulty: "zone",
        kind: "elimination",
        releaseDay: 26,
        zoneId: "central-basalt",
        body: "The unit worked the open basalt plains around Satara for three days. The lion prides there lay fat and undisturbed. No man moves through pride country unnoticed.",
        didYouKnow:
            "The sweet basalt grazing around Satara supports the highest lion density in Kruger, which is exactly why a man on foot avoids it.",
    },
    {
        id: "free-d30",
        source: "free",
        category: "geological",
        difficulty: "feature",
        kind: "trail",
        releaseDay: 30,
        zoneId: "mopane-shingwedzi",
        body: "The scent led to iron-red boulders rising above a riverbed, where elephants cooled in the water below. Rock like that is rare in this park.",
        didYouKnow:
            "Iron oxide can stain ancient sandstone a deep red. Only a few corners of Kruger show rock like this, and the geology overlay marks every one.",
    },
    {
        id: "free-d40",
        source: "free",
        category: "geological",
        difficulty: "feature",
        kind: "elimination",
        releaseDay: 40,
        zoneId: "lebombo",
        body: "Some swore the red rock meant the eastern border ridge. The dogs climbed it and found only klipspringers. That stone is grey-green rhyolite, not red. Rule the ridge out.",
        didYouKnow:
            "The Lebombo ridge along the Mozambique border is rhyolite, an old volcanic rock. It weathers grey-green, never the rust red of ironstone country.",
    },
    {
        id: "free-d45",
        source: "free",
        category: "mammal",
        difficulty: "feature",
        kind: "trail",
        releaseDay: 45,
        zoneId: "mopane-shingwedzi",
        body: "Klipspringers bounced across the red stone and a rock hyrax watched from a ledge. Water sat still in a dam just downstream of the boulders.",
        didYouKnow:
            "Klipspringers walk on the very tips of their hooves and can stand on a rock ledge the size of a coin.",
    },
    {
        id: "free-d60",
        source: "free",
        category: "hydrological",
        difficulty: "feature",
        kind: "trail",
        releaseDay: 60,
        zoneId: "mopane-shingwedzi",
        body: "The dogs worked a bend in the Shingwedzi, upstream of Kanniedood Dam, where the banks turn to bare red rock. The river finally has its name.",
        didYouKnow:
            "Kanniedood ('cannot die') Dam was named for the hardy trees that survive its seasonal floods. Shingwedzi is Tsonga for 'place of ironstone'.",
    },
    {
        id: "free-d75",
        source: "free",
        category: "geological",
        difficulty: "landmark",
        kind: "trail",
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
        kind: "trail",
        releaseDay: 88,
        zoneId: "mopane-shingwedzi",
        body: "Synthesis: stand at the Red Rocks viewpoint on the Shingwedzi. The suspect's camp was within sight of the largest red dome.",
        didYouKnow:
            "Red Rocks viewpoint is the signature stop on the Shingwedzi loop and the answer this whole hunt has pointed toward.",
    },

    // ---- Dog-instinct clues (unlocked by your chosen dog) -----
    {
        id: "dog-pepper",
        source: "dog",
        category: "operational",
        difficulty: "zone",
        kind: "trail",
        releaseDay: 14,
        dogId: "pepper",
        zoneId: "mopane-shingwedzi",
        body: "Pepper flags a bakkie at a northern gate. Under the spare wheel, wire snares and river sand stained rust red. The driver came down from ironstone country.",
        didYouKnow:
            "Detection spaniels like Pepper screen vehicles at park gates for horn, ivory and ammunition, and a find like this can redirect a whole operation.",
    },
    {
        id: "dog-dotty",
        source: "dog",
        category: "operational",
        difficulty: "zone",
        kind: "trail",
        releaseDay: 30,
        dogId: "dotty",
        zoneId: "mopane-shingwedzi",
        body: "Dotty swings the whole pack off the plains and holds a line north-east, nose down, toward mopane country and a river. The old matriarch does not guess.",
        didYouKnow:
            "When SAWC's free-running pack commits to a line, handlers follow by vehicle and GPS. A senior hound like Dotty anchors the younger dogs.",
    },
    {
        id: "dog-storm",
        source: "dog",
        category: "operational",
        difficulty: "feature",
        kind: "trail",
        releaseDay: 45,
        dogId: "storm",
        zoneId: "mopane-shingwedzi",
        body: "Storm finds a cached water bottle buried at the base of a mopane. The mud on it is red sandstone grit, river-worn. Your suspect keeps returning to the same boulders.",
        didYouKnow:
            "A Malinois like Storm is trained to indicate on human articles without touching them, preserving evidence for the case that follows an arrest.",
    },

    // ---- Equipment-locked (operational / visual) -------------
    {
        id: "eq-topo",
        source: "equipment",
        category: "geological",
        difficulty: "feature",
        kind: "trail",
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
        kind: "trail",
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
        kind: "trail",
        zoneId: "mopane-shingwedzi",
        body: "The Savannah's aerial photo shows a thread of smoke beside a cluster of bald red boulders on the north bank.",
        didYouKnow:
            "The College's airwing flies Savannah light sport aircraft, low and slow, patrolling some 500,000 hectares of the Greater Kruger.",
    },
    {
        id: "eq-ranger-gps",
        source: "equipment",
        category: "operational",
        difficulty: "landmark",
        kind: "trail",
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
        kind: "trail",
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
        kind: "trail",
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
        kind: "trail",
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
        kind: "trail",
        zoneId: "mopane-shingwedzi",
        body: "A school's class submits the answer together: 'The red boulders are on the Shingwedzi, just up from Kanniedood Dam. That's where the camp was.'",
        didYouKnow:
            "Every perennial river in Kruger flows east toward Mozambique. The Shingwedzi crosses the border below Kanniedood.",
    },
];

export const CLUE_BY_ID: Record<string, Clue> = Object.fromEntries(CLUES.map((c) => [c.id, c]));

export const FREE_CLUES = CLUES.filter((c) => c.source === "free");

export const DOG_CLUES = CLUES.filter((c) => c.source === "dog");
