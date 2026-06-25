"use client";

import { useGameStore } from "@/store/game";

/** True once the persisted Zustand store has rehydrated from localStorage. */
export function useHydrated(): boolean {
    return useGameStore((s) => s.hasHydrated);
}
