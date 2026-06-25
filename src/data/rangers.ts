import type { Ranger } from "./types";

/**
 * Five selectable ranger avatars. Cosmetic only in v1: the ranger is the
 * player's character, the dog provides the gameplay effect. The lineup
 * reflects the real demographic of SAWC field rangers (Grace is anchored on
 * real ranger Precious Malapane, a Tsonga/Shangaan woman who runs the SAWC
 * free-running hound pack).
 */
export const RANGERS: Ranger[] = [
    {
        id: "grace",
        name: "Grace",
        who: "Black South African woman",
        heritage: "Tsonga/Shangaan, from a community near the Greater Kruger",
        personality: "Brave, kind, deeply rooted in this land. She knows this bush by heart.",
        background: "Marula trees",
        photo: "/Rangers/Grace.png",
    },
    {
        id: "sabata",
        name: "Sabata",
        who: "Black South African man",
        heritage: "Sesotho name meaning leader or chief",
        personality: "Experienced, with the calm natural authority of a senior ranger who has trained dozens of others.",
        background: "Mopane leaves",
        photo: "/Rangers/Sabata.png",
    },
    {
        id: "vince",
        name: "Vince",
        who: "White South African man",
        heritage: "Afrikaner heritage, weathered dog handler",
        personality: "Focused, intense, the look of a dog handler who reads the bush like a book.",
        background: "Acacia thorn tree",
        photo: "/Rangers/Vince.png",
    },
    {
        id: "rubaina",
        name: "Rubaina",
        who: "Indian South African woman",
        heritage: "KwaZulu-Natal heritage, careful observer",
        personality: "Thoughtful, sharp-eyed, the quiet competence of someone who earned her place.",
        background: "Fever tree branches",
        photo: "/Rangers/Rubaina.png",
    },
    {
        id: "shakier",
        name: "Shakier",
        who: "Coloured South African man",
        heritage: "Western Cape heritage, team morale",
        personality: "Open, friendly, the morale of the team, with the alert eyes of someone who knows the bush.",
        background: "Lowveld grass",
        photo: "/Rangers/Shakier.png",
    },
];

export const RANGER_BY_ID: Record<string, Ranger> = Object.fromEntries(RANGERS.map((r) => [r.id, r]));
