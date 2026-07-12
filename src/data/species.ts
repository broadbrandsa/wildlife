/**
 * The spotting log: 66 real Kruger species across the three regions (north, central,
 * south of the park), matched to where they actually occur. Two rarity tiers:
 * common (most moves) and rare (a good day). The round prize comes from the
 * bingo lists below: spot all five of a Big, Ugly or Small Five.
 *
 * Photography: Wikimedia Commons images stored locally in public/species/.
 * Each carries its own Creative Commons licence; attribution must be surfaced
 * in the UI (or the photos replaced with licensed originals) before production.
 */

export type SpotRegion = "north" | "central" | "south";

export type SpeciesType = "mammal" | "bird" | "tree" | "insect" | "fish" | "reptile";
export type SpeciesRarity = "common" | "rare";

export interface Species {
    id: string;
    name: string;
    type: SpeciesType;
    rarity: SpeciesRarity;
    /** The part of the park where this species is spotted. */
    region: SpotRegion;
    info: string;
    photo: string;
}

export const SPECIES: Species[] = [
    {
        id: "racket-tailed-roller",
        name: "Racket-tailed roller",
        type: "bird",
        rarity: "rare",
        region: "north",
        info: "A roller of tall mopane woodland, told by the bare shafts and spoons on its tail. In South Africa it is found only in the far north of the Kruger, and even there a sighting is the stuff of legend.",
        photo: "/species/racket-tailed-roller.jpg",
    },
    {
        id: "pels-fishing-owl",
        name: "Pel's fishing owl",
        type: "bird",
        rarity: "rare",
        region: "north",
        info: "A giant rufous owl that fishes by night from branches over the Luvuvhu. Birders travel across the world for one glimpse at Pafuri.",
        photo: "/species/pels-fishing-owl.jpg",
    },
    {
        id: "samango-monkey",
        name: "Samango monkey",
        type: "mammal",
        rarity: "rare",
        region: "north",
        info: "South Africa's only forest monkey, darker and shyer than the vervet. In the Kruger it lives only in the tall riverine forest at Pafuri.",
        photo: "/species/samango-monkey.jpg",
    },
    {
        id: "crested-guineafowl",
        name: "Crested guineafowl",
        type: "bird",
        rarity: "rare",
        region: "north",
        info: "A guineafowl with a mop of black curls, scratching through riverine thickets in the far north. Far scarcer than its helmeted cousin.",
        photo: "/species/crested-guineafowl.jpg",
    },
    {
        id: "lichtensteins-hartebeest",
        name: "Lichtenstein's hartebeest",
        type: "mammal",
        rarity: "rare",
        region: "north",
        info: "A rangy antelope reintroduced to the far northern plains after vanishing from the park for a century. Only a small herd exists.",
        photo: "/species/lichtensteins-hartebeest.jpg",
    },
    {
        id: "eland",
        name: "Eland",
        type: "mammal",
        rarity: "rare",
        region: "north",
        info: "The largest antelope on earth, a bull can weigh close to a ton. Small herds drift through the northern sandveld.",
        photo: "/species/eland.jpg",
    },
    {
        id: "sharpes-grysbok",
        name: "Sharpe's grysbok",
        type: "mammal",
        rarity: "rare",
        region: "north",
        info: "A secretive, russet dwarf antelope of the mopane scrub, mostly seen at dusk. Blink and it is gone.",
        photo: "/species/sharpes-grysbok.jpg",
    },
    {
        id: "elephant",
        name: "African elephant",
        type: "mammal",
        rarity: "common",
        region: "north",
        info: "The great grey gardeners of the mopane. Northern bulls grow some of the finest tusks in Africa, and the herds bulldoze whole woodlands as they feed.",
        photo: "/species/elephant.jpg",
    },
    {
        id: "buffalo",
        name: "African buffalo",
        type: "mammal",
        rarity: "common",
        region: "north",
        info: "Herds several hundred strong churn the northern floodplains. Old bulls, the dagga boys, wallow alone and trust nobody.",
        photo: "/species/buffalo.jpg",
    },
    {
        id: "impala",
        name: "Impala",
        type: "mammal",
        rarity: "common",
        region: "north",
        info: "The bushveld's everywhere antelope, the reason the dogs learn early not to chase. Listen for the rutting roar in autumn.",
        photo: "/species/impala.jpg",
    },
    {
        id: "nyala",
        name: "Nyala",
        type: "mammal",
        rarity: "common",
        region: "north",
        info: "A striped, shaggy antelope of the northern thickets. The Luvuvhu river drives hold more nyala than anywhere else in the park.",
        photo: "/species/nyala.jpg",
    },
    {
        id: "kudu",
        name: "Greater kudu",
        type: "mammal",
        rarity: "common",
        region: "north",
        info: "The grey ghost of the bushveld. A bull's spiral horns can make two and a half full turns.",
        photo: "/species/kudu.jpg",
    },
    {
        id: "hippo",
        name: "Hippopotamus",
        type: "mammal",
        rarity: "common",
        region: "north",
        info: "Grunting rafts of hippo hold the deep pools of the Luvuvhu and Limpopo. At night they walk kilometres from the water to graze.",
        photo: "/species/hippo.jpg",
    },
    {
        id: "nile-crocodile",
        name: "Nile crocodile",
        type: "reptile",
        rarity: "common",
        region: "north",
        info: "The fearful rivers of the north are full of them. Crocodiles here have hunted the same pools since before the park had a name.",
        photo: "/species/nile-crocodile.jpg",
    },
    {
        id: "baobab",
        name: "Baobab",
        type: "tree",
        rarity: "common",
        region: "north",
        info: "The upside-down tree. South of the Tropic of Capricorn they thin out fast, which makes the northern giants signposts you can navigate by.",
        photo: "/species/baobab.jpg",
    },
    {
        id: "mopane",
        name: "Mopane tree",
        type: "tree",
        rarity: "common",
        region: "north",
        info: "Butterfly-shaped leaves that fold together in the heat. Mopane paints the whole northern half of the park in rust and olive.",
        photo: "/species/mopane.jpg",
    },
    {
        id: "mopane-worm",
        name: "Mopane worm",
        type: "insect",
        rarity: "common",
        region: "north",
        info: "The spiny caterpillar of the emperor moth, harvested and dried as food for generations. Whole trees are stripped in a good season.",
        photo: "/species/mopane-worm.jpg",
    },
    {
        id: "fever-tree",
        name: "Fever tree",
        type: "tree",
        rarity: "common",
        region: "north",
        info: "A ghostly acacia with luminous yellow-green bark, marking water in the Pafuri forest. Early travellers blamed it for malaria; the mosquitoes were the culprits.",
        photo: "/species/fever-tree.jpg",
    },
    {
        id: "tigerfish",
        name: "Tigerfish",
        type: "fish",
        rarity: "common",
        region: "north",
        info: "A silver torpedo with orange fins and interlocking teeth, patrolling the Luvuvhu and Limpopo. It has been filmed leaping to snatch swallows from the air.",
        photo: "/species/tigerfish.jpg",
    },
    {
        id: "yellow-billed-hornbill",
        name: "Yellow-billed hornbill",
        type: "bird",
        rarity: "common",
        region: "north",
        info: "The flying banana of the lowveld camps, hopping for scraps and hawking insects. It walls its nest hole shut with mud, the female sealed inside.",
        photo: "/species/yellow-billed-hornbill.jpg",
    },
    {
        id: "roan-antelope",
        name: "Roan antelope",
        type: "mammal",
        rarity: "rare",
        region: "central",
        info: "A horse-sized antelope with a clown-painted face, one of the rarest large mammals in the park. A handful survive on the northern basalt plains.",
        photo: "/species/roan-antelope.jpg",
    },
    {
        id: "pangolin",
        name: "Ground pangolin",
        type: "mammal",
        rarity: "rare",
        region: "central",
        info: "An armoured anteater that walks on its hind legs and rolls into a ball of scales. Rangers can work a lifetime in the bush and never see one.",
        photo: "/species/pangolin.jpg",
    },
    {
        id: "cheetah",
        name: "Cheetah",
        type: "mammal",
        rarity: "rare",
        region: "central",
        info: "The open knob-thorn plains of the central district are cheetah country, but only a few hundred live in the whole park. Scan the termite mounds.",
        photo: "/species/cheetah.jpg",
    },
    {
        id: "saddle-billed-stork",
        name: "Saddle-billed stork",
        type: "bird",
        rarity: "rare",
        region: "central",
        info: "A metre and a half of stork with a banded scarlet and black bill. Fewer than a hundred breeding pairs remain in the park, each pair holding its own stretch of river.",
        photo: "/species/saddle-billed-stork.jpg",
    },
    {
        id: "kori-bustard",
        name: "Kori bustard",
        type: "bird",
        rarity: "rare",
        region: "central",
        info: "The heaviest flying bird on earth strides the basalt grassland like a small ostrich. Males puff their necks white in display.",
        photo: "/species/kori-bustard.jpg",
    },
    {
        id: "honey-badger",
        name: "Honey badger",
        type: "mammal",
        rarity: "rare",
        region: "central",
        info: "Fearless, tireless and armour-skinned. It will raid a beehive, face down a lion and dig out a scorpion in the same night.",
        photo: "/species/honey-badger.jpg",
    },
    {
        id: "ostrich",
        name: "Common ostrich",
        type: "bird",
        rarity: "rare",
        region: "central",
        info: "The central plains are the only place in the park you are likely to meet one. A male's boom carries further than a lion's roar on a still night.",
        photo: "/species/ostrich.jpg",
    },
    {
        id: "lion",
        name: "Lion",
        type: "mammal",
        rarity: "common",
        region: "central",
        info: "The central district carries the highest lion density in the park, prides built on zebra and wildebeest. Most of the hunting happens after dark.",
        photo: "/species/lion.jpg",
    },
    {
        id: "zebra",
        name: "Plains zebra",
        type: "mammal",
        rarity: "common",
        region: "central",
        info: "Every stripe pattern is unique, a fingerprint in black and white. Zebra and wildebeest move the central plains together, one grazing tall grass, the other short.",
        photo: "/species/zebra.jpg",
    },
    {
        id: "blue-wildebeest",
        name: "Blue wildebeest",
        type: "mammal",
        rarity: "common",
        region: "central",
        info: "The bearded workhorse of the savanna. Calves run with the herd within minutes of being born.",
        photo: "/species/blue-wildebeest.jpg",
    },
    {
        id: "giraffe",
        name: "Giraffe",
        type: "mammal",
        rarity: "common",
        region: "central",
        info: "Browsing the tops of the knob-thorns with a half-metre blue tongue. Bulls neck-wrestle in slow motion to settle rank.",
        photo: "/species/giraffe.jpg",
    },
    {
        id: "marula",
        name: "Marula tree",
        type: "tree",
        rarity: "common",
        region: "central",
        info: "The tree of the central savanna. Elephants queue for the fallen fruit in late summer, and the pips feed everything from squirrels to people.",
        photo: "/species/marula.jpg",
    },
    {
        id: "knob-thorn",
        name: "Knob-thorn",
        type: "tree",
        rarity: "common",
        region: "central",
        info: "A tall acacia studded with knobs, flowering cream before the rains. Giraffe do the pollinating as they browse.",
        photo: "/species/knob-thorn.jpg",
    },
    {
        id: "spotted-hyena",
        name: "Spotted hyena",
        type: "mammal",
        rarity: "common",
        region: "central",
        info: "Not a scavenger but one of Africa's most successful hunters, run by the females. That whooping call at night is a clan keeping in touch.",
        photo: "/species/spotted-hyena.jpg",
    },
    {
        id: "warthog",
        name: "Warthog",
        type: "mammal",
        rarity: "common",
        region: "central",
        info: "Trots with its tail up like an aerial, kneels to graze, and reverses into its burrow so the tusks face the door.",
        photo: "/species/warthog.jpg",
    },
    {
        id: "waterbuck",
        name: "Waterbuck",
        type: "mammal",
        rarity: "common",
        region: "central",
        info: "A shaggy antelope with a white target ring on its rump, never far from the rivers. When danger comes it heads for deep water.",
        photo: "/species/waterbuck.jpg",
    },
    {
        id: "lilac-breasted-roller",
        name: "Lilac-breasted roller",
        type: "bird",
        rarity: "common",
        region: "central",
        info: "The bushveld's painted jewel, hunting from roadside perches. In display it rolls and tumbles out of the sky, which earned the family its name.",
        photo: "/species/lilac-breasted-roller.jpg",
    },
    {
        id: "dung-beetle",
        name: "Dung beetle",
        type: "insect",
        rarity: "common",
        region: "central",
        info: "The park's clean-up crew, rolling and burying tons of dung a day. Some navigate their dead-straight lines by the Milky Way.",
        photo: "/species/dung-beetle.jpg",
    },
    {
        id: "leopard-tortoise",
        name: "Leopard tortoise",
        type: "reptile",
        rarity: "common",
        region: "central",
        info: "The smallest of the Little Five, patterned like its namesake cat. It can live the better part of a century.",
        photo: "/species/leopard-tortoise.jpg",
    },
    {
        id: "red-billed-oxpecker",
        name: "Red-billed oxpecker",
        type: "bird",
        rarity: "common",
        region: "central",
        info: "Rides the game like a mounted sentry, feeding on ticks and hissing an alarm that half the bushveld understands.",
        photo: "/species/red-billed-oxpecker.jpg",
    },
    {
        id: "black-rhino",
        name: "Black rhinoceros",
        type: "mammal",
        rarity: "rare",
        region: "south",
        info: "The rarer, shyer cousin of the white rhino, a browser with a hooked lip that holds to the thickets. Seeing one is the privilege of a lifetime, and protecting them is why the K9 unit exists.",
        photo: "/species/black-rhino.jpg",
    },
    {
        id: "narina-trogon",
        name: "Narina trogon",
        type: "bird",
        rarity: "rare",
        region: "south",
        info: "A crimson and emerald ghost of the tall riverine forest. It sits dead still and faces away, green back to the world, which is why almost nobody ever sees one.",
        photo: "/species/narina-trogon.jpg",
    },
    {
        id: "wild-dog",
        name: "African wild dog",
        type: "mammal",
        rarity: "rare",
        region: "south",
        info: "The painted wolf. Fewer than three hundred roam the whole park in tight-knit packs, and a sighting can make a ranger's month.",
        photo: "/species/wild-dog.jpg",
    },
    {
        id: "white-rhino",
        name: "White rhinoceros",
        type: "mammal",
        rarity: "rare",
        region: "south",
        info: "The great grey grazer of the southern grasslands. The park guards their locations with its life, and so do the dogs.",
        photo: "/species/white-rhino.jpg",
    },
    {
        id: "sable-antelope",
        name: "Sable antelope",
        type: "mammal",
        rarity: "rare",
        region: "south",
        info: "Jet black with sweeping scimitar horns, the finest of them living in the sour grassland around Pretoriuskop.",
        photo: "/species/sable-antelope.jpg",
    },
    {
        id: "ground-hornbill",
        name: "Southern ground hornbill",
        type: "bird",
        rarity: "rare",
        region: "south",
        info: "A turkey-sized hornbill with scarlet wattles, patrolling in family groups. Its dawn booming is often mistaken for distant lion.",
        photo: "/species/ground-hornbill.jpg",
    },
    {
        id: "martial-eagle",
        name: "Martial eagle",
        type: "bird",
        rarity: "rare",
        region: "south",
        info: "Africa's most powerful eagle, capable of taking a small antelope. Each pair needs a territory the size of a small town.",
        photo: "/species/martial-eagle.jpg",
    },
    {
        id: "leopard",
        name: "Leopard",
        type: "mammal",
        rarity: "common",
        region: "south",
        info: "The Sabie river corridor holds one of the highest leopard densities in Africa. Check the horizontal limbs of the big jackalberries.",
        photo: "/species/leopard.jpg",
    },
    {
        id: "bushbuck",
        name: "Bushbuck",
        type: "mammal",
        rarity: "common",
        region: "south",
        info: "A solitary, dappled antelope of the riverine tangle. Cornered, it is one of the most dangerous antelope in Africa.",
        photo: "/species/bushbuck.jpg",
    },
    {
        id: "chacma-baboon",
        name: "Chacma baboon",
        type: "mammal",
        rarity: "common",
        region: "south",
        info: "Troops of a hundred work the granite koppies, led by old males with dog-like muzzles. Nothing in the veld misses their alarm bark.",
        photo: "/species/chacma-baboon.jpg",
    },
    {
        id: "vervet-monkey",
        name: "Vervet monkey",
        type: "mammal",
        rarity: "common",
        region: "south",
        info: "Quick hands and a bottomless curiosity. Their alarm calls tell the bush exactly what is coming: eagle, snake or leopard.",
        photo: "/species/vervet-monkey.jpg",
    },
    {
        id: "grey-duiker",
        name: "Common duiker",
        type: "mammal",
        rarity: "common",
        region: "south",
        info: "A knee-high antelope that dives into cover, which is exactly what its Afrikaans name means. Happy on fallen fruit, insects, even carrion.",
        photo: "/species/grey-duiker.jpg",
    },
    {
        id: "sycamore-fig",
        name: "Sycamore fig",
        type: "tree",
        rarity: "common",
        region: "south",
        info: "The great fruiting fig of the Sabie banks. When a big one ripens, half the bush arrives for the feast: green pigeons, hornbills, monkeys, bats.",
        photo: "/species/sycamore-fig.jpg",
    },
    {
        id: "silver-cluster-leaf",
        name: "Silver cluster-leaf",
        type: "tree",
        rarity: "common",
        region: "south",
        info: "Catches the afternoon light in silver on the granite slopes around Pretoriuskop. The sourveld's signature tree.",
        photo: "/species/silver-cluster-leaf.jpg",
    },
    {
        id: "jackalberry",
        name: "Jackalberry",
        type: "tree",
        rarity: "common",
        region: "south",
        info: "A giant riverine ebony whose fruit feeds jackals, hence the name. Leopards drape their kills across its horizontal boughs.",
        photo: "/species/jackalberry.jpg",
    },
    {
        id: "fish-eagle",
        name: "African fish eagle",
        type: "bird",
        rarity: "common",
        region: "south",
        info: "The voice of the rivers. That ringing cry over the Sabie is the sound most rangers would choose to hear last.",
        photo: "/species/fish-eagle.jpg",
    },
    {
        id: "goliath-heron",
        name: "Goliath heron",
        type: "bird",
        rarity: "common",
        region: "south",
        info: "The world's largest heron, as tall as a person, stalking the Sabie shallows in slow motion for fish the size of your forearm.",
        photo: "/species/goliath-heron.jpg",
    },
    {
        id: "orb-web-spider",
        name: "Golden orb-web spider",
        type: "insect",
        rarity: "common",
        region: "south",
        info: "Strings golden silk across whole game paths, strong enough to stop a small bird. The tiny males live at the edge of the giant female's web.",
        photo: "/species/orb-web-spider.jpg",
    },
    {
        id: "tilapia",
        name: "Mozambique tilapia",
        type: "fish",
        rarity: "common",
        region: "south",
        info: "The bream of the lowveld rivers. Males dig display craters in the shallows, and kingfishers and herons live on the young.",
        photo: "/species/tilapia.jpg",
    },
    {
        id: "bee-eater",
        name: "White-fronted bee-eater",
        type: "bird",
        rarity: "common",
        region: "south",
        info: "Jewelled flocks nest in colonies dug into the sand banks of the Sabie, hawking bees mid-air and beating the sting out on a branch.",
        photo: "/species/bee-eater.jpg",
    },
    {
        id: "white-backed-vulture",
        name: "White-backed vulture",
        type: "bird",
        rarity: "common",
        region: "central",
        info: "The clean-up crew of the plains, circling on thermals until one drops and the whole sky follows. One of the Ugly Five, and critically endangered for its trouble.",
        photo: "/species/white-backed-vulture.jpg",
    },
    {
        id: "marabou-stork",
        name: "Marabou stork",
        type: "bird",
        rarity: "common",
        region: "central",
        info: "The undertaker bird: bald head, dangling throat pouch and a tailcoat walk. It stands shoulder to shoulder with the vultures at a carcass, and somehow looks worse.",
        photo: "/species/marabou-stork.jpg",
    },
    {
        id: "elephant-shrew",
        name: "Elephant shrew",
        type: "mammal",
        rarity: "common",
        region: "south",
        info: "A mouse-sized sprinter with a trunk-like nose, dashing along cleared runways between the granite koppies. The elephant of the Small Five.",
        photo: "/species/elephant-shrew.jpg",
    },
    {
        id: "antlion",
        name: "Antlion",
        type: "insect",
        rarity: "common",
        region: "north",
        info: "The lion of the Small Five digs a perfect sand funnel and waits at the bottom for an ant to slip. The adult looks like a drab dragonfly and fools almost everyone.",
        photo: "/species/antlion.jpg",
    },
    {
        id: "buffalo-weaver",
        name: "Red-billed buffalo weaver",
        type: "bird",
        rarity: "common",
        region: "north",
        info: "The buffalo of the Small Five builds huge untidy stick nests in the northern baobabs and thorn trees, whole colonies bickering in one tree.",
        photo: "/species/buffalo-weaver.jpg",
    },
    {
        id: "rhino-beetle",
        name: "Rhinoceros beetle",
        type: "insect",
        rarity: "common",
        region: "south",
        info: "Gram for gram one of the strongest animals on earth, with a horn to match its namesake. The rhino of the Small Five blunders into camp lights on summer nights.",
        photo: "/species/rhino-beetle.jpg",
    },
];

