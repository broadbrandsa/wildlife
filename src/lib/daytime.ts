/**
 * Day/night cycle. The ranger and dog make camp at night because the Kruger
 * is dangerous to walk in the dark, so movement is blocked from the camp hour
 * until dawn. Time comes from the player's own device (see useClock), and the
 * phase drives both the movement gate and the map's atmosphere.
 */

export type DayPhase = "dawn" | "day" | "dusk" | "night";

/** Camp for the night at 20:00; the ranger walks again from 05:00. */
export const CAMP_HOUR = 20;
export const DAWN_HOUR = 5;

export function phaseForHour(hour: number): DayPhase {
    if (hour >= CAMP_HOUR || hour < DAWN_HOUR) return "night";
    if (hour < 7) return "dawn";
    if (hour < 17) return "day";
    return "dusk"; // 17:00 to camp
}

/** Night curfew: the ranger cannot move. */
export function isNight(hour: number): boolean {
    return phaseForHour(hour) === "night";
}

/** Dusk warning window: still light, but camp is coming. */
export function isDusk(hour: number): boolean {
    return phaseForHour(hour) === "dusk";
}

/** Whole hours until the camp hour, for the dusk prompt. Null once it is night. */
export function hoursToCamp(hour: number): number | null {
    if (hour >= CAMP_HOUR || hour < DAWN_HOUR) return null;
    return CAMP_HOUR - hour;
}

/** 24-hour clock string, e.g. "19:42". */
export function formatClock(hour: number, minute: number): string {
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** Phosphor icon and short label for the time chip. */
export const PHASE_META: Record<DayPhase, { icon: string; label: string }> = {
    dawn: { icon: "sun-horizon", label: "Dawn" },
    day: { icon: "sun", label: "Daylight" },
    dusk: { icon: "sun-horizon", label: "Dusk" },
    night: { icon: "moon", label: "Night" },
};

/**
 * Atmospheric map wash per phase. Decorative gradients + a legibility-safe
 * scrim laid over the map, in the spirit of the existing map/header gradients.
 */
export const PHASE_SKY: Record<DayPhase, { gradient: string; scrim: string | null }> = {
    dawn: {
        gradient: "radial-gradient(120% 110% at 50% 0%, #C56A2A 0%, #241A12 92%)",
        scrim: "rgba(255, 150, 62, 0.20)",
    },
    day: {
        gradient: "radial-gradient(120% 110% at 50% 0%, #2C4A39 0%, #16110A 92%)",
        scrim: null,
    },
    dusk: {
        gradient: "radial-gradient(120% 110% at 50% 0%, #CF5A24 0%, #221319 92%)",
        scrim: "rgba(247, 120, 40, 0.22)",
    },
    night: {
        gradient: "radial-gradient(120% 110% at 50% 0%, #060708 0%, #000000 60%)",
        scrim: "rgba(0, 0, 0, 0.55)",
    },
};
