"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Eyebrow, Tag } from "@/components/ds";
import { EQUIPMENT, FAIR_PLAY_LINE, GUIDES } from "@/data";
import type { Equipment, EquipmentTier } from "@/data";
import { zar } from "@/lib/format";
import { useGameStore } from "@/store/game";

const TABS: { id: EquipmentTier | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "hunt", label: "Hunt" },
    { id: "care", label: "Care" },
    { id: "big-ticket", label: "Big-ticket" },
];

function ItemCard({
    item,
    owned,
    onDonate,
}: {
    item: Equipment;
    owned: boolean;
    onDonate: () => void;
}) {
    const [showReal, setShowReal] = useState(false);
    const free = item.priceZar === 0;
    return (
        <div
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

                <div
                    style={{
                        marginTop: "0.6rem",
                        background: "var(--green-50)",
                        border: "1px solid var(--green-100)",
                        borderRadius: "var(--radius-sm)",
                        padding: "0.6rem 0.7rem",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--green-700)" }}>
                        <i className="ph ph-target" /> How it helps the hunt
                    </div>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "var(--text-primary)", lineHeight: 1.5 }}>{item.effect}</p>
                    {item.unlocksClueId && (
                        <div style={{ marginTop: "0.5rem" }}>
                            <Tag tone="ochre" size="sm">
                                <i className="ph ph-notebook" style={{ marginRight: 4 }} /> Unlocks a new clue
                            </Tag>
                        </div>
                    )}
                    {item.unlocksFieldGuideZoneId && (
                        <div style={{ marginTop: "0.5rem" }}>
                            <Tag tone="teal" size="sm">
                                <i className="ph ph-book-open" style={{ marginRight: 4 }} /> Unlocks a field guide
                            </Tag>
                        </div>
                    )}
                </div>

                {item.realWorldNote && (
                    <div style={{ marginTop: "0.5rem" }}>
                        <button
                            onClick={() => setShowReal((v) => !v)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.72rem", fontWeight: 600, color: "var(--text-link)" }}
                        >
                            <i className={`ph ph-${showReal ? "caret-down" : "info"}`} /> What is this really?
                        </button>
                        {showReal && (
                            <div style={{ marginTop: "0.4rem", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                                {item.realWorldNote}
                                <div style={{ marginTop: "0.4rem" }}>
                                    <a
                                        href="/team"
                                        style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--text-link)", fontWeight: 600, textDecoration: "none" }}
                                    >
                                        Meet the real K9 Unit <i className="ph ph-arrow-right" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!free && (
                    <div style={{ marginTop: "var(--space-4)" }}>
                        {owned ? (
                            <Tag tone="green">
                                <i className="ph-fill ph-check-circle" style={{ marginRight: 4 }} /> Donated
                            </Tag>
                        ) : (
                            <Button size="sm" onClick={onDonate} iconRight={<i className="ph ph-arrow-right" />}>
                                Donate {zar(item.priceZar)}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ShopPage() {
    const router = useRouter();
    const inventory = useGameStore((s) => s.inventory);
    const fieldGuides = useGameStore((s) => s.fieldGuides);
    const [tab, setTab] = useState<EquipmentTier | "all">("all");

    const items = EQUIPMENT.filter((e) => (tab === "all" ? true : e.tier === tab));
    const guidesToBuy = GUIDES.filter((g) => g.unlocksFieldGuideZoneId && !fieldGuides.includes(g.unlocksFieldGuideZoneId));

    return (
        <div style={{ padding: "var(--space-6) var(--gutter) var(--space-7)" }}>
            <Eyebrow>The kit room</Eyebrow>
            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 var(--space-2)" }}>Equip your hunt</h1>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                Every donation buys real kit for the K9 Unit and gives you a real edge on the hunt.
            </p>
            <p style={{ display: "flex", gap: 6, alignItems: "flex-start", color: "var(--text-muted)", fontSize: "0.78rem", lineHeight: 1.5, margin: "var(--space-3) 0 0" }}>
                <i className="ph ph-scales" style={{ marginTop: 2, color: "var(--green-600)" }} /> {FAIR_PLAY_LINE}
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
                {items.map((item) => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        owned={inventory.includes(item.id)}
                        onDonate={() => router.push(`/checkout/${item.id}`)}
                    />
                ))}
            </div>

            {/* Field guides */}
            <div style={{ margin: "var(--space-8) 0 var(--space-4)" }}>
                <Eyebrow rule>Field guides</Eyebrow>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "var(--space-2) 0 0", lineHeight: 1.5 }}>
                    You start with one area's field guide. Unlock more to read the terrain, plants and animals of other zones and rule them in or out on the case board.
                </p>
            </div>
            {guidesToBuy.length === 0 ? (
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    You hold every field guide. The whole park is open to read.
                </p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    {guidesToBuy.map((item) => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            owned={false}
                            onDonate={() => router.push(`/checkout/${item.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
