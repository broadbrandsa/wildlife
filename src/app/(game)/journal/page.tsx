"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Eyebrow } from "@/components/ds";
import { ClueCard } from "@/components/game/ClueCard";
import { ZoneSheet } from "@/components/game/ZoneSheet";
import { CLUES, EQUIPMENT, ZONES } from "@/data";
import type { Clue, Zone } from "@/data";
import { availableClueIds, isFreeClueReleased, nextClueLabel } from "@/lib/game";
import { useCurrentDay, useGameStore } from "@/store/game";

const ITEM_FOR_CLUE: Record<string, { id: string; name: string }> = Object.fromEntries(
    EQUIPMENT.filter((e) => e.unlocksClueId).map((e) => [e.unlocksClueId as string, { id: e.id, name: e.name }]),
);

function LockedRow({ clue, onAction }: { clue: Clue; onAction: () => void }) {
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

/** Field guide row: tap to read it if owned, otherwise unlock it in the kit room. */
function GuideRow({ zone, owned, onRead, onUnlock }: { zone: Zone; owned: boolean; onRead: () => void; onUnlock: () => void }) {
    return (
        <button
            onClick={owned ? onRead : onUnlock}
            aria-label={owned ? `Read the ${zone.name} field guide` : `Unlock the ${zone.name} field guide for R25`}
            style={{
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                background: owned ? "var(--surface-card)" : "var(--surface-sunken)",
                border: `1px solid ${owned ? "var(--border-subtle)" : "var(--border-default)"}`,
                borderRadius: "var(--radius-md)",
                padding: "0.6rem var(--space-4)",
            }}
        >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-accent)", width: 14 }}>{zone.number}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: owned ? "var(--text-primary)" : "var(--text-secondary)" }}>{zone.name}</span>
                <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)" }}>{zone.subtitle}</span>
            </span>
            {owned ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.76rem", fontWeight: 600, color: "var(--text-link)", whiteSpace: "nowrap" }}>
                    <i className="ph ph-book-open" /> Read
                </span>
            ) : (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.76rem", fontWeight: 600, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    <i className="ph ph-lock-simple" /> R25
                </span>
            )}
        </button>
    );
}

export default function JournalPage() {
    const router = useRouter();
    const cluesUnlocked = useGameStore((s) => s.cluesUnlocked);
    const day = useCurrentDay();
    const [guideZone, setGuideZone] = useState<Zone | null>(null);

    const { available, locked } = useMemo(() => {
        const ids = availableClueIds(cluesUnlocked, day);
        const available = [...CLUES.filter((c) => ids.has(c.id))].sort(
            (a, b) => (b.releaseDay ?? 999) - (a.releaseDay ?? 999),
        );
        const locked = CLUES.filter((c) => !ids.has(c.id) && !isFreeClueReleased(c, day));
        // order locked: upcoming free by day, then equipment, then sponsor
        locked.sort((a, b) => {
            const rank = (c: Clue) => (c.source === "free" ? (c.releaseDay ?? 0) : c.source === "equipment" ? 1000 : 2000);
            return rank(a) - rank(b);
        });
        return { available, locked };
    }, [cluesUnlocked, day]);

    const fieldGuides = useGameStore((s) => s.fieldGuides);

    return (
        <div style={{ padding: "var(--space-6) var(--gutter) var(--space-7)" }}>
            <Eyebrow>Field journal</Eyebrow>
            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 var(--space-2)" }}>Your clues</h1>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                {available.length} clue{available.length === 1 ? "" : "s"} in hand · {locked.length} still to come.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "var(--space-2)", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                <i className="ph ph-timer" /> {nextClueLabel(day)}
            </div>

            {/* Field guides */}
            <div style={{ margin: "var(--space-6) 0 0" }}>
                <Eyebrow rule>Field guides</Eyebrow>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "var(--space-2) 0 var(--space-3)" }}>
                    Your first field guide is free: it unlocks for the ground where you drop your first pin. Tap a guide you own to read it. Unlock any other zone for R25.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                    {ZONES.map((z) => (
                        <GuideRow
                            key={z.id}
                            zone={z}
                            owned={fieldGuides.includes(z.id)}
                            onRead={() => setGuideZone(z)}
                            onUnlock={() => router.push(`/checkout/guide-${z.id}`)}
                        />
                    ))}
                </div>
            </div>

            <div style={{ margin: "var(--space-7) 0 var(--space-4)" }}>
                <Eyebrow rule>In hand</Eyebrow>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
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

            <ZoneSheet zone={guideZone} onClose={() => setGuideZone(null)} />
        </div>
    );
}
