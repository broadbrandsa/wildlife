"use client";

import { Tag } from "@/components/ds";
import { ZONE_BY_ID } from "@/data";
import type { Clue } from "@/data";

const SOURCE_META: Record<Clue["source"], { label: string; icon: string; tone: "ochre" | "teal" | "clay" }> = {
    free: { label: "Field clue", icon: "tree", tone: "teal" },
    equipment: { label: "Kit intel", icon: "binoculars", tone: "ochre" },
    sponsor: { label: "Intel intercept", icon: "radio", tone: "clay" },
};

const CATEGORY_ICON: Record<string, string> = {
    geological: "mountains",
    hydrological: "drop",
    botanical: "leaf",
    bird: "bird",
    mammal: "paw-print",
    historical: "scroll",
    cultural: "translate",
    operational: "binoculars",
    seasonal: "sun-horizon",
};

export function ClueCard({ clue, compact = false }: { clue: Clue; compact?: boolean }) {
    const meta = SOURCE_META[clue.source];
    const zone = ZONE_BY_ID[clue.zoneId];

    return (
        <div
            style={{
                background: "var(--sand-50)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.7rem var(--space-4)",
                    background: "var(--sand-100)",
                    borderBottom: "1px solid var(--border-subtle)",
                }}
            >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    <i className={`ph ph-${meta.icon}`} /> {meta.label}
                </span>
                <Tag tone={meta.tone} size="sm">
                    <i className={`ph ph-${CATEGORY_ICON[clue.category] ?? "compass"}`} style={{ marginRight: 4 }} />
                    {clue.difficulty}
                </Tag>
            </div>

            <div style={{ padding: "var(--space-5)" }}>
                <p
                    style={{
                        margin: 0,
                        fontFamily: "var(--font-serif)",
                        fontSize: compact ? "1rem" : "1.12rem",
                        lineHeight: 1.5,
                        color: "var(--sand-900)",
                    }}
                >
                    {clue.body}
                </p>

                {!compact && (
                    <div
                        style={{
                            marginTop: "var(--space-4)",
                            paddingTop: "var(--space-4)",
                            borderTop: "1px dashed var(--border-default)",
                            display: "flex",
                            gap: "0.6rem",
                            alignItems: "flex-start",
                        }}
                    >
                        <i className="ph ph-lightbulb" style={{ color: "var(--ochre-600)", fontSize: 18, marginTop: 2 }} />
                        <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                            <strong style={{ color: "var(--text-primary)" }}>Did you know? </strong>
                            {clue.didYouKnow}
                        </span>
                    </div>
                )}
            </div>

            <div style={{ padding: "0.6rem var(--space-4)", borderTop: "1px solid var(--border-subtle)", fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
                ZONE {zone.number} · {zone.name.toUpperCase()}
            </div>
        </div>
    );
}
