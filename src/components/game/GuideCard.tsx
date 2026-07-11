"use client";

import Image from "next/image";

import { Button } from "@/components/ds";
import type { Zone } from "@/data";

/**
 * The front of a dealt field-guide card: the zone's photograph, its name and
 * a note on how it was earned, with a button through to the full guide.
 * Rendered inside a DealtCard so unlocking a guide reads like drawing a card.
 */
export function GuideCardFront({ zone, note, onRead }: { zone: Zone; note: string; onRead: () => void }) {
    return (
        <div
            style={{
                maxHeight: "88dvh",
                overflowX: "hidden",
                overflowY: "auto",
                background: "var(--surface-page)",
                borderRadius: "var(--radius-2xl)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-xl)",
            }}
        >
            <div style={{ position: "relative", aspectRatio: "16 / 10", background: "var(--sand-100)" }}>
                <Image src={zone.photo} alt={`${zone.name}: ${zone.subtitle}`} fill sizes="400px" style={{ objectFit: "cover" }} />
                <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(24,45,35,0) 55%, rgba(24,45,35,0.45) 100%)" }} />
                <span
                    style={{
                        position: "absolute",
                        left: 14,
                        bottom: 10,
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--sand-50)",
                    }}
                >
                    Field guide · Zone {zone.number}
                </span>
            </div>
            <div style={{ padding: "var(--space-5) var(--space-5) var(--space-6)" }}>
                <h2 style={{ fontSize: "var(--text-h4)", margin: 0 }}>{zone.name}</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>{zone.subtitle}</div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: "var(--space-3) 0 0" }}>{note}</p>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "var(--space-3)",
                        marginTop: "var(--space-4)",
                        paddingTop: "var(--space-3)",
                        borderTop: "1px dashed var(--border-default)",
                    }}
                >
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", lineHeight: 1.5 }}>
                        Added to your guides
                    </div>
                    <Button size="sm" variant="secondary" onClick={onRead} iconRight={<i className="ph ph-book-open" />}>
                        Read the guide
                    </Button>
                </div>
            </div>
        </div>
    );
}
