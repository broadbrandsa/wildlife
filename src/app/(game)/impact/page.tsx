"use client";

import { useRouter } from "next/navigation";

import { Button, Eyebrow } from "@/components/ds";
import { ImpactLadder, impactState, liveEquivalent } from "@/components/game/impact";
import { zar } from "@/lib/format";
import { useGameStore } from "@/store/game";

export default function ImpactPage() {
    const router = useRouter();
    const donationsTotal = useGameStore((s) => s.donationsTotal);
    const { next } = impactState(donationsTotal);

    return (
        <div style={{ paddingBottom: "var(--space-8)" }}>
            {/* header */}
            <div style={{ background: "radial-gradient(120% 130% at 50% 0%, #2C4A39 0%, #16110A 100%)", color: "var(--sand-50)", padding: "var(--space-6) var(--gutter) var(--space-7)" }}>
                <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,239,226,0.7)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
                    <i className="ph ph-arrow-left" /> Back
                </button>
                <Eyebrow color="var(--ochre-300)">Your impact</Eyebrow>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: "var(--space-3)" }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-h1)", fontWeight: 600, color: "#fff", lineHeight: 1 }}>{zar(donationsTotal)}</span>
                    <span style={{ color: "rgba(245,239,226,0.75)" }}>raised</span>
                </div>
                <p style={{ margin: "var(--space-3) 0 0", color: "var(--sand-100)", fontSize: "var(--text-lead)" }}>{liveEquivalent(donationsTotal)}</p>
                {next && (
                    <p style={{ margin: "var(--space-2) 0 0", fontSize: "0.85rem", color: "rgba(245,239,226,0.7)" }}>
                        Next: {zar(next.threshold - donationsTotal)} more unlocks &ldquo;{next.title.toLowerCase()}&rdquo;.
                    </p>
                )}
            </div>

            <div style={{ padding: "var(--space-6) var(--gutter)" }}>
                <div style={{ marginBottom: "var(--space-5)" }}>
                    <Eyebrow rule>What the money funds</Eyebrow>
                    <p style={{ margin: "var(--space-3) 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        Every rand goes to the SAWC K9 Anti-Poaching Unit. As the total grows, it funds real outcomes for the pack, one rung at a time.
                    </p>
                </div>

                <ImpactLadder amount={donationsTotal} />

                <div style={{ marginTop: "var(--space-6)" }}>
                    <Button size="lg" fullWidth onClick={() => router.push("/shop")} iconLeft={<i className="ph ph-hand-heart" />}>
                        Donate more kit
                    </Button>
                </div>

                <p style={{ marginTop: "var(--space-5)", fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
                    Costs are real-world estimates based on the unit&apos;s published figures and sector benchmarks, pending SAWC&apos;s own confirmation. This prototype uses a simulated checkout: no live payment is taken.
                </p>
            </div>
        </div>
    );
}
