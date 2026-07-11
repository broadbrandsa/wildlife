"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Eyebrow } from "@/components/ds";
import { DealtCard, prefersReducedMotion } from "@/components/game/CardFlip";
import { ClueCard } from "@/components/game/ClueCard";
import { GuideCardFront } from "@/components/game/GuideCard";
import { ZoneSheet } from "@/components/game/ZoneSheet";
import { CLUES, ZONES } from "@/data";
import type { Zone } from "@/data";
import { BUSH_WISE_DOGS, PARK_AREA_KM2, availableClueIds, freeCluesToCome, hoursUntilNextClue, searchAreaKm2 } from "@/lib/game";
import { useCurrentDay, useGameStore } from "@/store/game";

type ZoneMark = "suspect" | "ruled-out" | undefined;

/**
 * Case board card: the card body cycles the zone's verdict (open, suspect,
 * ruled out); the affordance in the corner opens or unlocks its field guide.
 */
function CaseCard({
    zone,
    mark,
    owned,
    freePick,
    onCycle,
    onRead,
    onUnlock,
}: {
    zone: Zone;
    mark: ZoneMark;
    owned: boolean;
    /** Dotty's superpower: this card can be claimed free. */
    freePick?: boolean;
    onCycle: () => void;
    onRead: () => void;
    onUnlock: () => void;
}) {
    const ruledOut = mark === "ruled-out";
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onCycle}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onCycle();
            }}
            aria-label={`Mark ${zone.name}: currently ${mark ?? "open"}`}
            style={{
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                background: owned ? "var(--surface-card)" : "var(--surface-sunken)",
                border: `1px solid ${mark === "suspect" ? "var(--ochre-500)" : owned ? "var(--border-subtle)" : "var(--border-default)"}`,
                borderRadius: "var(--radius-md)",
                padding: "var(--space-3) var(--space-4)",
                minHeight: 108,
                opacity: ruledOut ? 0.55 : 1,
                transition: "all var(--dur-fast) var(--ease-out)",
            }}
        >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-accent)" }}>{zone.number}</span>
                <span
                    role="button"
                    tabIndex={0}
                    aria-label={
                        owned
                            ? `Read the ${zone.name} field guide`
                            : freePick
                              ? `Claim the ${zone.name} field guide free`
                              : `Unlock the ${zone.name} field guide for R25`
                    }
                    onClick={(e) => {
                        e.stopPropagation();
                        (owned ? onRead : onUnlock)();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            (owned ? onRead : onUnlock)();
                        }
                    }}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "0.74rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        padding: "0.35rem 0.5rem",
                        margin: "-0.35rem -0.5rem",
                        borderRadius: "var(--radius-sm)",
                        color: owned ? "var(--text-link)" : freePick ? "var(--ochre-700)" : "var(--text-muted)",
                    }}
                >
                    {owned ? (
                        <>
                            <i className="ph ph-book-open" /> Read
                        </>
                    ) : freePick ? (
                        <>
                            <i className="ph-fill ph-paw-print" /> Free pick
                        </>
                    ) : (
                        <>
                            <i className="ph ph-lock-simple" /> R25
                        </>
                    )}
                </span>
            </span>
            <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: owned ? "var(--text-primary)" : "var(--text-secondary)", lineHeight: 1.25, textDecoration: ruledOut ? "line-through" : "none" }}>
                    {zone.name}
                </span>
                <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.35 }}>{zone.subtitle}</span>
            </span>
            <span style={{ minHeight: 18 }}>
                {mark === "suspect" && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.7rem", fontWeight: 700, color: "var(--ochre-700)" }}>
                        <i className="ph-fill ph-detective" /> Suspect
                    </span>
                )}
                {ruledOut && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)" }}>
                        <i className="ph ph-prohibit" /> Ruled out
                    </span>
                )}
            </span>
        </div>
    );
}

