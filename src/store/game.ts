"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { CODE_BY_VALUE, EQUIPMENT_BY_ID } from "@/data";
import type { ZoneId } from "@/data";
import { currentDay } from "@/lib/game";
import type { Direction, ScentTier } from "@/lib/game";
import { receiptNumber } from "@/lib/format";

export interface Player {
    id: string;
    /** The player's chosen name. They are the ranger, so this is the ranger's name. */
    displayName: string;
    birthYear: number;
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

/** Case-board verdict a player has recorded against a zone. */
export type ZoneMark = "suspect" | "eliminated";

/** The dog's most recent verdict on the pin. One read per round day. */
export interface ScentRead {
    day: number;
    tier: ScentTier;
    direction: Direction;
    x: number;
    y: number;
}

export interface Patrol {
    lastDay: number | null;
    streak: number;
}

interface GameState {
    hasHydrated: boolean;
    player: Player | null;
    pin: Pin | null;
    inventory: string[];
    cluesUnlocked: string[];
    redeemedCodes: string[];
    donations: Donation[];
    donationsTotal: number;
    notifyAsked: boolean;
    zoneMarks: Partial<Record<ZoneId, ZoneMark>>;
    lastScentRead: ScentRead | null;
    patrol: Patrol;
    /** Demo-only day override, driven by the profile page scrubber. */
    demoDay: number | null;

    setHasHydrated: (v: boolean) => void;
    setPlayer: (player: Player) => void;
    updatePlayer: (patch: Partial<Player>) => void;
    setPin: (x: number, y: number) => void;
    lockPin: () => void;
    purchase: (equipmentId: string) => Donation;
    grantEquipment: (equipmentId: string) => void;
    unlockClue: (id: string) => void;
    redeemCode: (raw: string) => RedeemResult;
    setNotifyAsked: () => void;
    cycleZoneMark: (zoneId: ZoneId) => void;
    recordScentRead: (read: ScentRead) => void;
    logPatrol: (day: number) => void;
    setDemoDay: (day: number | null) => void;
    reset: () => void;
}

const uuid = () =>
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

const initial = {
    player: null as Player | null,
    pin: null as Pin | null,
    inventory: ["standard-collar", "field-map"],
    cluesUnlocked: [] as string[],
    redeemedCodes: [] as string[],
    donations: [] as Donation[],
    donationsTotal: 0,
    notifyAsked: false,
    zoneMarks: {} as Partial<Record<ZoneId, ZoneMark>>,
    lastScentRead: null as ScentRead | null,
    patrol: { lastDay: null, streak: 0 } as Patrol,
    demoDay: null as number | null,
};

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            hasHydrated: false,
            ...initial,

            setHasHydrated: (v) => set({ hasHydrated: v }),

            setPlayer: (player) => set({ player }),
            updatePlayer: (patch) => set((s) => (s.player ? { player: { ...s.player, ...patch } } : {})),

            setPin: (x, y) =>
                set((s) => {
                    if (s.pin?.locked) return {};
                    return { pin: { x, y, updatedAt: new Date().toISOString(), locked: false } };
                }),

            lockPin: () => set((s) => (s.pin ? { pin: { ...s.pin, locked: true } } : {})),

            grantEquipment: (equipmentId) =>
                set((s) => {
                    const item = EQUIPMENT_BY_ID[equipmentId];
                    const clues = item?.unlocksClueId
                        ? [...new Set([...s.cluesUnlocked, item.unlocksClueId])]
                        : s.cluesUnlocked;
                    return {
                        inventory: [...new Set([...s.inventory, equipmentId])],
                        cluesUnlocked: clues,
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
                    return {
                        inventory: [...new Set([...s.inventory, equipmentId])],
                        cluesUnlocked: clues,
                        donations: [donation, ...s.donations],
                        donationsTotal: s.donationsTotal + donation.amountZar,
                    };
                });
                return donation;
            },

            unlockClue: (id) => set((s) => ({ cluesUnlocked: [...new Set([...s.cluesUnlocked, id])] })),

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

            // open → suspect → eliminated → open
            cycleZoneMark: (zoneId) =>
                set((s) => {
                    const cur = s.zoneMarks[zoneId];
                    const next: ZoneMark | undefined =
                        cur === undefined ? "suspect" : cur === "suspect" ? "eliminated" : undefined;
                    const zoneMarks = { ...s.zoneMarks };
                    if (next) zoneMarks[zoneId] = next;
                    else delete zoneMarks[zoneId];
                    return { zoneMarks };
                }),

            recordScentRead: (read) => set({ lastScentRead: read }),

            logPatrol: (day) =>
                set((s) => {
                    if (s.patrol.lastDay === day) return {};
                    const streak = s.patrol.lastDay === day - 1 ? s.patrol.streak + 1 : 1;
                    return { patrol: { lastDay: day, streak } };
                }),

            setDemoDay: (day) => set({ demoDay: day }),

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
