"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Eyebrow, Tag } from "@/components/ds";
import { EQUIPMENT } from "@/data";
import type { EquipmentTier } from "@/data";
import { zar } from "@/lib/format";
import { useGameStore } from "@/store/game";

const TABS: { id: EquipmentTier | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "hunt", label: "Hunt" },
    { id: "care", label: "Care" },
    { id: "big-ticket", label: "Big-ticket" },
];

const TIER_TONE: Record<EquipmentTier, "teal" | "green" | "ochre" | "clay"> = {
    free: "green",
    care: "green",
    hunt: "teal",
    "big-ticket": "ochre",
};

export default function ShopPage() {
    const router = useRouter();
    const inventory = useGameStore((s) => s.inventory);
    const [tab, setTab] = useState<EquipmentTier | "all">("all");

    const items = EQUIPMENT.filter((e) => (tab === "all" ? true : e.tier === tab));

    return (
        <div style={{ padding: "var(--space-6) var(--gutter) var(--space-7)" }}>
            <Eyebrow>The kit room</Eyebrow>
            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 var(--space-2)" }}>Equip your hunt</h1>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                Every donation buys real kit for the K9 Unit. Some gear also unlocks new intel.
            </p>

            <div style={{ display: "flex", gap: 8, overflowX: "auto", margin: "var(--space-5) 0 var(--space-6)", paddingBottom: 2 }} className="kw-noscroll">
                {TABS.map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", cursor: "pointer", flex: "none" }}>
                        <Tag tone="neutral" interactive selected={tab === t.id}>
                            {t.label}
                        </Tag>
                    </button>
                ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {items.map((item) => {
                    const owned = inventory.includes(item.id);
                    const free = item.priceZar === 0;
                    return (
                        <div
                            key={item.id}
                            style={{
                                background: "var(--surface-card)",
                                border: "1px solid var(--border-subtle)",
                                borderRadius: "var(--radius-lg)",
                                boxShadow: "var(--shadow-xs)",
                                padding: "var(--space-4)",
                                display: "flex",
                                gap: "var(--space-4)",
                            }}
                        >
                            <span style={{ flex: "none", width: 52, height: 52, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", color: "var(--ochre-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                                <i className={`ph ph-${item.icon}`} />
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                                    <strong style={{ fontSize: "1rem" }}>{item.name}</strong>
                                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                                        {free ? "Issued" : zar(item.priceZar)}
                                    </span>
                                </div>
                                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{item.description}</p>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "0.5rem", fontSize: "0.74rem", color: "var(--ochre-700)" }}>
                                    <i className="ph ph-sparkle" /> {item.effect}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "0.3rem", fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--text-muted)" }}>
                                    <i className="ph ph-hand-heart" /> {item.fundedEquivalent}
                                </div>

                                {!free && (
                                    <div style={{ marginTop: "var(--space-4)" }}>
                                        {owned ? (
                                            <Tag tone="green">
                                                <i className="ph-fill ph-check-circle" style={{ marginRight: 4 }} /> Donated
                                            </Tag>
                                        ) : (
                                            <Button size="sm" onClick={() => router.push(`/checkout/${item.id}`)} iconRight={<i className="ph ph-arrow-right" />}>
                                                Donate {zar(item.priceZar)}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
