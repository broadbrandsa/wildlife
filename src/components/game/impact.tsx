"use client";

import { MILESTONES, UNIT_COSTS } from "@/data";
import type { Milestone } from "@/data";
import { zar } from "@/lib/format";

interface ImpactState {
    achieved: Milestone[];
    current: Milestone | null;
    next: Milestone | null;
    toNext: number;
    progressToNext: number; // 0..1
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
    if (amount <= 0) return "Make a donation to start funding the unit.";
    const weeks = amount / (UNIT_COSTS.foodPerDogYear / 52);
    if (weeks < 52) {
        const w = Math.max(1, Math.round(weeks));
        return `That feeds a working dog for about ${w} week${w === 1 ? "" : "s"}.`;
    }
    const dogYears = Math.floor(amount / UNIT_COSTS.foodPerDogYear);
    return `That feeds ${dogYears} dog${dogYears === 1 ? "" : "s"} for a full year.`;
}

function ProgressBar({ value }: { value: number }) {
    return (
        <div style={{ height: 8, borderRadius: 999, background: "var(--surface-sunken)", overflow: "hidden" }}>
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

/** Compact card for the profile / home screen. Tap to open the full ladder. */
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
                    Your impact
                </span>
                {onOpen && <i className="ph ph-arrow-right" style={{ color: "var(--ochre-300)" }} />}
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: "var(--space-2)" }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 600, lineHeight: 1, color: "#fff" }}>{zar(amount)}</span>
                <span style={{ fontSize: "0.8rem", color: "rgba(245,239,226,0.7)" }}>raised so far</span>
            </div>

            <p style={{ margin: "var(--space-3) 0 0", fontSize: "0.9rem", color: "var(--sand-100)" }}>
                {current ? (
                    <>
                        <i className="ph-fill ph-check-circle" style={{ color: "var(--ochre-300)", marginRight: 6 }} />
                        Funded: {current.title.toLowerCase()}.
                    </>
                ) : (
                    "Your first donation starts the impact below."
                )}
            </p>

            {next && (
                <div style={{ marginTop: "var(--space-4)" }}>
                    <ProgressBar value={progressToNext} />
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
    const { current, next, progressToNext, toNext } = impactState(amount);
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
            {!current && (
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", marginTop: "var(--space-2)" }}>
                    Every rand goes to the SAWC K9 Anti-Poaching Unit. Costs are real estimates, pending the unit&apos;s confirmation.
                </p>
            )}
        </div>
    );
}
