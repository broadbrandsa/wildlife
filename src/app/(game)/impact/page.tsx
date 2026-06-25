"use client";

import { useRouter } from "next/navigation";

import { Button, Eyebrow } from "@/components/ds";
import { CostList, ImpactLadder, impactState, liveEquivalent, useCampaignTotal } from "@/components/game/impact";
import { zar } from "@/lib/format";

export default function ImpactPage() {
    const router = useRouter();
    const total = useCampaignTotal();
    const { current, next } = impactState(total);

    return (
        <div style={{ paddingBottom: "var(--space-8)" }}>
            {/* hero: lead with the outcome, money is secondary */}
            <div style={{ background: "radial-gradient(120% 130% at 50% 0%, #2C4A39 0%, #16110A 100%)", color: "var(--sand-50)", padding: "var(--space-6) var(--gutter) var(--space-7)" }}>
                <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,239,226,0.7)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", marginBottom: "var(--space-5)" }}>
                    <i className="ph ph-arrow-left" /> Back
                </button>

                <Eyebrow color="var(--ochre-300)">Together we have funded</Eyebrow>
                <h1 style={{ color: "#fff", fontSize: "var(--text-h1)", margin: "var(--space-3) 0 0", lineHeight: 1.1 }}>
                    {current ? current.title : "The first steps for the unit"}
                </h1>
                <p style={{ margin: "var(--space-3) 0 0", color: "var(--sand-100)", fontSize: "var(--text-lead)" }}>{liveEquivalent(total)}</p>

                {/* secondary: the actual number */}
                <div style={{ marginTop: "var(--space-5)", display: "inline-flex", alignItems: "baseline", gap: 8, padding: "0.5rem 0.9rem", borderRadius: "var(--radius-pill)", background: "rgba(245,239,226,0.1)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "#fff" }}>{zar(total)}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ochre-300)" }}>raised so far</span>
                </div>
                {next && (
                    <p style={{ margin: "var(--space-3) 0 0", fontSize: "0.85rem", color: "rgba(245,239,226,0.7)" }}>
                        {zar(next.threshold - total)} more unlocks &ldquo;{next.title.toLowerCase()}&rdquo;.
                    </p>
                )}
            </div>

            <div style={{ padding: "var(--space-6) var(--gutter)" }}>
                {/* main point: what the money does */}
                <div style={{ marginBottom: "var(--space-5)" }}>
                    <Eyebrow rule>What the money does</Eyebrow>
                    <p style={{ margin: "var(--space-3) 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        Every rand goes to the SAWC K9 Anti-Poaching Unit. As the community total grows, it funds real outcomes for the pack, one rung at a time.
                    </p>
                </div>

                <ImpactLadder amount={total} />

                {/* supporting detail: the unit's real costs */}
                <div style={{ margin: "var(--space-8) 0 var(--space-5)" }}>
                    <Eyebrow rule>What it costs to run the unit</Eyebrow>
                    <p style={{ margin: "var(--space-3) 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        The real numbers behind the milestones above, drawn from the unit&apos;s published figures and sector benchmarks.
                    </p>
                </div>

                <CostList />

                <div style={{ marginTop: "var(--space-7)" }}>
                    <Button size="lg" fullWidth onClick={() => router.push("/shop")} iconLeft={<i className="ph ph-hand-heart" />}>
                        Add to the total
                    </Button>
                </div>

                <p style={{ marginTop: "var(--space-5)", fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
                    Figures are real-world estimates pending SAWC&apos;s own confirmation. This prototype uses a simulated checkout, and the running total seeds a community baseline: no live payment is taken.
                </p>
            </div>
        </div>
    );
}