/**
 * The bingo lists: spot all five of each and win an instant prize (prize
 * partners illustrative, as on the prizes page). Every member id exists in
 * SPECIES.
 * The player's first ever spot is always drawn from these lists, so the game
 * opens with a name they know.
 */
export const FIVES: { id: "big" | "ugly" | "small"; label: string; members: string[]; prize: string }[] = [
    {
        id: "big",
        label: "The Big Five",
        members: ["lion", "leopard", "elephant", "buffalo", "white-rhino"],
        prize: "a SANParks day pass for two",
    },
    {
        id: "ugly",
        label: "The Ugly Five",
        members: ["spotted-hyena", "warthog", "blue-wildebeest", "white-backed-vulture", "marabou-stork"],
        prize: "the official SAWC K9 unit field cap",
    },
    {
        id: "small",
        label: "The Small Five",
        members: ["leopard-tortoise", "elephant-shrew", "antlion", "buffalo-weaver", "rhino-beetle"],
        prize: "a R250 Cape Union Mart gear voucher",
    },
];

/** Which five (if any) a species belongs to, for the card badge. */
export const FIVE_OF: Record<string, string> = Object.fromEntries(
    FIVES.flatMap((f) => f.members.map((m) => [m, f.label])),
);

export const SPECIES_BY_ID: Record<string, Species> = Object.fromEntries(SPECIES.map((s) => [s.id, s]));

