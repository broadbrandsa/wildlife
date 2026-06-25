"use client";

import { useRouter } from "next/navigation";

import { Eyebrow } from "@/components/ds";
import { FOUNDING_DONORS, IN_KIND_PARTNERS, SPONSORS } from "@/data";
import { zar } from "@/lib/format";

export default function AlliesPage() {
    const router = useRouter();

    return (
        <div style={{ padding: "var(--space-5) var(--gutter) var(--space-8)" }}>
            <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
                <i className="ph ph-arrow-left" /> Back
            </button>

            <Eyebrow>Our allies</Eyebrow>
            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 var(--space-2)" }}>Who makes this possible</h1>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                With gratitude to the people and partners funding the K9 Unit. No logos, no noise, just thanks.
            </p>

            {/* Sponsor partners */}
            <div style={{ marginTop: "var(--space-7)" }}>
                <Eyebrow rule>Sponsor partners</Eyebrow>
                <div style={{ marginTop: "var(--space-4)", borderTop: "1px solid var(--border-subtle)" }}>
                    {SPONSORS.map((s) => (
                        <div key={s.id} style={{ padding: "var(--space-4) 0", borderBottom: "1px solid var(--border-subtle)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                                <strong style={{ fontSize: "1.02rem" }}>{s.name}</strong>
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-accent)", whiteSpace: "nowrap" }}>{zar(s.fundedAmountZar)}</span>
                            </div>
                            <p style={{ margin: "0.3rem 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{s.fundedDescription}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* In-kind partners */}
            <div style={{ marginTop: "var(--space-7)" }}>
                <Eyebrow rule>In-kind partners</Eyebrow>
                <div style={{ marginTop: "var(--space-4)", borderTop: "1px solid var(--border-subtle)" }}>
                    {IN_KIND_PARTNERS.map((p) => (
                        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "0.7rem 0", borderBottom: "1px solid var(--border-subtle)" }}>
                            <span style={{ fontWeight: 600 }}>{p.name}</span>
                            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "right" }}>{p.contribution}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Founding donors */}
            <div style={{ marginTop: "var(--space-7)" }}>
                <Eyebrow rule>Founding donors</Eyebrow>
                <p style={{ marginTop: "var(--space-4)", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    The SAWC K9 Unit exists thanks to {FOUNDING_DONORS.slice(0, -1).join(", ")} and {FOUNDING_DONORS.slice(-1)}.
                </p>
            </div>

            <p style={{ marginTop: "var(--space-7)", fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.08em", color: "var(--text-muted)", textAlign: "center" }}>
                YOUR NAME COULD GO HERE, WITH WHAT YOUR SUPPORT FUNDED.
            </p>
        </div>
    );
}
