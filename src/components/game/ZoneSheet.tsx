"use client";

import { Tag } from "@/components/ds";
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
export function ZoneSheet({ zone, onClose }: { zone: Zone | null; onClose: () => void }) {
    if (!zone) return null;

    return (
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
                    maxHeight: "78dvh",
                    overflowY: "auto",
                    background: "var(--surface-page)",
                    borderTopLeftRadius: "var(--radius-2xl)",
                    borderTopRightRadius: "var(--radius-2xl)",
                    padding: "var(--space-5) var(--gutter) var(--space-7)",
                    boxShadow: "var(--shadow-xl)",
                }}
            >
                <div style={{ width: 44, height: 5, borderRadius: 999, background: "var(--border-default)", margin: "0 auto var(--space-5)" }} />

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
            </div>
        </div>
    );
}
