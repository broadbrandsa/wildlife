"use client";

import { useRouter } from "next/navigation";

import { Eyebrow } from "@/components/ds";
import { PhotoPlate } from "@/components/ds";
import { REAL_DOGS, REAL_HANDLERS, UNIT_STATS } from "@/data";
import type { RealProfile } from "@/data";

function ProfileCard({ p }: { p: RealProfile }) {
    return (
        <div
            style={{
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "flex-start",
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
                boxShadow: "var(--shadow-xs)",
            }}
        >
            <div style={{ flex: "none", width: 76, height: 76, borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <PhotoPlate icon={p.icon} wash={p.wash} style={{ width: 76, height: 76, minHeight: 76, borderRadius: "var(--radius-md)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem" }}>{p.name}</strong>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-accent)", marginTop: 3 }}>
                    {p.role}
                </div>
                {p.breed && <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 3 }}>{p.breed}</div>}
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{p.note}</p>
            </div>
        </div>
    );
}

export default function TeamPage() {
    const router = useRouter();

    return (
        <div style={{ paddingBottom: "var(--space-8)" }}>
            {/* hero */}
            <div style={{ background: "radial-gradient(120% 130% at 50% 0%, #2C4A39 0%, #16110A 100%)", color: "var(--sand-50)", padding: "var(--space-6) var(--gutter) var(--space-7)" }}>
                <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,239,226,0.7)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", marginBottom: "var(--space-5)" }}>
                    <i className="ph ph-arrow-left" /> Back
                </button>
                <Eyebrow color="var(--ochre-300)">Behind the game</Eyebrow>
                <h1 style={{ color: "#fff", fontSize: "var(--text-h1)", margin: "var(--space-3) 0 0", lineHeight: 1.1 }}>Meet the real K9 Unit</h1>
                <p style={{ margin: "var(--space-3) 0 0", color: "var(--sand-100)", fontSize: "var(--text-lead)" }}>
                    The handlers and dogs of the Southern African Wildlife College: the people and animals your hunt supports.
                </p>
            </div>

            <div style={{ padding: "var(--space-6) var(--gutter)" }}>
                {/* stats */}
                <Eyebrow rule>By the numbers</Eyebrow>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                    {UNIT_STATS.map((s) => (
                        <div
                            key={s.label}
                            style={{
                                background: "var(--surface-card)",
                                border: "1px solid var(--border-subtle)",
                                borderRadius: "var(--radius-lg)",
                                padding: "var(--space-4)",
                                boxShadow: "var(--shadow-xs)",
                            }}
                        >
                            <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "1.9rem", lineHeight: 1, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                                {s.value}
                            </div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-accent)", marginTop: 6 }}>
                                {s.label}
                            </div>
                            {s.sub && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4 }}>{s.sub}</div>}
                        </div>
                    ))}
                </div>

                {/* handlers */}
                <div style={{ margin: "var(--space-8) 0 var(--space-4)" }}>
                    <Eyebrow rule>The handlers</Eyebrow>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {REAL_HANDLERS.map((p) => (
                        <ProfileCard key={p.name} p={p} />
                    ))}
                </div>

                {/* dogs */}
                <div style={{ margin: "var(--space-8) 0 var(--space-4)" }}>
                    <Eyebrow rule>The dogs</Eyebrow>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {REAL_DOGS.map((p) => (
                        <ProfileCard key={p.name} p={p} />
                    ))}
                </div>

                <p style={{ marginTop: "var(--space-7)", fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
                    Names, roles and figures are drawn from public Southern African Wildlife College and International Rhino Foundation sources. Operational stats cover February 2018 to December 2019. Photographs and fuller bios will follow from the College.
                </p>
            </div>
        </div>
    );
}
