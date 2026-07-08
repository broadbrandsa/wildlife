"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Eyebrow } from "@/components/ds";
import { ClueCard } from "@/components/game/ClueCard";
import { ZoneSheet } from "@/components/game/ZoneSheet";
import { CLUES, DOG_BY_ID, EQUIPMENT, ZONES } from "@/data";
import type { Clue, Zone } from "@/data";
import { availableClueIds, isDogClueReleased, isFreeClueReleased, nextClueLabel } from "@/lib/game";
import { useCurrentDay, useGameStore } from "@/store/game";

const ITEM_FOR_CLUE: Record<string, { id: string; name: string }> = Object.fromEntries(
    EQUIPMENT.filter((e) => e.unlocksClueId).map((e) => [e.unlocksClueId as string, { id: e.id, name: e.name }]),
);

function LockedRow({ clue, dogName, onAction }: { clue: Clue; dogName?: string; onAction: () => void }) {
    let label = "Locked";
    let action = "";
    if (clue.source === "free" && clue.releaseDay) {
        label = `Releases on day ${clue.releaseDay}`;
    } else if (clue.source === "dog" && clue.releaseDay) {
        label = `${dogName ?? "Your dog"} will surface this on day ${clue.releaseDay}`;
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
            <i className={`ph ph-${clue.source === "dog" ? "paw-print" : "lock-simple"}`} style={{ fontSize: 20, color: "var(--text-muted)" }} />
            <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    {clue.source === "free" ? "Field clue" : clue.source === "equipment" ? "Kit intel" : clue.source === "dog" ? "Dog instinct" : "Intel intercept"}
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

/** Case board row: tap to cycle open → suspect → ruled out. */
function CaseRow({ zone, onOpenGuide }: { zone: Zone; onOpenGuide: () => void }) {
    const mark = useGameStore((s) => s.zoneMarks[zone.id]);
    const cycleZoneMark = useGameStore((s) => s.cycleZoneMark);

    const meta =
        mark === "suspect"
            ? { icon: "crosshair", color: "var(--ochre-700)", bg: "var(--ochre-100)", bd: "var(--ochre-200)", label: "Suspect" }
            : mark === "eliminated"
              ? { icon: "prohibit", color: "var(--text-muted)", bg: "var(--surface-sunken)", bd: "var(--border-subtle)", label: "Ruled out" }
              : { icon: "circle", color: "var(--text-muted)", bg: "var(--surface-card)", bd: "var(--border-subtle)", label: "Open" };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                background: meta.bg,
                border: `1px solid ${meta.bd}`,
                borderRadius: "var(--radius-md)",
                padding: "0.55rem var(--space-3) 0.55rem var(--space-4)",
            }}
        >
            <button
                onClick={() => cycleZoneMark(zone.id)}
                aria-label={`Mark ${zone.name}`}
                style={{ flex: 1, display: "flex", alignItems: "center", gap: "var(--space-3)", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
            >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-accent)", width: 14 }}>{zone.number}</span>
                <span
                    style={{
                        flex: 1,
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        color: mark === "eliminated" ? "var(--text-muted)" : "var(--text-primary)",
                        textDecoration: mark === "eliminated" ? "line-through" : "none",
                    }}
                >
                    {zone.name}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: meta.color }}>
                    <i className={`ph${mark === "suspect" ? "-fill" : ""} ph-${meta.icon}`} style={{ fontSize: 14 }} />
                    {meta.label}
                </span>
            </button>
            <button
                onClick={onOpenGuide}
                aria-label={`Field guide for ${zone.name}`}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-link)", fontSize: 17, padding: "0.2rem" }}
            >
                <i className="ph ph-book-open" />
            </button>
        </div>
    );
}

export default function JournalPage() {
    const router = useRouter();
    const player = useGameStore((s) => s.player);
    const cluesUnlocked = useGameStore((s) => s.cluesUnlocked);
    const day = useCurrentDay();
    const [guideZone, setGuideZone] = useState<Zone | null>(null);

    const dogName = player?.dogName ?? (player ? DOG_BY_ID[player.dogId]?.name : undefined);

    const { available, locked } = useMemo(() => {
        const ids = availableClueIds(cluesUnlocked, day, player?.dogId);
        const visible = CLUES.filter((c) => c.source !== "dog" || c.dogId === player?.dogId);
        const available = [...visible.filter((c) => ids.has(c.id))].sort(
            (a, b) => (b.releaseDay ?? 999) - (a.releaseDay ?? 999),
        );
        const locked = visible.filter(
            (c) => !ids.has(c.id) && !isFreeClueReleased(c, day) && !isDogClueReleased(c, day, player?.dogId),
        );
        // order locked: upcoming free/dog by day, then equipment, then sponsor
        locked.sort((a, b) => {
            const rank = (c: Clue) =>
                c.source === "free" || c.source === "dog" ? (c.releaseDay ?? 0) : c.source === "equipment" ? 1000 : 2000;
            return rank(a) - rank(b);
        });
        return { available, locked };
    }, [cluesUnlocked, day, player?.dogId]);

    const marks = useGameStore((s) => s.zoneMarks);
    const openCount = ZONES.length - Object.values(marks).filter((m) => m === "eliminated").length;

    return (
        <div style={{ padding: "var(--space-6) var(--gutter) var(--space-7)" }}>
            <Eyebrow>Field journal</Eyebrow>
            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 var(--space-2)" }}>Your clues</h1>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                {available.length} clue{available.length === 1 ? "" : "s"} in hand · {locked.length} still to come.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "var(--space-2)", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                <i className="ph ph-timer" /> {nextClueLabel(day, player?.dogId)}
            </div>

            {/* Case board */}
            <div style={{ margin: "var(--space-6) 0 0" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <Eyebrow rule>Case board</Eyebrow>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "var(--space-2) 0 var(--space-3)" }}>
                    Tap a zone to mark your verdict. {openCount} of {ZONES.length} still open. The book opens the field guide.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                    {ZONES.map((z) => (
                        <CaseRow key={z.id} zone={z} onOpenGuide={() => setGuideZone(z)} />
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
                                dogName={dogName}
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
