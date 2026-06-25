"use client";

import { CAMPAIGN_BASE_ZAR, COST_LINES, MILESTONES, UNIT_COSTS } from "@/data";
import type { Milestone } from "@/data";
import { zar } from "@/lib/format";
import { useGameStore } from "@/store/game";

interface ImpactState {
    achieved: Milestone[];
    current: Milestone | null;
    next: Milestone | null;
    toNext: number;
    progressToNext: number; // 0..1
}

/** Campaign total raised by the whole community (seeded baseline + this device's donations). */
export function useCampaignTotal(): number {
    const donationsTotal = useGameStore((s) => s.donationsTotal);
    return CAMPAIGN_BASE_ZAR + donationsTotal;
}

export function impactState(amount: number): ImpactState {
    const achieved = MILESTONES.filter((m) => amount >= m.threshold);
    const current = achieved[achieved.length - 1] ?? null;
    const next = MILESTONES.find((m) => amount < m.threshold) ?? null;
    const floor = current?.threshold ?? 0;
    const ceil = next?.threshold ?? floor;
    const toNext = next ? next.threshold - amount : 0;
    const progressToNext = next ? Math.min(Math.max((amount - floor) / (ceil - floor), 0), 1) : 1;
    return { achieved, current, next, toNext, progressToNext };
}

/** A plain-language line for what the running total covers right now. */
export function liveEquivalent(amount: number): string {
    if (amount <= 0) return "Be the first to fund the unit.";
    const dogYears = Math.floor(amount / UNIT_COSTS.foodPerDogYear);
    if (dogYears >= UNIT_COSTS.dogsInPack) return "That feeds the whole pack for over a year.";
    if (dogYears >= 1) return `That feeds ${dogYears} dog${dogYears === 1 ? "" : "s"} for a full year.`;
    const weeks = Math.max(1, Math.round(amount / (UNIT_COSTS.foodPerDogYear / 52)));
    return `That feeds a working dog for about ${weeks} week${weeks === 1 ? "" : "s"}.`;
}

