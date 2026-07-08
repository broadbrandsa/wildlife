/**
 * Morning patrol observations. One surfaces each round day (rotating), as the
 * light daily ritual: check in, read the veld, keep your streak.
 */
export interface PatrolNote {
    icon: string;
    body: string;
}

export const PATROL_NOTES: PatrolNote[] = [
    { icon: "sun-horizon", body: "First light. The dogs are fed and the kennels hosed down before the heat comes. A tracking day starts clean." },
    { icon: "paw-print", body: "Fresh civet tracks cross the firebreak by the kennels. The night shift was busy while you slept." },
    { icon: "bird", body: "A fish eagle calls from the dam before you see it. Rangers say you hear Kruger before you see it." },
    { icon: "wind", body: "Wind from the east today. The handlers work the dogs into it, a nose is only as good as the air it reads." },
    { icon: "drop", body: "The waterhole level has dropped a hand's width this week. Dry season pulls every animal toward the rivers." },
    { icon: "tree", body: "Elephants stripped a marula by the vehicle shed overnight. Nothing on a patrol route stays tidy for long." },
    { icon: "moon", body: "The moon was full last night. Bright nights mean more movement, animal and human both. The unit patrols later." },
    { icon: "fire", body: "A controlled burn smokes on the western boundary. New grass will bring the grazers, and the grazers bring everything else." },
    { icon: "binoculars", body: "A honey badger raided the camp bins again. The dogs found it hilarious. The quartermaster did not." },
    { icon: "cloud-sun", body: "Cool and overcast. Scent holds low and long in this weather, the best tracking conditions of the month." },
    { icon: "footprints", body: "The morning fence check finds one new hole, patched by nine. Most anti-poaching work is quiet work like this." },
    { icon: "radio", body: "Radio check with section rangers at 06:00. Quiet night across the park. Quiet is the sound of the job going well." },
];

export function patrolNoteForDay(day: number): PatrolNote {
    return PATROL_NOTES[(day - 1) % PATROL_NOTES.length];
}
