"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { CODE_BY_VALUE, EQUIPMENT_BY_ID } from "@/data";
import type { ZoneId } from "@/data";
import { currentDay } from "@/lib/game";
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

interface GameState {
    hasHydrated: boolean;
    player: Player | null;
    pin: Pin | null;
    inventory: string[];
    cluesUnlocked: string[];
    redeemedCodes: string[];
    /** Zones whose field guide the player owns (one chosen free at sign-on). */
    fieldGuides: ZoneId[];
    donations: Donation[];
    donationsTotal: number;
    notifyAsked: boolean;
    /** How many times the ranger has been moved on a given round day. */
    pinMovesToday: { day: number; count: number } | null;
    /** Demo-only day override, driven by the profile page scrubber. */
    demoDay: number | null;

    setHasHydrated: (v: boolean) => void;
    setPlayer: (player: Player) => void;
    updatePlayer: (patch: Partial<Player>) => void;
    /** Move the ranger (which is also your guess). Counts against the day's moves. */
    moveRanger: (x: number, y: number, day: number) => void;
    lockPin: () => void;
    purchase: (equipmentId: string) => Donation;
    grantEquipment: (equipmentId: string) => void;
    unlockClue: (id: string) => void;
    grantFieldGuide: (zoneId: ZoneId) => void;
    redeemCode: (raw: string) => RedeemResult;
    setNotifyAsked: () => void;
    setDemoDay: (day: number | null) => void;
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
    donations: [] as Donation[],
    donationsTotal: 0,
    notifyAsked: false,
    pinMovesToday: null as { day: number; count: number } | null,
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

            moveRanger: (x, y, day) =>
                set((s) => {
                    if (s.pin?.locked) return {};
                    const prior = s.pinMovesToday;
                    const count = prior && prior.day === day ? prior.count + 1 : 1;
                    return {
                        pin: { x, y, updatedAt: new Date().toISOString(), locked: false },
                        pinMovesToday: { day, count },
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
                    return {
                        inventory: item?.consumable ? s.inventory : [...new Set([...s.inventory, equipmentId])],
                        cluesUnlocked: clues,
                        fieldGuides: guides,
                        donations: [donation, ...s.donations],
                        donationsTotal: s.donationsTotal + donation.amountZar,
                        pin: reopen && s.pin ? { ...s.pin, locked: false } : s.pin,
                        pinMovesToday: reopen ? null : s.pinMovesToday,
                    };
                });
                return donation;
            },

            unlockClue: (id) => set((s) => ({ cluesUnlocked: [...new Set([...s.cluesUnlocked, id])] })),

            grantFieldGuide: (zoneId) =>
                set((s) => ({ fieldGuides: [...new Set([...s.fieldGuides, zoneId])] })),

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
