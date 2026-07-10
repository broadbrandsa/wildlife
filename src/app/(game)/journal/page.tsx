"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Eyebrow } from "@/components/ds";
import { ClueCard } from "@/components/game/ClueCard";
import { ZoneSheet } from "@/components/game/ZoneSheet";
import { CLUES, ZONES } from "@/data";
import type { Zone } from "@/data";
import { availableClueIds, freeCluesToCome, hoursUntilNextClue } from "@/lib/game";
import { useCurrentDay, useGameStore } from "@/store/game";

/** Field guide card: tap to read it if owned, otherwise unlock it in the kit room. */
function GuideCard({ zone, owned, onRead, onUnlock }: { zone: Zone; owned: boolean; onRead: () => void; onUnlock: () => void }) {
    return (
        <button
            onClick={owned ? onRead : onUnlock}
            aria-label={owned ? `Read the ${zone.name} field guide` : `Unlock the ${zone.name} field guide for R25`}
            style={{
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                background: owned ? "var(--surface-card)" : "var(--surface-sunken)",
                border: `1px solid ${owned ? "var(--border-subtle)" : "var(--border-default)"}`,
                borderRadius: "var(--radius-md)",
                padding: "var(--space-3) var(--space-4)",
                minHeight: 96,
            }}
        >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-accent)" }}>{zone.number}</span>
                {owned ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.74rem", fontWeight: 600, color: "var(--text-link)", whiteSpace: "nowrap" }}>
                        <i className="ph ph-book-open" /> Read
                    </span>
                ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.74rem", fontWeight: 600, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        <i className="ph ph-lock-simple" /> R25
                    </span>
                )}
            </span>
            <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: owned ? "var(--text-primary)" : "var(--text-secondary)", lineHeight: 1.25 }}>{zone.name}</span>
                <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.35 }}>{zone.subtitle}</span>
            </span>
        </button>
    );
}

export default function JournalPage() {
    const router = useRouter();
    const cluesUnlocked = useGameStore((s) => s.cluesUnlocked);
    const day = useCurrentDay();
    const [guideZone, setGuideZone] = useState<Zone | null>(null);

    // In hand: time-released free clues plus any you have bought or redeemed.
    const available = useMemo(() => {
        const ids = availableClueIds(cluesUnlocked, day);
        return [...CLUES.filter((c) => ids.has(c.id))].sort((a, b) => (b.releaseDay ?? 999) - (a.releaseDay ?? 999));
    }, [cluesUnlocked, day]);

    const toCome = freeCluesToCome(day);
    const nextHours = hoursUntilNextClue(day);

    const fieldGuides = useGameStore((s) => s.fieldGuides);

    return (
        <div style={{ padding: "var(--space-6) var(--gutter) var(--space-7)" }}>
            <Eyebrow>Field journal</Eyebrow>
            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 var(--space-2)" }}>Your clues</h1>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                {available.length} clue{available.length === 1 ? "" : "s"} in hand · {toCome} field clue{toCome === 1 ? "" : "s"} still to come.
            </p>

            {/* Field guides */}
            <div style={{ margin: "var(--space-6) 0 0" }}>
                <Eyebrow rule>Field guides</Eyebrow>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "var(--space-2) 0 var(--space-3)" }}>
                    Your first field guide is free: it unlocks for the ground where you drop your first pin. Tap a guide you own to read it. Unlock any other zone for R25.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)" }}>
                    {ZONES.map((z) => (
                        <GuideCard
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

            <div style={{ margin: "var(--space-7) 0 var(--space-4)" }}>
                <Eyebrow rule>Still out there</Eyebrow>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-4)",
                    boxShadow: "var(--shadow-xs)",
                }}
            >
                <span style={{ flex: "none", width: 40, height: 40, borderRadius: "var(--radius-pill)", background: "var(--surface-sunken)", color: "var(--text-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                    <i className="ph ph-timer" />
                </span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>
                        {toCome === 0
                            ? "All field clues are out"
                            : nextHours && nextHours > 0
                              ? `Next clue in about ${nextHours} hour${nextHours === 1 ? "" : "s"}`
                              : "A new clue is landing now"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.45 }}>
                        {toCome === 0
                            ? "You have the full field-clue timeline. Work the kit for extra intel."
                            : `${toCome} field clue${toCome === 1 ? "" : "s"} still to come. Each lands on its own, so keep tracking.`}
                    </div>
                </div>
            </div>

            <ZoneSheet zone={guideZone} onClose={() => setGuideZone(null)} />
        </div>
    );
}
