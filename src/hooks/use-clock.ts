"use client";

import { useEffect, useState } from "react";

import { useGameStore } from "@/store/game";

/**
 * The current time of day, from the player's device. A demo hour from the
 * profile scrubber overrides it for testing. Ticks each minute; before the
 * first client tick it reports midday so the first paint is a calm daylight
 * state (and matches the server render).
 */
export function useClock(): { hour: number; minute: number; simulated: boolean } {
    const demoHour = useGameStore((s) => s.demoHour);
    const [now, setNow] = useState<{ hour: number; minute: number } | null>(null);

    useEffect(() => {
        if (demoHour != null) return;
        const tick = () => {
            const d = new Date();
            setNow({ hour: d.getHours(), minute: d.getMinutes() });
        };
        tick();
        const id = setInterval(tick, 30_000);
        return () => clearInterval(id);
    }, [demoHour]);

    if (demoHour != null) return { hour: demoHour, minute: 0, simulated: true };
    if (!now) return { hour: 12, minute: 0, simulated: false };
    return { ...now, simulated: false };
}