/**
 * When a species is out and about, so spotting can follow the day/night cycle:
 * "day" species only turn up in daylight, "night" species only after dark, and
 * "any" species (trees, cathemeral mammals, reptiles) turn up at either time.
 * Species default to day; the two sets below carry the exceptions.
 */
export type SpeciesActivity = "day" | "night" | "any";

/** Nocturnal and crepuscular species: only spotted after the sun is down. */
const NOCTURNAL = new Set([
    "pels-fishing-owl",
    "sharpes-grysbok",
    "pangolin",
    "honey-badger",
    "lion",
    "spotted-hyena",
    "leopard",
    "rhino-beetle",
]);

/** Cathemeral or always-there species (trees, big grazers, reptiles): spotted at any hour. */
const ANYTIME = new Set([
    "elephant",
    "nyala",
    "kudu",
    "hippo",
    "nile-crocodile",
    "baobab",
    "mopane",
    "fever-tree",
    "marula",
    "knob-thorn",
    "sycamore-fig",
    "silver-cluster-leaf",
    "jackalberry",
    "mopane-worm",
    "dung-beetle",
    "black-rhino",
    "white-rhino",
    "bushbuck",
    "grey-duiker",
    "orb-web-spider",
    "antlion",
]);

export function speciesActivity(id: string): SpeciesActivity {
    if (NOCTURNAL.has(id)) return "night";
    if (ANYTIME.has(id)) return "any";
    return "day";
}

