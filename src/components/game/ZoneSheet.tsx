"use client";

import { Button, PhotoPlate, Tag } from "@/components/ds";
import { Overlay } from "@/components/game/Overlay";
import type { Zone } from "@/data";

function GuideRow({ label, icon, value }: { label: string; icon: string; value: string }) {
    return (
        <div style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
            <i className={`ph ph-${icon}`} style={{ color: "var(--ochre-600)", fontSize: 18, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                    }}
                >
                    {label}
                </div>
                <div style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 2 }}>{value}</div>
            </div>
        </div>
    );
}

/**
 * Field guide bottom sheet for a single zone. This is the deduction toolkit:
 * everything a clue can reference (rock, plants, animals, names) lives here.
 */
export function ZoneSheet({
    zone,
    onClose,
    justUnlocked = false,
    onBuyMore,
}: {
    zone: Zone | null;
    onClose: () => void;
    /** Show the "new field guide" banner (used when it opens on the first pin). */
    justUnlocked?: boolean;
    /** When set, shows a hint and button to unlock more field guides. */
    onBuyMore?: () => void;
}) {
    if (!zone) return null;

    return (
        <Overlay>
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 60,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                background: "var(--bg-overlay, rgba(17,32,26,0.55))",
            }}
            onClick={onClose}
        >
            <div
                className="kw-rise"
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "100%",
                    maxWidth: 480,
                    maxHeight: "82dvh",
                    overflowY: "auto",
                    background: "var(--surface-page)",
                    borderTopLeftRadius: "var(--radius-2xl)",
                    borderTopRightRadius: "var(--radius-2xl)",
                    padding: "var(--space-5) var(--gutter) calc(var(--space-7) + env(safe-area-inset-bottom))",
                    boxShadow: "var(--shadow-xl)",
                }}
            >
                <div style={{ width: 44, height: 5, borderRadius: 999, background: "var(--border-default)", margin: "0 auto var(--space-5)" }} />

                {/* the ground itself: each guide opens on a photograph of its zone */}
                <div style={{ aspectRatio: "16 / 9", marginBottom: "var(--space-5)" }}>
                    <PhotoPlate src={zone.photo} alt={`${zone.name}: ${zone.subtitle}`} wash={zone.wash} radius="var(--radius-lg)" />
                </div>

                {justUnlocked && (
                    <div
                        style={{
                            display: "flex",
                            gap: "0.7rem",
                            alignItems: "flex-start",
                            background: "var(--green-100)",
                            border: "1px solid var(--green-200)",
                            borderRadius: "var(--radius-lg)",
                            padding: "0.7rem 0.85rem",
                            marginBottom: "var(--space-5)",
                        }}
                    >
                        <i className="ph-fill ph-book-open-text" style={{ fontSize: 20, color: "var(--green-700)", marginTop: 1 }} />
                        <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                            <strong style={{ color: "var(--text-primary)" }}>Field guide unlocked, free.</strong> You dropped your pin here, so this ground is yours to study. Read it to turn clues into a place you can point to.
                        </div>
                    </div>
                )}

                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-3)" }}>
                    <div>
                        <div
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.62rem",
                                letterSpacing: "0.16em",
                                textTransform: "uppercase",
                                color: "var(--text-accent)",
                            }}
                        >
                            Field guide · Zone {zone.number}
                        </div>
                        <h2 style={{ fontSize: "var(--text-h3)", margin: "0.25rem 0 0" }}>{zone.name}</h2>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>{zone.subtitle}</div>
                    </div>
                    <Tag tone="green" size="sm">
                        <i className="ph ph-compass" style={{ marginRight: 4 }} />
                        Zone {zone.number}
                    </Tag>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginTop: "var(--space-5)" }}>
                    <GuideRow label="The ground" icon="mountains" value={zone.geology} />
                    <GuideRow label="What grows" icon="leaf" value={zone.vegetation} />
                    <GuideRow label="Who lives here" icon="paw-print" value={zone.signatureSpecies} />
                    <GuideRow label="Named places" icon="map-trifold" value={zone.namedFeatures} />
                </div>

                <div
                    style={{
                        marginTop: "var(--space-5)",
                        paddingTop: "var(--space-4)",
                        borderTop: "1px dashed var(--border-default)",
                        fontFamily: "var(--font-serif)",
                        fontSize: "0.95rem",
                        lineHeight: 1.55,
                        color: "var(--sand-900)",
                        fontStyle: "italic",
                    }}
                >
                    {zone.signatureClue}
                </div>

                {onBuyMore && (
                    <div
                        style={{
                            marginTop: "var(--space-5)",
                            background: "var(--surface-sunken)",
                            border: "1px solid var(--border-default)",
                            borderRadius: "var(--radius-lg)",
                            padding: "var(--space-4)",
                        }}
                    >
                        <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Read more ground</div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5, marginTop: 2 }}>
                            The suspect could be in any zone. Unlock the field guide for another zone for R25, and every unlock funds the real K9 unit.
                        </div>
                        <div style={{ marginTop: "var(--space-3)" }}>
                            <Button size="sm" variant="secondary" onClick={onBuyMore} iconLeft={<i className="ph ph-books" />}>
                                Unlock more field guides
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </Overlay>
    );
}