function ProgressBar({ value, onDark = false }: { value: number; onDark?: boolean }) {
    return (
        <div style={{ height: 8, borderRadius: 999, background: onDark ? "rgba(245,239,226,0.18)" : "var(--surface-sunken)", overflow: "hidden" }}>
            <div
                style={{
                    width: `${Math.round(value * 100)}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, var(--ochre-400), var(--ochre-600))",
                    transition: "width var(--dur-slow) var(--ease-out)",
                }}
            />
        </div>
    );
}

/**
 * Slim, highlighted strip for the home screen. Leads with the outcome; the rand
 * total is small and secondary.
 */
export function ImpactHighlight({ amount, onOpen }: { amount: number; onOpen?: () => void }) {
    const { current, next } = impactState(amount);
    return (
        <button
            onClick={onOpen}
            style={{
                width: "100%",
                textAlign: "left",
                cursor: onOpen ? "pointer" : "default",
                background: "radial-gradient(120% 160% at 0% 0%, #21392C 0%, #182D23 100%)",
                color: "var(--sand-50)",
                border: "none",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4) var(--space-5)",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
            }}
        >
            <span style={{ flex: "none", width: 40, height: 40, borderRadius: "var(--radius-pill)", background: "rgba(197,138,61,0.2)", color: "var(--ochre-300)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                <i className={`ph-fill ph-${current?.icon ?? "hand-heart"}`} />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ochre-300)" }}>
                    Together we have
                </span>
                <span style={{ display: "block", fontFamily: "var(--font-serif)", fontSize: "1.05rem", color: "#fff", lineHeight: 1.2, marginTop: 2 }}>
                    {current ? current.title : "started funding the unit"}
                </span>
                <span style={{ display: "block", fontSize: "0.7rem", color: "rgba(245,239,226,0.65)", marginTop: 3 }}>
                    {zar(amount)} raised{next ? ` · next: ${next.title.toLowerCase()}` : ""}
                </span>
            </span>
            <i className="ph ph-arrow-right" style={{ color: "var(--ochre-300)", flex: "none" }} />
        </button>
    );
}

/**
 * Fuller card for the profile. Leads with the outcome; rand total is secondary.
 */
export function ImpactCard({ amount, onOpen }: { amount: number; onOpen?: () => void }) {
    const { current, next, toNext, progressToNext } = impactState(amount);
    return (
        <button
            onClick={onOpen}
            style={{
                width: "100%",
                textAlign: "left",
                cursor: onOpen ? "pointer" : "default",
                background: "radial-gradient(120% 140% at 0% 0%, #21392C 0%, #182D23 100%)",
                color: "var(--sand-50)",
                border: "none",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-5)",
                boxShadow: "var(--shadow-md)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ochre-300)" }}>
                    Together we have funded
                </span>
                {onOpen && <i className="ph ph-arrow-right" style={{ color: "var(--ochre-300)" }} />}
            </div>

            <p style={{ margin: "var(--space-2) 0 0", fontFamily: "var(--font-serif)", fontSize: "1.55rem", lineHeight: 1.2, color: "#fff" }}>
                {current ? current.title : "The first steps for the unit"}
            </p>
            <p style={{ margin: "var(--space-1) 0 0", fontSize: "0.78rem", color: "rgba(245,239,226,0.65)" }}>
                {zar(amount)} raised by the community so far
            </p>

            {next && (
                <div style={{ marginTop: "var(--space-4)" }}>
                    <ProgressBar value={progressToNext} onDark />
                    <div style={{ marginTop: 8, fontSize: "0.78rem", color: "rgba(245,239,226,0.82)" }}>
                        {zar(toNext)} to go until <strong style={{ color: "#fff" }}>{next.title.toLowerCase()}</strong>
                    </div>
                </div>
            )}
        </button>
    );
}

/** The full milestone ladder. */
export function ImpactLadder({ amount }: { amount: number }) {
    const { next, progressToNext, toNext } = impactState(amount);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {MILESTONES.map((m) => {
                const done = amount >= m.threshold;
                const isNext = next?.threshold === m.threshold;
                return (
                    <div
                        key={m.threshold}
                        style={{
                            display: "flex",
                            gap: "var(--space-4)",
                            alignItems: "flex-start",
                            background: isNext ? "var(--accent-soft)" : "var(--surface-card)",
                            border: `1px solid ${isNext ? "var(--ochre-300)" : "var(--border-subtle)"}`,
                            borderRadius: "var(--radius-lg)",
                            padding: "var(--space-4)",
                            opacity: done || isNext ? 1 : 0.6,
                            boxShadow: "var(--shadow-xs)",
                        }}
                    >
                        <span
                            style={{
                                flex: "none",
                                width: 42,
                                height: 42,
                                borderRadius: "var(--radius-pill)",
                                background: done ? "var(--success)" : isNext ? "var(--ochre-500)" : "var(--surface-sunken)",
                                color: done || isNext ? "#fff" : "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 20,
                            }}
                        >
                            <i className={`ph${done ? "-fill ph-check" : ` ph-${m.icon}`}`} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                                <strong style={{ fontSize: "0.98rem" }}>{m.title}</strong>
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: done ? "var(--success)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                                    {zar(m.threshold)}
                                </span>
                            </div>
                            <p style={{ margin: "0.25rem 0 0", fontSize: "0.82rem", color: "var(--text-secondary)" }}>{m.detail}</p>
                            {isNext && (
                                <div style={{ marginTop: "var(--space-3)" }}>
                                    <ProgressBar value={progressToNext} />
                                    <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--ochre-700)" }}>
                                        {zar(toNext)} TO GO
                                    </div>
                                </div>
                            )}
                            {done && (
                                <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.08em", color: "var(--success)" }}>
                                    <i className="ph-fill ph-check-circle" style={{ marginRight: 4 }} /> FUNDED
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/** The unit's real running costs, shown as supporting detail. */
export function CostList() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {COST_LINES.map((c) => (
                <div
                    key={c.label}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-3)",
                        padding: "var(--space-3) var(--space-4)",
                        background: "var(--surface-card)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-md)",
                    }}
                >
                    <i className={`ph ph-${c.icon}`} style={{ fontSize: 20, color: "var(--green-600)", flex: "none" }} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600 }}>{c.label}</span>
                        {c.note && <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)" }}>{c.note}</span>}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, whiteSpace: "nowrap" }}>{zar(c.amount)}</span>
                </div>
            ))}
        </div>
    );
}
