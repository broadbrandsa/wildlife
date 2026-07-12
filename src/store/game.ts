"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { CAMP_REACH_KM, CODE_BY_VALUE, EQUIPMENT_BY_ID, REST_CAMPS } from "@/data";
import type { ZoneId } from "@/data";
import { BUSH_WISE_DOGS, RIDE_TRAVEL_MS, clampWalk, currentDay, dailyWalkKm, distanceKm, walkTravelMs } from "@/lib/game";
import type { ScentTier } from "@/lib/game";
import { receiptNumber } from "@/lib/format";

/**
 * Land close enough to a rest camp and the ranger walks the last stretch in, so
 * the pin snaps exactly onto the camp. Returns the camp point, or the original
 * target if no camp is within reach.
 */
function snapToCamp(target: { x: number; y: number }): { x: number; y: number } {
    const camp = REST_CAMPS.find((c) => distanceKm(target, { x: c.x, y: c.y }) <= CAMP_REACH_KM);
    return camp ? { x: camp.x, y: camp.y } : target;
}

export interface Player {
    id: string;
    /** The player's chosen name. They are the ranger, so this is the ranger's name. */
    displayName: string;
    /** Optional: the age gate was dropped from sign-on. */
    birthYear?: number;
    rangerId: string;
    dogId: string;
    /** Player-chosen name for their dog (defaults to the reference name). */
    dogName: string;
    parentEmail?: string;
}

export interface Pin {
    x: number;
    y: number;
    updatedAt: string;
    locked: boolean;
}

export interface Donation {
    id: string;
    equipmentId: string;
    amountZar: number;
    receiptNumber: string;
    createdAt: string;
}

export type RedeemResult =
    | { ok: true; unlockType: string; payloadId: string; creditLine: string }
    | { ok: false; reason: "unknown" | "used" | "expired" };

interface GameState {
    hasHydrated: boolean;
    player: Player | null;
    pin: Pin | null;
    inventory: string[];
    cluesUnlocked: string[];
    redeemedCodes: string[];
    /** Zones whose field guide the player owns (the first is free on first pin). */
    fieldGuides: ZoneId[];
    /** Dotty's superpower: the matriarch grants one extra free guide pick. */
    freeGuideUsed: boolean;
    donations: Donation[];
    donationsTotal: number;
    notifyAsked: boolean;
    /** How many times the ranger has been moved on a given round day. */
    pinMovesToday: { day: number; count: number } | null;
    /** Demo-only day override, driven by the profile page scrubber. */
    demoDay: number | null;
    /** Demo-only hour override (0-23) for the day/night cycle; null uses the device clock. */
    demoHour: number | null;
    /** The pin.updatedAt whose scent read the player has opened (dog badge). */
    scentSeenAt: string | null;
    /** The round day on which the player last opened the clue panel (clue badge). */
    cluesSeenDay: number | null;
    /**
     * Patrol bakkie rides left. Every player starts the round with two free
     * rides; they are never paywalled, so the free path stays fair. More rides
     * come from the consumable truck-fuel kit item.
     */
    truckRidesLeft: number;
    /**
     * Epoch ms the ranger set off on their last move. They are then walking to
     * the new location and cannot move again until they arrive; the walk takes
     * `moveTravelMs`. Null means arrived and ready.
     */
    lastMoveAt: number | null;
    /** How long the current walk takes, in ms (set by the distance of the move). */
    moveTravelMs: number;
    /**
     * The round day the ranger last topped up their food supply (reaching a
     * rest camp, using a field ration, or an auto-pickup). Null until first
     * deploy; then set to the day they set off.
     */
    resupplyDay: number | null;
    /**
     * A round day on which the bakkie collected a ranger who ran out of food:
     * they hold at the camp that day and move out again the next day.
     */
    pickupHoldDay: number | null;
    /** `${day}:${pin.updatedAt}` of the last scent reveal that played. */
    lastRevealKey: string | null;
    /** The read before the current one, for the warmer / colder delta line. */
    prevRead: { day: number; tier: ScentTier } | null;
    /** The currently revealed read; shifts into prevRead on the next reveal. */
    lastRead: { day: number; tier: ScentTier } | null;
    /** Consecutive days the revealed read has been hot. */
    hotStreak: number;
    /** Case board verdicts per zone. Open zones are simply absent. */
    zoneMarks: Partial<Record<ZoneId, "suspect" | "ruled-out">>;
    /** Every position the ranger has held, for the breadcrumb trail. */
    trail: { x: number; y: number; day: number; via: "walk" | "truck" }[];
    /** The spotting log: every species the player has tapped and revealed. */
    sightings: { speciesId: string; day: number }[];
    /** Completed fives (big, ugly, small) whose instant prize has been won. */
    fivesWon: string[];
    /** Ranger power-up counts (the bakkie ride is tracked by truckRidesLeft). */
    powerups: Record<string, number>;
    /** Rest-camp ids the ranger has reached, so each free power-up is granted once. */
    campsVisited: string[];

