"use client";

import { useRouter } from "next/navigation";

import { Button, Eyebrow, Tag } from "@/components/ds";
import { useCampaignTotal } from "@/components/game/impact";
import {
    EVERY_PLAYER_LINE,
    FAIR_PLAY_LINE,
    FUNDRAISING_GOAL_ZAR,
    GOAL_LINE,
    PRIZE_TIERS,
    WIN_STEPS,
} from "@/data";
import { zar } from "@/lib/format";

export default function PrizesPage() {
    const router = useRouter();
    const total = useCampaignTotal();
    const progress = Math.min(total / FUNDRAISING_GOAL_ZAR, 1);

    return (
        <div style={{ paddingBottom: "var(--space-8)" }}>
            {/* hero */}
            <div
                style={{
                    background: "radial-gradient(120% 130% at 50% 0%, #2C4A39 0%, #16110A 100%)",
                    color: "var(--sand-50)",
                    padding: "var(--space-6) var(--gutter) var(--space-7)",
                }}
            >
                <button
                    onClick={() => router.back()}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,239,226,0.7)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", marginBottom: "var(--space-5)" }}
                >
                    <i className="ph ph-arrow-left" /> Back
                </button>
                <Eyebrow color="var(--ochre-300)">How to win</Eyebrow>
                <h1 style={{ color: "#fff", fontSize: "var(--text-h1)", margin: "var(--space-3) 0 0", lineHeight: 1.1 }}>
                    Catch the poacher, win the bush.
                </h1>
                <p style={{ margin: "var(--space-3) 0 0", color: "rgba(245,239,226,0.85)", fontSize: "var(--text-lead)", lineHeight: 1.5 }}>
                    Twenty six rangers will take a prize when the camp is revealed. Here is how the hunt is won, and what is waiting for the sharpest noses.
                </p>
            </div>

            <div style={{ padding: "var(--space-6) var(--gutter)", display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
                {/* how to win */}
                <div>
                    <Eyebrow rule>How the hunt is won</Eyebrow>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", marginTop: "var(--space-5)" }}>
                        {WIN_STEPS.map((s, i) => (
                            <div key={s.title} style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
                                <span
                                    style={{
                                        flex: "none",
                                        width: 44,
                                        height: 44,
                                        borderRadius: "var(--radius-pill)",
                                        background: "var(--accent-soft)",
                                        color: "var(--ochre-700)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 22,
                                    }}
                                >
                                    <i className={`ph ph-${s.icon}`} />
                                </span>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <h3 style={{ margin: 0, fontSize: "var(--text-h4)" }}>{s.title}</h3>
                                    </div>
                                    <p style={{ margin: "0.3rem 0 0", color: "var(--text-secondary)", lineHeight: 1.55 }}>{s.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* prize tiers */}
                <div>
                    <Eyebrow rule>The prizes</Eyebrow>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginTop: "var(--space-5)" }}>
                        {PRIZE_TIERS.map((t) => (
                            <div
                                key={t.place}
                                style={{
                                    background: "var(--surface-card)",
                                    border: t.place === "1st" ? "1.5px solid var(--ochre-300)" : "1px solid var(--border-subtle)",
                                    borderRadius: "var(--radius-lg)",
                                    boxShadow: t.place === "1st" ? "var(--shadow-md)" : "var(--shadow-xs)",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "0.7rem var(--space-4)",
                                        background: t.place === "1st" ? "var(--ochre-100)" : "var(--sand-100)",
                                        borderBottom: "1px solid var(--border-subtle)",
                                    }}
                                >
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-accent)" }}>
                                        <i className={`ph-fill ph-${t.icon}`} style={{ fontSize: 15, color: "var(--ochre-600)" }} />
                                        {t.place} place · {t.count} winner{t.count === 1 ? "" : "s"}
                                    </span>
                                    <Tag tone={t.place === "1st" ? "ochre" : "neutral"} size="sm">
                                        worth {zar(t.valueZar)}
                                    </Tag>
                                </div>
                                <div style={{ padding: "var(--space-4) var(--space-4) var(--space-3)" }}>
                                    <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "1.15rem" }}>{t.title}</h3>
                                    <p style={{ margin: "var(--space-2) 0 0", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{t.prize}</p>
                                </div>
                                <div style={{ padding: "0.55rem var(--space-4)", borderTop: "1px dashed var(--border-default)", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                                    With thanks to {t.sponsor}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p style={{ margin: "var(--space-4) 0 0", fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{EVERY_PLAYER_LINE}</p>
                </div>

                {/* fair play */}
                <div
                    style={{
                        display: "flex",
                        gap: "var(--space-3)",
                        alignItems: "flex-start",
                        background: "var(--green-100)",
                        border: "1px solid var(--green-200)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-4)",
                    }}
                >
                    <i className="ph-fill ph-scales" style={{ fontSize: 20, color: "var(--green-700)", marginTop: 2 }} />
                    <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{FAIR_PLAY_LINE}</p>
                </div>

                {/* the goal */}
                <div>
                    <Eyebrow rule>Why we are tracking</Eyebrow>
                    <p style={{ margin: "var(--space-3) 0 0", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{GOAL_LINE}</p>
                    <div style={{ marginTop: "var(--space-4)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6 }}>
                            <span>{zar(total)} RAISED</span>
                            <span>GOAL {zar(FUNDRAISING_GOAL_ZAR)}</span>
                        </div>
                        <div style={{ height: 10, borderRadius: "var(--radius-pill)", background: "var(--surface-sunken)", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
                            <div
                                style={{
                                    width: `${Math.max(progress * 100, 2)}%`,
                                    height: "100%",
                                    borderRadius: "var(--radius-pill)",
                                    background: "linear-gradient(90deg, var(--green-700), var(--ochre-500))",
                                    transition: "width var(--dur-slow, 400ms) var(--ease-out, ease-out)",
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                        <Button fullWidth onClick={() => router.push("/shop")} iconLeft={<i className="ph ph-hand-heart" />}>
                            Kit out your hunt
                        </Button>
                        <Button fullWidth variant="secondary" onClick={() => router.push("/impact")}>
                            See what the money does
                        </Button>
                    </div>
                </div>

                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6, margin: 0 }}>
                    Prize partners shown are illustrative for this prototype. Final partners, values and the full written rules are published
                    before a live round opens. See rules and privacy for the fine print.
                </p>
            </div>
        </div>
    );
}
