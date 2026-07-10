import type { Clue } from "./types";

/**
 * Single-round clue bank. The poacher hides at a bald granite lookout koppie in
 * far-southern Kruger (Mathekenyane / Granokop, Zone 7). Built backwards from
 * that spot across five difficulty tiers. No clue ever names Mathekenyane or
 * Granokop; the answer is reached by combining clues and the field guide.
 *
 * 20 free time-released clues (everyone) + 10 paid clues:
 *   5 equipment-unlocked (bought in the kit room) + 5 sponsor-code clues.
 *
 * Canonical design and sources: Information/SAWC_K9_Clue_Bank.xlsx
 * IDs match the spreadsheet (f01-f20 free, s01-s10 paid).
 */
export const CLUES: Clue[] = [
    // ---------- TIER 1: entry, north vs south (days 1-14) ----------
    {
        id: "f01",
        source: "free",
        category: "geological",
        difficulty: "region",
        kind: "trail",
        tier: 1,
        releaseDay: 1,
        zoneId: "southern-sabie",
        body: "Dispatch opens the file: the suspect camps where the hills are pale grey granite domes, not the flat black plains of the middle park nor the red mopane country of the north. Think of the older, southern ground.",
        didYouKnow:
            "Almost half of Kruger is granite up to 3.5 billion years old, among the oldest rock on Earth, and it dominates the south and west.",
    },
    {
        id: "f02",
        source: "free",
        category: "seasonal",
        difficulty: "region",
        kind: "trail",
        tier: 1,
        releaseDay: 3,
        zoneId: "southern-sabie",
        body: "The rain gauge by the nearest camp is one of the fuller ones in the park. This is the wetter, greener half, where the storms come first.",
        didYouKnow:
            "Rainfall falls on a gradient, from about 750 mm a year in the south-west to about 400 mm in the dry north-east.",
    },
    {
        id: "f03",
        source: "free",
        category: "mammal",
        difficulty: "region",
        kind: "trail",
        tier: 1,
        releaseDay: 5,
        zoneId: "southern-sabie",
        body: "This is the busiest country in Kruger, the roads most tourists drive, and the ground where the great grey rhino once grazed thickest. It is also where the dogs are needed most.",
        didYouKnow:
            "Southern Kruger holds the densest network of roads and camps, and was home to most of the park's white rhino, which is why poaching pressure has been heaviest here.",
    },
    {
        id: "f04",
        source: "free",
        category: "hydrological",
        difficulty: "region",
        kind: "trail",
        tier: 1,
        releaseDay: 7,
        zoneId: "southern-sabie",
        body: "The closest great river is the one whose Tsonga name means fearful, for the crocodiles in it, and which carries more kinds of fish than any other river in the park.",
        didYouKnow:
            "The Sabie means fearful in Tsonga and supports 49 fish species, the most of any river in Kruger. The road along it is rated among the best game-viewing roads in Africa.",
    },

    // ---------- TIER 2: narrow within the south (days 19-34) ----------
    {
        id: "f05",
        source: "free",
        category: "mammal",
        difficulty: "zone",
        kind: "elimination",
        tier: 2,
        releaseDay: 10,
        zoneId: "far-north",
        body: "The pack cast for scent in the far north, among the butterfly-leaved trees and the fat grey baobabs, where samango monkeys bark in the fever-tree forest. Three days, nothing. Rule the north out.",
        didYouKnow:
            "The butterfly-shaped mopane leaf, the baobab and the samango monkey all belong to Kruger's northern half. The samango is found only in the far northern riverine forest at Pafuri.",
    },
    {
        id: "f06",
        source: "free",
        category: "geological",
        difficulty: "zone",
        kind: "trail",
        tier: 2,
        releaseDay: 12,
        zoneId: "southern-sabie",
        body: "Underfoot the rock is pale grey and pink, weathered into bald rounded domes and scattered koppies, not the dark cracked turf of the eastern plains.",
        didYouKnow:
            "The Nelspruit Granite Suite forms the rounded koppies of the south around Pretoriuskop, Berg-en-Dal and Skukuza. The eastern plains are dark basalt clay soils called turf.",
    },
    {
        id: "f07",
        source: "free",
        category: "botanical",
        difficulty: "zone",
        kind: "trail",
        tier: 2,
        releaseDay: 15,
        zoneId: "southern-sabie",
        body: "Silver-leaved trees catch the afternoon light on the slopes, and red bushwillow crowds the rocky rises. This is mixed granite woodland, not open golden savanna.",
        didYouKnow:
            "Silver cluster-leaf and red bushwillow are typical of the southern granite woodlands, while the central plains are open knob-thorn and marula savanna.",
    },
    {
        id: "f08",
        source: "free",
        category: "mammal",
        difficulty: "zone",
        kind: "elimination",
        tier: 2,
        releaseDay: 17,
        zoneId: "sw-granite",
        body: "The dogs worked the high sour grasslands to the west, where sable bulls graze near the park's oldest camp. No sign of the man. He is not in the far south-west corner.",
        didYouKnow:
            "The sourveld around Pretoriuskop, the oldest rest camp, carries Kruger's best population of sable antelope, whose horns can sweep back over a metre.",
    },

    // ---------- TIER 3: the Skukuza and Sabie area (days 39-54) ----------
    {
        id: "f09",
        source: "free",
        category: "cultural",
        difficulty: "feature",
        kind: "trail",
        tier: 3,
        releaseDay: 20,
        zoneId: "southern-sabie",
        body: "The nearest large camp carries the name the Shangaan gave a warden they respected: he who sweeps clean.",
        didYouKnow:
            "Skukuza is named for James Stevenson-Hamilton, the park's first warden. Local Shangaan people called him Skukuza, he who sweeps clean, for clearing the old hunters out.",
    },
    {
        id: "f10",
        source: "free",
        category: "historical",
        difficulty: "feature",
        kind: "trail",
        tier: 3,
        releaseDay: 22,
        zoneId: "southern-sabie",
        body: "Not far from that camp, a small rise of hills holds the scattered ashes of the same first warden and his wife. The suspect keeps within sight of those little hills.",
        didYouKnow:
            "Stevenson-Hamilton's ashes, and his wife Hilda's, were scattered on Shirimantanga koppie near Skukuza. Shirimantanga means place of little hills in Tsonga.",
    },
    {
        id: "f11",
        source: "free",
        category: "mammal",
        difficulty: "feature",
        kind: "trail",
        tier: 3,
        releaseDay: 25,
        zoneId: "southern-sabie",
        body: "Leopards are unusually common in this country, draping their kills in the riverine trees along the great fish-river road a little to the north of the camp.",
        didYouKnow:
            "The Sabie River corridor, especially the road between Skukuza and Lower Sabie, has one of the highest leopard densities in Africa.",
    },
    {
        id: "f12",
        source: "free",
        category: "bird",
        difficulty: "feature",
        kind: "trail",
        tier: 3,
        releaseDay: 27,
        zoneId: "southern-sabie",
        body: "Before dawn a southern ground hornbill boomed from the woodland near the camp, a turkey-sized black bird with a red throat, a bird of the southern and central park.",
        didYouKnow:
            "The southern ground hornbill, near-threatened and turkey-sized, favours the open woodlands of central and southern Kruger around Satara, Tshokwane and Lower Sabie.",
    },

    // ---------- TIER 4: features around the koppie (days 59-69) ----------
    {
        id: "f13",
        source: "free",
        category: "topographic",
        difficulty: "landmark",
        kind: "trail",
        tier: 4,
        releaseDay: 30,
        zoneId: "southern-sabie",
        body: "The camp sits at the foot of a bald granite dome that rises alone above the woodland, a lookout hill with a view for many miles in every direction.",
        didYouKnow:
            "Isolated granite domes, called koppies or inselbergs, rise above the southern woodland. Several, like the one south of Skukuza, are public lookout points.",
    },
    {
        id: "f14",
        source: "free",
        category: "operational",
        difficulty: "landmark",
        kind: "trail",
        tier: 4,
        releaseDay: 32,
        zoneId: "southern-sabie",
        body: "It lies just off the tar road that runs south from the sweeping-warden's camp toward the crocodile-river gate, not along the famous leopard road that runs east.",
        didYouKnow:
            "The H3 tar road runs south from Skukuza toward Malelane and the Crocodile River, while the leopard road runs east to Lower Sabie.",
    },
    {
        id: "f15",
        source: "free",
        category: "cultural",
        difficulty: "landmark",
        kind: "trail",
        tier: 4,
        releaseDay: 35,
        zoneId: "southern-sabie",
        body: "The hill's own name, in Tsonga, is a warning: it speaks of a tiny burrowing flea that lodges in the feet of the careless.",
        didYouKnow:
            "The name means place of jigger fleas in Tsonga. The jigger, or sand flea, burrows into skin, a hazard the old travellers knew well.",
    },

    // ---------- TIER 5: triangulate onto the dome (days 74-90) ----------
    {
        id: "f16",
        source: "free",
        category: "geological",
        difficulty: "pinpoint",
        kind: "trail",
        tier: 5,
        releaseDay: 37,
        zoneId: "southern-sabie",
        body: "The dome is bald because it sheds its skin in curved sheets, like an onion, under the heat. The suspect's fire sits on bare rock near the top, where the granite is smooth.",
        didYouKnow:
            "Granite domes go bald through exfoliation: curved outer sheets peel off as the rock expands and contracts with heat, leaving smooth bare stone.",
    },
    {
        id: "f17",
        source: "free",
        category: "synthesis",
        difficulty: "pinpoint",
        kind: "trail",
        tier: 5,
        releaseDay: 39,
        zoneId: "southern-sabie",
        body: "Put it together. A lone granite lookout dome. South of the sweeping-warden's camp. West of the fearful river. Within sight of the little-hills koppie where the warden's ashes lie.",
        didYouKnow:
            "Good tracking is triangulation: each clue is a bearing, and the answer is where the bearings cross. Rangers work the same way with scent, sign and terrain.",
    },
    {
        id: "f18",
        source: "free",
        category: "topographic",
        difficulty: "pinpoint",
        kind: "trail",
        tier: 5,
        releaseDay: 41,
        zoneId: "southern-sabie",
        body: "From the fire the suspect can see the Sabie's dark tree-line to the north, and low granite hills rolling away south toward the crocodile-river border.",
        didYouKnow:
            "From a southern lookout koppie you can read the whole landscape: riverine forest marking the Sabie to the north, open granite country falling south to the Crocodile River border.",
    },
    {
        id: "f19",
        source: "free",
        category: "operational",
        difficulty: "pinpoint",
        kind: "trail",
        tier: 5,
        releaseDay: 43,
        zoneId: "southern-sabie",
        body: "Field teams have ringed a single bald koppie between the two southern camps. The scent always returns to its rocky crown.",
        didYouKnow:
            "When a free-running pack keeps returning to one point, handlers tighten the ring around it. Persistence of scent at one spot is the strongest sign of all.",
    },
    {
        id: "f20",
        source: "free",
        category: "synthesis",
        difficulty: "pinpoint",
        kind: "trail",
        tier: 5,
        releaseDay: 45,
        zoneId: "southern-sabie",
        body: "The hunt ends where the oldest rock in Africa breaks the surface, at a flea-named lookout dome the tourists climb for the view, south of the great camp. Drop your pin on its crown.",
        didYouKnow:
            "The southern granite is part of the Kaapvaal Craton, some of the oldest continental crust on Earth. The hunt closes on one bald dome standing on 3.5-billion-year-old rock.",
    },

    // ================= PAID: equipment-unlocked (5) =================
    {
        id: "s02",
        source: "equipment",
        category: "geological",
        difficulty: "zone",
        kind: "trail",
        tier: 2,
        zoneId: "southern-sabie",
        body: "Kit intel: the rock beneath the camp is Nelspruit granite, part of the Kaapvaal Craton, roughly 3.5 billion years old, among the most ancient crust exposed anywhere on the planet.",
        didYouKnow:
            "The Kaapvaal Craton is one of the world's oldest surviving pieces of continental crust. Kruger's southern granites formed before complex life existed.",
    },
    {
        id: "s03",
        source: "equipment",
        category: "bird",
        difficulty: "landmark",
        kind: "elimination",
        tier: 4,
        zoneId: "lebombo",
        body: "Kit intel: a Verreaux's eagle quartered the ridge and found no cliff to nest on here. This is a rounded dome, not the sheer rhyolite wall of the eastern border.",
        didYouKnow:
            "Verreaux's eagles need sheer cliffs, found on the Lebombo ridge, at Red Rocks and in Lanner Gorge. A rounded granite dome offers no such ledge.",
    },
    {
        id: "s05",
        source: "equipment",
        category: "hydrological",
        difficulty: "landmark",
        kind: "trail",
        tier: 4,
        zoneId: "southern-sabie",
        body: "Kit intel: the camp draws its water from the fearful river, the same river that feeds the finest game-viewing road in Africa just to the north.",
        didYouKnow:
            "The Sabie River supplies Skukuza and feeds the corridor widely called the best game-viewing road in Africa for its leopards, lions and riverine birds.",
    },
    {
        id: "s08",
        source: "equipment",
        category: "operational",
        difficulty: "feature",
        kind: "trail",
        tier: 3,
        zoneId: "southern-sabie",
        body: "Kit intel: the K9 base lies far to the north-west near Orpen. The pack was trucked south for this deployment, a long haul deep into rhino country.",
        didYouKnow:
            "The SAWC K9 unit is based near Orpen Gate and Hoedspruit and deploys across the Greater Kruger, including long moves south into the high-pressure rhino zones.",
    },
    {
        id: "s10",
        source: "equipment",
        category: "topographic",
        difficulty: "landmark",
        kind: "trail",
        tier: 4,
        zoneId: "southern-sabie",
        body: "Kit intel: the hill is one of several bald granite heads south of the Sabie, but the tourist maps mark this one alone with a lookout symbol and a flea's name.",
        didYouKnow:
            "Several granite domes rise south of the Sabie, but only a few are gazetted public lookouts. This one appears on tourist maps as a named viewpoint.",
    },

    // ================= PAID: sponsor-code clues (5) =================
    {
        id: "s01",
        source: "sponsor",
        category: "astronomical",
        difficulty: "feature",
        kind: "trail",
        tier: 3,
        zoneId: "southern-sabie",
        body: "Sponsor intel: at eight in the evening in winter the Southern Cross stands high over the dome, and a line drawn down through it points to true south, over the low granite hills.",
        didYouKnow:
            "The Southern Cross points to the south celestial pole: extend its long axis about four and a half times to find true south. Rangers navigate by it on moonless nights.",
    },
    {
        id: "s04",
        source: "sponsor",
        category: "historical",
        difficulty: "feature",
        kind: "trail",
        tier: 3,
        zoneId: "southern-sabie",
        body: "Sponsor intel: the warden whose ashes rest on the nearby koppie ran this park for 44 years and gave the great southern camp its name.",
        didYouKnow:
            "James Stevenson-Hamilton was warden from 1902 to 1946, 44 years. His nickname Skukuza became the name of the park's largest camp.",
    },
    {
        id: "s06",
        source: "sponsor",
        category: "mammal",
        difficulty: "region",
        kind: "trail",
        tier: 1,
        zoneId: "southern-sabie",
        body: "Sponsor intel: white rhino once grazed this southern granite country in their thousands. That is why the poachers come, and why the dogs run.",
        didYouKnow:
            "Southern Kruger held the bulk of the world's white rhino. That concentration is exactly why the poaching pressure, and the K9 response, centres here.",
    },
    {
        id: "s07",
        source: "sponsor",
        category: "botanical",
        difficulty: "zone",
        kind: "trail",
        tier: 2,
        zoneId: "southern-sabie",
        body: "Sponsor intel: as the granite rises the marula and knob-thorn thin out, and the slopes pass to red bushwillow and silver cluster-leaf.",
        didYouKnow:
            "On southern koppies the open-plains marula and knob-thorn give way to red bushwillow and silver cluster-leaf, a clear signal you have left the basalt plains.",
    },
    {
        id: "s09",
        source: "sponsor",
        category: "seasonal",
        difficulty: "pinpoint",
        kind: "trail",
        tier: 5,
        zoneId: "southern-sabie",
        body: "Sponsor intel: winter mornings bring ground frost to the valleys, but the bald dome holds the day's heat into the night, a stone beacon for a cold man to camp against.",
        didYouKnow:
            "Bare granite absorbs heat by day and releases it slowly at night, so a rock dome stays warmer after dark than the frost-pooling valleys around it.",
    },
];

export const CLUE_BY_ID: Record<string, Clue> = Object.fromEntries(CLUES.map((c) => [c.id, c]));

export const FREE_CLUES = CLUES.filter((c) => c.source === "free");

/** Dog-instinct clues are retired; dog choice now shapes the scent read instead. */