export default function JournalPage() {
    const router = useRouter();
    const cluesUnlocked = useGameStore((s) => s.cluesUnlocked);
    const day = useCurrentDay();
    const [guideZone, setGuideZone] = useState<Zone | null>(null);
    // Dotty's free pick deals in as a card before the full guide opens.
    const [guideCard, setGuideCard] = useState<Zone | null>(null);
    const [guideFlipped, setGuideFlipped] = useState(true);

    // In hand: time-released free clues plus any you have bought or redeemed.
    const available = useMemo(() => {
        const ids = availableClueIds(cluesUnlocked, day);
        return [...CLUES.filter((c) => ids.has(c.id))].sort((a, b) => (b.releaseDay ?? 999) - (a.releaseDay ?? 999));
    }, [cluesUnlocked, day]);

    const toCome = freeCluesToCome(day);
    const nextHours = hoursUntilNextClue(day);

    const fieldGuides = useGameStore((s) => s.fieldGuides);
    const player = useGameStore((s) => s.player);
    const freeGuideUsed = useGameStore((s) => s.freeGuideUsed);
    const claimFreeGuide = useGameStore((s) => s.claimFreeGuide);
    const zoneMarks = useGameStore((s) => s.zoneMarks);
    const cycleZoneMark = useGameStore((s) => s.cycleZoneMark);
    const ruleOutZone = useGameStore((s) => s.ruleOutZone);
    const [markedClueId, setMarkedClueId] = useState<string | null>(null);
    const areaLeft = searchAreaKm2(zoneMarks);
    // Dotty's superpower: the matriarch knows the bush, so one guide pick is free.
    const freePickAvailable = Boolean(player && BUSH_WISE_DOGS.has(player.dogId) && !freeGuideUsed);
    const dogName = player?.dogName ?? "Your dog";

    return (
        <div style={{ padding: "var(--space-6) var(--gutter) var(--space-7)" }}>
            <Eyebrow>Field journal</Eyebrow>
            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 var(--space-2)" }}>Your clues</h1>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                {available.length} clue{available.length === 1 ? "" : "s"} in hand · {toCome} field clue{toCome === 1 ? "" : "s"} still to come.
            </p>

            {/* Case board: mark zones and open their field guides */}
            <div style={{ margin: "var(--space-6) 0 0" }}>
                <Eyebrow rule>Case board</Eyebrow>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-primary)", fontWeight: 700, margin: "var(--space-3) 0 0" }}>
                    Search area: {areaLeft.toLocaleString("en-ZA")} km² of {PARK_AREA_KM2.toLocaleString("en-ZA")}
                </div>
                <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", margin: "0.2rem 0 0" }}>Rule ground out to shrink the search.</p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "var(--space-3) 0 var(--space-3)" }}>
                    Tap a zone to mark it suspect or rule it out. The book opens its field guide. Your first guide unlocked with your first pin; any other zone opens for R25.
                    {freePickAvailable && ` ${dogName} knows this bush: the matriarch grants you one more guide free.`}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)" }}>
                    {ZONES.map((z) => (
                        <CaseCard
                            key={z.id}
                            zone={z}
                            mark={zoneMarks[z.id]}
                            owned={fieldGuides.includes(z.id)}
                            freePick={freePickAvailable}
                            onCycle={() => cycleZoneMark(z.id)}
                            onRead={() => setGuideZone(z)}
                            onUnlock={() => {
                                if (freePickAvailable) {
                                    claimFreeGuide(z.id);
                                    setGuideFlipped(prefersReducedMotion());
                                    setGuideCard(z);
                                } else {
                                    router.push(`/checkout/guide-${z.id}`);
                                }
                            }}
                        />
                    ))}
                </div>
            </div>

            <div style={{ margin: "var(--space-7) 0 var(--space-4)" }}>
                <Eyebrow rule>In hand</Eyebrow>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {available.map((c) => (
                    <ClueCard
                        key={c.id}
                        clue={c}
                        action={
                            c.kind === "elimination" ? (
                                markedClueId === c.id || zoneMarks[c.zoneId] === "ruled-out" ? (
                                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                        <i className="ph ph-check" style={{ marginRight: 5 }} /> Marked on your case board.
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => {
                                            ruleOutZone(c.zoneId);
                                            setMarkedClueId(c.id);
                                        }}
                                        style={{ background: "none", border: "none", cursor: "pointer", padding: "0.2rem 0", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-link)", display: "inline-flex", alignItems: "center", gap: 6 }}
                                    >
                                        <i className="ph ph-prohibit" /> Rule it out on your case board
                                    </button>
                                )
                            ) : undefined
                        }
                    />
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
                            : `${toCome} field clue${toCome === 1 ? "" : "s"} still to come. Each lands on its own day, so keep tracking.`}
                    </div>
                </div>
            </div>

            <ZoneSheet zone={guideZone} onClose={() => setGuideZone(null)} />

            {/* the free-pick guide, dealt onto the screen like a card */}
            {guideCard && (
                <DealtCard
                    flipped={guideFlipped}
                    onFlip={() => setGuideFlipped(true)}
                    onDismiss={() => setGuideCard(null)}
                    backIcon="book-open-text"
                    backEyebrow="Field guide"
                    backLine="New ground, unlocked."
                >
                    <GuideCardFront
                        zone={guideCard}
                        note={`${dogName} knows this bush, so this guide is on the house. It reads the ground: the rock, the plants, the animals and the named places a clue can point to.`}
                        onRead={() => {
                            const z = guideCard;
                            setGuideCard(null);
                            setGuideZone(z);
                        }}
                    />
                </DealtCard>
            )}
        </div>
    );
}
