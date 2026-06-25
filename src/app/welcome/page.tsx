"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ds";
import { Logo } from "@/components/game/Logo";

const POINTS = [
    { icon: "notebook", title: "Read the clues", body: "Clues drip out across the round, each one a real fact about Kruger's rivers, rock, plants and animals." },
    { icon: "map-pin", title: "Drop your pin", body: "Work out where the poacher is hiding and drop a pin on the map. Change it any time until the round locks." },
    { icon: "paw-print", title: "Fund the dogs", body: "Donate to kit out your hunt. Every rand goes to the SAWC K9 Anti-Poaching Unit." },
];

export default function WelcomePage() {
    const router = useRouter();

    return (
        <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--surface-page)" }}>
            <div
                style={{
                    background: "radial-gradient(120% 100% at 50% 0%, #2C4A39 0%, #182D23 100%)",
                    color: "var(--sand-50)",
                    padding: "var(--space-8) var(--gutter) var(--space-7)",
                }}
            >
                <Logo inverse />
                <h1 style={{ color: "#fff", fontSize: "var(--text-h1)", margin: "var(--space-6) 0 var(--space-3)" }}>
                    Welcome to the K9 Unit.
                </h1>
                <p style={{ color: "rgba(245,239,226,0.82)", fontSize: "var(--text-lead)", margin: 0 }}>
                    You and your dog are the team's best chance of finding the suspect. Here is how the hunt works.
                </p>
            </div>

            <div style={{ flex: 1, padding: "var(--space-7) var(--gutter)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                {POINTS.map((p, i) => (
                    <div key={p.title} style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
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
                            <i className={`ph ph-${p.icon}`} />
                        </span>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <h3 style={{ margin: 0, fontSize: "var(--text-h4)" }}>{p.title}</h3>
                            </div>
                            <p style={{ margin: "0.3rem 0 0", color: "var(--text-secondary)" }}>{p.body}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ padding: "var(--space-5) var(--gutter) var(--space-8)", borderTop: "1px solid var(--border-subtle)" }}>
                <Button size="lg" fullWidth onClick={() => router.push("/onboarding")} iconRight={<i className="ph ph-arrow-right" />}>
                    Start hunting
                </Button>
            </div>
        </div>
    );
}