    setHasHydrated: (v: boolean) => void;
    setPlayer: (player: Player) => void;
    updatePlayer: (patch: Partial<Player>) => void;
    /** Move the ranger (which is also your guess). Counts against the day's moves. */
    moveRanger: (x: number, y: number, day: number) => void;
    /**
     * Ride the patrol bakkie to any point on the map, ignoring the walking
     * clamp. The drive takes the rest of the day and spends one ride.
     */
    rideTruck: (x: number, y: number, day: number) => void;
    lockPin: () => void;
    purchase: (equipmentId: string) => Donation;
    grantEquipment: (equipmentId: string) => void;
    unlockClue: (id: string) => void;
    grantFieldGuide: (zoneId: ZoneId) => void;
    /** Spend Dotty's free pick on a zone guide. No-op for other dogs or if spent. */
    claimFreeGuide: (zoneId: ZoneId) => void;
    redeemCode: (raw: string) => RedeemResult;
    setNotifyAsked: () => void;
    setDemoDay: (day: number | null) => void;
    setDemoHour: (hour: number | null) => void;
    /** Top up the ranger's food supply to full, as of the given round day. */
    resupply: (day: number) => void;
    /** Food ran out: the bakkie carries the ranger to the nearest camp and resupplies. */
    autoPickup: (day: number) => void;
    /** The ranger reaches their location now: clears the walk. */
    arriveNow: () => void;
    /** Spend one of a power-up (scan, ration, snack). No-op if none left. */
    usePowerup: (id: string) => void;
    /** Add one of a power-up. */
    grantPowerup: (id: string) => void;
    /** Reaching a rest camp: grant its free power-up once, then remember it. */
    visitCamp: (campId: string, reward: string) => void;
    /** Clear the dog badge: the current pin's scent read has been opened. */
    markScentSeen: () => void;
    /** Clear the clue badge for this round day. */
    markCluesSeen: (day: number) => void;
    /**
     * A scent reveal finished playing: remember its key, shift the current
     * read into prevRead and keep the hot streak. One update, replay-safe.
     */
    recordReveal: (key: string, tier: ScentTier, day: number) => void;
    /** Case board: cycle a zone open, suspect, ruled-out, open. */
    cycleZoneMark: (zoneId: ZoneId) => void;
    /** Case board: rule a zone straight out (elimination clue button). */
    ruleOutZone: (zoneId: ZoneId) => void;
    /** Log the species spotted on this move. */
    recordSighting: (speciesId: string, day: number) => void;
    /** A five is complete: bank its instant prize (once per five). */
    recordFiveWin: (fiveId: string) => void;
    reset: () => void;
}

const uuid = () =>
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

