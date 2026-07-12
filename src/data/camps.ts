/**
 * The twelve main SANParks rest camps of the Kruger National Park, placed on
 * the map at their real positions (fractions of the 360x760 viewBox, matching
 * the pin coordinate space). Each carries a short field note and a photograph.
 *
 * Photography: Wikimedia Commons images stored locally in public/camps/. Each
 * carries its own Creative Commons licence; attribution must be surfaced in the
 * UI (or the photos replaced with licensed originals) before production.
 */

export interface RestCamp {
    id: string;
    name: string;
    /** Fraction of the map artwork, matching the pin coordinate space. */
    x: number;
    y: number;
    /** Short locator, shown as an eyebrow on the info card. */
    region: string;
    blurb: string;
    photo: string;
}

export const REST_CAMPS: RestCamp[] = [
    {
        id: "punda-maria",
        name: "Punda Maria",
        x: 0.154,
        y: 0.125,
        region: "Far north",
        blurb: "The park's northernmost rest camp, a 1930s outpost of whitewashed thatched huts on the slopes of Dimbo hill. It is the gateway to the sandveld and the birding wonderland of Pafuri, and holds species found nowhere else in the park.",
        photo: "/camps/punda-maria.jpg",
    },
    {
        id: "shingwedzi",
        name: "Shingwedzi",
        x: 0.479,
        y: 0.251,
        region: "Northern mopane",
        blurb: "A shady camp of large trees on the banks of the Shingwedzi River in the mopane country of the north. Its riverside loop drives are among the best in the park for elephant, buffalo and the big northern tuskers.",
        photo: "/camps/shingwedzi.jpg",
    },
    {
        id: "mopani",
        name: "Mopani",
        x: 0.448,
        y: 0.376,
        region: "North central",
        blurb: "A modern stone and thatch camp built into a rise of jackalberry and baobab, overlooking the Pioneer Dam. The dam draws elephant, hippo and a constant traffic of game to drink.",
        photo: "/camps/mopani.jpg",
    },
    {
        id: "letaba",
        name: "Letaba",
        x: 0.589,
        y: 0.478,
        region: "Letaba River",
        blurb: "One of the park's best loved camps, set on a sweeping bend of the Letaba River under giant trees. Its Elephant Hall museum tells the story of the great tuskers, and the restaurant looks out over grazing herds.",
        photo: "/camps/letaba.jpg",
    },
    {
        id: "olifants",
        name: "Olifants",
        x: 0.717,
        y: 0.524,
        region: "Central river cliff",
        blurb: "The most dramatically sited camp in the park, on a high cliff with a hundred kilometre view over the Olifants River valley. From the lookout you can watch elephant, buffalo and crocodile far below.",
        photo: "/camps/olifants.jpg",
    },
    {
        id: "satara",
        name: "Satara",
        x: 0.748,
        y: 0.641,
        region: "Central grasslands",
        blurb: "A large, busy camp on the open central grasslands, the richest grazing in the park and so prime predator country. Satara is famous for its lions and the night sounds of the surrounding plains.",
        photo: "/camps/satara.jpg",
    },
    {
        id: "orpen",
        name: "Orpen",
        x: 0.443,
        y: 0.666,
        region: "Western boundary",
        blurb: "A small, intimate camp at the Orpen Gate on the park's western boundary, looking out over a floodlit waterhole. It sits at the edge of excellent cheetah and wild dog country.",
        photo: "/camps/orpen.jpg",
    },
    {
        id: "skukuza",
        name: "Skukuza",
        x: 0.606,
        y: 0.823,
        region: "Sabie River, park HQ",
        blurb: "The park's largest camp and administrative headquarters, a small town on the banks of the Sabie River with shops, a museum, a golf course and the main airfield. The surrounding river frontage carries one of Africa's highest leopard densities.",
        photo: "/camps/skukuza.jpg",
    },
    {
        id: "lower-sabie",
        name: "Lower Sabie",
        x: 0.854,
        y: 0.861,
        region: "South-east",
        blurb: "A hugely popular camp on the Sabie River in the game rich south-east, its restaurant deck one of the finest game viewing spots in the park. The nearby Sunset Dam is alive with hippo, crocodile and waterbirds.",
        photo: "/camps/lower-sabie.jpg",
    },
    {
        id: "pretoriuskop",
        name: "Pretoriuskop",
        x: 0.351,
        y: 0.876,
        region: "South-west sourveld",
        blurb: "The park's oldest rest camp, established in 1928 in the high rainfall sourveld of the south-west. The lush surrounds and granite koppies are the place to look for sable, white rhino and the rare mountain reedbuck.",
        photo: "/camps/pretoriuskop.jpg",
    },
    {
        id: "berg-en-dal",
        name: "Berg-en-Dal",
        x: 0.489,
        y: 0.954,
        region: "Far south granite",
        blurb: "A modern camp in the rugged granite hills of the far south, its bungalows spread among natural bush along the Matjulu Spruit. The area is a stronghold for both white and black rhino.",
        photo: "/camps/berg-en-dal.jpg",
    },
    {
        id: "crocodile-bridge",
        name: "Crocodile Bridge",
        x: 0.837,
        y: 0.933,
        region: "South-east gate",
        blurb: "A small camp at the south-eastern gate on the Crocodile River, doubling as an entrance to the park. The surrounding plains hold lion, cheetah and general game, with a resident hippo pool below the low water bridge.",
        photo: "/camps/crocodile-bridge.jpg",
    },
];

export const REST_CAMP_BY_ID: Record<string, RestCamp> = Object.fromEntries(REST_CAMPS.map((c) => [c.id, c]));

/** Within this many km of a camp, the ranger snaps to it and counts as there. */
export const CAMP_REACH_KM = 5;

/**
 * Reach a rest camp with your ranger and it gives one free power-up. Different
 * camps hand out different ones, spread evenly across the four: a bakkie ride,
 * a binocular scan, a dog ration or trail rations.
 */
export const CAMP_REWARD: Record<string, string> = {
    "punda-maria": "scan",
    shingwedzi: "ration",
    mopani: "snack",
    letaba: "ride",
    olifants: "scan",
    satara: "ration",
    orpen: "snack",
    skukuza: "ride",
    "lower-sabie": "scan",
    pretoriuskop: "ration",
    "berg-en-dal": "snack",
    "crocodile-bridge": "ride",
};
