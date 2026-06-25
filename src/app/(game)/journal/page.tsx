"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { Eyebrow } from "@/components/ds";
import { ClueCard } from "@/components/game/ClueCard";
import { CLUES, EQUIPMENT } from "@/data";
import type { Clue } from "@/data";
import { availableClueIds, currentDay, isFreeClueReleased } from "@/lib/game";
import { useGameStore } from "@/store/game";

const ITEM_FOR_CLUE: Record<string, { id: string; name: string }> = Object.fromEntries(
    EQUIPMENT.filter((e) => e.unlocksClueId).map((e) => [e.unlocksClueId as string, { id: e.id, name: e.name }]),
);

function LockedRow({ clue, onAction }: { clue: Clue; onAction: () => void }) {
    const day = currentDay();
    let label = "Locked";
    let action = "";
    if (clue.source === "free" && clue.releaseDay) {
        label = `Releases on day ${clue.releaseDay}`;
    } else if (clue.source === "equipment") {
        const item = ITEM_FOR_CLUE[clue.id];
        label = item ? `Unlock with ${item.name}` : "Unlock with kit";
        action = "Visit kit";
    } else if (clue.source === "sponsor") {
        label = "Hidden behind a sponsor code";
        action = "Enter a code";
    }
    return (
        <button
            onClick={onAction}
            disabled={!action}
            style={{
                width: "100%",
                textAlign: "left",
                cursor: action ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                background: "var(--surface-sunken)",
                border: "1px dashed var(--border-default)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-4)",
            }}
        >
            <i className="ph ph-lock-simple" style={{ fontSize: 20, color: "var(--text-muted)" }} />
            <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    {clue.source === "free" ? "Field clue" : clue.source === "equipment" ? "Kit intel" : "Intel intercept"}
                </div>
                <div style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: 2 }}>{label}</div>
            </div>
            {action && (
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-link)", whiteSpace: "nowrap" }}>
                    {action} <i className="ph ph-arrow-right" />
                </span>
            )}
        </button>
    );
}

export default function JournalPage() {
    const router = useRouter();
    const cluesUnlocked = useGameStore((s) => s.cluesUnlocked);
    const day = currentDay();

    const { available, locked } = useMemo(() => {
        const ids = availableClueIds(cluesUnlocked, day);
        const available = CLUES.filter((c) => ids.has(c.id));
        const locked = CLUES.filter((c) => !ids.has(c.id) && !isFreeClueReleased(c, day));
        // order locked: upcoming free by day, then equipment, then sponsor
        locked.sort((a, b) => {
            const rank = (c: Clue) => (c.source === "free" ? (c.releaseDay ?? 0) : c.source === "equipment" ? 1000 : 2000);
            return rank(a) - rank(b);
        });
        return { available, locked };
    }, [cluesUnlocked, day]);

    return (
        <div style={{ padding: "var(--space-6) var(--gutter) var(--space-7)" }}>
            <Eyebrow>Field journal</Eyebrow>
            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 var(--space-2)" }}>Your clues</h1>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                {available.length} clue{available.length === 1 ? "" : "s"} in hand · {locked.length} still to come.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginTop: "var(--space-6)" }}>
                {available.map((c) => (
                    <ClueCard key={c.id} clue={c} />
                ))}
            </div>

            {locked.length > 0 && (
                <>
                    <div style={{ margin: "var(--space-7) 0 var(--space-4)" }}>
                        <Eyebrow rule>Still out there</Eyebrow>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                        {locked.map((c) => (
                            <LockedRow
                                key={c.id}
                                clue={c}
                                onAction={() => router.push(c.source === "sponsor" ? "/codes" : "/shop")}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