/** Whether a species can be spotted given the time of day. */
export function spottableAt(id: string, night: boolean): boolean {
    const a = speciesActivity(id);
    return a === "any" || (night ? a === "night" : a === "day");
}

/**
 * Field-guide stats shown on the species card: a short set of label/value
 * facts (weight, size, diet, range and the like), chosen to suit each kind of
 * species. Figures are typical field-guide values, rounded for readability.
 */
export interface SpeciesStat {
    label: string;
    value: string;
}

export const SPECIES_STATS: Record<string, SpeciesStat[]> = {
    // North
    "racket-tailed-roller": [
        { label: "Length", value: "36–40 cm" },
        { label: "Weight", value: "~110 g" },
        { label: "Diet", value: "Insects, reptiles" },
        { label: "Where", value: "Far-north mopane" },
    ],
    "pels-fishing-owl": [
        { label: "Height", value: "~63 cm" },
        { label: "Wingspan", value: "~1.5 m" },
        { label: "Weight", value: "~2.2 kg" },
        { label: "Diet", value: "Fish, frogs" },
    ],
    "samango-monkey": [
        { label: "Weight", value: "4–9 kg" },
        { label: "Body", value: "~55 cm" },
        { label: "Diet", value: "Fruit, leaves" },
        { label: "Where", value: "Riverine forest" },
    ],
    "crested-guineafowl": [
        { label: "Length", value: "~50 cm" },
        { label: "Weight", value: "0.7–1.5 kg" },
        { label: "Diet", value: "Seeds, insects" },
        { label: "Where", value: "Riverine thicket" },
    ],
    "lichtensteins-hartebeest": [
        { label: "Weight", value: "120–200 kg" },
        { label: "Shoulder", value: "~1.2 m" },
        { label: "Diet", value: "Grazer" },
        { label: "Herd", value: "Small, reintroduced" },
    ],
    eland: [
        { label: "Weight", value: "Up to 900 kg" },
        { label: "Shoulder", value: "~1.6 m" },
        { label: "Diet", value: "Browser & grazer" },
        { label: "Note", value: "Largest antelope" },
    ],
    "sharpes-grysbok": [
        { label: "Weight", value: "~7.5 kg" },
        { label: "Shoulder", value: "~50 cm" },
        { label: "Diet", value: "Browser" },
        { label: "Active", value: "Dusk & night" },
    ],
    elephant: [
        { label: "Weight", value: "Up to 6,000 kg" },
        { label: "Shoulder", value: "3–4 m" },
        { label: "Diet", value: "~250 kg plants/day" },
        { label: "Lifespan", value: "60–70 yrs" },
    ],
    buffalo: [
        { label: "Weight", value: "500–900 kg" },
        { label: "Shoulder", value: "1.4–1.7 m" },
        { label: "Diet", value: "Grazer" },
        { label: "Herd", value: "Up to hundreds" },
    ],
    impala: [
        { label: "Weight", value: "40–60 kg" },
        { label: "Shoulder", value: "~90 cm" },
        { label: "Diet", value: "Grazer & browser" },
        { label: "Leap", value: "Up to 10 m" },
    ],
    nyala: [
        { label: "Weight", value: "55–125 kg" },
        { label: "Shoulder", value: "~1.1 m" },
        { label: "Diet", value: "Browser" },
        { label: "Where", value: "Luvuvhu thickets" },
    ],
    kudu: [
        { label: "Weight", value: "190–270 kg" },
        { label: "Horns", value: "Up to 1.8 m" },
        { label: "Shoulder", value: "~1.5 m" },
        { label: "Diet", value: "Browser" },
    ],
    hippo: [
        { label: "Weight", value: "1,300–1,500 kg" },
        { label: "Length", value: "~3.5 m" },
        { label: "Diet", value: "Grazer" },
        { label: "Lifespan", value: "~40 yrs" },
    ],
    "nile-crocodile": [
        { label: "Length", value: "Up to 5 m" },
        { label: "Weight", value: "Up to 750 kg" },
        { label: "Diet", value: "Carnivore" },
        { label: "Lifespan", value: "70–100 yrs" },
    ],
    baobab: [
        { label: "Height", value: "Up to 25 m" },
        { label: "Trunk", value: "Up to 10 m wide" },
        { label: "Age", value: "1,000+ yrs" },
    ],
    mopane: [
        { label: "Height", value: "4–18 m" },
        { label: "Leaf", value: "Butterfly-shaped" },
        { label: "Range", value: "Northern half" },
    ],
    "mopane-worm": [
        { label: "Length", value: "Up to 10 cm" },
        { label: "Diet", value: "Mopane leaves" },
        { label: "Becomes", value: "Emperor moth" },
    ],
    "fever-tree": [
        { label: "Height", value: "15–25 m" },
        { label: "Bark", value: "Lime-green" },
        { label: "Habitat", value: "Near water" },
    ],
    tigerfish: [
        { label: "Length", value: "Up to 1 m" },
        { label: "Weight", value: "Up to 15 kg" },
        { label: "Diet", value: "Predator" },
        { label: "Note", value: "Leaps for birds" },
    ],
    "yellow-billed-hornbill": [
        { label: "Length", value: "48–60 cm" },
        { label: "Weight", value: "130–240 g" },
        { label: "Diet", value: "Omnivore" },
        { label: "Nest", value: "Sealed in mud" },
    ],
    antlion: [
        { label: "Larva", value: "Sand-pit trapper" },
        { label: "Adult", value: "Damselfly-like" },
        { label: "Diet", value: "Ants & insects" },
    ],
    "buffalo-weaver": [
        { label: "Length", value: "~24 cm" },
        { label: "Weight", value: "~70 g" },
        { label: "Diet", value: "Seeds, insects" },
        { label: "Nest", value: "Stick colonies" },
    ],
    // Central
    "roan-antelope": [
        { label: "Weight", value: "230–300 kg" },
        { label: "Shoulder", value: "~1.4 m" },
        { label: "Diet", value: "Grazer" },
        { label: "Status", value: "Very rare here" },
    ],
    pangolin: [
        { label: "Weight", value: "5–18 kg" },
        { label: "Length", value: "~1 m" },
        { label: "Diet", value: "Ants, termites" },
        { label: "Defence", value: "Rolls into a ball" },
    ],
    cheetah: [
        { label: "Weight", value: "21–72 kg" },
        { label: "Shoulder", value: "~80 cm" },
        { label: "Speed", value: "Up to 110 km/h" },
        { label: "Diet", value: "Carnivore" },
    ],
    "saddle-billed-stork": [
        { label: "Height", value: "~1.5 m" },
        { label: "Wingspan", value: "~2.5 m" },
        { label: "Diet", value: "Fish, frogs" },
        { label: "Pairs", value: "<100 in park" },
    ],
    "kori-bustard": [
        { label: "Weight", value: "Up to 18 kg" },
        { label: "Height", value: "~1.2 m" },
        { label: "Diet", value: "Omnivore" },
        { label: "Note", value: "Heaviest flyer" },
    ],
    "honey-badger": [
        { label: "Weight", value: "9–16 kg" },
        { label: "Length", value: "60–80 cm" },
        { label: "Diet", value: "Omnivore" },
        { label: "Active", value: "Mostly night" },
    ],
    ostrich: [
        { label: "Height", value: "Up to 2.7 m" },
        { label: "Weight", value: "Up to 130 kg" },
        { label: "Speed", value: "~70 km/h" },
        { label: "Diet", value: "Omnivore" },
    ],
    lion: [
        { label: "Weight", value: "120–190 kg (male)" },
        { label: "Shoulder", value: "~1.2 m" },
        { label: "Diet", value: "Carnivore" },
        { label: "Lifespan", value: "10–14 yrs" },
    ],
    zebra: [
        { label: "Weight", value: "200–350 kg" },
        { label: "Shoulder", value: "~1.3 m" },
        { label: "Diet", value: "Grazer" },
        { label: "Note", value: "Unique stripes" },
    ],
    "blue-wildebeest": [
        { label: "Weight", value: "120–250 kg" },
        { label: "Shoulder", value: "~1.3 m" },
        { label: "Diet", value: "Grazer" },
        { label: "Calves", value: "Run in minutes" },
    ],
    giraffe: [
        { label: "Height", value: "Up to 5.5 m" },
        { label: "Weight", value: "Up to 1,900 kg" },
        { label: "Diet", value: "Browser" },
        { label: "Tongue", value: "~45 cm" },
    ],
    marula: [
        { label: "Height", value: "Up to 18 m" },
        { label: "Fruit", value: "Loved by elephants" },
        { label: "Season", value: "Late summer" },
    ],
    "knob-thorn": [
        { label: "Height", value: "Up to 18 m" },
        { label: "Flower", value: "Cream, pre-rains" },
        { label: "Pollinator", value: "Giraffe" },
    ],
    "spotted-hyena": [
        { label: "Weight", value: "45–80 kg" },
        { label: "Shoulder", value: "~85 cm" },
        { label: "Diet", value: "Carnivore" },
        { label: "Led by", value: "Females" },
    ],
    warthog: [
        { label: "Weight", value: "50–150 kg" },
        { label: "Shoulder", value: "~65 cm" },
        { label: "Diet", value: "Grazer" },
        { label: "Home", value: "Old burrows" },
    ],
    waterbuck: [
        { label: "Weight", value: "200–300 kg" },
        { label: "Shoulder", value: "~1.25 m" },
        { label: "Diet", value: "Grazer" },
        { label: "Note", value: "White rump ring" },
    ],
    "lilac-breasted-roller": [
        { label: "Length", value: "36–38 cm" },
        { label: "Weight", value: "~110 g" },
        { label: "Diet", value: "Insects" },
        { label: "Display", value: "Tumbling flight" },
    ],
    "dung-beetle": [
        { label: "Length", value: "1–3 cm" },
        { label: "Diet", value: "Dung" },
        { label: "Note", value: "Rolls 10× its weight" },
    ],
    "leopard-tortoise": [
        { label: "Length", value: "Up to 45 cm" },
        { label: "Weight", value: "Up to 40 kg" },
        { label: "Diet", value: "Herbivore" },
        { label: "Lifespan", value: "80–100 yrs" },
    ],
    "red-billed-oxpecker": [
        { label: "Length", value: "~20 cm" },
        { label: "Weight", value: "~50 g" },
        { label: "Diet", value: "Ticks, parasites" },
        { label: "Rides", value: "Big game" },
    ],
    "white-backed-vulture": [
        { label: "Wingspan", value: "2.1–2.3 m" },
        { label: "Weight", value: "4–7 kg" },
        { label: "Diet", value: "Scavenger" },
        { label: "Status", value: "Critically endangered" },
    ],
    "marabou-stork": [
        { label: "Height", value: "~1.5 m" },
        { label: "Wingspan", value: "Up to 3.2 m" },
        { label: "Diet", value: "Scavenger" },
        { label: "Note", value: "Bald head" },
    ],
    "elephant-shrew": [
        { label: "Weight", value: "45–60 g" },
        { label: "Length", value: "~12 cm" },
        { label: "Diet", value: "Insects" },
        { label: "Note", value: "Trunk-like nose" },
    ],
    // South
    "black-rhino": [
        { label: "Weight", value: "800–1,400 kg" },
        { label: "Shoulder", value: "1.4–1.8 m" },
        { label: "Diet", value: "Browser" },
        { label: "Lip", value: "Hooked" },
    ],
    "narina-trogon": [
        { label: "Length", value: "32–34 cm" },
        { label: "Weight", value: "55–90 g" },
        { label: "Diet", value: "Insects" },
        { label: "Note", value: "Sits dead still" },
    ],
    "wild-dog": [
        { label: "Weight", value: "18–36 kg" },
        { label: "Shoulder", value: "~75 cm" },
        { label: "Diet", value: "Carnivore" },
        { label: "Pack", value: "Tight-knit" },
    ],
    "white-rhino": [
        { label: "Weight", value: "1,800–2,500 kg" },
        { label: "Shoulder", value: "~1.8 m" },
        { label: "Diet", value: "Grazer" },
        { label: "Lip", value: "Square" },
    ],
    "sable-antelope": [
        { label: "Weight", value: "190–270 kg" },
        { label: "Horns", value: "Up to 1.5 m" },
        { label: "Diet", value: "Grazer" },
        { label: "Where", value: "Pretoriuskop sourveld" },
    ],
    "ground-hornbill": [
        { label: "Height", value: "~1 m" },
        { label: "Weight", value: "3–6 kg" },
        { label: "Diet", value: "Carnivore" },
        { label: "Call", value: "Booming at dawn" },
    ],
    "martial-eagle": [
        { label: "Wingspan", value: "1.9–2.6 m" },
        { label: "Weight", value: "3–6 kg" },
        { label: "Diet", value: "Carnivore" },
        { label: "Note", value: "Africa's most powerful eagle" },
    ],
    leopard: [
        { label: "Weight", value: "30–90 kg" },
        { label: "Shoulder", value: "~65 cm" },
        { label: "Diet", value: "Carnivore" },
        { label: "Lifespan", value: "12–17 yrs" },
    ],
    bushbuck: [
        { label: "Weight", value: "30–80 kg" },
        { label: "Shoulder", value: "~80 cm" },
        { label: "Diet", value: "Browser" },
        { label: "Note", value: "Solitary" },
    ],
    "chacma-baboon": [
        { label: "Weight", value: "15–45 kg" },
        { label: "Length", value: "~1.1 m" },
        { label: "Diet", value: "Omnivore" },
        { label: "Troop", value: "Up to 100" },
    ],
    "vervet-monkey": [
        { label: "Weight", value: "3.5–8 kg" },
        { label: "Length", value: "~50 cm" },
        { label: "Diet", value: "Omnivore" },
        { label: "Note", value: "Distinct alarm calls" },
    ],
    "grey-duiker": [
        { label: "Weight", value: "15–25 kg" },
        { label: "Shoulder", value: "~50 cm" },
        { label: "Diet", value: "Browser" },
        { label: "Note", value: "Dives for cover" },
    ],
    "sycamore-fig": [
        { label: "Height", value: "Up to 25 m" },
        { label: "Fruit", value: "Figs year-round" },
        { label: "Feeds", value: "Birds, monkeys, bats" },
    ],
    "silver-cluster-leaf": [
        { label: "Height", value: "10–20 m" },
        { label: "Leaf", value: "Silver sheen" },
        { label: "Where", value: "Granite slopes" },
    ],
    jackalberry: [
        { label: "Height", value: "Up to 25 m" },
        { label: "Fruit", value: "Ebony berries" },
        { label: "Note", value: "Leopards store kills" },
    ],
    "fish-eagle": [
        { label: "Wingspan", value: "2–2.4 m" },
        { label: "Weight", value: "2–3.6 kg" },
        { label: "Diet", value: "Fish" },
        { label: "Call", value: "Iconic river cry" },
    ],
    "goliath-heron": [
        { label: "Height", value: "Up to 1.5 m" },
        { label: "Wingspan", value: "~2.3 m" },
        { label: "Diet", value: "Fish" },
        { label: "Note", value: "World's largest heron" },
    ],
    "orb-web-spider": [
        { label: "Body", value: "2.5–4 cm (female)" },
        { label: "Web", value: "Up to 2 m" },
        { label: "Diet", value: "Insects" },
    ],
    tilapia: [
        { label: "Length", value: "35–40 cm" },
        { label: "Weight", value: "Up to 1 kg" },
        { label: "Diet", value: "Omnivore" },
        { label: "Note", value: "Digs nest craters" },
    ],
    "bee-eater": [
        { label: "Length", value: "~23 cm" },
        { label: "Weight", value: "28–38 g" },
        { label: "Diet", value: "Bees, insects" },
        { label: "Nest", value: "Sand-bank colonies" },
    ],
    "rhino-beetle": [
        { label: "Length", value: "Up to 6 cm" },
        { label: "Diet", value: "Sap, fruit" },
        { label: "Strength", value: "~850× its weight" },
    ],
};

export function speciesStats(id: string): SpeciesStat[] {
    return SPECIES_STATS[id] ?? [];
}