const initial = {
    player: null as Player | null,
    pin: null as Pin | null,
    inventory: ["standard-collar"],
    cluesUnlocked: [] as string[],
    redeemedCodes: [] as string[],
    fieldGuides: [] as ZoneId[],
    freeGuideUsed: false,
    donations: [] as Donation[],
    donationsTotal: 0,
    notifyAsked: false,
    pinMovesToday: null as { day: number; count: number } | null,
    demoDay: null as number | null,
    demoHour: null as number | null,
    scentSeenAt: null as string | null,
    cluesSeenDay: null as number | null,
    truckRidesLeft: 2,
    lastMoveAt: null as number | null,
    moveTravelMs: 0,
    resupplyDay: null as number | null,
    pickupHoldDay: null as number | null,
    lastRevealKey: null as string | null,
    prevRead: null as { day: number; tier: ScentTier } | null,
    lastRead: null as { day: number; tier: ScentTier } | null,
    hotStreak: 0,
    zoneMarks: {} as Partial<Record<ZoneId, "suspect" | "ruled-out">>,
    trail: [] as { x: number; y: number; day: number; via: "walk" | "truck" }[],
    sightings: [] as { speciesId: string; day: number }[],
    fivesWon: [] as string[],
    powerups: { scan: 1, ration: 1, snack: 1 } as Record<string, number>,
    campsVisited: [] as string[],
};

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            hasHydrated: false,
            ...initial,

            setHasHydrated: (v) => set({ hasHydrated: v }),

            setPlayer: (player) => set({ player }),
            updatePlayer: (patch) => set((s) => (s.player ? { player: { ...s.player, ...patch } } : {})),

            moveRanger: (x, y, day) =>
                set((s) => {
                    if (s.pin?.locked) return {};
                    // The first pin drops anywhere; after that the ranger is on
                    // foot, so each move is clamped to the day's walking range.
                    const target = snapToCamp(s.pin ? clampWalk(s.pin, { x, y }, dailyWalkKm(s.player?.dogId)) : { x, y });
                    const prior = s.pinMovesToday;
                    const count = prior && prior.day === day ? prior.count + 1 : 1;
                    // The ranger then walks to the new location; the time depends
                    // on how far they went. The first deployment does not walk.
                    const dist = s.pin ? distanceKm(s.pin, target) : 0;
                    return {
                        pin: { x: target.x, y: target.y, updatedAt: new Date().toISOString(), locked: false },
                        pinMovesToday: { day, count },
                        lastMoveAt: Date.now(),
                        moveTravelMs: walkTravelMs(dist, s.player?.dogId, s.inventory.includes("ranger-boots")),
                        // The first deploy starts the food clock; later moves keep it running.
                        resupplyDay: s.pin ? s.resupplyDay : day,
                        trail: [...s.trail, { x: target.x, y: target.y, day, via: "walk" as const }],
                    };
                }),

            rideTruck: (x, y, day) =>
                set((s) => {
                    if (!s.pin || s.pin.locked || s.truckRidesLeft <= 0) return {};
                    // The bakkie goes anywhere: no clampWalk on a ride, but it
                    // still pulls in to a camp if it drops you close to one.
                    const target = snapToCamp({ x, y });
                    return {
                        pin: { x: target.x, y: target.y, updatedAt: new Date().toISOString(), locked: false },
                        truckRidesLeft: s.truckRidesLeft - 1,
                        // The drive takes a fixed chunk of the day before the
                        // ranger sets off again; pinMovesToday is kept for the tally.
                        pinMovesToday: { day, count: 99 },
                        lastMoveAt: Date.now(),
                        moveTravelMs: RIDE_TRAVEL_MS,
                        trail: [...s.trail, { x: target.x, y: target.y, day, via: "truck" as const }],
                    };
                }),

            lockPin: () => set((s) => (s.pin ? { pin: { ...s.pin, locked: true } } : {})),

            grantEquipment: (equipmentId) =>
                set((s) => {
                    const item = EQUIPMENT_BY_ID[equipmentId];
                    const clues = item?.unlocksClueId
                        ? [...new Set([...s.cluesUnlocked, item.unlocksClueId])]
                        : s.cluesUnlocked;
                    const guides = item?.unlocksFieldGuideZoneId
                        ? [...new Set([...s.fieldGuides, item.unlocksFieldGuideZoneId])]
                        : s.fieldGuides;
                    return {
                        inventory: [...new Set([...s.inventory, equipmentId])],
                        cluesUnlocked: clues,
                        fieldGuides: guides,
                    };
                }),

            purchase: (equipmentId) => {
                const item = EQUIPMENT_BY_ID[equipmentId];
                const donation: Donation = {
                    id: uuid(),
                    equipmentId,
                    amountZar: item?.priceZar ?? 0,
                    receiptNumber: receiptNumber(Math.floor(Math.random() * 1_000_000)),
                    createdAt: new Date().toISOString(),
                };
                set((s) => {
                    const clues = item?.unlocksClueId
                        ? [...new Set([...s.cluesUnlocked, item.unlocksClueId])]
                        : s.cluesUnlocked;
                    const guides = item?.unlocksFieldGuideZoneId
                        ? [...new Set([...s.fieldGuides, item.unlocksFieldGuideZoneId])]
                        : s.fieldGuides;
                    // A second lock-in reopens the pin and hands back a move; it is not kept in inventory.
                    const reopen = equipmentId === "extra-lockin";
                    // Consumable kit stocks a ranger power-up: bakkie fuel a ride,
                    // binoculars a scan, field rations a food top-up, snacks a trail push.
                    const fuel = equipmentId === "truck-fuel";
                    const puGrant =
                        equipmentId === "pro-binoculars"
                            ? "scan"
                            : equipmentId === "dog-ration"
                              ? "ration"
                              : equipmentId === "trail-rations"
                                ? "snack"
                                : null;
                    return {
                        inventory: item?.consumable ? s.inventory : [...new Set([...s.inventory, equipmentId])],
                        cluesUnlocked: clues,
                        fieldGuides: guides,
                        donations: [donation, ...s.donations],
                        donationsTotal: s.donationsTotal + donation.amountZar,
                        pin: reopen && s.pin ? { ...s.pin, locked: false } : s.pin,
                        pinMovesToday: reopen ? null : s.pinMovesToday,
                        // A second lock-in also rests the ranger, so the reopened pin can move at once.
                        lastMoveAt: reopen ? null : s.lastMoveAt,
                        truckRidesLeft: fuel ? s.truckRidesLeft + 1 : s.truckRidesLeft,
                        powerups: puGrant ? { ...s.powerups, [puGrant]: (s.powerups[puGrant] ?? 0) + 1 } : s.powerups,
                    };
                });
                return donation;
            },

            unlockClue: (id) => set((s) => ({ cluesUnlocked: [...new Set([...s.cluesUnlocked, id])] })),

            grantFieldGuide: (zoneId) =>
                set((s) => ({ fieldGuides: [...new Set([...s.fieldGuides, zoneId])] })),

            claimFreeGuide: (zoneId) =>
                set((s) => {
                    const dogId = s.player?.dogId;
                    if (!dogId || !BUSH_WISE_DOGS.has(dogId) || s.freeGuideUsed) return {};
                    if (s.fieldGuides.includes(zoneId)) return {};
                    return { fieldGuides: [...s.fieldGuides, zoneId], freeGuideUsed: true };
                }),

            redeemCode: (raw) => {
                const value = raw.trim().toUpperCase();
                const code = CODE_BY_VALUE[value];
                if (!code) return { ok: false, reason: "unknown" };
                if (get().redeemedCodes.includes(value)) return { ok: false, reason: "used" };
                if (code.validUntil && new Date(code.validUntil).getTime() < Date.now()) {
                    return { ok: false, reason: "expired" };
                }
                set((s) => {
                    const cluesUnlocked =
                        code.unlockType === "clue"
                            ? [...new Set([...s.cluesUnlocked, code.payloadId])]
                            : s.cluesUnlocked;
                    const inventory =
                        code.unlockType === "equipment"
                            ? [...new Set([...s.inventory, code.payloadId])]
                            : s.inventory;
                    return { redeemedCodes: [...s.redeemedCodes, value], cluesUnlocked, inventory };
                });
                return { ok: true, unlockType: code.unlockType, payloadId: code.payloadId, creditLine: code.creditLine };
            },

            setNotifyAsked: () => set({ notifyAsked: true }),

            // Moving the demo clock jumps game time, so the ranger's walk clears
            // with it: they count as arrived at the new location.
            setDemoDay: (day) => set({ demoDay: day, lastMoveAt: null }),

            setDemoHour: (hour) => set({ demoHour: hour, lastMoveAt: null }),

            resupply: (day) => set({ resupplyDay: day }),

            autoPickup: (day) =>
                set((s) => {
                    if (!s.pin) return {};
                    const p = s.pin;
                    let camp = REST_CAMPS[0];
                    let bestKm = distanceKm(p, { x: camp.x, y: camp.y });
                    for (const c of REST_CAMPS) {
                        const d = distanceKm(p, { x: c.x, y: c.y });
                        if (d < bestKm) {
                            bestKm = d;
                            camp = c;
                        }
                    }
                    return {
                        pin: { x: camp.x, y: camp.y, updatedAt: new Date().toISOString(), locked: false },
                        resupplyDay: day,
                        pickupHoldDay: day,
                        lastMoveAt: null,
                        moveTravelMs: 0,
                        trail: [...s.trail, { x: camp.x, y: camp.y, day, via: "truck" as const }],
                    };
                }),

            arriveNow: () => set({ lastMoveAt: null, moveTravelMs: 0 }),

            usePowerup: (id) =>
                set((s) => ((s.powerups[id] ?? 0) > 0 ? { powerups: { ...s.powerups, [id]: s.powerups[id] - 1 } } : {})),

            grantPowerup: (id) => set((s) => ({ powerups: { ...s.powerups, [id]: (s.powerups[id] ?? 0) + 1 } })),

            visitCamp: (campId, reward) =>
                set((s) => {
                    if (s.campsVisited.includes(campId)) return {};
                    const campsVisited = [...s.campsVisited, campId];
                    // The bakkie ride is counted separately; the rest are power-ups.
                    if (reward === "ride") return { campsVisited, truckRidesLeft: s.truckRidesLeft + 1 };
                    return { campsVisited, powerups: { ...s.powerups, [reward]: (s.powerups[reward] ?? 0) + 1 } };
                }),

            markScentSeen: () => set((s) => ({ scentSeenAt: s.pin?.updatedAt ?? null })),

            markCluesSeen: (day) => set({ cluesSeenDay: day }),

            recordReveal: (key, tier, day) =>
                set((s) => {
                    if (s.lastRevealKey === key) return {};
                    // The streak counts consecutive days hot; a same-day move
                    // that stays hot does not double-count the day.
                    const hotStreak =
                        tier !== "hot"
                            ? 0
                            : s.lastRead?.day === day && s.hotStreak > 0
                              ? s.hotStreak
                              : s.hotStreak + 1;
                    return { lastRevealKey: key, prevRead: s.lastRead, lastRead: { day, tier }, hotStreak };
                }),

            cycleZoneMark: (zoneId) =>
                set((s) => {
                    const next =
                        s.zoneMarks[zoneId] === "suspect"
                            ? ("ruled-out" as const)
                            : s.zoneMarks[zoneId] === "ruled-out"
                              ? undefined
                              : ("suspect" as const);
                    const marks = { ...s.zoneMarks };
                    if (next) marks[zoneId] = next;
                    else delete marks[zoneId];
                    return { zoneMarks: marks };
                }),

            ruleOutZone: (zoneId) => set((s) => ({ zoneMarks: { ...s.zoneMarks, [zoneId]: "ruled-out" as const } })),

            recordSighting: (speciesId, day) => set((s) => ({ sightings: [...s.sightings, { speciesId, day }] })),

            recordFiveWin: (fiveId) =>
                set((s) => (s.fivesWon.includes(fiveId) ? {} : { fivesWon: [...s.fivesWon, fiveId] })),

            reset: () => set({ ...initial }),
        }),
        {
            name: "sawc-k9-game",
            onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
            partialize: ({ hasHydrated, ...rest }) => rest,
        },
    ),
);

/** The round day the UI should render, honouring the demo scrubber. */
export function useCurrentDay(): number {
    const demoDay = useGameStore((s) => s.demoDay);
    return currentDay(demoDay);
}
